# Gunsnation MCP Server

The Gunsnation MCP Server is a lightweight integration layer that exposes the Gunsnation firearms catalog to AI assistants through the Model Context Protocol (MCP). It allows compatible AI clients to search, filter, and retrieve detailed firearm information using structured tool calls instead of manual API integration.

Designed for speed and simplicity, the server connects directly to the Gunsnation API and provides a clean, standardized interface for querying products by brand, model, UPC, or category. Assistants can also fetch full specifications, images, and metadata for individual firearms, making it ideal for retail, comparison, and product discovery workflows.

Built in TypeScript and distributed as an npm package, the server is easy to install and run locally or in hosted environments. With just an API key and an MCP-compatible client, developers can quickly add real-time firearm data access to their AI tools.

Key features
	•	MCP-compatible firearm search and lookup tools
	•	Real-time access to the Gunsnation product catalog
	•	Simple installation via npm or npx
	•	Lightweight, developer-friendly TypeScript codebase
	•	Secure API-key authentication

This project is ideal for developers building AI shopping assistants, retail tools, or product discovery experiences that require up-to-date firearm data from Gunsnation.

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
