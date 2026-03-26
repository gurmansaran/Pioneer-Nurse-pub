# Pioneer Nurse

A mobile study companion built for Texas Woman's University BSN students. Pioneer Nurse combines adaptive learning, AI tutoring, and clinical prep tools into one app designed around the TWU nursing curriculum.

## Features

### Adaptive Study Engine
- SM-2 spaced repetition across flashcard decks
- Per-course difficulty scaling (1.0–5.0) that adjusts automatically based on performance
- Weak area detection, study pattern analysis, and confidence check-ins
- Personalized dashboard with mastery rings, streak tracking, and priority course recommendations

### Flashcards & Practice Questions
- 100+ flashcards organized by course and topic
- 1,300+ practice questions covering all 7 Next Generation NCLEX (NGN) item types — extended multiple response, drag & drop, cloze dropdown, hot spot, matrix choice, matrix response, and bowtie
- Partial credit scoring with detailed rationales

### Pharmacology
- 70+ drug cards with hold parameters, mechanisms, side effects, and nursing considerations
- Searchable, color-coded by drug class

### AI Tutor
- Context-aware chat powered by the Anthropic API
- Adapts tone based on student anxiety level and study patterns
- Covers pathophysiology, pharmacology, clinical scenarios, and NCLEX prep
- Follows the CJMM clinical judgment framework

### Clinical Prep
- Pre-shift briefing generator for clinical rotations
- Select unit type, hospital, and patient info to receive a structured brief covering conditions, medications, assessment priorities, documentation tips, and a night-before checklist
- Post-rotation reflection capture

### Demo Mode
- Full app experience without authentication or a backend connection
- Seeded data across all modules for testing and App Store review

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo 55, Expo Router |
| Language | TypeScript 5.9 |
| State | Zustand, TanStack React Query |
| Styling | NativeWind (Tailwind CSS) |
| Backend | Supabase (PostgreSQL, Edge Functions, Auth) |
| AI | Anthropic API (Claude Sonnet / Haiku) |
| Auth | Apple Sign-In, email/password |
| Build | EAS (Expo Application Services) |

## Project Structure

```
app/
├── (auth)/           # Login & signup
├── (onboarding)/     # 10-step personalization flow
├── (tabs)/           # Main navigation
│   ├── index.tsx     # Dashboard
│   ├── study.tsx     # Study hub
│   ├── tutor.tsx     # AI tutor chat
│   ├── clinical.tsx  # Clinical prep
│   └── profile.tsx   # Profile & settings
├── study/            # Flashcards, questions, pharm
└── clinical/         # Clinical prep flow

lib/                  # Adaptive engine, spaced repetition, services
stores/               # Zustand state (auth, study, adaptive, chat, clinical, profile)
seeds/                # Flashcards, questions, drug cards, demo data
components/           # UI components (dashboard, quiz, clinical)
supabase/
├── functions/        # Edge functions (chat, clinical-brief)
└── migrations/       # Database schema
```

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

You'll need a Supabase project with the migrations applied and environment variables configured, or use demo mode to explore the app without a backend.

## Curriculum

Pioneer Nurse is designed around the TWU BSN program structure — semesters, course codes, clinical partners, and the 90%+ dosage calculation requirement are all built in. The adaptive engine maps directly to TWU course difficulty and exam schedules.
