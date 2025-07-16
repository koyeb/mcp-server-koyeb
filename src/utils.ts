import * as koyeb from '@koyeb/api-client-js';
import { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { ZodRawShape } from 'zod';

type Koyeb = typeof koyeb;

export function createApiTool(name: keyof Koyeb): ToolCallback<ZodRawShape> {
  const fn = koyeb[name] as Function;

  return async (params: object) => {
    const headers = new Headers();

    headers.set('Authorization', `Bearer ${process.env.KOYEB_TOKEN}`);

    const result = await fn({
      headers,
      ...params,
    });

    if (result.error) {
      return createTextContent('Error: ' + result.error ? JSON.stringify(result.error) : 'unknown error');
    }

    return createTextContent(JSON.stringify(result.data));
  };
}

export function createTextContent(text: string): CallToolResult {
  return {
    content: [{ type: 'text', text }],
  };
}
