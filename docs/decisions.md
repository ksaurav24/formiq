# Technical Decisions

## Runtime: Bun
We chose **Bun** for the server and local development because of its superior performance and built-in tooling (test runner, package manager). It significantly reduces startup times and CI/CD durations.

## Authentication: Better Auth
**Better Auth** was selected for its comprehensive feature set, including:
- robust type safety.
- support for multiple adapters (we use MongoDB).
- plugin system (easy to extend).
- built-in support for social logins and email/password flows.

## Queue System: BullMQ & Redis
To ensure the API remains responsive, we offload heavy tasks (emails, webhooks) to a background queue. **BullMQ** is the industry standard for Node.js/TypeScript queues, offering:
- reliability (retries, delayed jobs).
- priority queues.
- concurrency control.
**Redis** is the underlying store for BullMQ, chosen for its speed.

## Database: MongoDB
**Decision**: Use a NoSQL document store (MongoDB) instead of a relational database (PostgreSQL/MySQL).

**Rationale**:
*   **Flexible Schema**: Form submissions often have varying fields depending on the project. MongoDB's schema-less nature allows us to store arbitrary JSON data in the `fields` object without complex migrations or EAV (Entity-Attribute-Value) patterns.
*   **Performance**: High write throughput for incoming submissions.
*   **Scalability**: Easy to scale horizontally if submission volume grows.

## Runtime: Bun
**Decision**: Adopt Bun as the primary runtime and package manager.

**Rationale**:
*   **Speed**: Bun's startup time is significantly faster than Node.js, improving developer experience during iteration.
*   **Tooling**: It replaces `npm`/`yarn`, `jest`/`vitest`, and `nodemon` with a single binary, reducing dependency bloat.

## Authentication: Better Auth
**Decision**: Use Better Auth library.

**Rationale**:
*   **Type Safety**: Built with TypeScript in mind, offering superior type inference compared to older libraries like Passport.js.
*   **Modern Features**: Out-of-the-box support for Passkeys, 2FA, and social logins.
*   **Control**: Self-hosted solution (unlike Auth0 or Clerk) keeps user data within our infrastructure, which is crucial for privacy-focused applications.

## Queue System: BullMQ & Redis
**Decision**: Decouple submission processing using a message queue.

**Rationale**:
*   **Reliability**: If the email service (SendGrid) is down, jobs are retried automatically.
*   **Responsiveness**: The API responds immediately to the user (`201 Created`) without waiting for the email to be sent, preventing timeouts on slow 3rd party APIs.
*   **Scalability**: We can run multiple worker instances to process the queue in parallel.
