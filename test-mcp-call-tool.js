import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverPath = join(__dirname, 'supabase-mcp', 'packages', 'mcp-server-supabase', 'dist', 'transports', 'stdio.cjs');

console.log('=== Supabase MCP Server: Tool Execution Demo ===\n');
console.log('Calling tool: search_docs (query: "getting started")\n');

const server = spawn('node', [serverPath, '--access-token', 'sbp_demo_token_for_testing'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let buffer = '';
let callResult = null;

server.stdout.on('data', (data) => {
  buffer += data.toString();
  
  const lines = buffer.split('\n');
  buffer = lines.pop() || '';
  
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const msg = JSON.parse(line);
      
      if (msg.id === 1 && msg.result) {
        console.log('✅ Server initialized');
        console.log(`   Protocol: ${msg.result.protocolVersion}`);
        console.log(`   Server: ${msg.result.serverInfo?.name} v${msg.result.serverInfo?.version}\n`);
      }
      
      if (msg.id === 2 && msg.result) {
        console.log('✅ Tool call successful!');
        callResult = msg.result;
        if (msg.result.content) {
          console.log('\nResult:');
          msg.result.content.forEach(item => {
            if (item.type === 'text') {
              console.log(item.text);
            }
          });
        }
        if (msg.result.isError) {
          console.log('\n⚠️ Tool returned an error');
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
});

server.stderr.on('data', (data) => {
  // Suppress stderr
});

// Initialize
setTimeout(() => {
  server.stdin.write(JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'demo-client', version: '1.0.0' }
    }
  }) + '\n');
}, 500);

// Call search_docs tool
setTimeout(() => {
  server.stdin.write(JSON.stringify({
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'search_docs',
      arguments: {
        graphql_query: '{ searchDocs(query: "getting started") { nodes { title } } }'
      }
    }
  }) + '\n');
}, 1500);

// Close after 4 seconds
setTimeout(() => {
  if (!callResult) {
    console.log('\n⏱️ Request timed out or no result returned');
  }
  console.log('\n=== Demo Complete ===');
  server.kill();
}, 4000);

