<div align="center">

# ⚡ Vibe

**Autonomous AI-Powered Full-Stack App Generation Platform**

Turn natural language prompts into live, interactive React applications using durable workflow orchestration and isolated sandboxes.

<br/>

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v24+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Temporal](https://img.shields.io/badge/Temporal-Orchestration-242526?style=for-the-badge&logo=temporal&logoColor=white)](https://temporal.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

<br/>

[🚀 Quick Start](#-quick-start) • [🔄 Simple Workflows](#-simple-workflows) • [💡 Problem & Motive](#-problem--motive) • [📡 API Reference](#-api-reference) • [🧱 Tech Stack](#-tech-stack)

---

</div>

## 🔄 Simple Workflows

Vibe keeps workflows clean, durable, and fault-tolerant. Here is how code generation runs end-to-end:

### 1. High-Level Flow

```mermaid
flowchart LR
    User([👤 User Prompt]) --> API[🚀 Express API]
    API --> DB[(🗄️ PostgreSQL)]
    API --> Temp[⏱️ Temporal Workflow]
    Temp --> Sand[📦 Sandbox Environment]
    Temp --> LLM[🧠 LLM Agent<br/>Gemini / OpenRouter]
    LLM --> Save[💾 Save App & Fragment]
    Save --> Preview([✨ Live App Preview])
```

---

### 2. Code Agent Lifecycle (Step-by-Step)

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Express as Express API
    participant Temporal as Temporal Worker
    participant Sandbox as Sandbox FS
    participant LLM as LLM Engine
    participant DB as Postgres DB

    User->>Express: POST /api/projects { content: "Build a todo app" }
    Express->>DB: Create Project & User Message
    Express->>Temporal: Dispatch codeAgentWorkflow(projectId, prompt)
    Express-->>User: 201 Created { projectId, status: "pending" }

    activate Temporal
    Temporal->>Sandbox: Create isolated sandbox workspace
    par Code & Title Generation
        Temporal->>LLM: Generate project title
        Temporal->>LLM: Generate React code & structure
        Temporal->>Sandbox: Read current sandbox files
    end
    Temporal->>DB: Save assistant response + code fragments
    deactivate Temporal
```

---

## 💡 Problem & Motive

### Why Traditional AI Code Gen Fails
- ⏳ **Long-Running Timeouts**: Multi-file code generation and sandbox initialization take time. Ordinary HTTP connections drop or timeout mid-execution.
- 💥 **Lost Progress**: If an LLM hits a rate limit or a server restarts, stateless backends lose all uncommitted progress.
- ⚠️ **Host Vulnerability**: Running AI-generated code directly on the host machine presents dangerous security and filesystem traversal risks.

### How Vibe Solves It
| Feature | Traditional Approach | The Vibe Approach |
|---|---|---|
| **Execution State** | Fragile in-memory state | **Durable Temporal Workflows** with automatic retries and pause/resume |
| **Code Isolation** | Local file writes | **Chrooted Sandboxes** keeping every project strictly separated |
| **Model Resilience** | Single provider failure | **Dual-Engine Fallback** (Google Gemini with OpenRouter fallback) |
| **Observability** | Console logs | **Temporal Web UI** with real-time step visualization and replay |

---

## 🚀 Quick Start

Get your local environment up in 3 simple steps:

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/vibe.git
cd vibe
npm install
```

### 2. Configure Environment Variables
<details>
<summary><b>Click to expand sample <code>server/.env</code> file</b></summary>

```env
PORT=5001
NODE_ENV=development

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vibe?schema=public"

# Temporal
TEMPORAL_ADDRESS="localhost:7233"

# LLM Keys (Gemini with OpenRouter fallback)
GEMINI_API_KEY="your-gemini-api-key"
OPENROUTER_API_KEY="your-openrouter-api-key"
```
</details>

### 3. Launch Services & Dev Server
```bash
# Start Postgres, Temporal & Temporal UI in background
npm run docker:up

# Run database migrations
npm run prisma:migrate

# Start Express server & Temporal worker concurrently
npm run dev:all
```

> [!TIP]
> Open **Temporal Web UI** at [http://localhost:8233](http://localhost:8233) to monitor workflow execution and retry histories in real time!

---

## 📡 API Reference

<details open>
<summary><b>1. Create Project & Trigger Generation</b></summary>

`POST /api/projects`

**Request:**
```bash
curl -X POST http://localhost:5001/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Create a responsive countdown timer with dark mode support"
  }'
```

**Response (`201 Created`):**
```json
{
  "project": {
    "id": "cm7b8xyz0000abc123",
    "name": "Countdown Timer",
    "createdAt": "2026-11-24T08:00:00.000Z"
  },
  "workflowId": "workflow-cm7b8xyz0000abc123"
}
```
</details>

<details>
<summary><b>2. Fetch Project by ID</b></summary>

`GET /api/projects/:id`

```bash
curl http://localhost:5001/api/projects/cm7b8xyz0000abc123
```
</details>

<details>
<summary><b>3. Fetch Project Messages & Code Fragments</b></summary>

`GET /api/projects/:id/messages`

```bash
curl http://localhost:5001/api/projects/cm7b8xyz0000abc123/messages
```
</details>

<details>
<summary><b>4. Health Check</b></summary>

`GET /health`

```bash
curl http://localhost:5001/health
```
</details>

---

## 🧱 Tech Stack

```
vibe/
├── 🌐 API Layer        → Express 5, TypeScript, Zod Validation
├── ⚡ Workflow Engine   → Temporal.io (Distributed durable execution)
├── 🧠 LLM Orchestration → LangChain, Google Gemini, OpenRouter
├── 🗄️ Persistence      → PostgreSQL 16, Prisma ORM
├── 📦 Sandboxing        → Chrooted isolated project workspaces
└── 🐳 Infrastructure   → Docker & Docker Compose
```

---

## 🛠️ Handy CLI Commands

| Command | Action |
|---|---|
| `npm run dev:all` | Run Express server and Temporal worker together |
| `npm run docker:up` | Start Postgres, Temporal, and Temporal Web UI |
| `npm run docker:down` | Stop all Docker containers |
| `npm run prisma:migrate` | Apply database migrations |
| `npm run prisma:studio` | Open Prisma visual database editor |

---

<div align="center">
  <sub>Built with ❤️ using Temporal, LangChain & Node.js</sub>
</div>
