/**
 * Apply Supabase migration using the project's existing Supabase client
 * Run with: node scripts/apply-migration.js
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function applyMigration() {
  // Read migration file
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '004_add_templates_table.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');

  // Get Supabase credentials from environment
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    console.error('\n❌ Error: NEXT_PUBLIC_SUPABASE_URL not found in environment.');
    console.log('\nPlease set your environment variables first:');
    console.log('  $env:NEXT_PUBLIC_SUPABASE_URL = "your-project-url"');
    console.log('  $env:SUPABASE_SERVICE_ROLE_KEY = "your-service-role-key"');
    console.log('\nOr create a .env.local file with these values.\n');
    process.exit(1);
  }

  if (!supabaseKey) {
    console.error('\n❌ Error: SUPABASE_SERVICE_ROLE_KEY not found.');
    console.log('\nYou need the SERVICE ROLE key (not the anon key) to run migrations.');
    console.log('Find it in your Supabase Dashboard → Project Settings → API → service_role key.\n');
    process.exit(1);
  }

  console.log('🔄 Connecting to Supabase...');
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  console.log('📋 Running migration: 004_add_templates_table.sql\n');

  // Execute SQL
  const { error } = await supabase.rpc('exec_sql', { sql });

  if (error) {
    // If exec_sql function doesn't exist, try direct REST API
    console.log('⚠️ exec_sql not available, trying direct query...');

    // Alternative: use PostgREST to run the SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Prefer': 'tx=commit'
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      console.error('\n❌ Failed to apply migration.');
      console.error('Status:', response.status);
      console.error('\nPlease apply the SQL manually via the Supabase Dashboard:');
      console.log('1. Go to https://app.supabase.com');
      console.log('2. Open your project');
      console.log('3. Go to SQL Editor → New query');
      console.log('4. Paste the contents of: supabase/migrations/004_add_templates_table.sql');
      console.log('5. Click Run\n');
      process.exit(1);
    }
  }

  console.log('✅ Migration applied successfully!');
  console.log('The templates table is now ready to use.\n');
}

applyMigration().catch(console.error);
