import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { createTool } from '../utils.js';

export function logs(server: McpServer) {
  server.tool(
    'query-logs',
    'Get the build or runtime logs',
    {
      // prettier-ignore
      query: z.object({
      type: z.union([z.literal('build'), z.literal('runtime')]).optional().describe('Type of logs'),
      app_id: z.string().optional().describe('Filter by application id'),
      service_id: z.string().optional().describe('Filter by service id'),
      deployment_id: z.string().optional().describe('Filter by deployment id'),
      instance_id: z.string().optional().describe('Filter by instance id'),
      stream: z.union([z.literal('stdio'), z.literal('stderr')]).optional().describe('Filter by log stream'),
      regional_deployment_id: z.string().optional().describe('Filter by regional deployment id'),
      start: z.string().optional().describe('Must always be before `end`. Defaults to 15 minutes ago.'),
      end: z.string().optional().describe('Must always be after `start`. Defaults to now.'),
      order: z.string().optional().describe('`asc` or `desc`. Defaults to `desc`.'),
      limit: z.string().optional().describe('Defaults to 100. Maximum of 1000.'),
      regex: z.string().optional().describe('Apply a regex to filter logs. Can\'t be used with `text`.'),
      text: z.string().optional().describe('Looks for this string in logs. Can\'t be used with `regex`.'),
    }),
    },
    createTool('queryLogs'),
  );
}
