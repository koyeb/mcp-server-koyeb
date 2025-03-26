import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { server } from "./server.js";
import "./tools/deployment.js";
import "./tools/instance.js";
import "./tools/logs.js";
import "./tools/service.js";

try {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Koyeb MCP Server running on stdio");
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
