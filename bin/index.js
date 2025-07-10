#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import createStatelessServer from '../build/index.js';

export async function startServer() {
  await createStatelessServer().connect(new StdioServerTransport());
}

startServer().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
