import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { createApiTool } from '../utils.js';

export function instance(server: McpServer) {
  server.registerTool(
    'list-instances',
    {
      description: 'Get the list of instances',
      inputSchema: {
        query: z
          .object({
            app_id: z.string().describe('Filter on application id'),
            service_id: z.string().describe('Filter on service id'),
            deployment_id: z.string().describe('Filter on deployment id'),
            regional_deployment_id: z.string().describe('Filter on regional deployment id'),
            allocation_id: z.string().describe('Filter on allocation id'),
            replica_index: z.string().describe('Filter on replica index'),
            statuses: z
              .union([
                z.literal('ALLOCATING'),
                z.literal('STARTING'),
                z.literal('HEALTHY'),
                z.literal('UNHEALTHY'),
                z.literal('STOPPING'),
                z.literal('STOPPED'),
                z.literal('ERROR'),
                z.literal('SLEEPING'),
              ])
              .array()
              .describe('Filter on instance statuses'),
            limit: z.string().describe('The number of items to return'),
            offset: z.string().describe('The offset in the list of item to return'),
            order: z.string().describe('Sorts the list in the ascending or the descending order'),
            starting_time: z
              .string()

              .describe('The starting time of the period of running instance'),
            ending_time: z.string().describe('The ending time of the period of running instance'),
          })
          .partial()
          .optional(),
      },
    },
    createApiTool('listInstances'),
  );

  server.registerTool(
    'get-instance',
    {
      description: 'Get a specific instance by its id',
      inputSchema: {
        path: z.object({
          id: z.string().describe('The id of the instance'),
        }),
      },
    },
    createApiTool('getInstance'),
  );
}
