import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { createApiTool } from '../utils.js';

export function deployment(server: McpServer) {
  server.registerTool(
    'list-deployments',
    {
      description: 'Get the list of deployments',
      inputSchema: {
        query: z
          .object({
            app_id: z.string().describe('Filter on application id'),
            service_id: z.string().describe('Filter on service id'),
            limit: z.string().describe('The number of items to return'),
            offset: z.string().describe('The offset in the list of item to return'),
            statuses: z
              .union([
                z.literal('PENDING'),
                z.literal('PROVISIONING'),
                z.literal('SCHEDULED'),
                z.literal('CANCELING'),
                z.literal('CANCELED'),
                z.literal('ALLOCATING'),
                z.literal('STARTING'),
                z.literal('HEALTHY'),
                z.literal('DEGRADED'),
                z.literal('UNHEALTHY'),
                z.literal('STOPPING'),
                z.literal('STOPPED'),
                z.literal('ERRORING'),
                z.literal('ERROR'),
                z.literal('STASHED'),
                z.literal('SLEEPING'),
              ])
              .array()
              .describe('Filter on statuses'),
          })
          .partial()
          .optional(),
      },
    },
    createApiTool('listDeployments'),
  );

  server.registerTool(
    'get-deployment',
    {
      description: 'Get a specific deployment by its id',
      inputSchema: {
        path: z.object({
          id: z.string().describe('The id of the deployment'),
        }),
      },
    },
    createApiTool('getDeployment'),
  );
}
