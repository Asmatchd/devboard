# DevBoard

[![CI](https://github.com/Asmatchd/devboard/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/Asmatchd/devboard/actions/workflows/ci.yml)

A full-stack kanban-style task management application built with modern technologies. This project demonstrates production-grade software engineering practices including containerization, orchestration, and AI integration.

![DevBoard Screenshot](./docs/screenshot.png)

## ✨ Features

- **Kanban Board** — drag and drop tasks across To Do, In Progress and Done columns with same-column reordering
- **Authentication** — JWT-based register and login with persistent sessions
- **Task Management** — create, edit and delete tasks with title, description and status
- **AI Integration** — generate task descriptions and break down goals into tasks using Claude AI (claude-sonnet-4-6)
- **Optimistic UI** — instant drag and drop updates with automatic rollback on failure
- **Production Ready** — Dockerized, Kubernetes deployed with load balancing, autoscaling and health checks

## 🏗 Architecture

```mermaid
graph TB
    Client[Browser] -->|HTTP| Ingress[NGINX Ingress]
    Ingress -->|/| Frontend[Frontend Pods x2\nReact + Vite + nginx]
    Ingress -->|/api| Backend[Backend Pods x2\nNode.js + Express]
    Backend -->|SQL| DB[(PostgreSQL\nPersistentVolume)]
    Backend -->|API| AI[Anthropic Claude API]

    subgraph Kubernetes Cluster
        Ingress
        Frontend
        Backend
        DB
        HPA[HorizontalPodAutoscaler\n2-5 pods]
        HPA -->|scales| Backend
    end
```

## 🛠 Tech Stack

### Frontend

| Technology            | Purpose                                         |
| --------------------- | ----------------------------------------------- |
| React 19 + TypeScript | UI framework                                    |
| Vite 8                | Build tool and dev server                       |
| Tailwind CSS 4        | Styling with CSS custom properties              |
| TanStack Query        | Data fetching, caching and optimistic updates   |
| Zustand               | Global auth state with localStorage persistence |
| @dnd-kit              | Drag and drop (React 19 compatible)             |
| React Router 7        | Client-side routing with protected routes       |
| Axios                 | HTTP client with JWT interceptors               |

### Backend

| Technology             | Purpose                     |
| ---------------------- | --------------------------- |
| Node.js 24 + Express 5 | HTTP server                 |
| TypeScript             | Type safety                 |
| Kysely                 | Type-safe SQL query builder |
| PostgreSQL 16          | Database                    |
| JWT + bcryptjs         | Authentication              |
| Zod 4                  | Request validation          |
| Pino                   | Structured logging          |
| Anthropic SDK          | AI integration              |

### Infrastructure

| Technology              | Purpose                        |
| ----------------------- | ------------------------------ |
| Docker + Docker Compose | Containerization and local dev |
| Kubernetes + Minikube   | Container orchestration        |
| NGINX Ingress           | Load balancing and routing     |
| HorizontalPodAutoscaler | Auto-scaling                   |
| GitHub Actions          | CI/CD pipeline                 |
| pnpm workspaces         | Monorepo management            |

## 📁 Project Structure

```
devboard/
├── apps/
│   ├── frontend/          # React + TypeScript (Vite)
│   └── backend/           # Node.js + Express + TypeScript
├── packages/
│   └── shared/            # Shared TypeScript types
├── k8s/
│   ├── postgres/          # PostgreSQL manifests
│   ├── backend/           # Backend manifests + HPA
│   ├── frontend/          # Frontend manifests
│   └── ingress/           # NGINX ingress
├── .github/
│   └── workflows/         # GitHub Actions CI/CD
├── docker-compose.yml     # Local development
└── README.md
```

## 🚀 Getting Started

## Prerequisites

- Node.js 24+
- pnpm 11+
- Docker Desktop
- kubectl + Minikube (for Kubernetes deployment)
- Anthropic API key (optional — for AI features)

## 🤖 AI Features

DevBoard integrates with Anthropic's Claude API for two features:

- **Generate Description** — type a task title and click ✨ AI Generate to get a detailed description
- **Goal Breakdown** — describe a high-level goal and Claude breaks it into up to 6 actionable tasks

To enable AI features, add your Anthropic API key to `apps/backend/.env`:

### Local Development

**1. Clone the repository:**

```bash
git clone https://github.com/Asmatchd/devboard.git
cd devboard
```

**2. Install dependencies:**

```bash
pnpm install
```

**3. Set up environment variables:**

```bash
cp apps/backend/.env.example apps/backend/.env
# Edit .env with your values
```

**4. Start the database:**

```bash
pnpm dev:db
```

**5. Run migrations and seed:**

```bash
cd apps/backend
pnpm db:migrate
pnpm db:seed
```

**6. Start the development servers:**

```bash
pnpm dev:all
```

Open `http://localhost:5173`

**Test credentials (after running seed):**

- Email: `test@devboard.com`
- Password: `password123`

### Docker

```bash
pnpm docker:build
pnpm docker:up
```

Open `http://localhost:5173`

### Kubernetes

**1. Start Minikube:**

```bash
pnpm k8s:start
```

**2. Build images into Minikube:**

```bash
eval $(minikube docker-env)
docker compose build
```

**3. Deploy:**

```bash
pnpm k8s:deploy
```

**4. Start tunnel (keep terminal open):**

```bash
pnpm k8s:tunnel
```

Open `http://devboard.local`

## 🔑 Environment Variables

| Variable            | Description                          | Required           |
| ------------------- | ------------------------------------ | ------------------ |
| `PORT`              | Backend server port                  | No (default: 3001) |
| `DATABASE_URL`      | PostgreSQL connection string         | Yes                |
| `JWT_SECRET`        | Secret key for JWT signing           | Yes                |
| `NODE_ENV`          | Environment (development/production) | No                 |
| `ANTHROPIC_API_KEY` | Anthropic API key for AI features    | No                 |

## 📡 API Endpoints

### Auth

| Method | Endpoint             | Description       | Auth |
| ------ | -------------------- | ----------------- | ---- |
| POST   | `/api/auth/register` | Register new user | No   |
| POST   | `/api/auth/login`    | Login             | No   |
| GET    | `/api/auth/me`       | Get current user  | Yes  |

### Tasks

| Method | Endpoint         | Description   | Auth |
| ------ | ---------------- | ------------- | ---- |
| GET    | `/api/tasks`     | Get all tasks | Yes  |
| POST   | `/api/tasks`     | Create task   | Yes  |
| PATCH  | `/api/tasks/:id` | Update task   | Yes  |
| DELETE | `/api/tasks/:id` | Delete task   | Yes  |

### AI

| Method | Endpoint                       | Description               | Auth |
| ------ | ------------------------------ | ------------------------- | ---- |
| POST   | `/api/ai/generate-description` | Generate task description | Yes  |
| POST   | `/api/ai/breakdown`            | Break goal into tasks     | Yes  |

## 🧪 Running Tests

```bash
pnpm test
```

## 📄 License

MIT
