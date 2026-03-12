import {
  Network,
  FolderTree,
  Database,
  LayoutTemplate,
  Server,
  ShieldCheck,
  Layout,
  Rocket
} from 'lucide-react';

export const sections = [
  {
    id: 'architecture',
    title: '1. System Architecture Diagram',
    icon: Network,
    content: `
# System Architecture

The platform follows a microservice-ready, modular monolithic architecture. It separates the frontend, backend, database, and code execution engine.

\`\`\`mermaid
graph TD
    Client[Client Browser / React Frontend] -->|HTTPS / REST API| API_Gateway[API Gateway / Load Balancer]
    API_Gateway --> Auth[Authentication & Authorization Filter]
    Auth --> Controllers[Spring Boot Controllers]
    
    subgraph Spring Boot Backend
        Controllers --> Services[Business Logic Services]
        Services --> Repositories[MongoDB Repositories]
        Services --> Judge0[Code Execution Engine Integration]
    end
    
    Repositories --> MongoDB[(MongoDB Database)]
    Judge0 --> External_Judge0[Judge0 API / Sandbox]
    
    subgraph External Services
        External_Judge0
        EmailService[Email Service - SMTP/SendGrid]
        CloudStorage[Cloud Storage - AWS S3 for Media]
    end
    
    Services --> EmailService
    Services --> CloudStorage
\`\`\`

### Key Components:
- **Frontend**: React.js SPA hosted on a CDN (e.g., Vercel, AWS CloudFront).
- **Backend**: Spring Boot REST API hosted on scalable containers (e.g., AWS ECS, Kubernetes).
- **Database**: MongoDB Atlas for flexible, document-based storage.
- **Code Execution**: Judge0 API (self-hosted or cloud) for secure, isolated code evaluation.
- **Authentication**: JWT-based stateless authentication.
    `
  },
  {
    id: 'backend',
    title: '2. Backend Folder Structure',
    icon: FolderTree,
    content: `
# Spring Boot Backend Structure

A clean, domain-driven or layered architecture for the Spring Boot application.

\`\`\`text
src/main/java/com/platform/
├── CodeLearnApplication.java
├── config/               # Configuration classes (Security, Swagger, CORS, MongoDB)
├── controllers/          # REST API Endpoints
│   ├── AuthController.java
│   ├── UserController.java
│   ├── CourseController.java
│   ├── ProblemController.java
│   ├── SubmissionController.java
│   ├── ContestController.java
│   ├── LeaderboardController.java
│   ├── DiscussionController.java
│   └── NotificationController.java
├── services/             # Business Logic
│   ├── impl/             # Service Implementations
│   └── interfaces/       # Service Interfaces
├── repositories/         # MongoDB Repositories (Spring Data MongoDB)
├── models/               # MongoDB Document Entities
├── security/             # JWT Filters, UserDetails, EntryPoints
├── dto/                  # Data Transfer Objects (Requests & Responses)
│   ├── request/
│   └── response/
├── exceptions/           # Global Exception Handler & Custom Exceptions
└── utils/                # Helper classes (Constants, JWT Utils, Pagination)
\`\`\`
    `
  },
  {
    id: 'database',
    title: '3. MongoDB Schemas',
    icon: Database,
    content: `
# MongoDB Database Collections

### 1. Users
\`\`\`json
{
  "_id": "ObjectId",
  "username": "String",
  "email": "String",
  "passwordHash": "String",
  "role": "Enum ['STUDENT', 'ADMIN']",
  "profilePhoto": "String (URL)",
  "achievements": ["String"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
\`\`\`

### 2. Courses
\`\`\`json
{
  "_id": "ObjectId",
  "title": "String",
  "description": "String",
  "instructorId": "ObjectId (User)",
  "thumbnail": "String (URL)",
  "difficulty": "Enum ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']",
  "enrolledStudents": ["ObjectId (User)"],
  "createdAt": "Date"
}
\`\`\`

### 3. Lessons
\`\`\`json
{
  "_id": "ObjectId",
  "courseId": "ObjectId (Course)",
  "title": "String",
  "content": "String (Markdown/HTML)",
  "videoUrl": "String",
  "order": "Number"
}
\`\`\`

### 4. CodingProblems
\`\`\`json
{
  "_id": "ObjectId",
  "title": "String",
  "description": "String (Markdown)",
  "difficulty": "Enum ['EASY', 'MEDIUM', 'HARD']",
  "topicTags": ["String"],
  "constraints": "String",
  "inputFormat": "String",
  "outputFormat": "String",
  "testCases": [
    {
      "input": "String",
      "expectedOutput": "String",
      "isHidden": "Boolean"
    }
  ],
  "authorId": "ObjectId (User)",
  "createdAt": "Date"
}
\`\`\`

### 5. Submissions
\`\`\`json
{
  "_id": "ObjectId",
  "userId": "ObjectId (User)",
  "problemId": "ObjectId (CodingProblem)",
  "contestId": "ObjectId (Contest) [Optional]",
  "language": "String",
  "code": "String",
  "status": "Enum ['ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'COMPILATION_ERROR', 'RUNTIME_ERROR']",
  "executionTimeMs": "Number",
  "memoryUsedKb": "Number",
  "submittedAt": "Date"
}
\`\`\`

### 6. Contests
\`\`\`json
{
  "_id": "ObjectId",
  "title": "String",
  "description": "String",
  "startTime": "Date",
  "endTime": "Date",
  "problems": ["ObjectId (CodingProblem)"],
  "creatorId": "ObjectId (User)",
  "status": "Enum ['UPCOMING', 'ACTIVE', 'COMPLETED']"
}
\`\`\`

### 7. ContestParticipants
\`\`\`json
{
  "_id": "ObjectId",
  "contestId": "ObjectId (Contest)",
  "userId": "ObjectId (User)",
  "score": "Number",
  "finishTime": "Date"
}
\`\`\`

### 8. Leaderboard (Can be aggregated or materialized view)
\`\`\`json
{
  "_id": "ObjectId",
  "userId": "ObjectId (User)",
  "totalScore": "Number",
  "problemsSolved": "Number",
  "globalRank": "Number",
  "lastUpdated": "Date"
}
\`\`\`

### 9. Discussions
\`\`\`json
{
  "_id": "ObjectId",
  "authorId": "ObjectId (User)",
  "title": "String",
  "content": "String",
  "tags": ["String"],
  "upvotes": "Number",
  "downvotes": "Number",
  "createdAt": "Date"
}
\`\`\`

### 10. Comments
\`\`\`json
{
  "_id": "ObjectId",
  "discussionId": "ObjectId (Discussion)",
  "authorId": "ObjectId (User)",
  "content": "String",
  "upvotes": "Number",
  "createdAt": "Date"
}
\`\`\`

### 11. Notifications
\`\`\`json
{
  "_id": "ObjectId",
  "userId": "ObjectId (User)",
  "title": "String",
  "message": "String",
  "isRead": "Boolean",
  "type": "Enum ['SYSTEM', 'CONTEST', 'COURSE']",
  "createdAt": "Date"
}
\`\`\`
    `
  },
  {
    id: 'frontend',
    title: '4. React Frontend Structure',
    icon: LayoutTemplate,
    content: `
# React Frontend Structure

A scalable, feature-based folder structure for the React application.

\`\`\`text
src/
├── assets/               # Images, fonts, global styles
├── components/           # Reusable UI components (Buttons, Modals, Editor)
│   ├── common/
│   ├── editor/           # Monaco Editor wrapper
│   └── layout/           # Navbar, Sidebar, Footer
├── contexts/             # React Contexts (AuthContext, ThemeContext)
├── hooks/                # Custom React Hooks (useAuth, useFetch)
├── layouts/              # Layout wrappers
│   ├── StudentLayout.tsx
│   └── AdminLayout.tsx
├── pages/                # Page components grouped by role/feature
│   ├── auth/             # Login, Register
│   ├── student/          # Dashboard, Courses, Problems, Contests, Profile
│   └── admin/            # AdminDashboard, UserManagement, CourseManagement
├── services/             # Axios API calls
│   ├── api.ts            # Axios instance with interceptors
│   ├── authService.ts
│   ├── problemService.ts
│   └── ...
├── utils/                # Helper functions (formatting, validation)
├── App.tsx               # Main App component with Routing
└── main.tsx              # Entry point
\`\`\`
    `
  },
  {
    id: 'api',
    title: '5. REST API Endpoint List',
    icon: Server,
    content: `
# REST API Endpoints

### Authentication APIs
- \`POST /api/auth/register\` - Register a new user
- \`POST /api/auth/login\` - Authenticate and return JWT
- \`POST /api/auth/verify-email\` - Verify email address
- \`POST /api/auth/forgot-password\` - Initiate password reset

### User APIs
- \`GET /api/users/me\` - Get current user profile
- \`PUT /api/users/me\` - Update profile
- \`GET /api/users\` - Get all users (Admin only)
- \`PUT /api/users/{id}/suspend\` - Suspend user (Admin only)

### Course APIs
- \`GET /api/courses\` - List all courses
- \`GET /api/courses/{id}\` - Get course details
- \`POST /api/courses\` - Create course (Admin only)
- \`POST /api/courses/{id}/enroll\` - Enroll in course
- \`GET /api/courses/{id}/lessons\` - Get course lessons

### Problem APIs
- \`GET /api/problems\` - List coding problems (with pagination/filters)
- \`GET /api/problems/{id}\` - Get problem details
- \`POST /api/problems\` - Create problem (Admin only)
- \`PUT /api/problems/{id}\` - Update problem (Admin only)

### Submission APIs
- \`POST /api/submissions\` - Submit code for evaluation
- \`GET /api/submissions/{id}\` - Get submission result
- \`GET /api/submissions/user/me\` - Get user's submission history

### Contest APIs
- \`GET /api/contests\` - List contests
- \`GET /api/contests/{id}\` - Get contest details
- \`POST /api/contests/{id}/join\` - Join contest
- \`POST /api/contests\` - Create contest (Admin only)

### Leaderboard APIs
- \`GET /api/leaderboard/global\` - Get global rankings
- \`GET /api/leaderboard/contest/{id}\` - Get contest rankings

### Discussion APIs
- \`GET /api/discussions\` - List discussions
- \`POST /api/discussions\` - Create discussion
- \`POST /api/discussions/{id}/comments\` - Add comment
- \`POST /api/discussions/{id}/upvote\` - Upvote discussion

### Notification APIs
- \`GET /api/notifications\` - Get user notifications
- \`PUT /api/notifications/{id}/read\` - Mark as read
- \`POST /api/notifications/broadcast\` - Send announcement (Admin only)
    `
  },
  {
    id: 'auth',
    title: '6. Role-Based Authentication Design',
    icon: ShieldCheck,
    content: `
# Role-Based Authentication Design

The platform uses **JSON Web Tokens (JWT)** for stateless, secure authentication.

### Flow:
1. **Login**: User submits credentials to \`/api/auth/login\`.
2. **Validation**: Spring Security validates credentials against MongoDB.
3. **Token Generation**: If valid, the server generates a JWT containing the user's ID and Role (\`STUDENT\` or \`ADMIN\`).
4. **Storage**: The React frontend stores the JWT (preferably in an \`HttpOnly\` cookie or \`localStorage\` for simpler setups).
5. **Subsequent Requests**: The frontend attaches the JWT in the \`Authorization: Bearer <token>\` header for all protected API calls.
6. **Authorization**: Spring Security's \`OncePerRequestFilter\` intercepts requests, validates the JWT signature, extracts the role, and checks if the user has permission to access the endpoint (using \`@PreAuthorize("hasRole('ADMIN')")\`).

### Security Measures:
- Passwords hashed using **BCrypt**.
- JWT expiration set to a reasonable time (e.g., 1 hour) with a Refresh Token mechanism for extended sessions.
- CORS configured to only allow requests from the frontend domain.
    `
  },
  {
    id: 'ui',
    title: '7. UI Layout Structure',
    icon: Layout,
    content: `
# UI Layout Structure

The application has two distinct layouts based on the user's role.

### Student Layout (Top Navbar)
A clean, accessible top navigation bar for students to quickly jump into learning.

**Navbar Links:**
- **Logo**: CodeLearn
- **Home**: Dashboard overview
- **Courses**: Browse and resume courses
- **Practice**: Problem list and coding arena
- **Contests**: Upcoming and active contests
- **Leaderboard**: Global rankings
- **Discuss**: Community forum
- **Profile Dropdown**: View Profile, Settings, Logout

### Admin Layout (Sidebar + Topbar)
A dashboard-style layout for administrators to manage the platform efficiently.

**Sidebar Links:**
- **Dashboard**: High-level analytics and metrics
- **Users**: Manage student accounts
- **Courses**: Create and edit courses/lessons
- **Problems**: Manage coding problem bank and test cases
- **Contests**: Schedule and monitor contests
- **Submissions**: Monitor code submissions and plagiarism
- **Discussions**: Moderate forum posts
- **Notifications**: Send system-wide announcements
- **Analytics**: Detailed platform usage reports
- **Settings**: Platform configuration

**Topbar:**
- Search bar
- Admin Profile & Logout
    `
  },
  {
    id: 'deployment',
    title: '8. Deployment Suggestion',
    icon: Rocket,
    content: `
# Deployment Architecture

A scalable, containerized deployment strategy using Docker and Cloud services.

### 1. Containerization (Docker)
- **Frontend**: Dockerized Nginx serving the built React static files.
- **Backend**: Dockerized Spring Boot application (OpenJDK image).
- **Database**: MongoDB Atlas (managed cloud database, no need to dockerize for production).

### 2. Cloud Infrastructure (AWS / GCP)
- **Frontend Hosting**: Vercel, Netlify, or AWS CloudFront + S3 for fast global CDN delivery.
- **Backend Hosting**: AWS ECS (Elastic Container Service) with Fargate or Google Cloud Run for serverless container execution.
- **API Gateway**: AWS API Gateway or Nginx Ingress to route traffic and handle SSL termination.
- **Code Execution Engine**: Host Judge0 API on a separate, isolated EC2 instance or Kubernetes cluster to ensure security and prevent resource exhaustion from user code.

### 3. CI/CD Pipeline (GitHub Actions)
- **Continuous Integration**: On push to \`main\`, run unit tests (JUnit for Spring, Jest for React).
- **Continuous Deployment**: If tests pass, build Docker images, push to a container registry (Docker Hub / AWS ECR), and trigger a rolling update on the hosting environment.

### 4. Monitoring & Logging
- **Logs**: ELK Stack (Elasticsearch, Logstash, Kibana) or Datadog for centralized logging.
- **APM**: New Relic or Datadog for application performance monitoring.
    `
  }
];
