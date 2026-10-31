# TOURMS AGRO-SOLUTIONS — PRODUCT SPECIFICATION (PRODUCT_SPEC.md)

## 1. Product Scope & Vision

TOURMS AGRO-SOLUTIONS is an agricultural workforce, opportunity, and knowledge platform built for Nigeria first, with an extensible architecture capable of supporting Pan-African deployment.

### Core Value Proposition:
- **Workforce Infrastructure:** Connects employers and commercial farms with people who possess verified agricultural capabilities.
- **Opportunity Pipeline:** Aggregates and vets scholarships, grants, concessionary credit facilities, and professional development calls distinct from jobs.
- **Editorial Knowledge Base:** Provides rigorous, peer-referenced research briefs and agronomic field notes free of fabricated claims.

---

## 2. Active V1 Scope vs. Future Horizons

### Active in V1:
1. **Tourms Workforce (Jobs):**
   - Public job discovery across 10 agricultural categories.
   - Comprehensive Nigerian geographic search (36 States + FCT & all constituent LGAs).
   - Detailed job specifications answering the 5 core user questions.
   - Persistent mobile apply drawer solving the 2,420px mobile scroll distance issue.
2. **Opportunities:**
   - Dedicated listing for non-job programmes (Grants, Loans, Scholarships, Fellowships).
   - Source vetting status and official portal direct links.
3. **Insights:**
   - Technical research briefs with author academic affiliations and verified citations.
4. **Worker Experience:**
   - Progressive 8-step onboarding.
   - Capability-first profile presentation distinguishing self-reported from verified evidence.
5. **Employer Experience:**
   - Operational workspace with real application queues.
   - Mathematically consistent 7-stage posting flow terminating in "Submit for Review".
6. **Administration Console:**
   - 8 specialized operational screens covering review queues, CAC audits, moderation, and role-based access control (RBAC).

### Explicitly Excluded from V1 (Future Horizons):
- *Tourms Academy* (Future horizon, not active).
- *Tourms Farm Management* (Future horizon, not active).
- Produce/commodity marketplaces or equipment auctions.
- Social networks, speculative wallets, crypto tokens, or complex escrow systems.

---

## 3. User Roles & Permission Matrix

| User Role | Key Permissions & Accessible Views |
| :--- | :--- |
| **Public Visitor** | Browse approved jobs, explore verified opportunities, read insights, access About, begin worker/employer registration. |
| **Worker** | Create 8-step capability profile, upload/declare evidence, set availability & state preferences, submit job applications, track application status. |
| **Employer** | Manage organisation profile, complete CAC registration audit, create job requirements via 7-stage wizard, review candidate applications, manage candidate hiring statuses. |
| **Super Admin** | Full access to all operational queues, user role assignment, platform-wide policy enforcement, and audit logs. |
| **Operations** | Jobs review queue processing, dispatching listings, handling urgent staffing issues. |
| **Verification** | Corporate CAC certificate validation, land title review, worker institutional credentials audit. |
| **Editorial** | Insights drafting, peer review, scheduling, opportunity source verification. |
| **Support** | User incident inquiries, ticket resolution. |
| **Analyst** | Telemetry review, queue bottleneck analysis, compliance audit records. |

---

## 4. Nigerian Geographic Localization Architecture

Accommodates all 36 States and the Federal Capital Territory (FCT). Dynamic LGA selection guarantees authentic regional representation without assuming all users operate in Lagos or Ibadan.
