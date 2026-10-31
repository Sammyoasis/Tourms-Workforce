# TOURMS AGRO-SOLUTIONS — INTERACTION & STATE SPECIFICATION (INTERACTION_SPEC.md)

## 1. Interaction Principles & State Architecture

In compliance with Section 10 of the Master Project Prompt, the interface is architected around complete interaction cycles, not merely static happy paths.

### Documented State Behaviors:

1. **Initial State:**
   - Default search and filter inputs pre-populated with neutral fallbacks ("All Sectors", "All States").
2. **Populated State:**
   - Cards and tables populated with verified demonstration records, tabular figures, and full metadata.
3. **Empty State:**
   - When query or state filters yield zero matches, an `EmptyState` card explains the condition and provides a "Reset Search Filters" action.
4. **Loading State:**
   - Shimmer skeleton loaders matching card heights prevent layout shift (CLS < 0.05).
5. **Validation State:**
   - Instant visual and text feedback on required inputs; high-contrast red boundary ring and error message below the field.
6. **Confirmation State:**
   - Consequential operations (submitting an application, publishing a profile, recording CAC rejection) invoke confirmation notifications and modals.
7. **Permission-Restricted State:**
   - Admin RBAC enforces clearances (e.g., Editorial role attempting CAC verification triggers an access restriction card with audit code).
8. **Expired / Closed State:**
   - Positions past deadline display a muted "Closed" tag, preventing invalid application submissions.

---

## 2. Isolated State Specimen Inspection (`StateSpecimenDrawer`)

To prevent polluting the public user journey with contradictory error or loading specimens:
- Reference states are encapsulated inside an interactive drawer accessible from both the top `RoleBar` and the `Footer` ("Interaction States").
- Reviewers can independently inspect:
  - Job Listing Skeleton Loader
  - Admin Review Queue Table Skeleton
  - Filter Mismatch Empty State
  - Employer Zero-Jobs Workspace
  - Form Validation Error Specimens
  - Network Failure & Local Cache Recovery
  - Expired Job Listing
  - RBAC Permission Restriction
  - Application Submission Confirmation
