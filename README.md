# Statbotics MCP Server

A Model Context Protocol (MCP) server that provides comprehensive access to [Statbotics](https://www.statbotics.io/) FRC (FIRST Robotics Competition) data. This server enables AI assistants to query detailed robotics competition data including team performance, match results, event statistics, and historical analysis.

## 🤖 What is Statbotics?

[Statbotics](https://www.statbotics.io/) is the premier analytics platform for FIRST Robotics Competition, providing:
- **EPA (Expected Points Added)** - Advanced team performance ratings
- **Match predictions and analysis**
- **Comprehensive historical data** from 2002-present
- **Real-time event tracking** and statistics
- **Team, event, and match breakdowns**

## 🚀 Features

### 📊 Comprehensive Data Access
- **Teams**: Individual team profiles, season performance, multi-year analysis
- **Events**: Competition details, EPA statistics, team rankings
- **Matches**: Detailed match breakdowns, predictions vs. results
- **Seasons**: Year-over-year statistics and game analysis
- **Performance Metrics**: EPA progression, ranking points, score breakdowns

### 🔍 Advanced Querying
- **Bulk Operations**: Query multiple teams, events, or matches simultaneously
- **Flexible Filtering**: Filter by year, location, district, event type, and more
- **Sorting & Pagination**: Sort by any metric with pagination support
- **Historical Analysis**: Access data from 2002 to current season

### 🎯 Specialized Analysis Tools
- **Team Performance Tracking**: Follow teams across seasons and events
- **Match-Level Analysis**: Individual team contributions to alliance performance
- **Event Deep Dives**: Complete tournament breakdowns and progressions
- **Comparative Analysis**: Compare teams, events, or seasons

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Clone the repository:**
```bash
git clone https://github.com/ericg4/robostats-mcp.git
cd robostats-mcp/backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Build the project:**
```bash
npm run build
```

4. **Start the server:**
```bash
npm start
```

The server will run on stdio transport, making it compatible with MCP-enabled AI assistants.

## 🔌 MCP Configuration for Cursor/Claude

After building the project, you need to configure the MCP server in Cursor/Claude:

### 1. Create MCP Configuration File

Create or edit the MCP configuration file at `~/.cursor/mcp.json`:

```bash
# Create the directory if it doesn't exist
mkdir -p ~/.cursor

# Edit the configuration file
code ~/.cursor/mcp.json
```

### 2. Add Server Configuration

Add the robostats MCP server to your configuration:

```json
{
  "mcpServers": {
    "robostats": {
      "command": "node",
      "args": ["/path/to/your/robostats-mcp/backend/build/index.js"]
    }
  }
}
```

**Replace `/path/to/your/` with your actual project path.**

### 3. Adding Multiple MCP Servers

If you have other MCP servers, you can add them to the same configuration:

```json
{
  "mcpServers": {
    "robostats": {
      "command": "node",
      "args": ["/path/to/robostats-mcp/backend/build/index.js"]
    },
    "another-server": {
      "command": "python",
      "args": ["/path/to/another/server.py"]
    }
  }
}
```

### 4. Restart Cursor

After updating the configuration file, restart Cursor for the changes to take effect.

### 5. Verify Installation

Test the MCP server by asking Cursor questions like:
- "Get data for FRC team 254"
- "Show me the 2024 Championship events"
- "What were the highest scoring matches in 2024?"

### 6. Troubleshooting

If the MCP server isn't working:

1. **Verify the build output exists:**
   ```bash
   ls -la /path/to/your/robostats-mcp/backend/build/index.js
   ```

2. **Test the server manually:**
   ```bash
   node /path/to/your/robostats-mcp/backend/build/index.js
   ```

3. **Check JSON syntax** in your `mcp.json` file
4. **Check Cursor's developer tools** for error messages
5. **Ensure proper file permissions** on the build directory

## 📚 Available Tools

### 🏆 Team Analysis
| Tool | Description | Example Usage |
|------|-------------|---------------|
| `get-team` | Get individual team data | Team 254's profile and statistics |
| `get-team-year` | Team performance in specific year | Team 1678's 2024 season |
| `get-teams` | Search/filter multiple teams | Top California teams by EPA |
| `get-team-years` | Bulk team-year analysis | All teams in 2023 sorted by wins |

### 🏟️ Event Analysis  
| Tool | Description | Example Usage |
|------|-------------|---------------|
| `get-event` | Individual event details | 2024 San Diego Regional statistics |
| `get-events` | Search/filter multiple events | All 2024 Championship events |
| `get-team-event` | Team performance at event | Team 3647 at San Diego Regional |
| `get-team-events` | Bulk team-event analysis | Team's performance across all events |

### ⚔️ Match Analysis
| Tool | Description | Example Usage |
|------|-------------|---------------|
| `get-match` | Individual match details | Finals Match 1 breakdown |
| `get-matches` | Search/filter multiple matches | Highest scoring matches in 2024 |
| `get-team-match` | Team's individual match performance | Team 254's contribution in specific match |
| `get-team-matches` | Bulk team-match analysis | All matches for a team at an event |

### 📈 Season Analysis
| Tool | Description | Example Usage |
|------|-------------|---------------|
| `get-year-stats` | Season averages and statistics | 2024 Crescendo game averages |
| `get-years` | Multi-year comparison | Compare scoring across FRC history |

## 🎯 Example Queries

### Team Performance Analysis
```
"How did Team 1678 perform in 2024?"
→ Uses get-team-year to show season EPA, record, events attended

"Find the top 10 teams in California by EPA"
→ Uses get-teams with state=CA, metric=norm_epa, limit=10

"Show me Team 254's progression at the 2024 Silicon Valley Regional"
→ Uses get-team-matches with team=254, event=2024casj
```

### Event & Match Analysis
```
"What were the highest scoring matches in FRC history?"
→ Uses get-matches with metric=red_score, ascending=false

"How competitive was the 2024 Championship?"
→ Uses get-events with year=2024, week=8, type=cmp_division

"Break down Finals Match 1 at San Diego Regional 2024"
→ Uses get-match with match=2024casd_f1m1
```

### Historical & Comparative Analysis
```
"Compare average scores between 2023 and 2024"
→ Uses get-year-stats for both years

"Which teams have been most consistent over the past 5 years?"
→ Uses get-team-years with filters and EPA analysis

"Show me all Championship-winning performances"
→ Uses get-matches with week=8, elim=true, winner filtering
```

## 🔧 Configuration

### Environment Variables
```bash
# Optional: Custom Statbotics API base URL
STATBOTICS_API_BASE=https://api.statbotics.io

# Optional: Custom user agent
USER_AGENT=statbotics-app/1.0
```

### Filter Options

#### Team Filters
- **Country/State/District**: Geographic filtering
- **Active Status**: Currently competing teams
- **Metrics**: EPA, wins, losses, winrate, rookie year

#### Event Filters  
- **Year/Week**: Temporal filtering (Week 8 = Championships)
- **Type**: regional, district, district_cmp, cmp_division, cmp_finals
- **Location**: Country, state, district

#### Match Filters
- **Elimination Status**: Qualification vs playoff matches
- **Team Involvement**: Matches involving specific teams
- **Performance Metrics**: Scores, win probability, ranking points

## 📖 API Reference

### Data Types

#### EPA (Expected Points Added)
Statbotics' proprietary team rating system that measures team strength:
- **Normalized EPA**: Standardized rating for cross-year comparison
- **Unitless EPA**: Raw EPA value for within-season analysis
- **EPA Progression**: How teams improve throughout events

#### Key Metrics
- **Record**: Wins-Losses-Ties with win percentage
- **Ranking Points**: Bonus points for game-specific achievements
- **Score Breakdown**: Auto, teleop, and endgame contributions
- **Game Elements**: Note scoring, climbing, special mechanics

#### Event Types
- **Regional**: Traditional regional competitions
- **District**: District-based qualification events  
- **Championships**: Einstein Division finals (Week 8)
- **District Championships**: District-level championship events

## 🏗️ Architecture

### Project Structure
```
backend/
├── src/
│   ├── index.ts              # Main MCP server setup
│   ├── tools/                # Individual tool implementations
│   │   ├── team.ts           # Team-related interfaces & formatting
│   │   ├── event.ts          # Event-related interfaces & formatting
│   │   ├── match.ts          # Match-related interfaces & formatting
│   │   ├── team-year.ts      # Team-year analysis tools
│   │   ├── team-event.ts     # Team-event analysis tools
│   │   └── team-match.ts     # Team-match analysis tools
│   └── utils/
│       └── web-requests.ts   # HTTP request utilities
├── package.json
└── tsconfig.json
```

### Key Components
- **MCP Server**: Handles tool registration and request routing
- **Zod Validation**: Type-safe parameter validation
- **Formatting Functions**: Human-readable data presentation
- **Error Handling**: Graceful failure handling and user feedback

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Add new tools or improve existing ones
4. **Add tests**: Ensure your changes work correctly
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Add proper Zod validation for new parameters
- Include comprehensive formatting functions
- Update documentation for new tools
- Test with real Statbotics API data

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Statbotics](https://www.statbotics.io/)** - For providing the comprehensive FRC data API
- **[Model Context Protocol](https://modelcontextprotocol.io/)** - For the MCP framework
- **[FIRST Robotics Competition](https://www.firstinspires.org/robotics/frc)** - For the amazing robotics competition
- **FRC Community** - For continuous innovation and data collection

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/robostats-mcp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/robostats-mcp/discussions)
- **Statbotics API**: [Official Documentation](https://www.statbotics.io/api)

---

**Built with ❤️ for the FRC community** 🤖🔥