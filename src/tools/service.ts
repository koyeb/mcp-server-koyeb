import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { deploymentDefinitionSchema } from '../schemas.js';
import { createApiTool } from '../utils.js';

export function service(server: McpServer) {
  server.tool(
    'list-services',
    'Get the list of services',
    {
      // prettier-ignore
      query: z.object({
        app_id: z.string().optional().describe('The id of the app'),
        limit: z.string().optional().describe('The number of items to return'),
        offset: z.string().optional().describe('The offset in the list of item to return'),
        name: z.string().optional().describe('A filter for name'),
        types: z.union([z.literal('INVALID_TYPE'), z.literal('WEB'), z.literal('WORKER'), z.literal('DATABASE')]).array().optional().describe('Filter on service types')
      }),
    },
    createApiTool('listServices'),
  );

  server.tool(
    'get-service',
    'Get a specific service by its id',
    {
      path: z.object({
        id: z.string().describe('The id of the Service'),
      }),
    },
    createApiTool('getService'),
  );

  server.tool(
    'create-service',
    'Create a new service inside an existing app',
    {
      query: z
        .object({
          dry_run: z.string().optional().describe('If set only run validation'),
        })
        .optional(),
      body: z.object({
        app_id: z.string().describe('The id of the app'),
        definition: deploymentDefinitionSchema,
      }),
    },
    createApiTool('createService'),
  );

  server.tool(
    'update-service',
    "Update a service's configuration by creating a new deployment",
    {
      path: z.object({
        id: z.string().describe('The id of the Service'),
      }),
      // prettier-ignore
      query: z.object({
        dry_run: z.string().optional().describe('If set, do not trigger a deployment, only run validation and check that the service exists'),
      }).optional(),
      // prettier-ignore
      body: z.object({
        definition: deploymentDefinitionSchema,
        save_only: z.boolean().optional().describe('If set, do not trigger a deployment, only store the new settings'),
        skip_build: z.boolean().optional().describe('If set to true, the build stage will be skipped and the image coming from the last successful build step will be used instead. The call fails if no previous successful builds happened.')
      }),
    },
    createApiTool('updateService'),
  );
}
