# 🤖 RIFT Autonomous DevOps Agent

**An autonomous CI/CD healing agent that clones repositories, runs tests, identifies failures, applies fixes, and iterates until all tests pass.**

---

## 🚀 Live Deployment

- **Frontend Dashboard**: [Your Vercel URL - Update after deployment]
- **Backend API**: [Your Railway URL - Update after deployment]

## 📹 Demo Video

[LinkedIn post URL - Tag @RIFT2026]

---

## 🎯 Problem Statement

Build an Autonomous DevOps Agent with a React Dashboard that:
- Takes a GitHub repository URL as input
- Clones and analyzes the repository structure
- Discovers and runs all test files automatically
- Identifies failures and generates targeted fixes
- Commits fixes with `[AI-AGENT]` prefix and pushes to a new branch
- Monitors CI/CD pipeline and iterates until all tests pass
- Displays comprehensive results in a React dashboard

---

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐
│  React Frontend │ ──────> │  Express Backend │
│   (Vercel)      │  HTTP   │   (Railway)      │
└─────────────────┘         └──────────────────┘
                                      │
                                      ▼
                            ┌──────────────────┐
                            │  LangGraph Agent │
                            │  (Multi-Agent)   │
                            └──────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
            ┌──────────┐      ┌──────────┐      ┌──────────┐
            │  Clone   │      │  Run     │      │  Fix &   │
            │  Repo    │      │  Tests   │      │  Commit  │
            └──────────┘      └──────────┘      └──────────┘
```

### Tech Stack

**Frontend:**
- React 19 (functional components + hooks)
- Zustand (state management)
- Vite (build tool)
- Tailwind CSS v4 (styling)
- Recharts (data visualization)

**Backend:**
- Node.js + TypeScript
- Express.js (REST API)
- LangGraph (multi-agent architecture)
- Simple-git (Git operations)

---

## 📁 Project Structure

```
kodus-ai-main/
├── frontend/              # React dashboard
│   ├── src/
│   │   ├── app/
│   │   └── modules/dashboard/
│   │       ├── components/    # UI components
│   │       ├── state.ts       # Zustand store
│   │       ├── agentApi.ts    # API client
│   │       └── types.ts       # TypeScript types
│   └── package.json
│
├── agent/                 # Backend service
│   ├── src/
│   │   ├── index.ts          # Express server
│   │   ├── results-schema.ts  # Results JSON schema
│   │   └── branch-name.ts    # Branch naming logic
│   └── package.json
│
└── DEPLOYMENT.md          # Deployment guide
```

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- Yarn
- GitHub Personal Access Token
- Railway account (for backend)
- Vercel account (for frontend)

### Local Development

1. **Clone repository**
```bash
git clone <your-repo-url>
cd kodus-ai-main
```

2. **Backend Setup**
```bash
cd agent
yarn install
cp .env.example .env
# Edit .env with your GitHub token and LLM keys
yarn dev
```

3. **Frontend Setup** (new terminal)
```bash
cd frontend
yarn install
yarn dev
```

4. **Access**
- Frontend: http://localhost:4173
- Backend: http://localhost:4100

### Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed Railway + Vercel deployment steps.

---

## 📖 Usage Example

1. Open the React dashboard (Vercel URL)
2. Enter:
   - **GitHub Repository URL**: `https://github.com/org/repo`
   - **Team Name**: `RIFT ORGANISERS`
   - **Team Leader**: `Saiyam Kumar`
3. Click **Run Agent**
4. Wait for agent to:
   - Clone repository
   - Discover test files
   - Run tests
   - Identify failures
   - Apply fixes
   - Commit and push to branch: `RIFT_ORGANISERS_SAIYAM_KUMAR_AI_Fix`
   - Monitor CI/CD until green
5. View results:
   - Run Summary Card
   - Score Breakdown (base 100 + speed bonus - efficiency penalty)
   - Fixes Applied Table
   - CI/CD Status Timeline

---

## 🐛 Supported Bug Types

The agent can detect and fix:

- **LINTING**: Unused imports, formatting issues
- **SYNTAX**: Missing colons, brackets, parentheses
- **LOGIC**: Incorrect conditionals, wrong operators
- **TYPE_ERROR**: Type mismatches, missing type hints
- **IMPORT**: Missing imports, incorrect import paths
- **INDENTATION**: Incorrect indentation levels

---

## 📊 Evaluation Criteria

- **Test Case Accuracy** (40 pts): Exact match with test cases
- **Dashboard Quality** (25 pts): All required sections, responsive design
- **Agent Architecture** (20 pts): Multi-agent structure, sandboxed execution
- **Documentation** (10 pts): Complete README, architecture diagram
- **Video Presentation** (5 pts): Clear explanation, live demo

---

## ⚠️ Known Limitations

- Agent runs synchronously (no job queue yet)
- In-memory state store (use Redis/DB in production)
- Basic test discovery (supports common test file patterns)
- Limited to public GitHub repos (unless token has private access)
- Retry limit: 5 iterations (configurable via `RETRY_LIMIT`)

---

## 🔒 Security Notes

- Never commit `.env` files
- GitHub tokens stored in Railway environment variables
- CORS configured for production domains
- Sandboxed execution recommended (Docker)

---

## 👥 Team Members

- [Your Name] - Team Leader
- [Team Member 2]
- [Team Member 3]

---

## 📄 License

UNLICENSED - Hackathon Project

---

## 🙏 Acknowledgments

Built for RIFT 2026 Hackathon
