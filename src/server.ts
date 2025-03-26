import * as koyeb from "@koyeb/api-client-js";
import {
  McpServer,
  ToolCallback,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z, ZodRawShape } from "zod";

const token = process.env.KOYEB_TOKEN;

export const server = new McpServer({
  name: "koyeb",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

server.tool("get-token", "Get the Koyeb API token", {}, () => {
  return createTextContent(token ?? "No token set.");
});

server.tool(
  "list-services",
  "Get the list of services",
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
  createTool("listServices")
);

server.tool(
  "get-service",
  "Get a specific service by its id",
  {
    // prettier-ignore
    path: z.object({
      id: z.string().optional().describe('The id of the Service'),
    }),
  },
  createTool("getService")
);

server.tool(
  "list-deployments",
  "Get the list of deployments",
  {
    // prettier-ignore
    query: z.object({
      app_id: z.string().optional().describe('Filter on application id'),
      service_id: z.string().optional().describe('Filter on service id'),
      limit: z.string().optional().describe('The number of items to return'),
      offset: z.string().optional().describe('The offset in the list of item to return'),
      statuses: z.union([z.literal('PENDING'), z.literal('PROVISIONING'), z.literal('SCHEDULED'), z.literal('CANCELING'), z.literal('CANCELED'), z.literal('ALLOCATING'), z.literal('STARTING'), z.literal('HEALTHY'), z.literal('DEGRADED'), z.literal('UNHEALTHY'), z.literal('STOPPING'), z.literal('STOPPED'), z.literal('ERRORING'), z.literal('ERROR'), z.literal('STASHED'), z.literal('SLEEPING')]).array().optional().describe('Filter on statuses')
    }),
  },
  createTool("listDeployments")
);

server.tool(
  "get-deployment",
  "Get a specific deployment by its id",
  {
    // prettier-ignore
    path: z.object({
      id: z.string().optional().describe('The id of the deployment'),
    }),
  },
  createTool("getDeployment")
);

server.tool(
  "list-instances",
  "Get the list of instances",
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
  createTool("listInstances")
);

server.tool(
  "get-instance",
  "Get a specific instance by its id",
  {
    // prettier-ignore
    path: z.object({
      id: z.string().optional().describe('The id of the instance'),
    }),
  },
  createTool("getInstance")
);

server.tool(
  "query-logs",
  "Get the build or runtime logs",
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
  createTool("queryLogs")
);

type Koyeb = typeof koyeb;

function createTool(name: keyof Koyeb): ToolCallback<ZodRawShape> {
  const fn = koyeb[name] as Function;

  return async (params: object) => {
    const headers = new Headers();

    headers.set("Authorization", `Bearer ${token}`);

    const result = await fn({
      headers,
      ...params,
    });

    if (result.error) {
      return createTextContent(result.error.message ?? "Error");
    }

    return createTextContent(JSON.stringify(result.data));
  };
}

function createTextContent(text: string): CallToolResult {
  return {
    content: [{ type: "text", text }],
  };
}
