import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { createApiTool } from '../utils.js';

export function instance(server: McpServer) {
  server.tool(
    'list-instances',
    'Get the list of instances',
    {
      // prettier-ignore
      query: z.object({
      app_id: z.string().optional().describe('Filter on application id'),
      service_id: z.string().optional().describe('Filter on service id'),
      deployment_id: z.string().optional().describe('Filter on deployment id'),
      regional_deployment_id: z.string().optional().describe('Filter on regional deployment id'),
      allocation_id: z.string().optional().describe('Filter on allocation id'),
      replica_index: z.string().optional().describe('Filter on replica index'),
      statuses: z.union([z.literal('ALLOCATING'), z.literal('STARTING'), z.literal('HEALTHY'), z.literal('UNHEALTHY'), z.literal('STOPPING'), z.literal('STOPPED'), z.literal('ERROR'), z.literal('SLEEPING')]).describe('Filter on instance statuses'),
      limit: z.string().optional().describe('The number of items to return'),
      offset: z.string().optional().describe('The offset in the list of item to return'),
      order: z.string().optional().describe('Sorts the list in the ascending or the descending order'),
      starting_time: z.string().optional().describe('The starting time of the period of running instance'),
      ending_time: z.string().optional().describe('The ending time of the period of running instance'),
    }),
    },
    createApiTool('listInstances'),
  );

  server.tool(
    'get-instance',
    'Get a specific instance by its id',
    {
      // prettier-ignore
      path: z.object({
      id: z.string().optional().describe('The id of the instance'),
    }),
    },
    createApiTool('getInstance'),
  );
}
