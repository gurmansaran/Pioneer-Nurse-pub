# Pioneer Nurse -- 30-Day Launch Plan

## Overview

This plan covers the path from first TestFlight build to App Store go/no-go decision. The goal is to validate the app with real TWU nursing students before public release, catch critical issues early, and build confidence that the app is ready.

---

## Day 1-3: TestFlight Setup and First Users

### Day 1: Build and Deploy
- [ ] Run `eas build --platform ios --profile production` to create the first production build
- [ ] Upload to App Store Connect (via `eas submit --platform ios` or automatic)
- [ ] Wait for TestFlight processing (typically 10-15 minutes, sometimes longer for first build)
- [ ] Set up TestFlight internal testing group: "Pioneer Nurse Beta"
- [ ] Add yourself as the first tester -- install and verify the full flow works end-to-end

### Day 2: First 5 Users
- [ ] Invite 5 users from your TWU study group via TestFlight
- [ ] Target mix: at least one student from each semester level if possible (1st, 2nd, 3rd, or 4th semester)
- [ ] Send each person a personal message (not a mass email) explaining what Pioneer Nurse is and asking them to try it for a week
- [ ] Give them a specific task: "Create an account, set up your courses, try the AI tutor with one real question, and review 5 flashcards"
- [ ] Ask them to note anything confusing, broken, or frustrating

### Day 3: Monitor and Fix Criticals
- [ ] Check Supabase dashboard: Are all 5 accounts created? Did they complete onboarding?
- [ ] Check for any Edge Function errors (AI tutor failures)
- [ ] Fix any blocking issues immediately (crashes, auth failures, broken flows)
- [ ] Send a quick check-in message: "How's it going? Any issues getting started?"

---

## Day 4-7: First Feedback Collection

### What to Watch (Daily)
- [ ] **Onboarding completion rate:** How many people who download actually finish setup? (Target: 80%+)
- [ ] **Daily active users:** Are people coming back after day 1?
- [ ] **Feature usage:** Which features are being used? (Check Supabase query logs or add basic analytics)
- [ ] **AI tutor usage:** Are people asking real study questions? How many conversations per user?
- [ ] **Error rates:** Any failed API calls, auth errors, or Edge Function failures?

### Day 5: First Feedback Session
- [ ] Have a 10-minute conversation (in person, call, or text) with each of the 5 testers
- [ ] Questions to ask:
  1. "What's the first thing you tried in the app?"
  2. "Was anything confusing when you first opened it?"
  3. "Have you used the AI tutor? What did you ask it?"
  4. "Is there anything you expected to find that wasn't there?"
  5. "Would you use this to study for your next exam? Why or why not?"
  6. "What's the one thing you'd change?"
- [ ] Write down answers immediately -- do not rely on memory

### Day 7: First Bug Fix + Polish Release
- [ ] Based on feedback, fix the top 3 issues (bugs or UX confusion)
- [ ] Push a new TestFlight build
- [ ] Notify testers that an update is available
- [ ] Consider expanding to 10 users if the first 5 are engaged

---

## Week 2 (Day 8-14): Metrics Tracking and Expansion

### Expand Beta Group
- [ ] Invite 10-15 additional TWU nursing students
- [ ] Target: students outside your immediate friend group (less biased feedback)
- [ ] Post in TWU nursing class group chats or study groups (with permission)
- [ ] Total target: 15-20 active testers by end of week 2

### Metrics to Track

Set up a simple tracking spreadsheet or Supabase view for these metrics:

| Metric | How to Measure | Target |
|--------|---------------|--------|
| **DAU (Daily Active Users)** | Count distinct users with any Supabase auth activity per day | 50%+ of installed base |
| **AI tutor sessions/day** | Count rows in chat messages table per day | 2+ per active user |
| **Flashcard reviews/day** | Count review events per day | 10+ cards per active user |
| **Practice questions/day** | Count question attempts per day | 5+ per active user |
| **Most used module** | Rank features by usage | Identify top 3 |
| **Least used module** | Rank features by usage | Investigate why |
| **Onboarding completion** | Users who complete onboarding / users who sign up | 80%+ |
| **Day 1 retention** | Users who return day after first use / total users | 60%+ |
| **Day 7 retention** | Users active on day 7 / total users | 30%+ |
| **AI error rate** | Failed AI requests / total AI requests | <5% |
| **Avg session length** | Approximate from auth token refresh patterns | 10+ minutes |

