import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { createApiTool } from '../utils.js';

export function app(server: McpServer) {
  server.registerTool(
    'list-apps',
    {
      description: 'List apps',
      inputSchema: {
        query: z
          .object({
            limit: z.string().describe('The number of items to return'),
            name: z.string().describe('A filter for name'),
            offset: z.string().describe('The offset in the list of item to return'),
          })
          .partial()
          .optional(),
      },
    },
    createApiTool('listApps'),
  );

  server.registerTool(
    'get-app',
    {
      description: 'Get an app by its id',
      inputSchema: {
        path: z.object({
          id: z.string().describe('The id of the App'),
        }),
      },
    },
    createApiTool('getApp'),
  );

  server.registerTool(
    'create-app',
    {
      description: 'Create an app',
      inputSchema: {
        body: z.object({
          name: z.string().describe('The name of the app'),
        }),
      },
    },
    createApiTool('createApp'),
  );
}
