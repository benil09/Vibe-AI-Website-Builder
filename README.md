# Vibe

An AI-driven code generation platform that converts natural language requirements into functional web applications through durable workflow orchestration and isolated sandboxes.

---

## Problem & Motive

### The Problem
Building web applications through conversational AI requires multi-step operations: task decomposition, code generation, dependency handling, file structuring, and execution testing. Traditional stateless HTTP request-response architectures struggle with this workflow:
- **Long-Running Failures**: AI generation and environment setup take time; network disconnects or timeouts break partial state.
- **Safety & Isolation**: Untrusted code and file traversal risks can compromise the host machine.
- **Resilience**: API rate limits and model service interruptions lead to lost agent progress without durable state machines.

### The Motive
Vibe solves these issues by pairing an AI agent layer with durable workflow execution:
- **Durable Orchestration**: Every agent step is backed by Temporal workflows, guaranteeing automatic retries, fault tolerance, and persistent state across server restarts.
- **Secure Sandboxing**: Isolated filesystem workspaces isolate generated files per project, preventing directory traversal while supporting safe file reading, writing, and shell execution.
- **Provider Agnostic LLM Engine**: Built-in support for Google Gemini and OpenAI / OpenRouter with automatic provider fallback and reasoning token management.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Runtime & Language** | Node.js (v24+), TypeScript |
| **API Framework** | Express 5 |
| **AI Orchestration** | LangChain (`@langchain/core`, `@langchain/google-genai`, `@langchain/openai`) |
| **LLM Providers** | Google Gemini, OpenRouter / OpenAI |
| **Workflow Engine** | Temporal (`@temporalio/workflow`, `@temporalio/activity`, `@temporalio/worker`, `@temporalio/client`) |
| **Database & ORM** | PostgreSQL 16, Prisma ORM |
| **Infrastructure** | Docker, Docker Compose |
| **Validation** | Zod |

---

## Getting Started

### 1. Start Infrastructure
```bash
npm run docker:up
```

### 2. Run Database Migrations
```bash
npm run prisma:migrate
```

### 3. Start Development Server & Temporal Worker
```bash
npm run dev:all
```