### Week 2 Actions
- [ ] Review metrics on day 10 and day 14
- [ ] If onboarding completion is below 80%, simplify the onboarding flow
- [ ] If AI tutor usage is low, investigate -- is the feature hard to find? Are responses useful?
- [ ] If flashcard usage is low, check if the empty state is clear (do users know they need to create cards or are there starter decks?)
- [ ] Push at least one update based on week 2 data
- [ ] Enable the in-app "Send Feedback" button (FeedbackButton component) for all testers

---

## Week 3 (Day 15-21): Feedback Loop

### Structured Feedback Collection

Send a short survey to all testers (Google Form, Typeform, or even a text message with 5 questions):

1. **On a scale of 1-5, how useful is Pioneer Nurse for your study routine?**
2. **Which feature do you use most?** (AI Tutor / Drug Cards / Practice Questions / Flashcards / Study Planner)
3. **Which feature do you use least or never?**
4. **What's the most frustrating thing about the app right now?**
5. **Would you recommend Pioneer Nurse to a classmate? Why or why not?**

### What to Look For
- **Net Promoter Signal:** If fewer than 70% would recommend to a classmate, there is a core value problem to address before public launch
- **Feature gap:** If everyone says "I wish it had X," that might be worth adding before launch
- **Confusion patterns:** If multiple people are confused by the same thing, it is a design problem, not a user problem

### Week 3 Actions
- [ ] Compile survey results
- [ ] Identify top 3 improvements based on feedback
- [ ] Implement at least the highest-impact improvement
- [ ] Push an update to TestFlight
- [ ] Have one more round of 10-minute conversations with 3-5 testers
- [ ] Check all in-app feedback submissions (from the FeedbackButton component) in the Supabase `feedback` table

---

## Week 4 (Day 22-30): Go/No-Go Decision

### Go/No-Go Criteria

Answer each question honestly. You need a "Yes" on ALL critical items and at least 4 of 6 on the important items.

**Critical (all must be Yes):**
- [ ] Does the app crash during normal use? (Must be No)
- [ ] Can a new user sign up, complete onboarding, and use a core feature without help? (Must be Yes)
- [ ] Is the AI tutor returning useful, accurate responses? (Must be Yes)
- [ ] Are there any data loss or security issues? (Must be No)
- [ ] Is the privacy policy live at a public URL? (Must be Yes)
- [ ] Does account deletion work? (Must be Yes)

**Important (4 of 6 must be Yes):**
- [ ] Is day 7 retention above 25%?
- [ ] Do at least 70% of surveyed testers say they would recommend the app?
- [ ] Has at least one tester voluntarily used the app for real exam prep (not just exploring)?
- [ ] Are there fewer than 3 known non-critical bugs?
- [ ] Does the app work reliably on both iPhone SE and iPhone 15 Pro Max?
- [ ] Is the DisclaimerBanner visible on every AI response and drug card?

### If GO: Submit to App Store
- [ ] Complete all items in `submission-checklist.md`
- [ ] Create the test account for App Review
- [ ] Take final screenshots for the store listing
- [ ] Write What's New copy
- [ ] Submit via `eas submit --platform ios`
- [ ] Submit to Google Play Store
- [ ] Prepare announcement for TWU nursing student channels

### If NO-GO: Extend Beta
- [ ] Identify the specific blockers
- [ ] Create a 2-week fix plan targeting the blockers
- [ ] Continue collecting feedback from beta testers
- [ ] Re-evaluate at the end of the extension period

---

## Feedback Collection Infrastructure

### In-App Feedback Button
The `FeedbackButton` component (see `/components/FeedbackButton.tsx`) provides a persistent way for users to send feedback from within the app. It saves to a `feedback` Supabase table.

### Supabase Feedback Table Schema

```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  screen TEXT,         -- which screen they were on when they tapped feedback
  app_version TEXT,    -- e.g., "1.0.0"
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Users can insert their own feedback
CREATE POLICY "Users can insert own feedback"
  ON feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can read their own feedback
CREATE POLICY "Users can read own feedback"
  ON feedback FOR SELECT
  USING (auth.uid() = user_id);
```

