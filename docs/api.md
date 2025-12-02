# API Reference

The Formiq API is organized around RESTful principles. All API requests should be prefixed with `/api`.

## Authentication

We use **Better Auth** for authentication.
- Base URL: `/api/auth`
- Common endpoints: `/api/auth/sign-in`, `/api/auth/sign-up`, `/api/auth/sign-out`

## Projects (`/api/v1/projects`)

### Create Project
`POST /api/v1/projects`

**Request Body:**
```json
{
  "name": "Contact Form",
  "description": "Main contact form for website",
  "authorizedDomains": ["example.com", "www.example.com"],
  "emailNotifications": true,
  "email": "admin@example.com"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "projectId": "user123-contact-form-1715000000",
    "name": "Contact Form",
    "keys": {
      "publicKey": "fpk_...",
      "privateKey": "fsk_..."
    },
    "authorizedDomains": ["example.com", "www.example.com"],
    "createdAt": "2024-05-06T12:00:00.000Z"
  }
}
```

### Get Projects
`GET /api/v1/projects?page=1&limit=10`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Projects fetched successfully",
  "data": {
    "projects": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCount": 42
    }
  }
}
```

## Submissions (`/api/v1/submissions`)

### Submit Form
`POST /api/v1/submissions/project/:projectId/submit`

**Headers:**
- `Content-Type`: `application/json`
- `X-Formiq-Key`: `your_public_key`

**Request Body:**
```json
{
  "email": "user@example.com",
  "message": "Hello, I have a question...",
  "customField": "value"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Submission received successfully"
}
```

### Get Submissions
`GET /api/v1/submissions/project/:projectId`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Submissions fetched successfully",
  "data": {
    "submissions": [
      {
        "_id": "663...",
        "fields": {
          "email": "user@example.com",
          "message": "..."
        },
        "createdAt": "2024-05-06T12:05:00.000Z"
      }
    ]
  }
}
```

## Tickets (`/api/v1/tickets`)

Manage support tickets (internal use).

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/` | Create a ticket |
| `GET` | `/` | List tickets |
