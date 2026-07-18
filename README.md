# BubbleAI — Creative Workplace Suite

A modern, premium creative web suite featuring AI-powered screenwriter modules, real-time collaboration, and secure authentication.

---

## Architecture Overview

- **Frontend**: React + Vite + CSS (with custom animations and styles)
- **Backend**: Express + TypeScript + Prisma ORM + PostgreSQL
- **Real-time Sync**: WebSockets (Socket.io)

---

## Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)
- **PostgreSQL** database server running locally or in the cloud

---

## Backend Setup

1. **Navigate to the server directory**:
   ```bash
   cd server
   ```

2. **Install backend dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `server` directory (or use/update the existing one):
   ```env
   # Database Connection
   DATABASE_URL="postgresql://postgres:<password>@localhost:5432/bubbleai"

   # JWT Tokens Secret Configuration
   JWT_SECRET="bubbleai-jwt-secret-dev-only-2024"
   JWT_REFRESH_SECRET="bubbleai-refresh-secret-dev-only-2024"

   # Server Port & CORS Configuration
   PORT=5000
   FRONTEND_URL="http://localhost:5173"

   # Gemini AI API Key (Optional, for screenplay insights)
   GEMINI_API_KEY=""
   ```

4. **Initialize Database Schema**:
   Generate Prisma client and push the PostgreSQL database models:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed the Database**:
   Add the default user account (`rohan@bubbletree.com` / `password123`):
   ```bash
   npx prisma db seed
   ```

6. **Start the Backend Dev Server**:
   ```bash
   npm run dev
   ```
   The backend API will run on **http://localhost:5000/api**.

---

## Frontend Setup

1. **Navigate back to the project root directory**:
   ```bash
   cd ..
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**:
   Create a `.env` file in the root directory to customize the API URL:
   ```env
   VITE_API_URL="http://localhost:5000"
   ```
   *If omitted, the frontend automatically defaults to `http://localhost:5000`.*

4. **Start the Frontend Dev Server**:
   ```bash
   npm run dev
   ```
   Open your browser to **http://localhost:5173** to view the app.

---

## Default Login Credentials

Use the default seeded credentials to log in and start writing:
- **Email**: `rohan@bubbletree.com`
- **Password**: `password123`

---

## Troubleshooting

- **Database Connection Error (P1000)**: Double-check your `DATABASE_URL` credentials and ensure PostgreSQL is running.
- **Port Conflict**: If port `5000` or `5173` is already in use, you can edit the `PORT` in the server's `.env` or run vite with a custom port: `npm run dev -- --port <port>`.
