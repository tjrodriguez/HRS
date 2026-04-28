import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverPath = join(__dirname, 'supabase-mcp', 'packages', 'mcp-server-supabase', 'dist', 'transports', 'stdio.cjs');

console.log('Starting Supabase MCP Server test...\n');

// Spawn the MCP server with a demo token
const server = spawn('node', [serverPath, '--access-token', 'sbp_demo_token_for_testing'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';

server.stdout.on('data', (data) => {
  output += data.toString();
  console.log('Server output:', data.toString().trim());
});

server.stderr.on('data', (data) => {
  console.error('Server error:', data.toString().trim());
});

server.on('close', (code) => {
  console.log(`\nServer exited with code ${code}`);
});

// Send initialize request after a short delay
setTimeout(() => {
  const initRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0'
      }
    }
  };
  
  console.log('Sending initialize request...');
  server.stdin.write(JSON.stringify(initRequest) + '\n');
}, 1000);

// Close after 3 seconds
setTimeout(() => {
  console.log('\nClosing server...');
  server.kill();
}, 3000);

