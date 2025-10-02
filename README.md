# SkillLink — Mentor & Learner Platform (MVP)

SkillLink connects non-skilled learners with skilled mentors across any field. Core MVP features include discovery & matching, realtime rooms/chat, Q&A, live classes, and VOD tutorials—plus basic monetization and trust & safety.

## Tech Stack
- **Web:** React 18, TypeScript, Vite or Next.js (UI: Tailwind CSS + shadcn/ui)
- **Backend:** Supabase (Postgres database, Auth, Row-Level Security, Realtime subscriptions, Storage)
- **Live:** Daily.co (live video calls, tokens, recordings)
- **VOD:** Mux (video upload/ingest and playback)
- **Payments:** Stripe (checkout and webhooks)
- **Analytics:** PostHog
- **AI (optional):** OpenAI for content moderation and assistive features

---

## Quick Start

### 1. Prerequisites

- Node.js 18+ with npm, yarn or pnpm installed.
- Supabase account (and optionally the Supabase CLI for local development).
- API keys for:
  - **Daily.co** (video),
  - **Mux** (VOD),
  - **Stripe** (payments),
  - **PostHog** (analytics),
  - **OpenAI** (optional for moderation/assistant features).

### 2. Installation & Configuration

Clone the repo and install dependencies:

```
bash
git clone https://github.com/jbfx1/skilllink-mvp
cd skilllink-mvp
npm install            # or yarn / pnpm install
```

Set up your environment variables:

```
bash
cp .env.example .env.local
```

Fill out `.env.local` with your credentials:

- `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- `DAILY_API_KEY`
- `MUX_TOKEN` and `MUX_SECRET`
- `STRIPE_SECRET`
- `POSTHOG_KEY`
- (Optional) `OPENAI_API_KEY`

### 3. Database Setup

If running Supabase locally:

```
bash
npx supabase start
```

Then initialize the database and seed any required data:

```
bash
npm run db:setup
```

Alternatively, connect this project to an existing Supabase instance and run the migrations from the `/backend` directory.

### 4. Development

Start the development server:

```
bash
npm run dev
```

This will launch the web client locally (Vite/Next.js) and watch for changes. Make sure your Supabase instance is running and environment variables are configured.

### 5. Testing & Linting

To run tests and lint the codebase:

```
bash
npm run test      # run unit tests
npm run lint      # lint the code with ESLint
```

### 6. Build & Deploy

Build the production-ready web app:

```
bash
npm run build
```

Deploy your application:

- **Web**: Deploy the contents of the build directory to your preferred hosting platform (e.g., Vercel).
- **Backend**: Push database schema and functions to your Supabase instance using the Supabase CLI (`supabase db push`).

---

## Project Structure

```
├── backend/           # Supabase functions, database migrations, seeds
├── web/               # React web application (TypeScript, Tailwind, shadcn/ui)
├── docs/              # Product docs (PRD, specs)
├── .env.example       # Example environment variables file
└── README.md
```

- `DOCUMENTATION.md`, `QUICK_START.md` and `PRODUCTION_READY.md` have been consolidated into this README.
- Additional design and product docs live in the `docs/` folder.

---

## Contributing

Contributions are welcome! Please:

1. Fork this repository and create a new branch for your feature or fix.
2. Add tests and update documentation where relevant.
3. Submit a pull request with a clear description of your changes.

---

## License

This project is licensed under the MIT License.
