import * as koyeb from '@koyeb/api-client-js';
import { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

type Koyeb = typeof koyeb;

type KoyebApiParam<Name extends keyof Koyeb> = Koyeb[Name] extends Function
  ? Parameters<Koyeb[Name]>[0]
  : never;

export const token = process.env.KOYEB_TOKEN;
export const auth = `Bearer ${token}`;

export function createApiTool<Name extends keyof Koyeb>(
  name: Name,
): ToolCallback<z.ZodType<KoyebApiParam<Name>>> {
  const fn = koyeb[name] as Function;

  return async (params) => {
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
    throw new Error(JSON.stringify(result.error));
  }

  return result.data as T;
}
