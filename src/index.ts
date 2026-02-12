#!/usr/bin/env node

import { GunsnationMcpServer } from './server';

async function main() {
  const apiKey = process.env.GUNSNATION_API_KEY;

  if (!apiKey) {
    console.error('Error: GUNSNATION_API_KEY environment variable is required');
    console.error('');
    console.error('Usage:');
    console.error('  GUNSNATION_API_KEY=your_key npx gunsnation-mcp');
    console.error('');
    console.error('Or in Claude Desktop config:');
    console.error(JSON.stringify({
      mcpServers: {
        gunsnation: {
          command: 'npx',
          args: ['gunsnation-mcp'],
          env: { GUNSNATION_API_KEY: 'your_key_here' },
        },
      },
    }, null, 2));
    process.exit(1);
  }

  const apiUrl = process.env.GUNSNATION_API_URL;

  const server = new GunsnationMcpServer(apiKey, apiUrl);
  await server.run();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
