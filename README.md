# Gunsnation MCP Server

An MCP (Model Context Protocol) server that provides access to the Gunsnation firearms database API for AI assistants like Claude.

## Features

- **Search Firearms**: Search the firearms database by name, brand, model, UPC, or category
- **Get Firearm Details**: Retrieve comprehensive details about a specific firearm including specifications and images

## Installation

```bash
npm install gunsnation-mcp
```

Or use directly with npx:

```bash
npx gunsnation-mcp
```

## Configuration

### Environment Variables

- `GUNSNATION_API_KEY` (required): Your Gunsnation API key
- `GUNSNATION_API_URL` (optional): Custom API URL (defaults to https://api.gunsnation.com)

### Claude Desktop Configuration

Add to your Claude Desktop config file (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "gunsnation": {
      "command": "npx",
      "args": ["gunsnation-mcp"],
      "env": {
        "GUNSNATION_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Available Tools

### search_firearms

Search the Gunsnation firearms database.

**Parameters:**
- `query` (optional): Search query for firearm name, brand, model, or UPC
- `category` (optional): Category filter (e.g., "Handguns", "Rifles", "Shotguns")
- `limit` (optional): Maximum number of results (1-100, default: 20)
- `offset` (optional): Number of results to skip for pagination

**Example:**
```
Search for Glock handguns: { "query": "glock", "category": "Handguns", "limit": 10 }
```

### get_firearm

Get detailed information about a specific firearm.

**Parameters:**
- `id` (required): The ID of the firearm to retrieve

**Example:**
```
Get firearm details: { "id": 12345 }
```

## Getting an API Key

1. Create an account at [gunsnation.com](https://gunsnation.com)
2. Go to Settings
3. Click "Generate API Key" in the API Key section
4. Copy your API key and keep it secure

## Rate Limits

- 60 requests per minute per API key

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run in development mode
GUNSNATION_API_KEY=your_key npm run dev
```

## License

MIT
