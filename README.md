# TOURMS AGRO-SOLUTIONS

> **AGRICULTURE, CONNECTED BETTER.**  
> Work, opportunity and knowledge for the people and businesses shaping agriculture.  
> **Master Brand:** TOURMS — *Same sound, different frequency.*

---

## Overview

TOURMS AGRO-SOLUTIONS is an agricultural workforce, opportunity, and knowledge platform built for Nigeria-first deployment and designed for long-term scalability across Africa.

This repository implements the complete product architecture across 24 canonical screens, covering:
1. **Public Experience:** Home (Desktop & Mobile), Jobs (Tourms Workforce), Job Details (with persistent mobile apply action), Opportunities, Insights, and About.
2. **Worker Experience:** Progressive 8-stage Onboarding and Capability-First Worker Profiles.
3. **Employer Experience:** Task-first Employer Dashboard and mathematically consistent 7-stage Job Posting Flow.
4. **Administration Console:** 8 operational consoles covering Review Queues, Employer CAC Verification, Worker Management, Moderation, and Role Permissions.

---

## Key Features & UX Innovations

- **Zero-Pill Metadata Discipline:** Unboxed, clean typography with subtle separators (`·`), avoiding generic AI candy-capsule slop.
- **Mobile Usability Fix (Screen 06):** Resolved the 2,420px mobile apply distance defect via a persistent, safe-area-aware mobile apply drawer.
- **Mathematical Posting Flow (Screens 11–15):** Consistent 7-stage progress indicator (`Step X of 7`) ending with `SUBMIT FOR REVIEW`.
- **Complete Nigerian Geographic Localization:** Real data support for all 36 States + Federal Capital Territory (FCT) and representative LGAs.
- **WCAG 2.2 Level AA Compliance:** Calibrated contrast scores, 44px minimum touch targets, and non-color-alone state signaling.
- **Interactive Review Switcher:** Top bar lets you jump directly to any of the 24 screens or toggle between Public, Worker, Employer, and Admin roles.
- **Isolated State Specimens:** Dedicated drawer to inspect loading skeletons, empty states, validation errors, and permission restrictions.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open `http://localhost:3000` to interact with the application.

### Build & Lint
```bash
npm run build
npm run lint
```

---

## Architectural Documentation

- [`DESIGN.md`](./DESIGN.md) — Visual identity, color palette, typography scale, anti-slop rules.
- [`PRODUCT_SPEC.md`](./PRODUCT_SPEC.md) — Product vision, V1 boundaries, user roles matrix.
- [`SCREEN_INVENTORY.md`](./SCREEN_INVENTORY.md) — Detailed specifications for all 24 canonical screens.
- [`COMPONENTS.md`](./COMPONENTS.md) — Design system primitives and UI components.
- [`INTERACTION_SPEC.md`](./INTERACTION_SPEC.md) — Interaction states and specimen viewer.
- [`RESPONSIVE_SPEC.md`](./RESPONSIVE_SPEC.md) — Breakpoint behaviors and mobile safe areas.
- [`ACCESSIBILITY_AUDIT.md`](./ACCESSIBILITY_AUDIT.md) — WCAG 2.2 AA audit scores and contrast verifications.
- [`IMPLEMENTATION_NOTES.md`](./IMPLEMENTATION_NOTES.md) — Technical decisions, resolved inconsistencies.

---

© TOURMS AGRO-SOLUTIONS. Same sound, different frequency.
