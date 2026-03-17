# Pioneer Nurse -- Privacy Policy

**Effective Date:** March 15, 2026
**Last Updated:** March 15, 2026

---

The short version: We collect only what is needed to make Pioneer Nurse work for you. We do not sell your data. We do not show ads. Your study data is yours.

---

## Who We Are

Pioneer Nurse is a free study app built for Texas Woman's University (TWU) Dallas BSN nursing students. This policy explains what information we collect, how we use it, and what control you have over it.

## What We Collect

### Account Information
- **Email address** -- used to create and sign into your account
- **First name** -- used for personalized greetings in the app
- **Password** -- stored as a secure hash; we never see your actual password

### Profile and Course Information
- Courses you select during onboarding (e.g., Pharmacology, Med-Surg I)
- Campus information (TWU Dallas)
- Upcoming exam dates you enter
- Self-reported areas of difficulty

### Study Performance Data
- Flashcard review history and spaced repetition scheduling data
- Practice question answers and accuracy scores
- Study streak counts and session durations
- Weak area tracking (topics where your accuracy is lower)

### AI Tutor Conversations
- Messages you send to the AI tutor
- AI responses generated for your questions
- These conversations are sent to the Anthropic API (Claude) to generate responses. See "AI Conversations and Third-Party Processing" below for details.

### Feedback
- Any feedback you voluntarily submit through the in-app feedback feature

### What We Do NOT Collect
- Location data
- Contacts or address book
- Health or biometric data
- Financial or payment information
- Device identifiers for advertising purposes
- Browsing history outside the app

## How We Use Your Data

- **Account management:** To let you sign in and access your data across devices
- **Personalized study experience:** To generate your daily study plan, track weak areas, schedule flashcard reviews using spaced repetition, and tailor the AI tutor experience to your courses and semester
- **AI tutor responses:** To send your questions to the Anthropic API and return answers
- **App improvement:** We may review aggregate, anonymized usage patterns (e.g., which features are used most) to improve the app. We do not review individual study data for this purpose.

## How We Store Your Data

Your data is stored in [Supabase](https://supabase.com), a cloud database platform. Our Supabase project is hosted on servers located in the United States.

Security measures include:

- **HTTPS encryption** for all data in transit
- **Secure password hashing** (bcrypt via Supabase Auth)
- **Row Level Security (RLS)** on every database table -- your data is isolated at the database level. Queries can only return rows that belong to your authenticated account. No other user, and no app administrator, can view your individual study data, flashcard history, or AI conversations through normal database access.
- **Secure token storage** on your device (using Expo SecureStore)
- **API keys stored server-side** in Supabase Edge Functions, never in the app code

No system is 100% secure. If you discover a security issue, please report it to us immediately.

## Third-Party Services

### Supabase

We use [Supabase](https://supabase.com) for authentication, database storage, and serverless functions. Supabase stores your account information, study data, and conversation history. Supabase's infrastructure is hosted on AWS in the United States. See [Supabase's Privacy Policy](https://supabase.com/privacy) for details on their data handling practices.

### Anthropic API (Claude)

When you use the AI Tutor feature, your messages are sent to the Anthropic API (which powers Claude, the AI model) to generate responses. This processing happens through a Supabase Edge Function -- your messages go from the app to our server, then to Anthropic, and the response comes back the same way.

**What Anthropic receives:** The text of your question and recent conversation context. Anthropic does not receive your name, email, or account information.

**Anthropic's data handling:** As of this writing, Anthropic states that API inputs and outputs are not used to train their models. For the most current information, see [Anthropic's Privacy Policy](https://www.anthropic.com/privacy) and [API Data Usage Policy](https://www.anthropic.com/api-data-usage).

Your AI conversation history is stored in our Supabase database (protected by RLS as described above) so you can review past conversations.

## Who Can See Your Data

**You.** Your study performance, flashcard progress, AI conversations, and profile information are visible only to you through your authenticated account.

We do not share, sell, rent, or trade your personal information with any third party for marketing, advertising, or data brokerage purposes.

The only exception is the Anthropic API for AI tutor functionality, described above.

## Data Retention

We keep your data for as long as your account is active. If you delete your account, all associated data -- including your profile, study history, flashcard progress, and AI conversation history -- is permanently deleted from our database within 30 days.

## Your Rights

You have the right to:

- **Access** the personal data we hold about you
- **Correct** inaccurate information in your profile
- **Delete** your account and all associated data
- **Export** your data -- request a copy of your data in a portable format

To exercise any of these rights, contact us at the email below.

## Account Deletion

You can delete your account at any time from within the app (Profile > Delete Account). You can also request account deletion by emailing us at the address below. Account deletion is permanent and cannot be undone.

## No Advertising

Pioneer Nurse does not display advertisements. We do not collect data for advertising purposes. We do not use advertising identifiers or tracking pixels. There are no analytics SDKs from ad networks in this app.

## No Data Sales

We do not sell your personal information. Period. This app is free because it was built to help students, not to monetize their data.

## Children's Privacy (COPPA Compliance)

Pioneer Nurse is designed for college-level nursing students at TWU Dallas. The app is intended for users who are 18 years of age or older. We do not knowingly collect personal information from children under 13. If you believe a child under 13 has created an account, please contact us and we will delete the account promptly.

## Changes to This Policy

If we make meaningful changes to this policy, we will notify you through the app or by email before the changes take effect. Minor wording updates that do not affect your rights will be posted here with an updated date.

## Contact

If you have questions about this privacy policy or your data, contact us at:

**Email:** privacy@pioneernurse.app

**App:** Pioneer Nurse
Built for TWU Dallas BSN students
