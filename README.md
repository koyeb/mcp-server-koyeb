# Koyeb MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.org) server implementation for the [Koyeb](https://www.koyeb.com) API. This project enables programmatic management of Koyeb resources (apps, services, deployments, instances, logs, and more) via the MCP protocol.

## Features

- **App Management**
  - List, get, and create Koyeb apps

- **Service Management**
  - List, get, create, and update services within apps

- **Deployment Management**
  - List and get deployments, query build/runtime logs

- **Instance Management**
  - List and get instances for deployments/services

- **One-Click Apps**
  - List available one-click (example) apps on Koyeb

> **Planned / Not Yet Implemented:**
> Secrets, volumes, domains, organization management, pause/resume, update app, cancel deployment, metrics, log tailing

## Installation

```sh
pnpm install -g @koyeb/mcp-server
```

Or using npm:

```sh
npm install -g @koyeb/mcp-server
```

## Usage

1. **Set your Koyeb API token:**

Create a token at [Koyeb API settings](https://app.koyeb.com/user/settings/api) and export it:

```sh
export KOYEB_TOKEN=your_token_here
```

2. **Start the MCP server:**

```sh
koyeb-mcp
```

The server will connect via stdio and expose the Koyeb API as MCP tools. It can also be integrated within a client supporting MCP (like cursor).

## Contributing

This MCP server is a work in progress. Feedback, bug reports, and contributions are welcome! Please open an issue or pull request.

## License

MIT
