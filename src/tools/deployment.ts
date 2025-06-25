import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { createTool } from '../utils.js';

export function deployment(server: McpServer) {
  server.tool(
    'list-deployments',
    'Get the list of deployments',
    {
      // prettier-ignore
      query: z.object({
        app_id: z.string().optional().describe('Filter on application id'),
        service_id: z.string().optional().describe('Filter on service id'),
        limit: z.string().optional().describe('The number of items to return'),
        offset: z.string().optional().describe('The offset in the list of item to return'),
        statuses: z.union([z.literal('PENDING'), z.literal('PROVISIONING'), z.literal('SCHEDULED'), z.literal('CANCELING'), z.literal('CANCELED'), z.literal('ALLOCATING'), z.literal('STARTING'), z.literal('HEALTHY'), z.literal('DEGRADED'), z.literal('UNHEALTHY'), z.literal('STOPPING'), z.literal('STOPPED'), z.literal('ERRORING'), z.literal('ERROR'), z.literal('STASHED'), z.literal('SLEEPING')]).array().optional().describe('Filter on statuses')
      }),
    },
    createTool('listDeployments'),
  );

  server.tool(
    'get-deployment',
    'Get a specific deployment by its id',
    {
      // prettier-ignore
      path: z.object({
        id: z.string().optional().describe('The id of the deployment'),
      }),
    },
    createTool('getDeployment'),
  );
}
