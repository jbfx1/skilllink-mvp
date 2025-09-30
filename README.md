# SkillLink - Learning Platform MVP

A comprehensive learning platform that connects learners with mentors through chat, topic rooms, live classes, and tutorials.

## Architecture Overview

### Frontend
- **Web App**: React with TypeScript, Tailwind CSS, and Shadcn/UI
- **Mobile App**: React Native with Expo (shared components where possible)
- **Shared UI Library**: Common components and utilities

### Backend
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: Supabase Auth with social login
- **Storage**: Supabase Storage for files and media
- **Real-time**: Supabase Realtime for chat and live features

### Third-Party Services
- **Live Video**: Daily.co SDK for live classes
- **VOD**: Mux for video on demand
- **Search**: Built-in PostgreSQL full-text search
- **Payments**: Stripe for monetization
- **Analytics**: PostHog for user analytics
- **Moderation**: OpenAI Moderation API

## Core Features

### MVP Features
- [x] Authentication & User Profiles
- [x] Discovery & Matching
- [x] Chat & Projects
- [x] Q&A & Knowledge Base
- [x] Live Teaching
- [x] Gamification
- [x] Trust & Safety
- [x] Admin Panel

### Project Structure
```
skilllink/
├── web/                    # React web application
├── mobile/                 # React Native mobile app
├── shared/                 # Shared components and utilities
├── backend/                # Supabase configuration and functions
├── docs/                   # Documentation
├── scripts/                # Deployment and utility scripts
└── README.md
```

## Quick Start

1. **Prerequisites**
   - Node.js 18+
   - npm or yarn
   - Supabase CLI
   - Expo CLI (for mobile)

2. **Setup**
   ```bash
   # Clone and install dependencies
   npm install
   
   # Setup environment variables
   cp .env.example .env.local
   
   # Setup Supabase
   npm run db:setup
   
   # Start development servers
   npm run dev
   ```

3. **Demo Accounts**
   - Learner: `learner@test.com` / `Demo1234!`
   - Mentor: `mentor@test.com` / `Demo1234!`

## Development

See individual README files in each directory for specific setup instructions:
- [Web App Setup](./web/README.md)
- [Mobile App Setup](./mobile/README.md)
- [Backend Setup](./backend/README.md)

## Deployment

- **Web**: Vercel
- **Mobile**: Expo Application Services (EAS)
- **Backend**: Supabase Cloud

Run `npm run deploy` for automated deployment.

## License

MIT License - see [LICENSE](./LICENSE) for details.
