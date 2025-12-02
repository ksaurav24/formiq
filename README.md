# Formiq

Formiq is a robust, open-source form management solution designed for modern web applications. It provides a complete infrastructure for handling form submissions, including a secure API server, a developer-friendly SDK, and background workers for asynchronous processing.

## 🚀 Key Features

-   **Secure Form Handling**: End-to-end encryption for sensitive data and secure API key management.
-   **Multi-Project Support**: Manage multiple projects (forms) from a single dashboard.
-   **Asynchronous Processing**: Offload heavy tasks like email notifications and webhooks to background workers using Redis and BullMQ.
-   **Developer SDK**: Easy-to-use TypeScript SDK with React and Next.js hooks (`useFormiq`).
-   **Analytics**: Track submission counts and trends.
-   **Spam Protection**: Built-in rate limiting and validation.

## 🛠 Tech Stack

-   **Runtime**: [Bun](https://bun.sh/) (Fast JavaScript runtime)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **Database**: [MongoDB](https://www.mongodb.com/) (Data persistence)
-   **Queue**: [BullMQ](https://docs.bullmq.io/) & [Redis](https://redis.io/) (Background jobs)
-   **Authentication**: [Better Auth](https://better-auth.com/)
-   **Validation**: [Zod](https://zod.dev/) & [Express Validator](https://express-validator.github.io/)

## 📂 Components

-   **[Server](./server)**: The core API backend.
-   **[SDK](./sdk)**: Client-side libraries.
-   **[Workers](./workers)**: Background job processors.
-   **[Client](./client)**: Frontend dashboard (Next.js).

## 📚 Documentation

Detailed documentation is available in the [docs](./docs) directory:

-   **[Architecture](./docs/architecture.md)**: System design, data flow, and database schema.
-   **[API Reference](./docs/api.md)**: Endpoints, request/response formats, and authentication.
-   **[Setup Guide](./docs/setup.md)**: Installation, configuration, and deployment instructions.
-   **[Technical Decisions](./docs/decisions.md)**: Rationale behind technology choices.

## Quick Start

1.  **Prerequisites**: Ensure you have [Bun](https://bun.sh/), [Docker](https://www.docker.com/), and [Node.js](https://nodejs.org/) installed.
2.  **Start Infrastructure**: Run `docker-compose up -d` to start MongoDB and Redis.
3.  **Install Dependencies**: Run `bun install` in the root directory (if using a monorepo workspace) or in each subdirectory.
4.  **Start Server**: `cd server && bun run dev`
5.  **Start Workers**: `cd workers && bun run dev` (or `npm run dev`)

## License

MIT
