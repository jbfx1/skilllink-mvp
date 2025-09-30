# SkillLink Backend

Supabase-powered backend for the SkillLink learning platform.

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Supabase Local Development**
   ```bash
   npm run start
   ```

3. **Apply Database Migrations**
   ```bash
   npm run migrate
   ```

4. **Seed Database with Sample Data**
   ```bash
   npm run seed
   ```

## Database Schema

The database includes the following main entities:

### Core Tables
- `profiles` - User profiles extending Supabase auth
- `skills` - Skills taxonomy
- `topic_rooms` - Discussion rooms by topic
- `posts` - Posts in topic rooms
- `conversations` - Direct message conversations
- `messages` - Chat messages

### Learning Content
- `questions` - Q&A questions
- `answers` - Q&A answers
- `resources` - Resource library items
- `lessons` - Lesson cards/micro-courses
- `tutorials` - Pre-recorded video tutorials
- `live_classes` - Live video classes

### Gamification
- `badges` - Achievement badges
- `user_badges` - User badge awards
- `follows` - User following relationships

### Moderation
- `reports` - Content/user reports
- `notifications` - User notifications

## Row Level Security

All tables have RLS enabled with appropriate policies:
- Users can only access their own private data
- Public content is viewable by all authenticated users
- Moderators have additional permissions in their rooms
- Admins have full access for moderation

## Functions & Triggers

- Automatic profile creation on user signup
- XP and level calculation
- Streak tracking
- Vote counting
- Member count updates

## Environment Variables

Required environment variables (see `.env.example`):
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## API Endpoints

The Supabase API provides:
- Authentication endpoints
- Real-time subscriptions
- RESTful API for all tables
- GraphQL endpoint (optional)
- Storage for files and media

## Development

- **Reset Database**: `npm run reset`
- **Generate Types**: `npm run generate-types`
- **View Database**: Open Supabase Studio at http://localhost:54323
