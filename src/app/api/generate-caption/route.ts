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
    } = body;

    if (!holidayName || !businessName || !businessType || !tone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = `Generate 3 engaging social media captions for a ${businessType} business named "${businessName}" (${businessNiche}) to celebrate ${holidayName} on ${platform}. 
    
    Requirements:
    - Tone: ${tone}
    - Target audience: ${targetAudience || "General customers"}
    - Platform: ${platform}
    - Keep each caption under 200 characters
    - Include relevant emojis
    - Make it compelling and action-oriented
    
    Format your response as a JSON array with exactly 3 captions: ["caption1", "caption2", "caption3"]
    Only return the JSON array, no additional text.`;

    const message = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText = message.choices[0]?.message?.content || "";

    // Parse the JSON response
    const captions = JSON.parse(responseText);

    if (!Array.isArray(captions) || captions.length === 0) {
      throw new Error("Invalid caption format received");
    }

    return NextResponse.json({
      success: true,
      captions: captions.slice(0, 3), // Ensure we only return 3
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
