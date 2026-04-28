const { Client } = require('pg');
const fs = require('fs');

const sql = fs.readFileSync('supabase/migrations/004_add_templates_table.sql', 'utf-8');
const projectRef = 'vnetdecbbnwytjvnjkxc';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuZXRkZWNiYm53eXRqdm5qa3hjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgxMTkxMCwiZXhwIjoyMDkxMzg3OTEwfQ.6fNQlXsnTId7T7xencsKHHrtQO-NCCgMyO7emiCR428';

const hosts = [
  'db.' + projectRef + '.supabase.co',
  'aws-0-us-east-1.pooler.supabase.com',
  'aws-0-us-west-1.pooler.supabase.com',
  'aws-0-eu-west-1.pooler.supabase.com',
  'aws-0-ap-southeast-1.pooler.supabase.com'
];

async function tryConnect(host, port, ssl) {
  const client = new Client({
    host,
    port,
    database: 'postgres',
    user: 'postgres.' + projectRef,
    password: serviceRoleKey,
    ssl: ssl ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 5000
  });
  try {
    await client.connect();
    console.log('Connected to ' + host + ':' + port + ' (ssl=' + ssl + ')');
    await client.query(sql);
    console.log('Migration applied successfully!');
    await client.end();
    return true;
  } catch (err) {
    console.log('Failed ' + host + ':' + port + ' ssl=' + ssl + ': ' + err.message);
    try { await client.end(); } catch(e) {}
    return false;
  }
}

(async () => {
  for (const host of hosts) {
    const port = host.includes('pooler') ? 6543 : 5432;
    if (await tryConnect(host, port, true)) return;
    if (await tryConnect(host, port, false)) return;
  }
  console.log('All connection attempts failed. Please apply migration manually via Supabase Dashboard SQL Editor.');
})();

