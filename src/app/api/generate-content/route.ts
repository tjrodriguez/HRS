import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

interface ContentRequestBody {
  holiday: string;
  holidayDescription: string;
  businessType: string;
  businessName: string;
  businessDescription?: string;
  targetAudience: string;
  location: string;
}

interface EngagementPrediction {
  reach: { min: number; max: number };
  likes: { min: number; max: number };
  comments: { min: number; max: number };
  shares: { min: number; max: number };
}

interface PlatformTips {
  instagram: string;
  facebook: string;
  twitter: string;
}

/**
 * POST /api/generate-content
 * Generates AI-powered marketing content for a specific holiday using Groq API
 * Falls back to template-based content if Groq API is unavailable
 */
export async function POST(request: NextRequest) {
  try {
    const body: ContentRequestBody = await request.json();

    const {
      holiday,
      holidayDescription,
      businessType,
      businessName,
      businessDescription,
      targetAudience,
      location,
    } = body;

    // Validate required fields
    if (!holiday || !businessType || !businessName || !targetAudience) {
      return NextResponse.json(
        { error: 'Missing required fields: holiday, businessType, businessName, targetAudience' },
        { status: 400 }
      );
    }

    // If no API key, return template-based content
    if (!GROQ_API_KEY) {
      console.warn('GROQ_API_KEY not configured, using template-based content');
      return generateTemplateContent(holiday, businessName, businessType, targetAudience, location);
    }

    // Create the prompt for Groq
    const systemPrompt = `Act as a Senior Copy Editor and Brand Strategist specializing in holiday marketing campaigns.
You create strikingly unique, authentic, and human marketing content.
You are strictly prohibited from using 'AI-isms' or buzzwords like 'elevate,' 'unlock,' 'seamless,' 'journey,' or 'comprehensive.'
Vary your sentence structures and rhythm so they are not repetitive. Focus on punchy, active verbs and sensory language.
Always maintain brand authenticity while optimizing for engagement.`;

    const userPrompt = `Generate marketing content for the following:

Holiday: ${holiday}
Holiday Description: ${holidayDescription}
Business Type: ${businessType}
Business Name: ${businessName}
Target Audience: ${targetAudience}
Location: ${location}

Please provide two pieces of content:

1. Instagram Post Caption Variations: 10 catchy, engaging captions with relevant hashtags and emojis that would work well on Instagram. Keep each under 2200 characters. Provide them as an array of strings.

2. Email Subject & Body: A professional email marketing copy with:
   - Subject line (concise and compelling)
   - Body text (2-3 paragraphs with clear call-to-action)

Format your response as JSON with the following structure:
{
  "instagram": ["caption 1 here", "caption 2 here", "...", "caption 10 here"],
  "email": "subject line\\n\\nemail body text here"
}`;

    try {
      // Call Groq API
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: userPrompt,
            },
          ],
          temperature: 0.8,
          top_p: 1.0,
          max_tokens: 1000,
        }),
      });

      if (!groqResponse.ok) {
        const errorData = await groqResponse.text();
        console.error('Groq API error:', groqResponse.status, errorData);
        // Fall back to template-based content on API error
        return generateTemplateContent(holiday, businessName, businessType, targetAudience, location);
      }

      const result = await groqResponse.json();
      
      if (!result.choices || !result.choices[0] || !result.choices[0].message) {
        console.error('Unexpected Groq response structure:', result);
        return generateTemplateContent(holiday, businessName, businessType, targetAudience, location);
      }

      const content = result.choices[0].message.content;

      // Parse the JSON response from Groq
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('Could not parse JSON from Groq response, using fallback');
        return generateTemplateContent(holiday, businessName, businessType, targetAudience, location);
      }

      const parsedContent = JSON.parse(jsonMatch[0]);

      // Now generate engagement metrics and pro tips
      const engagementPrompt = `Based on this marketing campaign:
Holiday: ${holiday}
Business Type: ${businessType}
Target Audience: ${targetAudience}

Generate realistic engagement predictions and platform-specific tips.

Please provide a JSON response with this exact structure:
{
  "engagement": {
    "reach": { "min": number, "max": number },
    "likes": { "min": number, "max": number },
    "comments": { "min": number, "max": number },
    "shares": { "min": number, "max": number }
  },
  "platformTips": {
    "instagram": "specific tip for Instagram optimization",
    "facebook": "specific tip for Facebook optimization",
    "twitter": "specific tip for Twitter optimization"
  }
}

Make predictions realistic based on typical small business engagement rates. Instagram typically gets 5-15% engagement rate, Facebook 2-8%, Twitter 1-3%.
Platform tips should be specific to the holiday and business type provided.`;

      // Call Groq API again for engagement metrics and tips
      const engagementResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'user',
              content: engagementPrompt,
            },
          ],
          temperature: 0.7,
          top_p: 1.0,
          max_tokens: 500,
        }),
      });

      let engagement: EngagementPrediction = getDefaultEngagement();
      let platformTips: PlatformTips = getDefaultPlatformTips();

      if (engagementResponse.ok) {
        try {
          const engagementResult = await engagementResponse.json();
          const engagementContent = engagementResult.choices?.[0]?.message?.content;
          
          if (engagementContent) {
            const engagementJsonMatch = engagementContent.match(/\{[\s\S]*\}/);
            if (engagementJsonMatch) {
              const parsedEngagement = JSON.parse(engagementJsonMatch[0]);
              engagement = parsedEngagement.engagement || engagement;
              platformTips = parsedEngagement.platformTips || platformTips;
            }
          }
        } catch (parseError) {
          console.warn('Could not parse engagement metrics, using defaults:', parseError);
        }
      }

      return NextResponse.json({
        instagram: parsedContent.instagram || '',
        email: parsedContent.email || '',
        engagement,
        platformTips,
      });
    } catch (groqError) {
      console.error('Groq API call failed:', groqError);
      // Fall back to template-based content
      return generateTemplateContent(holiday, businessName, businessType, targetAudience, location);
    }
  } catch (error) {
    console.error('Error in generate-content route:', error);
    return NextResponse.json(
      { error: 'Failed to generate content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Generate template-based content when Groq API is unavailable
 */
function generateTemplateContent(
  holiday: string,
  businessName: string,
  businessType: string,
  targetAudience: string,
  location: string
) {
  const locationCity = location.split(',')[0] || location;
  
  const instagramCaption = [
    `🎉 Happy ${holiday}! 🎊\n\nJoin us at ${businessName} as we celebrate this special occasion with amazing ${businessType} experiences tailored for ${targetAudience}.\n\nWhether you're looking to celebrate with friends, family, or your loved ones, we've got something special prepared just for you this ${holiday}! \n\n📍 Find us in ${locationCity}\n🔗 Link in bio for more details\n\n#${holiday.replace(/\s+/g, '')} #${businessName.replace(/\s+/g, '')} #${businessType.replace(/\s+/g, '')} #SmallBusiness #SupportLocal #${locationCity.replace(/\s+/g, '')} #HolidaySpecial`,
    `✨ Celebrate ${holiday} with us!🌟\n\nStop by ${businessName} today to explore what we have for you.\n\n📍 ${locationCity}\n\n#${holiday.replace(/\s+/g, '')} #${businessName.replace(/\s+/g, '')}`,
    `This ${holiday}, treat yourself at ${businessName}. Don't miss out on our festive season exclusives tailored just for ${targetAudience}!\n\n#${holiday.replace(/\s+/g, '')} #${businessName.replace(/\s+/g, '')}`
  ];

  const emailContent = `Subject: 🎉 Celebrate ${holiday} with ${businessName}!

Dear Valued ${targetAudience},

This ${holiday}, we're excited to invite you to celebrate with us at ${businessName}! 

As your local ${businessType}, we've curated special ${holiday} experiences and exclusive offers just for our community. Whether you're celebrating with friends, family, or treating yourself, we have something special waiting for you.

Visit us in ${locationCity} and discover why your neighbors love us. We look forward to making your ${holiday} memorable!

Warm regards,
${businessName} Team
📍 ${location}`;

  return NextResponse.json({
    instagram: instagramCaption,
    email: emailContent,
    engagement: getDefaultEngagement(),
    platformTips: getDefaultPlatformTips(),
  });
}

/**
 * Generate default engagement predictions
 */
function getDefaultEngagement(): EngagementPrediction {
  return {
    reach: { min: 2500, max: 4000 },
    likes: { min: 150, max: 300 },
    comments: { min: 20, max: 40 },
    shares: { min: 25, max: 50 },
  };
}

/**
 * Generate default platform-specific tips
 */
function getDefaultPlatformTips(): PlatformTips {
  return {
    instagram: 'Use all suggested hashtags and post during peak hours (9-11 AM or 7-9 PM). Instagram prioritizes authentic, community-driven content.',
    facebook: 'Include a clear call-to-action and encourage comments through questions. Facebook\'s algorithm prioritizes engagement and authentic conversation.',
    twitter: 'Keep your post concise and punchy. Engage with replies quickly and use trending hashtags to increase visibility and reach.',
  };
}

