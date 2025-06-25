import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { createTool } from '../utils.js';

export function app(server: McpServer) {
  server.tool(
    'list-apps',
    'List apps',
    {
      query: z.object({
        limit: z.string().optional().describe('The number of items to return'),
        name: z.string().optional().describe('A filter for name'),
        offset: z.string().optional().describe('The offset in the list of item to return'),
      }),
    },
    createTool('listApps'),
  );

  server.tool(
    'get-app',
    'Get an app by its id',
    {
      path: z.object({
        id: z.string().describe('The id of the App'),
      }),
    },
    createTool('getApp'),
  );

  server.tool(
    'create-app',
    'Create an app',
    {
      body: z.object({
        name: z.string().describe('The name of the app'),
      }),
    },
    createTool('createApp'),
  );
}
