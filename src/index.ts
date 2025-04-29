import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { server } from "./server.js";

import "./tools/app.js";
import "./tools/deployment.js";
import "./tools/instance.js";
import "./tools/logs.js";
import "./tools/one-click-apps.js";
import "./tools/service.js";

try {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Koyeb MCP Server connected successfully");
} catch (error) {
  console.error("Failed to start Koyeb MCP Server:", error);
  process.exitCode = 1;
}
