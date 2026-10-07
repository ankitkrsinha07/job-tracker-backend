# Job Application Tracker — Backend

Node.js + Express + TypeScript + PostgreSQL + Prisma backend.

## Frontend
https://github.com/ankitkrsinha07/job-tracker-frontend

## Live Demo
https://job-tracker-frontend-rose-seven.vercel.app

## Tech Stack
- Node.js + Express
- TypeScript
- PostgreSQL (Supabase)
- Prisma 7
- JWT Authentication
- bcryptjs
- express-validator

## Setup
```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

## Environment Variables
```
DATABASE_URL=your_supabase_url
JWT_SECRET=your_secret
PORT=3001
```