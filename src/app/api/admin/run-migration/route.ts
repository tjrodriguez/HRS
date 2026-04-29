import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// This should only be accessible in development or with admin credentials
export async function POST(request: Request) {
  try {
    // Security check - only allow in development or with secret
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    if (process.env.NODE_ENV !== 'development' && secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    // Notifications migration has been removed as part of removing the notification subsystem.
    const migrationSQL = `-- Notifications migration removed`;

    // Execute the SQL via Supabase RPC
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

    if (error) {
      // Fallback: try direct SQL execution through REST
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY || '',
        },
        body: JSON.stringify({ sql: migrationSQL }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Migration failed: ${errorText}`);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Notifications migration skipped (removed from codebase).' 
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
