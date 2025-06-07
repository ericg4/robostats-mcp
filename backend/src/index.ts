import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { Team, formatTeam } from "./tools/team.js";
import { makeStatboticsRequest } from "./utils/web-requests.js";

const STATBOTICS_API_BASE = "https://api.statbotics.io";
const USER_AGENT = "statbotics-app/1.0";

// Create server instance
const server = new McpServer({
  name: "robostats",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Register Statbotics team tool
server.tool(
  "get-team",
  "Get Statbotics team data by team number",
  {
    team: z.number().int().describe("Team number (e.g. 254)"),
  },
  async ({ team }) => {
    const url = `${STATBOTICS_API_BASE}/v3/team/${team}`;
    const teamData = await makeStatboticsRequest<Team>(url, USER_AGENT);

    if (!teamData) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to retrieve data for team ${team}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: formatTeam(teamData),
        },
      ],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Statbotics MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
