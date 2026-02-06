# Todo List Application

A simple full-stack Todo List application with user authentication and CRUD functionality.

## Tech Stack

- **Frontend**: React with Vite
- **Backend**: Node.js with Express
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Docker & Docker Compose

## Features

- User signup and login
- Create, read, update, and delete todos
- User-specific todo isolation (each user sees only their own todos)
- Modern dark theme UI
- Responsive design

## Quick Start with Docker

### Prerequisites

- Docker
- Docker Compose

### Run the Application

1. Clone the repository and navigate to the project directory:

   ```bash
   cd crud
   ```

2. Build and start the containers:

   ```bash
   sudo docker-compose up -d
   ```

3. Open your browser and go to:

   ```
   http://localhost
   ```

4. To stop the application:
   ```bash
   sudo docker-compose down
   ```

## Local Development

### Backend

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The backend runs on `http://localhost:5000`

### Frontend

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend runs on `http://localhost:3000`

## API Endpoints

### Authentication

| Method | Endpoint           | Description             |
| ------ | ------------------ | ----------------------- |
| POST   | `/api/auth/signup` | Register a new user     |
| POST   | `/api/auth/login`  | Login and get JWT token |

### Todos (Authenticated)

| Method | Endpoint         | Description                    |
| ------ | ---------------- | ------------------------------ |
| GET    | `/api/todos`     | Get all todos for current user |
| POST   | `/api/todos`     | Create a new todo              |
| PUT    | `/api/todos/:id` | Update a todo                  |
| DELETE | `/api/todos/:id` | Delete a todo                  |

## Environment Variables

### Backend (.env)

```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
DB_PATH=/data/todo.db
```

> **Note**: Change `JWT_SECRET` to a secure random string in production.

## Project Structure

```
crud/
├── backend/
│   ├── db/
│   │   └── database.js       # SQLite setup and schema
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   └── todos.js          # Todo CRUD routes
│   ├── .env                  # Environment variables
│   ├── Dockerfile
│   ├── package.json
│   └── server.js             # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── TodoList.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
└── README.md
```

## License

MIT
