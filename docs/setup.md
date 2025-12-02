# Setup Guide

## Prerequisites

- **Node.js** (v18+)
- **Bun** (latest)
- **Docker** & **Docker Compose** (for local database/redis)

## Environment Variables

### Server (`server/.env`)

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/formiq
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Workers (`workers/.env`)

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
SENDGRID_API_KEY=your_sendgrid_api_key
SUPPORT_EMAIL=your_verified_sender_email
FORM_SUBMISSION_TEMPLATE_ID=your_template_id
SUPPORT_TICKET_TEMPLATE_ID=your_template_id
```

## Installation & Running

### 1. Infrastructure

Start MongoDB and Redis using Docker Compose:

```bash
docker-compose up -d
```

### 2. Server

Navigate to the server directory, install dependencies, and start the development server:

```bash
cd server
bun install
bun run dev
```

The server will start at `http://localhost:3000`.

### 3. Workers

Navigate to the workers directory, install dependencies, and start the worker process:

```bash
cd workers
bun install
bun run dev
```

### 4. SDK

To build the SDK locally:

```bash
cd sdk
bun install
bun run build
```

## Docker Deployment

You can also run the entire stack using Docker. (Instructions to be added based on production `docker-compose.yml` if available).

## Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
*   **Error**: `MongoNetworkError: failed to connect to server`
*   **Solution**: Ensure the MongoDB container is running (`docker ps`). Check if `MONGODB_URI` in `.env` matches your Docker configuration (usually `mongodb://localhost:27017/formiq` for local dev).

**2. Redis Connection Error**
*   **Error**: `ECONNREFUSED 127.0.0.1:6379`
*   **Solution**: Ensure Redis is running. If using Docker, make sure the port 6379 is exposed.

**3. Emails Not Sending**
*   **Symptom**: Submission is successful, but no email arrives.
*   **Solution**:
    *   Check Worker logs: `cd workers && bun run dev`.
    *   Verify `SENDGRID_API_KEY` and `SUPPORT_EMAIL` in `workers/.env`.
    *   Ensure the `FORM_SUBMISSION_TEMPLATE_ID` is correct and active in SendGrid.

## Testing

To run the test suite (if available):

```bash
# Server tests
cd server
bun test

# SDK tests
cd sdk
bun test
```
