import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { GunsnationApiClient } from './api/client';
import { searchFirearms, searchFirearmsSchema } from './tools/search-firearms';
import { getFirearm, getFirearmSchema } from './tools/get-firearm';

export class GunsnationMcpServer {
  private server: Server;
  private apiClient: GunsnationApiClient;

  constructor(apiKey: string, apiUrl?: string) {
    this.server = new Server(
      {
        name: 'gunsnation-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.apiClient = new GunsnationApiClient(apiKey, apiUrl);

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'search_firearms',
            description:
              'Search the Gunsnation firearms database. Returns a list of firearms matching the search criteria with basic details including name, brand, caliber, action type, and price.',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query for firearm name, brand, model, or UPC',
                },
                category: {
                  type: 'string',
                  description: 'Category filter (e.g., "Handguns", "Rifles", "Shotguns")',
                },
                limit: {
                  type: 'number',
                  description: 'Maximum number of results (1-100, default: 20)',
                  minimum: 1,
                  maximum: 100,
                  default: 20,
                },
                offset: {
                  type: 'number',
                  description: 'Number of results to skip for pagination',
                  minimum: 0,
                  default: 0,
                },
              },
            },
          },
          {
            name: 'get_firearm',
            description:
              'Get detailed information about a specific firearm by its ID. Returns comprehensive details including specifications, description, and images.',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: ['string', 'number'],
                  description: 'The ID of the firearm to retrieve',
                },
              },
              required: ['id'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'search_firearms': {
            const input = searchFirearmsSchema.parse(args);
            const result = await searchFirearms(this.apiClient, input);
            return {
              content: [
                {
                  type: 'text',
                  text: result,
                },
              ],
            };
          }

          case 'get_firearm': {
            const input = getFirearmSchema.parse(args);
            const result = await getFirearm(this.apiClient, input);
            return {
              content: [
                {
                  type: 'text',
                  text: result,
                },
              ],
            };
          }

          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }

        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Gunsnation MCP server running on stdio');
  }
}
