# StudyTrack Frontend

Angular frontend application for StudyTrack - a comprehensive study management system. Built with Angular 21, TypeScript, and Angular Material.

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **Angular CLI** (v21 or higher) - Install globally: `npm install -g @angular/cli`
- **Backend API** - The StudyTrack backend must be running (see `../studytrack-backend/README.md`)

## Installation

1. Install dependencies:

```bash
npm install
```

This will install all required Angular packages and dependencies including:
- Angular 21 framework
- Angular Material UI components
- RxJS for reactive programming
- TypeScript

## Configuration

### API URL Configuration

The API URL is configured in `src/app/config.ts`:

```typescript
export const API_URL = 'http://localhost:5000/api';
```

If your backend runs on a different port or URL, update this file accordingly.

## Development Server

Run the development server:

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Using a Different Port

```bash
ng serve --port 4201
```

## Project Structure

```
studytrack-frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── navbar/          # Navigation bar component
│   │   ├── guards/
│   │   │   └── auth-guard.ts    # Route protection guard
│   │   ├── interceptors/
│   │   │   └── auth-interceptor.ts # JWT token interceptor
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── login/       # Login page
│   │   │   │   └── register/    # Registration page
│   │   │   ├── courses/
│   │   │   │   └── course-list/ # Course management page
│   │   │   ├── tasks/
│   │   │   │   └── task-list/   # Task management page
│   │   │   ├── sessions/
│   │   │   │   └── session-list.component/ # Study session management
│   │   │   └── dashboard/       # Dashboard/home page
│   │   ├── services/
│   │   │   ├── auth.service.ts  # Authentication service
│   │   │   ├── course.service.ts # Course API service
│   │   │   ├── task.service.ts  # Task API service
│   │   │   └── session.service.ts # Session API service
│   │   ├── config.ts            # API configuration
│   │   ├── app.routes.ts        # Application routes
│   │   ├── app.config.ts        # App configuration
│   │   └── app.ts               # Root component
│   ├── index.html
│   ├── main.ts                  # Application entry point
│   └── styles.css               # Global styles
├── angular.json                 # Angular CLI configuration
├── package.json
└── README.md                    # This file
```

## Features

### Authentication
- User registration with form validation
- User login with JWT token management
- Automatic token storage in localStorage
- Protected routes using AuthGuard
- Automatic token injection via HTTP interceptor

### Course Management
- View all courses
- Create new courses
- Edit existing courses
- Delete courses (with confirmation)
- Form validation for required fields

### Task Management
- View all tasks
- Create tasks linked to courses
- Edit tasks
- Delete tasks
- Filter by status, priority, type

### Study Session Management
- View all study sessions
- Create study sessions
- Link sessions to courses and tasks
- Track session duration and status

### Dashboard
- Overview statistics
- Upcoming tasks and sessions
- Today's schedule
- Course summaries

## Routing

The application uses Angular Router with the following routes:

- `/` - Redirects to dashboard
- `/login` - Login page (public)
- `/register` - Registration page (public)
- `/dashboard` - Dashboard/home (protected)
- `/courses` - Course management (protected)
- `/tasks` - Task management (protected)
- `/sessions` - Study session management (protected)

All routes except `/login` and `/register` are protected by `AuthGuard` and require authentication.

## Services

### AuthService
- `register()` - Register new user
- `login()` - Login user
- `logout()` - Logout and clear token
- `fetchCurrentUser()` - Get current user info
- `isAuthenticated()` - Check if user is logged in

### CourseService
- `getCourses()` - Get all courses
- `getCourse(id)` - Get course by ID
- `createCourse(course)` - Create new course
- `updateCourse(id, course)` - Update course
- `deleteCourse(id)` - Delete course

### TaskService
- `getTasks()` - Get all tasks
- `getTask(id)` - Get task by ID
- `createTask(task)` - Create new task
- `updateTask(id, task)` - Update task
- `deleteTask(id)` - Delete task

### SessionService
- `getSessions()` - Get all study sessions
- `getSession(id)` - Get session by ID
- `createSession(session)` - Create new session
- `updateSession(id, session)` - Update session
- `deleteSession(id)` - Delete session

## Forms and Validation

The application uses Angular Reactive Forms with validation:

- **Required fields** - Marked with `Validators.required`
- **Email validation** - `Validators.email`
- **Minimum length** - `Validators.minLength(6)` for passwords
- **Custom validation** - Enum values for task types, priorities, etc.

Error messages are displayed using Angular Material Snackbar.

## UI Components

The application uses Angular Material for UI components:

- Material Cards
- Material Form Fields
- Material Inputs
- Material Buttons
- Material Snackbar (for notifications)
- Material Icons

## Building for Production

Build the project:

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory. Use the `--configuration production` flag for a production build:

```bash
ng build --configuration production
```

## Testing

### Unit Tests

Run unit tests:

```bash
ng test
```

This will execute unit tests using Vitest.

### End-to-End Tests

Angular CLI does not come with an end-to-end testing framework by default. You can add one that suits your needs.

## Code Generation

Angular CLI includes powerful code scaffolding tools:

```bash
# Generate a new component
ng generate component component-name

# Generate a new service
ng generate service service-name

# Generate a new guard
ng generate guard guard-name

# See all available schematics
ng generate --help
```

## Development Notes

### Authentication Flow
1. User logs in/registers
2. JWT token is stored in localStorage
3. `AuthInterceptor` automatically adds token to all HTTP requests
4. `AuthGuard` protects routes and redirects unauthenticated users
5. Token is cleared on logout

### State Management
- Services use RxJS Observables for reactive data flow
- Current user state managed via `BehaviorSubject` in `AuthService`
- Components subscribe to observables for real-time updates

### API Communication
- All API calls go through Angular services
- HTTP errors are handled in component error callbacks
- User-friendly error messages displayed via Snackbar

## Troubleshooting

### API Connection Errors

- Verify backend is running on port 5000 (or configured port)
- Check `API_URL` in `src/app/config.ts`
- Check browser console for CORS errors
- Verify backend CORS settings allow requests from `http://localhost:4200`

### Angular CLI Not Found

Install Angular CLI globally:

```bash
npm install -g @angular/cli
```

### Port 4200 Already in Use

Use a different port:

```bash
ng serve --port 4201
```

### Module Not Found Errors

- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Build Errors

- Clear Angular cache: `rm -rf .angular` (Mac/Linux) or `rmdir /s .angular` (Windows)
- Reinstall dependencies: `npm install`

## Additional Resources

- [Angular Documentation](https://angular.dev)
- [Angular Material](https://material.angular.io)
- [Angular CLI Overview](https://angular.dev/tools/cli)
- [RxJS Documentation](https://rxjs.dev)

## License

This project is created for educational purposes as part of INF656 Back-End Web Development II course.
