# TOURMS AGRO-SOLUTIONS — IMPLEMENTATION NOTES (IMPLEMENTATION_NOTES.md)

## 1. Technical Architecture & Decisions

- **Framework:** React 19 SPA running on Vite 8 with TypeScript.
- **Styling:** Tailwind CSS v4 with custom brand tokens in `@theme` (`src/index.css`):
  - `--color-tourms-charcoal: #0F1F1C`
  - `--color-tourms-green: #0E5A46`
  - `--color-tourms-ivory: #F7F7EE`
  - `--color-tourms-amber: #C98A3A`
  - `--color-tourms-amber-accessible: #8E5A18`
- **Typography:** Google Fonts: `Montserrat` (Headings/Display), `Inter` (Body & Forms), `JetBrains Mono` (Tabular data).
- **Icons:** `lucide-react` (semantic, lightweight SVGs).
- **State Management:** React hooks with persistent in-memory models across roles and views, allowing fluid testing of applications, posting flows, and review decisions.

---

## 2. Reviewer Persona Switcher & Canonical Screen Jumper

To enable immediate inspection of all 24 principal screens without cumbersome manual account recreation:
- The top utility `RoleBar` features:
  - Role toggles: **Public Visitor**, **Worker Profile**, **Employer Workspace**, **Admin Operational Console**.
  - Admin sub-role switcher: Super Admin, Operations, Verification, Editorial, Support, Analyst.
  - Direct Screen Jumper dropdown indexing all 24 canonical screens (e.g. Screen 01 Home, Screen 06 Job Detail Mobile, Screen 11 Post a Job Step 1, Screen 16 Admin Dashboard, Screen 18 Admin Job Review).
  - State Specimens Drawer trigger for isolated loading, empty, and validation inspections.

---

## 3. Mathematical Consistency in Job-Posting Flow

The previous audit noted a mismatch between a "STEP 1 OF 6" label and 7 actual stages.
In our implementation:
- The 6 input stages plus Review are structured into exactly 7 stages:
  1. Role Identity & Category
  2. Role Description & Key Responsibilities
  3. Required Skills & Capabilities
  4. Eligibility & Qualifications (Essential vs Desirable)
  5. Location, Schedule & Duration
  6. Compensation & Terms
  7. Final Review & Submit for Review
- The progress indicator dynamically displays `Step X of 7: [Stage Name]` with an exact `(currentStep / 7) * 100%` width progress bar, resolving the mathematical mismatch.
- The terminal action is strictly `SUBMIT FOR REVIEW` (never Publish), in full compliance with Tourms verification rules.
