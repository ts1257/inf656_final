# StudyTrack Backend

Node.js/Express backend API for the StudyTrack application. Provides RESTful endpoints for managing courses, tasks, and study sessions with JWT-based authentication.

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (local installation or MongoDB Atlas account)

## Installation

1. Install dependencies:

```bash
npm install
```

This will install:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `express-validator` - Input validation
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management
- `nodemon` - Development auto-reload (dev dependency)

## Configuration

### Environment Variables

Create a `.env` file in the root of this directory:

```env
MONGO_URI=mongodb://localhost:27017/studytrack
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
```

**For MongoDB Atlas:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/studytrack?retryWrites=true&w=majority
```

**Important:**
- Replace `your_super_secret_jwt_key_change_this_in_production` with a strong, random string
- Never commit the `.env` file to version control (it's already in `.gitignore`)

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

## Project Structure

```
studytrack-backend/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection configuration
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── courseController.js # Course CRUD operations
│   │   ├── taskController.js  # Task CRUD operations
│   │   └── sessionController.js # Study session CRUD operations
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT authentication middleware
│   │   └── errorMiddleware.js # Error handling middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Course.js          # Course schema
│   │   ├── Task.js            # Task schema
│   │   └── StudySession.js    # Study session schema
│   ├── routes/
│   │   ├── authRoutes.js      # Authentication routes
│   │   ├── courseRoutes.js    # Course routes
│   │   ├── taskRoutes.js      # Task routes
│   │   └── sessionRoutes.js   # Study session routes
│   ├── app.js                 # Express app configuration
│   └── server.js              # Server entry point
├── package.json
├── .env                        # Environment variables (create this)
└── README.md                   # This file
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ name, email, password }`
  - Returns: `{ user, token }`

- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ user, token }`

- `GET /api/auth/me` - Get current user (protected)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ user }`

### Courses (Protected - requires authentication)

- `GET /api/courses` - Get all courses for the authenticated user
- `GET /api/courses/:id` - Get a specific course by ID
- `POST /api/courses` - Create a new course
  - Body: `{ name, code, instructor?, semester? }`
- `PUT /api/courses/:id` - Update a course
- `DELETE /api/courses/:id` - Delete a course

### Tasks (Protected - requires authentication)

- `GET /api/tasks` - Get all tasks for the authenticated user
- `GET /api/tasks/:id` - Get a specific task by ID
- `POST /api/tasks` - Create a new task
  - Body: `{ course, title, type, dueDate, estimatedTimeHours?, priority?, status? }`
  - `type`: "assignment" | "exam" | "project" | "quiz"
  - `priority`: "low" | "medium" | "high"
  - `status`: "not-started" | "in-progress" | "done"
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Study Sessions (Protected - requires authentication)

- `GET /api/sessions` - Get all study sessions for the authenticated user
- `GET /api/sessions/:id` - Get a specific session by ID
- `POST /api/sessions` - Create a new study session
  - Body: `{ date, startTime, durationMinutes, course?, task?, notes?, status? }`
  - `status`: "planned" | "completed" | "skipped"
  - `durationMinutes`: minimum 15
- `PUT /api/sessions/:id` - Update a study session
- `DELETE /api/sessions/:id` - Delete a study session

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

The token is obtained from the `/api/auth/login` or `/api/auth/register` endpoints.

## Data Models

### User
- `name` (String, required)
- `email` (String, required, unique)
- `passwordHash` (String, required)
- `timestamps` (createdAt, updatedAt)

### Course
- `user` (ObjectId, ref: User, required)
- `name` (String, required)
- `code` (String, required)
- `instructor` (String, optional)
- `semester` (String, optional)
- `timestamps` (createdAt, updatedAt)

### Task
- `user` (ObjectId, ref: User, required)
- `course` (ObjectId, ref: Course, required)
- `title` (String, required)
- `type` (String, enum: ["assignment", "exam", "project", "quiz"], required)
- `dueDate` (Date, required)
- `estimatedTimeHours` (Number, optional, min: 0)
- `priority` (String, enum: ["low", "medium", "high"], default: "medium")
- `status` (String, enum: ["not-started", "in-progress", "done"], default: "not-started")
- `timestamps` (createdAt, updatedAt)

### StudySession
- `user` (ObjectId, ref: User, required)
- `course` (ObjectId, ref: Course, optional)
- `task` (ObjectId, ref: Task, optional)
- `date` (Date, required)
- `startTime` (String, required)
- `durationMinutes` (Number, required, min: 15)
- `notes` (String, optional, maxlength: 500)
- `status` (String, enum: ["planned", "completed", "skipped"], default: "planned")
- `timestamps` (createdAt, updatedAt)

## Error Handling

The API uses consistent error responses:

- `400` - Bad Request (validation errors, invalid input)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

Error response format:
```json
{
  "message": "Error message here"
}
```

For validation errors:
```json
{
  "errors": [
    {
      "msg": "Validation error message",
      "param": "fieldName",
      "location": "body"
    }
  ]
}
```

## Validation

Input validation is performed using `express-validator`:

- **Registration/Login**: Email format, password length (min 6 characters)
- **Courses**: Name and code are required
- **Tasks**: Course, title, type, and dueDate are required; type must be valid enum value
- **Sessions**: Date, startTime, and durationMinutes are required; durationMinutes must be at least 15

## Security Features

- Password hashing using bcryptjs (salt rounds: 10)
- JWT tokens for authentication (7-day expiration)
- Protected routes using authentication middleware
- User data isolation (users can only access their own data)
- CORS enabled for frontend communication
- Environment variables for sensitive data

## Development

### Scripts

- `npm start` - Start server in production mode
- `npm run dev` - Start server in development mode with nodemon (auto-reload)

### Code Style

- Follow Node.js best practices
- Use async/await for asynchronous operations
- Implement proper error handling
- Keep controllers focused on business logic
- Use middleware for cross-cutting concerns

## Troubleshooting

### MongoDB Connection Issues

- Verify MongoDB is running (if using local MongoDB)
- Check `MONGO_URI` in `.env` file
- For Atlas: Verify network access settings and credentials
- Check firewall settings

### Port Already in Use

- Change `PORT` in `.env` file
- Or stop the process using port 5000:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:5000 | xargs kill
  ```

### Module Not Found

- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## License

This project is created for educational purposes as part of INF656 Back-End Web Development II course.

