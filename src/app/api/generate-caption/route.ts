import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

/**
 * Generate social media captions using Groq AI
 */
export async function POST(request: NextRequest) {
  try {
    // Check if API key exists
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY environment variable is not set" },
        { status: 500 }
      );
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const body = await request.json();

    const {
      holidayName,
      businessName,
      businessType,
      businessNiche,
      tone,
      targetAudience,
      platform,
      previousCaptions,
    } = body;

    if (!holidayName || !businessName || !businessType || !tone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const previousCaptionsInstruction = previousCaptions && previousCaptions.length > 0 
      ? `\n\nCRITICAL DO NOT REUSE: You MUST NOT generate these exact concepts again. The user has already seen and rejected similar ideas. Pivot to entirely new angles and styles.\nHere is a small sample of what NOT to do:\n${previousCaptions.slice(-10).map((c: string) => `- "${c}"`).join('\n')}` 
      : "";

    const prompt = `Act as a Senior Copy Editor and Brand Strategist. Generate 10 strikingly unique and human social media captions for a ${businessType} business named "${businessName}" (${businessNiche}) to celebrate ${holidayName} on ${platform}. 
    
    You are strictly prohibited from using 'AI-isms' or buzzwords like 'elevate,' 'unlock,' 'seamless,' 'journey,' or 'comprehensive.'
    Instead, provide 10 variations, ensuring each one uses a completely different psychological framework (e.g., one focused on curiosity, one on brutal honesty, and one on high-energy action). 
    Vary the sentence structure and rhythm so they do not feel repetitive. Focus on punchy, active verbs and sensory language.${previousCaptionsInstruction}
    
    Requirements:
    - Tone: ${tone}
    - Target audience: ${targetAudience || "General customers"}
    - Platform: ${platform}
    - Keep each caption under 200 characters
    - Include relevant emojis
    
    Format your response as a JSON array with exactly 10 captions: ["caption1", "caption2", ... "caption10"]
    Only return the JSON array string, no additional text or markdown formatting.`;

    const message = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      max_tokens: 1500,
      temperature: 0.9,
      presence_penalty: 0.6,
      frequency_penalty: 0.6,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText = message.choices[0]?.message?.content || "";

    // Extract the JSON array using regex in case the LLM wrapped it in markdown or added conversational text
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Could not find JSON array in the response");
    }

    // Parse the JSON response
    const captions = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(captions) || captions.length === 0) {
      throw new Error("Invalid caption format received");
    }

    return NextResponse.json({
      success: true,
      captions: captions.slice(0, 10), // Ensure we only return 10
    });
  } catch (error) {
    console.error("Error generating caption:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate caption",
      },
      { status: 500 }
    );
  }
}
