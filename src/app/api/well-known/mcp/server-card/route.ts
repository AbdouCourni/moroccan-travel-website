// app/api/well-known/mcp/server-card/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const mcpCard = {
    "serverInfo": {
      "name": "MoroCompase MCP Server",
      "version": "1.0.0",
      "description": "Morocco travel planning and discovery tools"
    },
    "transport": {
      "type": "http",
      "endpoint": "https://morocompase.com/api/mcp",
      "protocol": "json-rpc",
      "version": "2.0"
    },
    "capabilities": {
      "tools": [
        {
          "name": "search_destinations",
          "description": "Search Morocco destinations by name, region, or activity",
          "inputSchema": {
            "type": "object",
            "properties": {
              "query": { "type": "string" },
              "region": { "type": "string" },
              "limit": { "type": "integer", "default": 10 }
            }
          }
        },
        {
          "name": "plan_trip",
          "description": "Generate personalized Morocco itinerary",
          "inputSchema": {
            "type": "object",
            "properties": {
              "duration": { "type": "integer" },
              "interests": { "type": "array", "items": { "type": "string" } },
              "budget": { "type": "string", "enum": ["budget", "mid", "luxury"] }
            }
          }
        },
        {
          "name": "get_accommodation",
          "description": "Find places to stay in Morocco",
          "inputSchema": {
            "type": "object",
            "properties": {
              "destination": { "type": "string" },
              "type": { "type": "string", "enum": ["riad", "hotel", "camp"] },
              "price_range": { "type": "object" }
            }
          }
        }
      ],
      "resources": [
        {
          "uri": "https://morocompase.com/api/destinations",
          "name": "destinations",
          "description": "List of all Morocco destinations",
          "mimeType": "application/json"
        }
      ]
    },
    "authentication": {
      "type": "oauth2",
      "wellKnown": "https://morocompase.com/.well-known/openid-configuration"
    }
  };

  return NextResponse.json(mcpCard, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}