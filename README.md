# CodeLearn

This workspace now contains:

- Frontend: Vite + React (root folder)
- Backend: Spring Boot API in [backend](backend)

## Prerequisites

- Node.js 18+
- Java 21+ (Java 23 also works)
- Maven 3.9+

## Run Frontend

```bash
npm install
npm run dev
```

Frontend runs on a local Vite port (usually `http://127.0.0.1:5173` or `5174` if occupied).

## Run Spring Boot Backend

From project root:

```bash
npm run backend
```

Set MongoDB URI before running backend:

```bash
set "MONGODB_URI=mongodb+srv://jayendramajji22_db_user:Majji%401622@cluster0.fxkiwcz.mongodb.net/codelearn?retryWrites=true&w=majority&appName=Cluster0"
```

Or directly:

```bash
cd backend
mvn spring-boot:run
```

Backend base URL:

`http://127.0.0.1:8080`

## Backend API (Spring Boot)

Health:

- `GET /api/health`

Auth:

- `POST /api/auth/admin/login`

Admin:

- `GET /api/admin/users`
- `POST /api/admin/users`
- `PUT /api/admin/users/{id}`
- `DELETE /api/admin/users/{id}`
- `GET /api/admin/courses`
- `POST /api/admin/courses`
- `GET /api/admin/problems`
- `POST /api/admin/problems`
- `GET /api/admin/contests`
- `POST /api/admin/contests`
- `GET /api/admin/analytics`

## Notes

- Backend currently uses in-memory seeded data for speed.
- CORS is enabled for localhost frontend ports.
- If `mongoStatus` is `DOWN` in `GET /api/health`, add your machine IP in MongoDB Atlas `Network Access` (or temporarily allow `0.0.0.0/0`) and verify Atlas cluster is active.
- Next step (optional): wire frontend `src/data/adminApi.ts` calls to these endpoints.
