import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { createTextContent } from '../utils.js';

export function oneClickApps(server: McpServer) {
  server.registerTool(
    'list-one-click-apps',
    {
      description: 'List one-click apps (example applications) that can be deployed on Koyeb',
    },
    async () => {
      const response = await fetch('https://koyeb.com/api/one-click-apps.json');

      if (!response.ok) {
        return createTextContent(await response.text());
      }

      return createTextContent(await response.text());
    },
  );
}
