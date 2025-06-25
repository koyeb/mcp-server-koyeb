# Koyeb MCP Server

> [!NOTE]
>
> **Koyeb MCP** is currently a beta pre-release. Feedback, bug reports, and contributions are welcome! Please open an issue or pull request.
>
> Planned features:
> Secrets, volumes, domains, pause/resume, update app, cancel deployment, metrics, log tailing

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

## Adding MCP config to your client

Add the following to your `.cursor/mcp.json` or `claude_desktop_config.json`.

```json
{
  "mcpServers": {
    "koyebApi": {
      "command": "npx",
      "args": ["-y", "@koyeb/mcp-server-koyeb"],
      "env": {
        "KOYEB_TOKEN": "your_token_here"
      }
    }
  }
}
```

## CLI usage

1. **Install the package from npmjs:**

```sh
npm install -g @koyeb/mcp-server-koyeb
```

2. **Set your Koyeb API token:**

Create a token at [Koyeb API settings](https://app.koyeb.com/user/settings/api) and export it:

```sh
export KOYEB_TOKEN=your_token_here
```

3. **Start the MCP server:**

```sh
koyeb-mcp
```

The server will connect via stdio and expose the Koyeb API as MCP tools.

## License

MIT
