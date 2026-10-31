# TOURMS AGRO-SOLUTIONS — SCREEN & ROUTE INVENTORY (SCREEN_INVENTORY.md)

This document catalogs the 24 canonical screens established in the product architecture, their route mapping, core question, and responsive execution.

---

## Group A: Public Experience

### Screen 01 — Home Desktop
- **Route:** `/`
- **Hero:** AGRICULTURE, CONNECTED BETTER.
- **Purpose:** Communicate product purpose within 5 seconds; 3 prominent entry points (Find Jobs, Explore Opportunities, Read Insights); architectural value strip; verified listings previews.
- **Container Baseline:** 1440px viewport, max-w-7xl inner container.

### Screen 02 — Home Mobile
- **Route:** `/?mobile=1`
- **Purpose:** First-class mobile viewport adaptation with preserved vertical rhythm, uncompromised typography, and full footer.

### Screen 03 — Jobs Desktop (Tourms Workforce)
- **Route:** `/jobs`
- **Hero:** FIND WORK IN AGRICULTURE.
- **Purpose:** Nationwide employment discovery; multi-faceted sidebar filters (36 States + FCT, LGAs, Categories, Employment Type, CAC Verified); clean unboxed listing cards.

### Screen 04 — Jobs Mobile
- **Route:** `/jobs?mobile=1`
- **Purpose:** Mobile search with accessible filter bottom sheet (`BottomSheet`), touch targets $\ge 44\text{px}$, and seamless thumb pagination.

### Screen 05 — Job Detail Desktop
- **Route:** `/jobs/:jobId`
- **Purpose:** Answers the 5 core user questions (What is the role? Is it suitable? What will I receive? What do I need to do? How do I apply?). Detailed compensation, responsibilities, essential vs desirable requirements.

### Screen 06 — Job Detail Mobile
- **Route:** `/jobs/:jobId?mobile=1`
- **High-Priority Fix:** Solves the 2,420px mobile apply distance defect by rendering a persistent safe-area bottom action bar containing job title, monthly compensation, and instant "Apply Now" trigger.

---

## Group B: Worker Experience

### Screen 07 — Worker Onboarding
- **Route:** `/worker/onboarding`
- **Purpose:** Progressive 8-stage onboarding flow (Identity, Location, Capabilities, Education, Experience, Certifications, Availability, Review).
- **Core Distinction:** Explicit separation between self-reported entries and verified institutional documents.

### Screen 08 — Worker Profile Desktop
- **Route:** `/worker/profile`
- **Core Question:** WHAT CAN THIS PERSON ACTUALLY DO?
- **Purpose:** Capability-first layout prioritizing verified operational competencies, tractor/implement calibration, and IPM achievements over decorative statistics.

### Screen 09 — Worker Profile Mobile
- **Route:** `/worker/profile?mobile=1`
- **Purpose:** Touch-optimized mobile capability card deck with rapid credentials inspection.

---

## Group C: Employer Experience

### Screen 10 — Employer Dashboard Desktop
- **Route:** `/employer`
- **Core Question:** WHAT NEEDS MY ATTENTION?
- **Purpose:** Task-first operational workspace displaying candidate application queues, active listings, and CAC verification standing. No decorative CRM vanity charts.

### Screen 11 — Post a Job: Step 1
- **Route:** `/employer/post-job?step=1`
- **Stage:** Role Identity & Sector Classification.

### Screen 12 — Post a Job: Step 2
- **Route:** `/employer/post-job?step=2`
- **Stage:** Role Description & Field Responsibilities.

### Screen 13 — Post a Job: Step 3
- **Route:** `/employer/post-job?step=3`
- **Stage:** Required Skills & Technical Capabilities.

### Screen 14 — Post a Job: Step 4
- **Route:** `/employer/post-job?step=4`
- **Stage:** Eligibility & Qualifications (Essential vs Desirable).

### Screen 14b — Post a Job: Step 5
- **Route:** `/employer/post-job?step=5`
- **Stage:** Location (State, LGA, Farm Address), Timing & Duration.

### Screen 14c — Post a Job: Step 6
- **Route:** `/employer/post-job?step=6`
- **Stage:** Remuneration & Compensation Structure (NGN currency, frequency, notes).

### Screen 15 — Post a Job: Step 7 (Review)
- **Route:** `/employer/post-job?step=7`
- **Mathematical Consistency:** Mathematically consistent 7-stage progress indicator (`Step 7 of 7: Review & Submit for Review`).
- **Primary Action:** `SUBMIT FOR REVIEW` (never Publish).

---

## Group D: Administration Console

### Screen 16 — Admin Dashboard
- **Route:** `/admin`
- **Core Question:** WHAT NEEDS TOURMS' ATTENTION RIGHT NOW?
- **Purpose:** Operational priority queues for jobs, CAC audits, moderation alerts, and funding opportunities.

### Screen 17 — Admin Jobs Review Queue
- **Route:** `/admin/jobs-queue`
- **Purpose:** Filterable data table of submitted job requirements pending verification.

### Screen 18 — Admin Job Review & Approval
- **Route:** `/admin/job-review/:jobId`
- **Purpose:** Comprehensive compliance audit; checklist verification; explicit actions (Approve, Request Changes, Reject, Return for Clarification) with mandatory audit notes.

### Screen 19 — Admin Employer Verification
- **Route:** `/admin/employers`
- **Purpose:** CAC Certificate of Incorporation audit, Land Title (C of O) validation, and corporate decision logging.

### Screen 20 — Admin Worker Management
- **Route:** `/admin/workers`
- **Purpose:** Auditing worker capabilities, institutional credentials (NASC, IITA), and privacy safeguards.

### Screen 21 — Admin Opportunities Review
- **Route:** `/admin/opportunities-review`
- **Purpose:** Lifecycle management: SUBMITTED → VERIFIED → PUBLISHED → EXPIRED.

### Screen 22 — Admin Insights / Content Management
- **Route:** `/admin/content`
- **Purpose:** Editorial lifecycle: DRAFT → IN REVIEW → APPROVED → SCHEDULED/PUBLISHED → ARCHIVED.

### Screen 23 — Admin Reports & Moderation
- **Route:** `/admin/reports`
- **Purpose:** Incident response queue with Severity, Priority (P1/P2/P3), Assigned Investigator, and Enforcement audit trails.

### Screen 24 — Admin Users & Roles
- **Route:** `/admin/users`
- **Purpose:** Role-Based Access Control (RBAC) across Super Admin, Operations, Verification, Editorial, Support, and Analyst.