### Monitoring Feedback
- Check the `feedback` table daily during beta
- Respond to feedback personally when possible (builds trust and encourages more feedback)
- Tag and categorize feedback to spot patterns

---

## Post-Launch (After App Store Approval)

### Week 1 Post-Launch
- [ ] Announce in TWU nursing student group chats, Discord, GroupMe, etc.
- [ ] Ask the 15-20 beta testers to leave App Store ratings (do not ask for 5 stars -- just honest reviews)
- [ ] Monitor crash reports and error rates closely
- [ ] Monitor App Store reviews daily
- [ ] Respond to any 1-star reviews with helpful follow-ups

### Ongoing
- [ ] Weekly check on metrics (DAU, retention, feature usage)
- [ ] Monthly release cycle for improvements
- [ ] Keep collecting feedback through the in-app button
- [ ] Start planning features for v1.1 based on real usage data

---

## Marketing Plan

### Primary Channels (Zero-Cost)

**WhatsApp and GroupMe Groups**
- [ ] Share in TWU Dallas BSN cohort WhatsApp groups (each semester typically has one)
- [ ] Post in TWU nursing student GroupMe channels
- [ ] Keep the message personal and authentic -- "I built this for us" resonates better than a marketing pitch
- [ ] Include a direct App Store link and one screenshot showing the AI tutor or drug cards
- [ ] Ask classmates to share with their own study groups

**Word of Mouth**
- [ ] Ask beta testers who loved the app to tell their study partners
- [ ] Mention Pioneer Nurse in study group sessions and before/after class
- [ ] Offer to demo the app one-on-one for interested classmates
- [ ] Word of mouth is the strongest channel for a niche student audience -- invest time here

**TWU Dallas Campus Presence**
- [ ] Print simple flyers (QR code + App Store link + "Free NCLEX prep built for TWU BSN students")
- [ ] Post flyers on approved bulletin boards near nursing classrooms and the simulation lab
- [ ] Leave flyers in common study areas used by nursing students
- [ ] Follow TWU posting guidelines -- get approval from appropriate campus office if required

### Secondary Channels

**Social Media (Optional)**
- [ ] Create a simple Instagram account (@pioneernurse) to share study tips and app updates
- [ ] Post NCLEX tip cards that showcase app features
- [ ] Keep it low-effort -- social media is secondary to direct campus outreach

**Faculty Awareness (Long-Term)**
- [ ] If a faculty member asks about the app, be transparent about what it is and is not
- [ ] Do not ask faculty to endorse or promote the app -- let them discover it through students
- [ ] Emphasize that it is a free supplementary tool with clear medical disclaimers

### Launch Message Template

For WhatsApp/GroupMe/text messages:

> Hey! I built a free study app specifically for TWU Dallas BSN students. It has an AI tutor, drug cards with hold parameters, NCLEX practice questions, and spaced repetition flashcards. No ads, no subscriptions, everything is free. Would love for you to try it and let me know what you think: [App Store Link]

---

## Key Metrics to Track

| Metric | How to Measure | Target | Frequency |
|--------|---------------|--------|-----------|
| **DAU (Daily Active Users)** | Distinct users with any activity per day | 50%+ of installed base | Daily |
| **Session Duration** | Average time spent in app per session | 10+ minutes | Weekly |
| **Questions Answered** | Practice question attempts per day | 5+ per active user | Weekly |
| **AI Conversations** | Chat messages sent to AI tutor per day | 2+ sessions per active user | Weekly |
| **Flashcard Reviews** | Card reviews per day | 10+ cards per active user | Weekly |
| **Day 1 Retention** | Users who return day after first use | 60%+ | Weekly |
| **Day 7 Retention** | Users active on day 7 | 30%+ | Weekly |
| **Day 30 Retention** | Users active on day 30 | 15%+ | Monthly |
| **Onboarding Completion** | Users completing onboarding / signups | 80%+ | Weekly |
| **AI Error Rate** | Failed AI requests / total requests | <5% | Daily |
| **Crash-Free Rate** | Sessions without crashes / total sessions | >99% | Daily |
| **App Store Rating** | Average star rating | 4.5+ | Weekly |
