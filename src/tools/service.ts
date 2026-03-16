import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { deploymentDefinitionSchema } from '../schemas.js';
import { createApiTool } from '../utils.js';

export function service(server: McpServer) {
  server.registerTool(
    'list-services',
    {
      description: 'Get the list of services',
      inputSchema: {
        query: z
          .object({
            app_id: z.string().describe('The id of the app'),
            limit: z.string().describe('The number of items to return'),
            offset: z.string().describe('The offset in the list of item to return'),
            name: z.string().describe('A filter for name'),
            types: z
              .union([
                z.literal('INVALID_TYPE'),
                z.literal('WEB'),
                z.literal('WORKER'),
                z.literal('DATABASE'),
              ])
              .array()
              .describe('Filter on service types'),
          })
          .partial()
          .optional(),
      },
    },
    createApiTool('listServices'),
  );

  server.registerTool(
    'get-service',
    {
      description: 'Get a specific service by its id',
      inputSchema: {
        path: z.object({
          id: z.string().describe('The id of the Service'),
        }),
      },
    },
    createApiTool('getService'),
  );

  server.registerTool(
    'create-service',
    {
      description: 'Create a new service inside an existing app',
      inputSchema: {
        query: z
          .object({
            dry_run: z.boolean().describe('If true only run validation'),
          })
          .partial()
          .optional(),
        body: z.object({
          app_id: z.string().describe('The id of the app'),
          definition: deploymentDefinitionSchema(),
        }),
      },
    },
    createApiTool('createService'),
  );

  server.registerTool(
    'update-service',
    {
      description: "Update a service's configuration by creating a new deployment",
      inputSchema: {
        path: z.object({
          id: z.string().describe('The id of the Service'),
        }),
        query: z
          .object({
            dry_run: z
              .boolean()
              .describe(
                'If true, do not trigger a deployment, only run validation and check that the service exists',
              ),
          })
          .partial()
          .optional(),
        body: z.object({
          definition: deploymentDefinitionSchema(),
          save_only: z
            .boolean()
            .optional()
            .describe('If set, do not trigger a deployment, only store the new settings'),
          skip_build: z
            .boolean()
            .optional()
            .describe(
              'If set to true, the build stage will be skipped and the image coming from the last successful build step will be used instead. The call fails if no previous successful builds happened.',
            ),
        }),
      },
    },
    createApiTool('updateService'),
  );
}
