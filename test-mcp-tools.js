import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverPath = join(__dirname, 'supabase-mcp', 'packages', 'mcp-server-supabase', 'dist', 'transports', 'stdio.cjs');

console.log('=== Supabase MCP Server: Tool Capabilities Demo ===\n');

const server = spawn('node', [serverPath, '--access-token', 'sbp_demo_token_for_testing'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let buffer = '';

server.stdout.on('data', (data) => {
  buffer += data.toString();
  
  // Try to parse complete JSON-RPC messages
  const lines = buffer.split('\n');
  buffer = lines.pop() || '';
  
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const msg = JSON.parse(line);
      
      if (msg.id === 1 && msg.result) {
        console.log('✅ Server initialized successfully!');
        console.log(`   Protocol: ${msg.result.protocolVersion}`);
        console.log(`   Server: ${msg.result.serverInfo?.name} v${msg.result.serverInfo?.version}`);
        console.log(`   Capabilities:`, Object.keys(msg.result.capabilities || {}).join(', '));
      }
      
      if (msg.id === 2 && msg.result?.tools) {
        console.log(`   Tools available: ${msg.result.tools.length}\n`);
        console.log('Available Tools:');
        msg.result.tools.forEach((tool, i) => {
          console.log(`  ${i + 1}. ${tool.name}`);
          if (tool.description) {
            const desc = tool.description.length > 100 
              ? tool.description.substring(0, 100) + '...' 
              : tool.description;
            console.log(`     ${desc}`);
          }
        });
      }
    } catch (e) {
      // Not valid JSON
    }
  }
});

server.stderr.on('data', (data) => {
  // Suppress stderr for clean output
});

// Send initialize request
setTimeout(() => {
  const initRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'demo-client', version: '1.0.0' }
    }
  };
  server.stdin.write(JSON.stringify(initRequest) + '\n');
}, 500);

// Send tools/list request after initialization
setTimeout(() => {
  const toolsRequest = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  };
  server.stdin.write(JSON.stringify(toolsRequest) + '\n');
}, 1500);

// Close after 3 seconds
setTimeout(() => {
  console.log('\n=== Demo Complete ===');
  server.kill();
}, 3000);

