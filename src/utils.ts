import util from 'node:util';

import * as koyeb from '@koyeb/api-client-js';
import { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { ZodRawShape } from 'zod';

type Koyeb = typeof koyeb;

export const auth = `Bearer ${process.env.KOYEB_TOKEN}`;

export function createApiTool(name: keyof Koyeb): ToolCallback<ZodRawShape> {
  const fn = koyeb[name] as Function;

  return async (params: object) => {
    const result = await fn({ auth, ...params });

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

type ApiResult<T> = { data: T; error: undefined } | { data: undefined; error: unknown };

export async function api<T>(promise: Promise<ApiResult<T>>): Promise<T> {
  const result = await promise;

  if (result.error) {
    throw Object.assign(new Error('API Call failed'), { result });
  }

  return result.data as T;
}
