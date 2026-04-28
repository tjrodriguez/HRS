import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * GET /api/templates
 * Fetch all templates for the authenticated user
 * Supports query params: ?category=&search=&favorite=
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const favorite = searchParams.get('favorite');

    let query = supabase
      .from('templates')
      .select('*')
      .eq('user_id', user.id)
      .order('is_favorite', { ascending: false })
      .order('updated_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (favorite === 'true') {
      query = query.eq('is_favorite', true);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,content.ilike.%${search}%,holiday_name.ilike.%${search}%`);
    }

    const { data: templates, error } = await query;

    if (error) {
      // Gracefully handle missing table — return empty list instead of crashing
      if (error.message?.includes('Could not find the table') || error.code === 'PGRST205') {
        console.warn('Templates table not found in database. Run migration 004_add_templates_table.sql');
        return NextResponse.json({ templates: [] });
      }
      console.error('Error fetching templates:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error in GET /api/templates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/templates
 * Create a new template
 */
export async function POST(request: NextRequest) {
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
      content,
      hashtags,
      category,
      holiday_name,
      business_type,
      tone,
      platforms,
    } = body;

    if (!name || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: name and content are required' },
        { status: 400 }
      );
    }

    const { data: template, error } = await supabase
      .from('templates')
      .insert({
        user_id: user.id,
        name,
        content,
        hashtags: hashtags || [],
        category: category || 'general',
        holiday_name: holiday_name || null,
        business_type: business_type || null,
        tone: tone || null,
        platforms: platforms || [],
      })
      .select()
      .single();

    if (error) {
      // Gracefully handle missing table
      if (error.message?.includes('Could not find the table') || error.code === 'PGRST205') {
        console.warn('Templates table not found in database. Run migration 004_add_templates_table.sql');
        return NextResponse.json({ error: 'Templates table not found. Please run the database migration.' }, { status: 503 });
      }
      console.error('Error creating template:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/templates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/templates
 * Update a template (toggle favorite, update content, increment usage)
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
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    const { data: template, error } = await supabase
      .from('templates')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating template:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error('Error in PATCH /api/templates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/templates
 * Delete a template
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting template:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/templates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

