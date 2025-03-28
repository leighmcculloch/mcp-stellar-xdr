# Stellar MCP Server for XDR-JSON

A [Claude Model Context Protocol (MCP)] server that exposes Stellar XDR-JSON conversion tools, that Claude can use to understand what XDR means. 

[Claude Model Context Protocol (MCP)]: https://www.claudemcp.com/

## Usage (Claude Desktop)

To use with Claude Desktop:

1. Add the server config:

   On macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

   On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "stellar-mcp": {
         "command": "npx",
         "args": ["deno", "run", "--allow-read", "https://github.com/leighmcculloch/stellar-mcp-xdr-json/raw/refs/heads/main/stellar-mcp-xdr-json.ts"]
       }
     }
   }
   ```

2. Reopen Claude Desktop. 

## Usage (Claude Code)

1. Add the server config:

   ```
   claude mcp add \
     --transport stdio \
     --scope user \
     stellar-mcp-xdr-json \
     -- \
     npx deno run --allow-read https://github.com/leighmcculloch/stellar-mcp-xdr-json/raw/refs/heads/main/stellar-mcp-xdr-json.ts
   ```

2. Reopen Claude Code.

## Example

### Understanding a Transaction

https://github.com/user-attachments/assets/8c4eef81-9109-432d-8be6-8e24ead74eef

### Understanding a Contract Event

https://github.com/user-attachments/assets/91523c7e-652e-46f8-92af-2315f408e32d

