# Task Manager API (In-Memory)

A small guided project: a RESTful Task Manager API built with Node.js and Express.
Data is stored in-memory (an array), so tasks are lost when the server restarts.

## Overview

This project implements a task management API with CRUD operations, simple
validation, error handling, filtering, sorting, and a `priority` attribute.
It is intended for learning Express routing, validation, and testing.

## Setup

Requirements
- Node.js 18+

Install dependencies:

```powershell
npm install
```

Run the server (development):

```powershell
node app.js
```

Run the test suite:

```powershell
npm test
```

> Note: `npm test` runs the `tap` test suite included in `test/server.test.js`.

## Task schema

A task looks like:

```json
{
  "id": 2,
  "title": "Create a new project",
  "description": "Create a new project using Magic",
  "completed": false,
  "priority": "low",
  "createdAt": "2025-09-21T14:40:58.914Z"
}
```

## API Endpoints

Base URL: `http://localhost:3000`

- GET /tasks
  - Returns all tasks.
  - Query params:
    - `completed=true|false` — filter by completed status.
    - `sort=asc|desc` — sort by `createdAt` (default `desc`).
  - Example:
    ```powershell
    curl http://localhost:3000/tasks?completed=false&sort=asc
    ```

- GET /tasks/:id
  - Returns a single task by numeric id.
  - 404 if not found.
  - Example:
    ```powershell
    curl http://localhost:3000/tasks/1
    ```

- GET /tasks/priority/:level
  - Returns tasks matching `level` (one of `low`, `medium`, `high`).
  - 400 if invalid level.
  - Example:
    ```powershell
    curl http://localhost:3000/tasks/priority/high
    ```

- POST /tasks
  - Create a new task.
  - Required JSON body fields: `title` (string), `description` (string), `completed` (boolean).
  - Optional: `priority` (one of `low`, `medium`, `high`) — defaults to `medium`.
  - Returns 201 with created task or 400 for invalid payload.
  - Example:
    ```powershell
    curl -Method POST -Uri http://localhost:3000/tasks \
      -Body (ConvertTo-Json @{ title='New Task'; description='Desc'; completed=$false; priority='low' }) \
      -ContentType 'application/json'
    ```

- PUT /tasks/:id
  - Update an existing task by id.
  - JSON body same validation as POST.
  - Returns 200 with updated task, 400 for invalid payload, 404 if id not found.
  - Example:
    ```powershell
    curl -Method PUT -Uri http://localhost:3000/tasks/1 \
      -Body (ConvertTo-Json @{ title='Updated'; description='New'; completed=$true; priority='high' }) \
      -ContentType 'application/json'
    ```

- DELETE /tasks/:id
  - Deletes a task by id. Returns 200 on success or 404 if not found.
  - Example:
    ```powershell
    curl -Method DELETE http://localhost:3000/tasks/1
    ```

## Testing with curl (PowerShell examples)

Create a task:
```powershell
curl -Method POST -Uri http://localhost:3000/tasks -Body (ConvertTo-Json @{ title='Create a new project'; description='Create a new project using Magic'; completed=$false; priority='low' }) -ContentType 'application/json'
```

Get tasks filtered by completion:
```powershell
curl http://localhost:3000/tasks?completed=false
```

Get tasks by priority:
```powershell
curl http://localhost:3000/tasks/priority/low
```

## Notes and next steps

- Data is stored in-memory; if you need persistence add a JSON file or a small DB.
- Consider adding richer validation/error responses and more tests for the optional endpoints.

---

If you'd like, I can also:
- Add tests for priority/filtering endpoints.
- Add persistence (JSON file or SQLite) and adapt the API accordingly.
