# Pioneer Nurse -- App Review Notes

Copy the text below into the "Notes for App Review" field in App Store Connect when submitting.

---

## Notes for App Review

Pioneer Nurse is a free educational study app built specifically for nursing students in the Bachelor of Science in Nursing (BSN) program at Texas Woman's University (TWU) in Dallas, Texas.

### What the App Does

The app helps nursing students study for their courses and prepare for the NCLEX-RN licensure exam. Features include:

- An AI-powered study tutor for asking questions about nursing topics
- Searchable drug reference cards with nursing considerations
- NCLEX-style practice questions with detailed rationales
- Spaced repetition flashcards
- Clinical preparation tools
- A personalized daily study planner

### Why Account Creation Is Required

Students sign in so their study progress, flashcard review history, exam schedules, and AI conversation history are saved and available across sessions. Without an account, there would be no way to persist the adaptive study features (spaced repetition scheduling, weak area tracking, and personalized study plans). Account deletion is available in the Profile screen.

### Test Account

To review the app without creating a new account, please use the following test credentials:

- **Email:** appreview@pioneernurse.app
- **Password:** AppReview2026!

This test account has sample data pre-populated, including active courses (Pharmacology, Med-Surg I), upcoming exam dates, flashcard review history, and AI tutor conversation history, so all features can be evaluated without completing the onboarding flow.

### Educational Tool -- Not Medical Advice

Pioneer Nurse is strictly an educational study aid. It does not provide medical advice, clinical diagnoses, or treatment recommendations. This is clearly communicated to users in multiple ways:

1. A disclaimer banner appears on all AI tutor responses: "For study purposes only. Verify with your instructor."
2. Drug reference cards include a disclaimer that hold parameters and protocols may vary by institution.
3. The app description and Terms of Service explicitly state the app is not a substitute for professional nursing judgment or clinical instruction.

### AI Usage Disclosure

The AI Tutor feature uses the Anthropic API (Claude) to generate study explanations. Users see a clear disclaimer on every AI response. The AI receives only the conversation text -- no personal identifying information (name, email) is sent to the API. AI conversations are processed through our server (Supabase Edge Function), not directly from the client.

### No In-App Purchases

The app is completely free with no in-app purchases, subscriptions, or advertisements. All features are available to all users.

### Data Privacy

The app collects only the minimum data needed to function: email for authentication, first name for personalization, course selections, and study performance data. All data is stored with Row Level Security in Supabase. Full details are in our privacy policy, accessible within the app and at our privacy policy URL.

---

## Contact Information for Review Team

<!-- TODO: Replace with actual contact info -->
**Name:** [Your Name]
**Email:** hello@pioneernurse.app
**Phone:** [Your Phone Number]

---

## Reminder: Test Account Setup Before Submission

Before submitting to App Review, create the test account described above:

1. Create a Supabase user with email `appreview@pioneernurse.app` and password `AppReview2026!`
2. Complete onboarding for this account with the following settings:
   - First name: "App"
   - Courses: Pharmacology, Med-Surg I
   - Add at least one upcoming exam date
3. Generate some study activity:
   - Review at least 10 flashcards
   - Answer at least 5 practice questions
   - Have at least 2 AI tutor conversations (one about pharmacology, one about a clinical scenario)
4. Confirm the account works by logging in on a fresh device/simulator
5. Mark the email as verified in Supabase Auth so the reviewer does not hit a verification wall
