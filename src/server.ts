import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createTextContent } from "./utils.js";

export const server = new McpServer({
  name: "koyeb",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

server.tool("get-token", "Get the Koyeb API token", {}, () => {
  return createTextContent(process.env.KOYEB_TOKEN ?? "No token set");
});
