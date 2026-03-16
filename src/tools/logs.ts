import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { createApiTool } from '../utils.js';

export function logs(server: McpServer) {
  server.registerTool(
    'query-logs',
    {
      description: 'Get the build or runtime logs',
      inputSchema: {
        query: z
          .object({
            type: z.union([z.literal('build'), z.literal('runtime')]).describe('Type of logs'),
            app_id: z.string().describe('Filter by application id'),
            service_id: z.string().describe('Filter by service id'),
            deployment_id: z.string().describe('Filter by deployment id'),
            instance_id: z.string().describe('Filter by instance id'),
            stream: z.union([z.literal('stdio'), z.literal('stderr')]).describe('Filter by log stream'),
            regional_deployment_id: z.string().describe('Filter by regional deployment id'),
            start: z.string().describe('Must always be before `end`. Defaults to 15 minutes ago.'),
            end: z.string().describe('Must always be after `start`. Defaults to now.'),
            order: z.string().describe('`asc` or `desc`. Defaults to `desc`.'),
            limit: z.string().describe('Defaults to 100. Maximum of 1000.'),
            regex: z.string().describe("Apply a regex to filter logs. Can't be used with `text`."),
            text: z.string().describe("Looks for this string in logs. Can't be used with `regex`."),
          })
          .partial()
          .optional(),
      },
    },
    createApiTool('queryLogs'),
  );
}
