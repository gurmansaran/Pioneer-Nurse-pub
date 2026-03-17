# Pioneer Nurse -- App Store Screenshots Specification

## Device Specifications

### iPhone 6.7-inch (iPhone 15 Pro Max)
- **Resolution:** 1290 x 2796 pixels
- **Format:** PNG or JPEG, no alpha/transparency
- **Max file size:** 8 MB per image
- **Required:** 6 screenshots minimum

---

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| TWU Maroon | `#8B0000` | Primary brand, gradient backgrounds, headline accents |
| Deep Maroon | `#500000` | Gradient end, dark accents |
| Warm White | `#FAFAF9` | App background |
| Stone 900 | `#1C1917` | Primary text |
| Gold Accent | `#D4A574` | Highlights, badges |

---

## Screenshot 1: Home Dashboard with Greeting and Exam Countdown

**App Screen:** Home tab showing personalized greeting, next exam countdown, study streak badge, and daily study plan

**Screen State:**
- Greeting: "Good morning, Sarah" with wave icon
- Exam countdown card: "Med-Surg II Final -- 6 days" with prominent countdown
- Study streak badge: "5-day streak" with flame icon
- Daily plan blocks visible below
- 12 flashcards due indicator

**Text Overlay:**
- **Headline:** "Your Nursing Study Command Center"
- **Font:** SF Pro Display Bold, 84pt
- **Color:** White text on TWU Maroon (#8B0000) gradient banner
- **Position:** Top 18% of screenshot

**Why First:** First impression shows the app is purpose-built for nursing students. The exam countdown and personalized plan immediately communicate value.

---

## Screenshot 2: AI Tutor Conversation Showing Clinical Reasoning

**App Screen:** AI Tutor chat with a clinical reasoning question and structured response

**Screen State:**
- User message: "A patient on metoprolol has a BP of 88/56 and HR of 52. What should I do?"
- AI response showing structured clinical reasoning:
  - Assessment of the vital signs
  - Hold parameter check (HR < 60, BP < 90 systolic)
  - Nursing interventions prioritized
  - When to notify the provider
- Disclaimer banner visible at bottom: "For study purposes only. Verify with your instructor."

**Text Overlay:**
- **Headline:** "AI Tutor That Thinks Like a Nurse"
- **Font:** SF Pro Display Bold, 84pt
- **Color:** White text on TWU Maroon (#8B0000) gradient banner
- **Position:** Top 18% of screenshot

**Why Second:** AI is the headline differentiator. Showing a real clinical reasoning scenario with a structured, useful answer demonstrates immediate utility.

---

## Screenshot 3: Flashcard Review with SM-2 Buttons

**App Screen:** Spaced repetition flashcard mid-review with answer revealed and SM-2 difficulty rating buttons

**Screen State:**
- Card flipped to show answer side
- Front: "What are the 4 signs of right-sided heart failure?"
- Back: Clear bullet-point answer (JVD, peripheral edema, hepatomegaly, weight gain)
- SM-2 rating buttons visible at bottom: "Again" (red), "Hard" (orange), "Good" (green), "Easy" (blue)
- Progress indicator: "8 of 24 cards"
- Course tag: "Med-Surg I"

**Text Overlay:**
- **Headline:** "Flashcards That Know When You'll Forget"
- **Font:** SF Pro Display Bold, 84pt
- **Color:** White text on TWU Maroon (#8B0000) gradient banner
- **Position:** Top 18% of screenshot

**Why Third:** Flashcards are familiar and expected. The spaced repetition angle with visible SM-2 buttons differentiates from basic flashcard apps.

---

## Screenshot 4: Drug Card Showing Hold Parameters Prominently

**App Screen:** Drug card detail view for Metoprolol with hold parameters highlighted

**Screen State:**
- Drug name: "Metoprolol (Lopressor)"
- Classification: "Beta-Blocker (Beta-1 Selective)"
- Mechanism of action section
- **Hold Parameters section prominently displayed** with visual emphasis:
  - "Hold if HR < 60 bpm"
  - "Hold if SBP < 90 mmHg"
  - Visual highlight/border making hold parameters stand out
- Nursing Considerations section
- Common Side Effects section
- Drug disclaimer banner at bottom

**Text Overlay:**
- **Headline:** "Drug Cards Built for Clinical"
- **Font:** SF Pro Display Bold, 84pt
- **Color:** White text on TWU Maroon (#8B0000) gradient banner
- **Position:** Top 18% of screenshot

**Why Fourth:** Drug cards are a top search intent for nursing students. Prominently showing hold parameters signals this app understands what nursing students actually need at the bedside.

---

## Screenshot 5: NGN Practice Question (Matrix Type)

**App Screen:** Next Generation NCLEX (NGN) style practice question showing a matrix/grid format

**Screen State:**
- Question stem with a brief patient scenario
- Matrix-type question with rows and columns for selecting nursing actions
- Rows: nursing interventions (e.g., "Administer oxygen", "Elevate HOB", "Obtain blood glucose", "Apply cardiac monitor")
- Columns: "Indicated", "Not Indicated", "Contraindicated"
- Difficulty badge: "NGN -- Medium"
- Question progress: "Question 3 of 10"

**Text Overlay:**
- **Headline:** "NGN Questions That Adapt to You"
- **Font:** SF Pro Display Bold, 84pt
- **Color:** White text on TWU Maroon (#8B0000) gradient banner
- **Position:** Top 18% of screenshot

**Why Fifth:** NGN-format questions are the current standard for NCLEX prep. Showing a matrix-type question demonstrates the app goes beyond basic multiple choice.

---

## Screenshot 6: Clinical Prep Briefing

**App Screen:** Clinical preparation briefing template with structured sections

**Screen State:**
- Patient overview section with diagnosis, age, relevant history fields
- Assessment checklist with key systems to review
- Medications section showing patient's active medications with nursing considerations
- Care plan section with priority nursing diagnoses
- Pre-clinical questions/objectives section
- Clean, organized layout that feels professional

**Text Overlay:**
- **Headline:** "Walk Into Clinical Prepared"
- **Font:** SF Pro Display Bold, 84pt
- **Color:** White text on TWU Maroon (#8B0000) gradient banner
- **Position:** Top 18% of screenshot

**Why Sixth:** Clinical prep is a unique feature most competing apps lack. Appeals to students in clinical semesters who feel anxious about being underprepared.

---

## Design Guidelines

### Headline Overlay Style
- **Font:** SF Pro Display Bold (system font, no licensing issues)
- **Size:** 80-90pt for headlines
- **Color:** White text on TWU Maroon (#8B0000) gradient banner at top
- **Position:** Top 18-20% of screenshot
- **Background gradient:** #8B0000 to #500000 (left to right or top to bottom)

### Device Frame
- iPhone 15 Pro Max frame (titanium finish)
- App content visible below the headline overlay
- Subtle maroon gradient (#8B0000 to #500000) as background behind device frame

### Consistency Rules
- Same headline font, size, and position across all 6 screenshots
- Same device frame style throughout
- TWU Maroon accent color throughout
- Clean, uncluttered -- no decorative elements that distract from app content
- All app screens should show realistic, populated data (not empty states)

### Tools for Creation
- Figma with App Store screenshot templates
- Screenshots.pro or AppMockUp for device frames
- Alternatively: Fastlane Frameit for automated framing

---

## Localization

English (US) only for v1.0. No localization needed.
