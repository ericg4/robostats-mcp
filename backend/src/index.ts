import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { Team, formatTeam, formatTeamsList } from "./tools/team.js";
import { makeStatboticsRequest } from "./utils/web-requests.js";
import { formatYearStats } from "./tools/year.js";

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

// Register Statbotics teams list tool
server.tool(
  "get-teams",
  "Get a list of teams with optional filters",
  {
    country: z.string().optional().describe("Capitalized country name (e.g. USA, Canada)"),
    state: z.string().optional().describe("Capitalized two-letter state code (e.g. CA, TX)"),
    district: z.enum([
      "fma", "fnc", "fsc", "fit", "fin", "fim", "ne", "chs", "ont", "pnw", "pch", "isr"
    ]).optional().describe("District code (e.g. fma, fnc, fsc, fit, fin, fim, ne, chs, ont, pnw, pch, isr)"),
    active: z.boolean().optional().describe("Whether the team has played in the last year"),
    metric: z.enum([
      "norm_epa", "rookie_year", "wins", "losses", "ties", "winrate", "team", "name", "count"
    ]).optional().describe("How to sort the returned values"),
    ascending: z.boolean().optional().describe("Whether to sort in ascending order (default: true)"),
    limit: z.number().int().min(1).max(1000).optional().describe("Maximum number of teams to return (default: 100, max: 1000)"),
    offset: z.number().int().min(0).optional().describe("Offset from the first result to return (default: 0)"),
  },
  async ({ country, state, district, active, metric, ascending, limit = 100, offset = 0 }) => {
    const params = new URLSearchParams();
    if (country) params.append("country", country);
    if (state) params.append("state", state);
    if (district) params.append("district", district);
    if (active !== undefined) params.append("active", active.toString());
    if (metric) params.append("metric", metric);
    if (ascending !== undefined) params.append("ascending", ascending.toString());
    params.append("limit", limit.toString());
    params.append("offset", offset.toString());

    const url = `${STATBOTICS_API_BASE}/v3/teams?${params.toString()}`;
    const teamsData = await makeStatboticsRequest<Team[]>(url, USER_AGENT);

    if (!teamsData) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve teams data",
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: formatTeamsList(teamsData),
        },
      ],
    };
  },
);

// Register Statbotics year stats tool
server.tool(
  "get-year-stats",
  "Get Statbotics average year stats by year",
  {
    year: z.number().int().describe("Competition year (e.g. 2023)"),
  },
  async ({ year }) => {
    const url = `${STATBOTICS_API_BASE}/v3/year/${year}`;
    const yearData = await makeStatboticsRequest(url, USER_AGENT);
    
    if (!yearData) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to retrieve data for year ${year}`,
          },
        ],
      };
    }
    
    return {
      content: [
        {
          type: "text",
          text: formatYearStats(yearData),
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
