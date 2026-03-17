# Pioneer Nurse -- App Store Submission Checklist

## EAS Build Setup

### eas.json Configuration
- [ ] `eas.json` exists at project root with `development`, `preview`, and `production` profiles
- [ ] Development profile: `developmentClient: true`, `distribution: "internal"`, `environment: "development"`
- [ ] Preview profile: `distribution: "internal"`, `environment: "preview"` (for TestFlight-like internal distribution)
- [ ] Production profile: `autoIncrement: true` for build numbers, `environment: "production"`
- [ ] Submit configuration included for both iOS and Android

### app.json Required Fields
- [ ] `expo.name`: "Pioneer Nurse"
- [ ] `expo.slug`: "pioneer-nurse"
- [ ] `expo.version`: "1.0.0" (semver -- update for each App Store release)
- [ ] `expo.ios.bundleIdentifier`: "com.pioneernurse.app"
- [ ] `expo.ios.buildNumber`: "1" (auto-incremented by EAS)
- [ ] `expo.ios.supportsTablet`: true
- [ ] `expo.ios.infoPlist.NSUserTrackingUsageDescription` -- NOT needed (we do not track)
- [ ] `expo.ios.config.usesNonExemptEncryption`: false (we use HTTPS only, which is exempt)
- [ ] `expo.android.package`: "com.pioneernurse.app"
- [ ] `expo.android.versionCode`: 1 (auto-incremented by EAS)
- [ ] `expo.icon`: "./assets/images/icon.png" (1024x1024, no alpha, no rounded corners)
- [ ] `expo.splash`: configured with TWU maroon background (#8B0000)
- [ ] `expo.orientation`: "portrait"
- [ ] `expo.scheme`: "pioneernurse" (for deep linking)

### Icon Requirements
- [ ] iOS icon: 1024x1024px, PNG, no transparency, no rounded corners (Apple applies rounding)
- [ ] Android adaptive icon: foreground, background, and monochrome images provided
- [ ] Icon does not contain text that would be unreadable at small sizes
- [ ] Icon passes contrast check on both light and dark backgrounds

### iOS Certificates and Provisioning (EAS Managed)
- [ ] Apple Developer Program membership is active ($99/year)
- [ ] EAS CLI installed: `npm install -g eas-cli`
- [ ] Logged into EAS: `eas login`
- [ ] First build will auto-generate certificates -- confirm with `eas credentials`
- [ ] Distribution certificate and provisioning profile created via EAS
- [ ] Push notification capability added (if using push notifications in future)

### SDK Compatibility
- [ ] Expo SDK 55 -- confirm compatible with latest iOS and Android versions
- [ ] Test on iOS 17+ and iOS 18
- [ ] Test on Android 13+ (API 33+)
- [ ] All native dependencies are compatible (check `npx expo install --check`)

---

## App Store Connect Setup

### App Record Creation
- [ ] Sign into [App Store Connect](https://appstoreconnect.apple.com)
- [ ] Create new app: "Pioneer Nurse"
- [ ] Primary language: English (U.S.)
- [ ] Bundle ID: `com.pioneernurse.app` (must match app.json)
- [ ] SKU: `pioneer-nurse-v1` (internal identifier, any unique string)

### App Information
- [ ] App name: "Pioneer Nurse" (cannot be changed easily after approval)
- [ ] Subtitle: "NCLEX Prep | AI Tutor | Cards"
- [ ] Category: Education (primary)
- [ ] Secondary category: Medical (switch to Reference if Apple flags it during review)
- [ ] Content rights: Confirm you own or have rights to all content
- [ ] Privacy Policy URL: Host `privacy-policy.html` at a public URL and enter it here

### Age Rating

**Recommended: 4+**

Rationale: Pioneer Nurse contains no violence, sexual content, gambling, horror, profanity, alcohol/drug use descriptions (drug cards describe medications, not recreational drugs), or mature themes. The age rating questionnaire asks about specific content types -- answer "None" or "Infrequent" for all.

Note: Apple overhauled age ratings in mid-2025. The new system includes 4+, 9+, 13+, 16+, and 18+ (replacing the old 12+ and 17+). For Pioneer Nurse:
- Medical/wellness content: Yes, but educational, not diagnostic
- User-generated content: No public sharing -- flashcards are private to each user
- AI-generated content: Yes -- flag this in the questionnaire if asked. The AI disclaimer within the app satisfies Apple's requirement.

A 4+ rating maximizes discoverability. The app contains nothing that would require 9+ or higher.

### Privacy Nutrition Labels -- Exact Data Types to Declare

In App Store Connect, you must declare all data types collected. Here is exactly what to select:

**Contact Info**
- Email Address
  - Used for: App Functionality
  - Linked to User: Yes
  - Used for Tracking: No

**User Content**
- Other User Content (AI chat messages, custom flashcards)
  - Used for: App Functionality
  - Linked to User: Yes
  - Used for Tracking: No

**Usage Data**
- Product Interaction (features used, study sessions, question attempts)
  - Used for: App Functionality, Analytics
  - Linked to User: Yes
  - Used for Tracking: No

**Identifiers**
- User ID (Supabase auth user ID)
  - Used for: App Functionality
  - Linked to User: Yes
  - Used for Tracking: No

**Do NOT declare** (because we do not collect these):
- Location
- Financial Info
- Health & Fitness (drug cards are educational reference, not health data)
- Contacts
- Browsing History
- Search History (in-app search is not persisted)
- Sensitive Info
- Diagnostics (unless you add crash reporting -- see note below)
- Purchases

**Note on crash reporting:** If you add Sentry, Bugsnag, or Expo's error reporting in the future, you will need to add "Crash Data" under Diagnostics. For v1.0, if no crash reporting SDK is included, skip it.

### Pricing
- [ ] Price: Free
- [ ] No in-app purchases
- [ ] No subscriptions

---

## Google Play Store Setup

### Google Play Console
- [ ] Sign into [Google Play Console](https://play.google.com/console)
- [ ] Create new application: "Pioneer Nurse"
- [ ] Default language: English (United States)

### Store Listing
- [ ] App name: "Pioneer Nurse - TWU Study App" (up to 50 chars on Google Play)
- [ ] Short description (80 chars): "Free AI tutor, drug cards & NCLEX prep for TWU nursing students"
- [ ] Full description: Same as App Store description (4000 char limit)
- [ ] Screenshots: Phone and tablet (7-inch and 10-inch)
- [ ] Feature graphic: 1024x500px (required for Google Play)
- [ ] App icon: 512x512px (Google Play specification)

### Content Rating
- [ ] Complete the IARC rating questionnaire
- [ ] Expected rating: Everyone / PEGI 3 (equivalent to App Store 4+)

### Data Safety Section
- [ ] Matches the same data declarations as Apple privacy nutrition labels
- [ ] Declare data shared with Anthropic API for AI functionality
- [ ] Link to privacy policy

### First Upload Requirement
- [ ] Google requires the first APK/AAB to be uploaded manually via the console
- [ ] Subsequent submissions can use `eas submit --platform android`

---

## Pre-Submission Quality Checks

### Content Completeness
- [ ] No placeholder text anywhere in the app ("Lorem ipsum", "TODO", "Coming soon" on main features)
- [ ] All screens have real content or graceful empty states
- [ ] Onboarding flow works end-to-end (signup > email verify > course selection > dashboard)
- [ ] All navigation paths work (no dead-end screens)
- [ ] Error states are handled gracefully (no raw error messages shown to users)

### Security
- [ ] No API keys hardcoded in client code (Supabase URL and anon key in env vars are OK -- they are public by design)
- [ ] Anthropic API key is in Supabase Edge Function, NOT in client code
- [ ] No `.env` file committed to git
- [ ] Supabase RLS is enabled on every table
- [ ] Auth tokens stored in SecureStore (already using expo-secure-store)

### Performance
- [ ] Remove or disable all `console.log` statements in production (use `__DEV__` guard or babel plugin)
- [ ] App launches in under 3 seconds on mid-range devices
- [ ] No jank or dropped frames during flashcard swiping or scrolling
- [ ] Images are optimized (use WebP where possible, compress PNGs)
- [ ] Bundle size is reasonable (check with `npx expo export` and review output)

### Device Compatibility
- [ ] Test on iPhone SE (3rd gen) -- smallest supported screen (4.7")
- [ ] Test on iPhone 15 Pro Max -- largest screen
- [ ] Test on iPad (if `supportsTablet: true`)
- [ ] Test on Android device with small screen (360dp width)
- [ ] Safe area insets respected (no content hidden behind notch/Dynamic Island/home indicator)

### Accessibility
- [ ] VoiceOver (iOS) reads all interactive elements correctly
- [ ] TalkBack (Android) reads all interactive elements correctly
- [ ] All buttons have accessible labels
- [ ] Color is not the only indicator of meaning (check color-blind users)
- [ ] Text scales properly with system Dynamic Type / font size settings
- [ ] Touch targets are at least 44x44pt (Apple HIG requirement)

### Dark Mode
- [ ] App respects system dark mode setting (`userInterfaceStyle: "automatic"` is set)
- [ ] All screens are readable in dark mode
- [ ] No white flashes during screen transitions in dark mode
- [ ] Cards, borders, and text have adequate contrast in dark mode

### External Links
- [ ] Privacy policy link opens in in-app browser (expo-web-browser)
- [ ] Terms of service link opens in in-app browser
- [ ] Any external links (Anthropic privacy policy, etc.) open in in-app browser
- [ ] No links to competing app stores (Apple rejects this)

### Offline Behavior
- [ ] App launches without network (show cached content or graceful offline message)
- [ ] Flashcard reviews work offline if cards were previously loaded
- [ ] AI tutor shows clear "No internet connection" message when offline
- [ ] Practice questions work offline if previously cached
- [ ] App does not crash when network is lost mid-request

### Legal / Disclaimers
- [ ] DisclaimerBanner component is shown on AI tutor responses
- [ ] DrugDisclaimer component is shown on drug card screens
- [ ] Privacy policy is accessible from the app (Settings / Profile)
- [ ] Terms of service are accessible from the app
- [ ] Account deletion is available from within the app (Apple requirement since 2022)

---

## Common Rejection Reasons to Pre-Check

### 1. "Your app requires account creation but does not explain why"
**Fix:** Add a brief note on the login screen explaining why sign-in is needed ("Sign in to save your study progress and sync across devices"). Also include this in the App Review notes.

### 2. "Your app uses a login but does not offer account deletion"
**Fix:** Account deletion must be available within the app. Add "Delete Account" option in Profile/Settings. This has been required since June 2022.

### 3. "Your app uses third-party AI services without disclosure"
**Fix:** Disclose AI usage clearly. The DisclaimerBanner component handles this in the UI. Also mention it in the app description and App Review notes. As of November 2025, Apple requires explicit disclosure and consent when personal data is shared with third-party AI services.

### 4. "We noticed your app's medical content..."
**Fix:** Pioneer Nurse is an educational study tool, not a medical/diagnostic app. Make this clear in App Review notes, in the app description, and through in-app disclaimers. The primary category should be Education, not Medical.

### 5. "Your app does not have enough content to justify a standalone app"
**Fix:** Ensure the app has substantive content at launch -- populated drug cards, practice questions, functional AI tutor, working flashcards. An empty shell will be rejected.

### 6. "Placeholder content found"
**Fix:** Search entire codebase for "TODO", "Lorem", "placeholder", "coming soon", "TBD". Remove or replace all instances.

### 7. "Broken links or features"
**Fix:** Test every button, link, and navigation path. Apple testers are thorough.

### 8. "Privacy policy is missing or incomplete"
**Fix:** Privacy policy must be hosted at a public URL and linked in both App Store Connect and within the app. It must cover all data collection including third-party services (Anthropic API).

### 9. "App crashes on launch or during use"
**Fix:** Test on multiple devices and iOS versions. Run through the entire onboarding flow. Test with poor network conditions. Test logging in with an account that has no data yet (empty state).

### 10. "The app's export compliance information is missing"
**Fix:** In app.json, set `expo.ios.config.usesNonExemptEncryption: false`. Pioneer Nurse uses only standard HTTPS (which is exempt from US export regulations). This prevents the export compliance popup on every TestFlight upload.

---

## Build and Submit Commands

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Configure EAS (if not already done)
eas build:configure

# Build for iOS (production)
eas build --platform ios --profile production

# Build for Android (production)
eas build --platform android --profile production

# Submit to App Store (after build completes)
eas submit --platform ios

# Submit to Google Play (after first manual upload)
eas submit --platform android

# Build and submit in one step
eas build --platform ios --profile production --auto-submit
```

---

## Post-Submission

- [ ] Monitor App Store Connect for review status updates
- [ ] Typical iOS review time: 24-48 hours
- [ ] Typical Google Play review time: A few hours to 3 days
- [ ] If rejected, read the rejection reason carefully, fix the issue, and resubmit
- [ ] After approval, set the release date (manual release or automatic)
- [ ] Verify the app appears in search results with correct metadata
- [ ] Download from the store and test the production build end-to-end
