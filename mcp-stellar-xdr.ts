#!/usr/bin/env -S deno run --allow-read

import { Server } from "npm:@modelcontextprotocol/sdk@1.8.0/server/index.js";
import { StdioServerTransport } from "npm:@modelcontextprotocol/sdk@1.8.0/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "npm:@modelcontextprotocol/sdk@1.8.0/types.js";

import init, {
  decode,
  encode,
  guess,
  schema,
  types,
} from "npm:@stellar/stellar-xdr-json@23.0.0";
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
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "xdr_types",
        description: "Get the supported XDR types.",
      },
      {
        name: "xdr_json_schema",
        description: "Get the JSON schema for an XDR type.",
        inputSchema: {
          type: "object",
          properties: {
            type: {
              type: "string",
              description: "Type name",
            },
          },
          required: ["type"],
        },
      },
      {
        name: "xdr_guess",
        description:
          "Guess what type Stellar XDR is, getting back a list of possible types.",
        inputSchema: {
          type: "object",
          properties: {
            xdr: {
              type: "string",
              description: "Base64-encoded XDR",
            },
          },
          required: ["xdr"],
        },
      },
      {
        name: "xdr_decode",
        description: "Decode a Stellar XDR to JSON",
        inputSchema: {
          type: "object",
          properties: {
            type: {
              type: "string",
              description: "Type name",
            },
            xdr: {
              type: "string",
              description: "Base64-encoded XDR of the transaction",
            },
          },
          required: ["type", "xdr"],
        },
      },
      {
        name: "xdr_encode",
        description: "Encode a Stellar XDR from JSON",
        inputSchema: {
          type: "object",
          properties: {
            type: {
              type: "string",
              description: "Type name",
            },
            json: {
              type: "string",
              description:
                "JSON for the transaction adhereing to the JSON Schema",
            },
          },
          required: ["type", "json"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "xdr_types": {
      const list = types();

      return { content: [{ type: "text", text: `${list.join(", ")}` }] };
    }

    case "xdr_json_schema": {
      const type = String(request.params.arguments?.type);
      if (!type) {
        throw new Error("Type is required");
      }

      const json_schema = schema(type);

      return { content: [{ type: "text", text: `${json_schema}` }] };
    }

    case "xdr_guess": {
      const xdr = String(request.params.arguments?.xdr);
      if (!xdr) {
        throw new Error("XDR is required");
      }

      const list = guess(xdr);

      return { content: [{ type: "text", text: `${list.join(", ")}` }] };
    }

    case "xdr_decode": {
      const type = String(request.params.arguments?.type);
      const xdr = String(request.params.arguments?.xdr);
      if (!type || !xdr) {
        throw new Error("Type and XDR is required");
      }

      const json = decode(type, xdr);

      return { content: [{ type: "text", text: `${json}` }] };
    }

    case "xdr_encode": {
      const type = String(request.params.arguments?.type);
      const json = String(request.params.arguments?.json);
      if (!type || !json) {
        throw new Error("Type and JSON is required");
      }

      const xdr = encode(type, json);

      return { content: [{ type: "text", text: `${xdr}` }] };
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
