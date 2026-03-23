#!/usr/bin/env node

import { GunsnationMcpServer } from './server';

async function main() {
  const apiKey = process.env.GUNSNATION_API_KEY || '';
  const apiUrl = process.env.GUNSNATION_API_URL;

  if (!apiKey) {
    console.error('Warning: GUNSNATION_API_KEY not set. Server will start but tools will return errors.');
  }

  const server = new GunsnationMcpServer(apiKey, apiUrl);
  await server.run();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
