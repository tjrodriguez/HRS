import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * GET /api/profile
 * Fetch user profile
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error in GET /api/profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/profile
 * Update user profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      type,
      location,
      description,
      targetAudience,
      niche,
      tone,
      socialPlatforms,
      websiteUrl,
      phone,
      contactEmail,
      businessHours,
      brandColors,
      brandVoice,
      logoUrl,
    } = body;

    // Update profile with all fields (including new enhanced fields)
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        ...(name !== undefined && { name }),
        ...(type !== undefined && { type }),
        ...(location !== undefined && { location }),
        ...(description !== undefined && { description }),
        ...(targetAudience !== undefined && { target_audience: targetAudience }),
        ...(niche !== undefined && { niche }),
        ...(tone !== undefined && { tone }),
        ...(socialPlatforms !== undefined && { social_platforms: socialPlatforms }),
        ...(websiteUrl !== undefined && { website_url: websiteUrl }),
        ...(phone !== undefined && { phone }),
        ...(contactEmail !== undefined && { contact_email: contactEmail }),
        ...(businessHours !== undefined && { business_hours: businessHours }),
        ...(brandColors !== undefined && { brand_colors: brandColors }),
        ...(brandVoice !== undefined && { brand_voice: brandVoice }),
        ...(logoUrl !== undefined && { logo_url: logoUrl }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error in PATCH /api/profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
