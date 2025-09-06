#!/usr/bin/env -S deno run --allow-read

import { Server } from "npm:@modelcontextprotocol/sdk@1.8.0/server/index.js";
import { StdioServerTransport } from "npm:@modelcontextprotocol/sdk@1.8.0/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "npm:@modelcontextprotocol/sdk@1.8.0/types.js";

import init, { decode, guess } from "npm:@stellar/stellar-xdr-json@23.0.0";
await init();

const server = new Server(
  {
    name: "mcp-stellar-xdr",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "xdr_guess",
        description: "Guess what type Stellar XDR is, getting back a list of possible types.",
        inputSchema: {
          type: "object",
          properties: {
            xdr: {
              type: "string",
              description: "Base64-encoded XDR"
            },
          },
          required: ["xdr"]
        }
      },
      {
        name: "xdr_decode",
        description: "Decode a Stellar XDR to JSON",
        inputSchema: {
          type: "object",
          properties: {
            type: {
              type: "string",
              description: "Type name"
            },
            xdr: {
              type: "string",
              description: "Base64-encoded XDR of the transaction"
            },
          },
          required: ["type", "xdr"]
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "xdr_guess": {
      const xdr = String(request.params.arguments?.xdr);
      if (!xdr) {
        throw new Error("XDR is required");
      }

      const list = guess(xdr);

      return {
        content: [{
          type: "text",
          text: `${list.join(", ")}`
        }]
      };
    }

    case "xdr_decode": {
      const xdr = String(request.params.arguments?.xdr);
      const type = String(request.params.arguments?.type);
      if (!xdr || !type) {
        throw new Error("XDR is required");
      }

      const json = decode(type, xdr);

      return {
        content: [{
          type: "text",
          text: `${json}`
        }]
      };
    }

    default:
      throw new Error("Unknown tool");
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  Deno.exit(1);
});
