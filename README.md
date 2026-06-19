# Lingo

A gamified Spanish flashcard app built with React, TypeScript, and Neon Postgres. Features a full quiz loop with XP, streaks, hearts, a leaderboard, sound effects, and Web Speech API audio — built in a single day.

**Live demo:** https://lingo.theteecee.dev

---

## Features

- 25 Spanish lessons across 9 categories with difficulty badges (Beginner / Intermediate / Advanced)
- Lesson lock/unlock progression — complete lessons in order to unlock the next
- Multiple choice quiz loop with 4 options per question
- Hearts system — lose a heart on each wrong answer, lesson ends at 0
- Keyboard shortcuts — press 1–4 to select an answer, Enter to advance
- Web Speech API audio — hear each Spanish phrase spoken aloud
- Sound effects for correct answers, wrong answers, lesson complete, and level up
- Wrong answers review screen after each lesson
- XP and streak tracking persisted to localStorage
- Level progression (500 XP per level) with a progress bar
- Leaderboard with seeded entries and your live rank
- Progress screen with level milestones
- Settings modal — choose an avatar, set a display name, reset progress
- Questions shuffled on every attempt so retrying feels fresh
- Time-aware greeting (good morning / afternoon / evening)
- Loading skeletons on all data-fetching screens
- Error states with retry on all screens
- Page transitions with Framer Motion
- Responsive layout — desktop three-column view, mobile bottom tab bar
- Confetti burst on lesson complete

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v6 |
| Data fetching | TanStack Query v5 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Database | Neon Postgres (serverless) |
| ORM | Drizzle ORM |
| API | Vercel serverless functions |
| Deployment | Vercel |
| Audio | Web Speech API + Web Audio API (browser-native) |
| State | React Context (user stats) |
| Persistence | localStorage (XP, streak, level, avatar) |

---

## Architecture

```mermaid
flowchart TD
    A[Browser — React + Vite] -->|GET /api/lessons| B[Vercel Serverless Functions]
    A -->|GET /api/questions?lessonId=n| B
    A -->|GET /api/leaderboard| B
    B -->|Drizzle ORM| C[Neon Postgres]
    C -->|lessons table| D[(lessons)]
    C -->|questions table| E[(questions)]
    C -->|leaderboard table| F[(leaderboard)]
    A -->|XP · streak · level · avatar| G[localStorage]
    A -->|TanStack Query cache| H[Shared query cache]
    A -->|Spanish phrase audio| I[Web Speech API]
    A -->|Sound effects| J[Web Audio API]
```

---

## Database schema

```mermaid
erDiagram
    lessons {
        serial id PK
        text title
        text description
        text category
        text difficulty
        integer order
    }
    questions {
        serial id PK
        integer lesson_id FK
        text prompt
        jsonb options
        integer correct_index
        text hint
    }
    leaderboard {
        serial id PK
        text name
        integer xp
        integer streak
    }
    lessons ||--o{ questions : "has many"
```

---

## Project structure

```
lingo/
├── api/                              # Vercel serverless functions
│   ├── lessons.ts                    # GET /api/lessons
│   ├── questions.ts                  # GET /api/questions?lessonId=n
│   └── leaderboard.ts                # GET /api/leaderboard
├── src/
│   ├── components/
│   │   ├── AppLayout.tsx             # Shared layout — TopNav + BottomNav + children
│   │   ├── TopNav.tsx                # Desktop nav with XP, streak, settings modal
│   │   ├── BottomNav.tsx             # Mobile bottom tab bar
│   │   ├── PageTransition.tsx        # Framer Motion fade wrapper
│   │   ├── ErrorState.tsx            # Reusable error + retry component
│   │   └── SkeletonCard.tsx          # Loading skeleton
│   ├── context/
│   │   └── UserStatsContext.tsx      # React Context for XP, streak, level, avatar
│   ├── lib/
│   │   ├── db.ts                     # Neon + Drizzle connection
│   │   ├── schema.ts                 # Drizzle table definitions
│   │   ├── queries.ts                # TanStack Query query factories
│   │   ├── sounds.ts                 # Web Audio API sound effects
│   │   ├── seed.ts                   # Initial seed (3 lessons)
│   │   └── seed-more.ts              # Extended seed (25 lessons)
│   ├── screens/
│   │   ├── HomeScreen.tsx            # Lesson card grid with lock/unlock/complete states
│   │   ├── QuizScreen.tsx            # Quiz loop with hearts, progress bar, right panel
│   │   ├── CompleteScreen.tsx        # Post-lesson summary with confetti
│   │   ├── ReviewScreen.tsx          # Wrong answers review
│   │   ├── LeaderboardScreen.tsx     # Weekly XP leaderboard
│   │   ├── ProgressScreen.tsx        # Level milestones and stats
│   │   └── SettingsScreen.tsx        # Avatar, display name, progress reset
│   └── types/
│       └── index.ts                  # Shared TypeScript interfaces
├── drizzle.config.ts
├── vercel.json
└── vite.config.ts
```

