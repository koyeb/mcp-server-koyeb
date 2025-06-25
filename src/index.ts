import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import pkg from '../package.json';
import { app } from './tools/app.js';
import { deployment } from './tools/deployment.js';
import { instance } from './tools/instance.js';
import { logs } from './tools/logs.js';
import { oneClickApps } from './tools/one-click-apps.js';
import { service } from './tools/service.js';
import { createTextContent } from './utils.js';

export default function createStatelessServer() {
  const server = new McpServer({
    name: 'koyeb',
    version: pkg.version,
    capabilities: {
      resources: {},
      tools: {},
    },
  });

  server.tool('get-token', 'Get the Koyeb API token', {}, () => {
    return createTextContent(process.env.KOYEB_TOKEN ?? 'No token set');
  });

  app(server);
  deployment(server);
  instance(server);
  logs(server);
  oneClickApps(server);
  service(server);

  return server.server;
}
