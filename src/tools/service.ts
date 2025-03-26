import { z } from "zod";

import { server } from "../server.js";
import { createTool } from "../utils.js";

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
