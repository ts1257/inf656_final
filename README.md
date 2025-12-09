# StudyTrack - Full-Stack Study Management Application

A comprehensive study management application built with Angular, Node.js/Express, and MongoDB. StudyTrack helps students organize their courses, track assignments and tasks, and manage study sessions effectively.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Technologies Used](#technologies-used)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Angular CLI** (v21 or higher) - Install globally: `npm install -g @angular/cli`
- **MongoDB** - Either:
  - MongoDB Atlas account (cloud) - [Sign up](https://www.mongodb.com/cloud/atlas)
  - MongoDB installed locally - [Download](https://www.mongodb.com/try/download/community)

## Project Structure

```
inf656_final/
├── studytrack-backend/     # Node.js + Express + MongoDB backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth and error middleware
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── app.js          # Express app configuration
│   │   └── server.js       # Server entry point
│   ├── package.json
│   └── .env                # Environment variables (create this)
├── studytrack-frontend/    # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Reusable components
│   │   │   ├── guards/     # Route guards
│   │   │   ├── interceptors/ # HTTP interceptors
│   │   │   ├── pages/      # Page components
│   │   │   ├── services/   # API services
│   │   │   └── app.routes.ts
│   │   └── main.ts
│   └── package.json
└── README.md               # This file
```

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd studytrack-backend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:

- express
- mongoose
- jsonwebtoken
- bcryptjs
- express-validator
- cors
- dotenv

### 3. Configure Environment Variables

Create a `.env` file in the `studytrack-backend` directory:

```bash
# Windows (PowerShell)
New-Item .env

# Mac/Linux
touch .env
```

Add the following variables to `.env`:

```env
MONGO_URI=mongodb://localhost:27017/studytrack
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/studytrack?retryWrites=true&w=majority

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
```

**Important Notes:**

- Replace `your_super_secret_jwt_key_change_this_in_production` with a strong, random string
- For MongoDB Atlas: Replace `username`, `password`, and `cluster` with your actual Atlas credentials
- For local MongoDB: Ensure MongoDB is running on your machine

### 4. Start the Backend Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

You should see:

```
Server running on port 5000
```

## Frontend Setup

### 1. Navigate to Frontend Directory

Open a new terminal window and navigate to:

```bash
cd studytrack-frontend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required Angular packages and dependencies.

### 3. Configure API URL (if needed)

The API URL is configured in `src/app/config.ts`. By default, it points to:

```typescript
export const API_URL = "http://localhost:5000/api";
```

If your backend runs on a different port or URL, update this file accordingly.

### 4. Start the Angular Development Server

```bash
npm start
# or
ng serve
```

The application will be available at `http://localhost:4200`.

The app will automatically reload if you change any source files.

## Running the Application

### Complete Setup Steps

1. **Start MongoDB** (if using local MongoDB):

   ```bash
   # Windows
   mongod

   # Mac/Linux
   sudo systemctl start mongod
   # or
   brew services start mongodb-community
   ```

2. **Start the Backend Server**:

   ```bash
   cd studytrack-backend
   npm run dev
   ```

3. **Start the Frontend** (in a new terminal):

   ```bash
   cd studytrack-frontend
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:4200`

### First Time Setup

1. Register a new account at `http://localhost:4200/register`
2. Log in with your credentials
3. Start creating courses, tasks, and study sessions!

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Courses

- `GET /api/courses` - Get all courses (protected)
- `GET /api/courses/:id` - Get course by ID (protected)
- `POST /api/courses` - Create a new course (protected)
- `PUT /api/courses/:id` - Update a course (protected)
- `DELETE /api/courses/:id` - Delete a course (protected)

### Tasks

- `GET /api/tasks` - Get all tasks (protected)
- `GET /api/tasks/:id` - Get task by ID (protected)
- `POST /api/tasks` - Create a new task (protected)
- `PUT /api/tasks/:id` - Update a task (protected)
- `DELETE /api/tasks/:id` - Delete a task (protected)

### Study Sessions

- `GET /api/sessions` - Get all study sessions (protected)
- `GET /api/sessions/:id` - Get session by ID (protected)
- `POST /api/sessions` - Create a new study session (protected)
- `PUT /api/sessions/:id` - Update a study session (protected)
- `DELETE /api/sessions/:id` - Delete a study session (protected)

**Note:** All endpoints except `/api/auth/register` and `/api/auth/login` require authentication via JWT token in the Authorization header: `Bearer <token>`

## Environment Variables

### Backend (.env file)

| Variable     | Description               | Example                                |
| ------------ | ------------------------- | -------------------------------------- |
| `MONGO_URI`  | MongoDB connection string | `mongodb://localhost:27017/studytrack` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key_here`                 |
| `PORT`       | Server port (optional)    | `5000`                                 |

## Technologies Used

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend

- **Angular 21** - Frontend framework
- **TypeScript** - Programming language
- **Angular Material** - UI component library
- **RxJS** - Reactive programming
- **Angular Router** - Client-side routing
- **Angular Forms** - Form handling and validation

## Troubleshooting

### Backend Issues

**MongoDB Connection Error:**

- Verify MongoDB is running (if local)
- Check `MONGO_URI` in `.env` file
- For Atlas: Verify network access and credentials

**Port Already in Use:**

- Change `PORT` in `.env` file
- Or stop the process using port 5000

**Module Not Found:**

- Run `npm install` again in `studytrack-backend`

### Frontend Issues

**API Connection Error:**

- Verify backend is running on port 5000
- Check `API_URL` in `src/app/config.ts`
- Check browser console for CORS errors

**Angular CLI Not Found:**

- Install globally: `npm install -g @angular/cli`

**Port 4200 Already in Use:**

- Use a different port: `ng serve --port 4201`

## Development Notes

- The backend uses `nodemon` for auto-reload during development
- Frontend uses Angular's built-in development server with hot-reload
- All API requests from frontend automatically include JWT token via `AuthInterceptor`
- Protected routes use `AuthGuard` to redirect unauthenticated users

## License

This project is created for educational purposes as part of INF656 Back-End Web Development II course.

