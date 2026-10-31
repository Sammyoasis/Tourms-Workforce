# TOURMS AGRO-SOLUTIONS — COMPONENT LIBRARY (COMPONENTS.md)

## 1. Design System Primitives (`/src/components/ui/`)

### 1.1 Button (`Button.tsx`)
- **Variants:** `primary` (`#0E5A46`), `secondary` (`#0F1F1C`), `outline` (border `#0E5A46`), `tertiary` (ghost), `destructive` (`#C53030`).
- **Sizes:** `sm` (min 36px), `md` (min 44px - WCAG 2.2 touch target compliant), `lg` (min 48px).
- **Features:** Asynchronous loading spinner, left/right icon slots, visible `:focus-visible` offset ring, disabled states.

### 1.2 Form Controls (`Input.tsx`, `Select.tsx`)
- **Input:** Single-line text, email, phone, number. Includes accessible label, helper text, and high-contrast placeholder text (`#5A6E68`).
- **Textarea:** Multi-line text with dynamic rows and error state styling.
- **SearchField:** Integrated search icon, clear button (`✕`), and live query binding.
- **Select:** Custom SVG caret, accessible native `<select>` element, full keyboard navigability.

### 1.3 Badges & Status Indicators (`Badge.tsx`)
- **StatusIndicator:** Explicit text label coupled with an SVG icon (e.g., `ShieldCheck` for Verified, `Clock` for Awaiting Review, `AlertTriangle` for Unverified). Never relies on hue alone.
- **EvidenceBadge:** Differentiates `institutional_credential`, `verified_document`, and `self_reported` without violating zero-pill discipline.

### 1.4 Modals & Sheets (`Modal.tsx`)
- **Modal:** Accessible desktop/tablet dialog with focus trapping, `Escape` key dismissal, backdrop blur, and aria attributes (`aria-modal="true"`, `aria-labelledby`).
- **BottomSheet:** Mobile-specific bottom drawer for filters and actions with a tactile drag handle, touch targets $\ge 44\text{px}$, and safe-area padding.

### 1.5 Toast Notifications (`Toast.tsx`)
- **ToastProvider & useToast:** Non-intrusive notifications for workflow events (application transmission, review decision logging, profile publishing). Auto-dismiss after 4.5 seconds.

### 1.6 State Specimens (`EmptyState.tsx`, `LoadingSkeleton.tsx`)
- **EmptyState:** Communicates missing records with an explanatory message, contextual icon, and primary recovery action.
- **LoadingSkeletonCard & LoadingSkeletonTable:** Low-latency animated pulse skeletons matching target row/card geometry within 2px.

---

## 2. Navigation & Layout (`/src/components/layout/`)

### 2.1 Header (`Header.tsx`)
- Implements the strict **Top Bar Contract**:
  `[Single-line Brand Wordmark] — [4 Nav Links with hover underline] — [1 Primary Action ("Get Started")]`
- Includes a clean responsive mobile hamburger menu with comfortable touch targets.

### 2.2 RoleBar (`RoleBar.tsx`)
- Administrative & review utility toolbar allowing immediate switching between Public Visitor, Worker, Employer, and Admin (with sub-role selection).
- Provides instant jumping across all 24 canonical screens.

### 2.3 Footer (`Footer.tsx`)
- Full brand expression: "Same sound, different frequency. Agriculture, Connected Better."
- Comprehensive links across destinations, workflows, administration, and specifications.
