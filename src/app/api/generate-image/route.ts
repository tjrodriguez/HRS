import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Generate Pollinations URL with seed for consistency
    const encoded = encodeURIComponent(prompt);
    const seed = Date.now();
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&seed=${seed}&nologo=true`;

    // Return the Pollinations URL directly
    // Note: The image generates on first access. Some browsers may block external images.
    return NextResponse.json({ 
      url: pollinationsUrl,
      prompt,
      seed
    });

  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
