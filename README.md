# Affiliate Platform

A premium niche information and affiliate website platform with AI-powered content generation.

## Features
- Product database with brands and categories
- Reviews, comparisons, and buying guides
- AI-powered content generation
- Affiliate link management
- Admin dashboard
- SEO optimized
- Analytics tracking
- Newsletter management

## Tech Stack
- Next.js 16
- TypeScript
- Prisma + Neon PostgreSQL
- Tailwind CSS
- NextAuth.js
- Zod validation

## Quick Start

\\\ash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your variables

# Push database schema
npx prisma db push

# Seed the database
npm run seed

# Start development server
npm run dev
\\\

## Environment Variables
Copy .env.example to .env and fill in:
- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL

## Deployment
See docs/deployment.md for deployment instructions.

## Documentation
- API: docs/api/
- User Guide: docs/user-guide.md
- Admin Guide: docs/admin-guide.md
- Deployment: docs/deployment.md

## License
Private
