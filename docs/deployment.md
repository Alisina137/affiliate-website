# Deployment Guide

## Prerequisites
- Node.js 20+
- PostgreSQL database (Neon, Vercel Postgres)
- Git repository

## Environment Setup
1. Copy .env.example to .env.production
2. Fill in all required variables
3. Generate NEXTAUTH_SECRET:
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

## Deployment Options

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Import repository to Vercel
3. Add environment variables
4. Deploy

### Option 2: Docker
\\\ash
npm run docker:build
npm run docker:run
\\\

### Option 3: Manual Deployment
\\\ash
npm run build
npm run start
\\\

## CI/CD Pipeline
- GitHub Actions runs tests on every push
- Auto-deploys to staging on develop branch
- Auto-deploys to production on main branch

## Environment Variables
| Variable | Description |
|----------|-------------|
| DATABASE_URL | PostgreSQL connection string |
| NEXTAUTH_SECRET | JWT encryption secret |
| NEXTAUTH_URL | Base URL of the app |
