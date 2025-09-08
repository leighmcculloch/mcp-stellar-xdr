# Stellar MCP Server for XDR

An [Model Context Protocol (MCP)] server that decodes Stellar XDR into
XDR-JSON, that agents can use to understand what XDR means.

[Model Context Protocol (MCP)]: https://www.claudemcp.com/

Provides five tools:

- `mcp_stellar-xdr_types` - Get the supported XDR types.
- `mcp_stellar-xdr_json_schema` - Get the JSON schema for an XDR type.
- `mcp_stellar-xdr_guess` - Guess what type Stellar XDR is, getting back a list of possible types.
- `mcp_stellar-xdr_decode` - Decode a Stellar XDR to JSON.
- `mcp_stellar-xdr_encode` - Encode a Stellar XDR from JSON.

## Usage (General)

To use with agents, setup a `stdio` MCP configuration with your agent calling
the following command:

```
{
  "command": "npx",
  "args": ["deno", "run", "--allow-read", "https://github.com/leighmcculloch/mcp-stellar-xdr/raw/refs/heads/main/mcp-stellar-xdr.ts"]
}
```

If you have `deno` installed you can omit the `npx` command and call `deno`
directly.

## Usage (Claude Desktop)

To use with Claude Desktop:

1. Add the server config:

   On macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

   On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "mcp-stellar-xdr-json": {
         "command": "npx",
         "args": [
           "deno",
           "run",
           "--allow-read",
           "https://github.com/leighmcculloch/mcp-stellar-xdr/raw/refs/heads/main/mcp-stellar-xdr.ts"
         ]
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
     mcp-stellar-xdr \
     -- \
     npx deno run --allow-read https://github.com/leighmcculloch/mcp-stellar-xdr/raw/refs/heads/main/mcp-stellar-xdr.ts
   ```

2. Reopen Claude Code.

## Example

### Understanding a Transaction

https://github.com/user-attachments/assets/8c4eef81-9109-432d-8be6-8e24ead74eef

### Understanding a Contract Event

https://github.com/user-attachments/assets/91523c7e-652e-46f8-92af-2315f408e32d
