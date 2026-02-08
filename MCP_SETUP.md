# MCP Server Setup for GitHub Integration

## Overview

MCP (Model Context Protocol) allows AI assistants to connect to external services like GitHub through standardized tools. This enables automatic ticket management on your GitHub project board.

## How to Set Up GitHub MCP Server in Cursor

### Option 1: Using Official GitHub MCP Server

1. **Install the GitHub MCP Server** (if available as an npm package):
   ```bash
   npm install -g @modelcontextprotocol/server-github
   ```

2. **Create a GitHub Personal Access Token**:
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Create a token with these permissions:
     - `repo` (full control of private repositories)
     - `project` (read/write access to project boards)
     - `issues` (read/write access to issues)

3. **Configure Cursor MCP Settings**:
   
   In Cursor, you'll need to configure MCP servers. This is typically done in:
   - Settings → Features → Model Context Protocol
   - Or via a configuration file: `~/.cursor/mcp.json` or similar

   Example configuration:
   ```json
   {
     "mcpServers": {
       "github": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-github"],
         "env": {
           "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token_here"
         }
       }
     }
   }
   ```

### Option 2: Custom MCP Server

If no official server exists, you can create a custom one:

1. **Create a simple Node.js MCP server** that wraps GitHub API calls
2. **Expose tools** for:
   - Moving issues between board columns
   - Updating issue status
   - Adding labels
   - Creating comments
   - Linking branches to issues

### Available Tools (Once Configured)

Once the MCP server is connected, I would have access to tools like:

- `github_move_issue_to_column` - Move an issue card to a different column
- `github_update_issue_status` - Update issue state (open/closed)
- `github_add_label` - Add labels to issues
- `github_create_comment` - Add comments to issues
- `github_link_branch_to_issue` - Link a branch to an issue

## Current Status

Currently, I don't have direct MCP server access configured. To enable this:

1. **Check Cursor's MCP Support**: Verify if your Cursor version supports MCP servers
2. **Install GitHub MCP Server**: Follow the steps above
3. **Configure Authentication**: Set up your GitHub token securely
4. **Test Connection**: Once configured, I'll be able to automatically manage tickets

## Alternative: GitHub Actions (Already Set Up)

You already have a GitHub Actions workflow (`.github/workflows/update-issue-status.yml`) that:
- Adds comments to issues when branches are created
- Closes issues when PRs are merged
- Updates issue status automatically

This provides similar automation without requiring MCP server setup.

## Next Steps

1. Check Cursor documentation for MCP server configuration
2. Install and configure a GitHub MCP server
3. Test the connection by having me move a ticket
4. Once working, I'll automatically update ticket statuses when working on issues