---

## Getting started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) Postgres database

### Installation

```bash
git clone https://github.com/terrence-celestine/lingo.git
cd lingo
npm install
```

### Environment variables

Create a `.env` file at the root:

```
DATABASE_URL=your_neon_connection_string
```

### Database setup

Push the schema and seed the database:

```bash
npx drizzle-kit push
npm run seed
npm run seed:more
```

### Run locally

```bash
npx vercel dev
```

Visit `http://localhost:3000`.

---

## Engineering decisions

**TanStack Query over manual useEffect fetching**
Initially used `useEffect` + `useState` for data fetching, but this caused a double-render bug on the quiz screen where questions were shuffled twice and the wrong question displayed. Refactoring to TanStack Query eliminated the issue via request deduplication, gave shared caching across screens (the leaderboard is fetched once and reused on both the quiz screen and leaderboard screen), and provided loading/error states out of the box.

**React Context over prop drilling**
User stats (XP, streak, level, avatar) are consumed by multiple components at different levels of the tree — TopNav, QuizScreen, CompleteScreen, ProgressScreen, and SettingsScreen. Initially threaded stats as props but refactored to a single `UserStatsContext` so any component can access and mutate state without threading props through the tree.

**Neon Postgres + Drizzle over a JSON file**
Question data lives in a real database rather than a hardcoded file. This makes it straightforward to add new lessons, languages, or question types without touching application code — just seed new rows. The `difficulty` column was added via a schema migration mid-build to demonstrate the pattern.

**Vercel serverless functions over a separate Express server**
Keeping the API co-located with the frontend in a single Vercel project simplifies deployment significantly. There's no separate server to manage or keep running. The tradeoff is cold starts on the free tier, which are acceptable for a demo but worth revisiting at scale.

**localStorage over a users table**
XP, streak, level, avatar, and completed lessons are stored client-side. For a single-player demo this avoids needing auth entirely and keeps the architecture simple. A natural v2 would add Clerk auth and sync stats server-side to enable a real leaderboard with live user scores.

**Web Audio API over a third-party sound library**
Browser-native audio synthesis is free, requires no external files or API keys, and gives precise control over tone, frequency, and envelope. The correct answer chime, wrong answer thud, and lesson complete chord are all generated programmatically rather than loaded as audio files.

**Shuffle on every attempt**
Questions are shuffled client-side after the fetch so retrying a lesson feels fresh rather than memorizable. Keeping the shuffle client-side means the API stays simple — no shuffle logic or randomization parameters needed on the server.

**AppLayout for shared chrome**
TopNav, BottomNav, and page transitions are handled in a single `AppLayout` component that wraps all routes. This means each screen only renders its own content — no repeated nav imports across 7 screen files.

---

## Roadmap

- [ ] Clerk auth + server-side XP sync for real leaderboard scores
- [ ] Additional languages (French, Japanese)
- [ ] Streak freeze mechanic
- [ ] Spaced repetition algorithm for question ordering
- [ ] Offline support via service worker
- [ ] Push notifications for streak reminders
