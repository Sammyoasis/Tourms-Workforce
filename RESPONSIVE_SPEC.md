# TOURMS AGRO-SOLUTIONS — RESPONSIVE DESIGN SPECIFICATION (RESPONSIVE_SPEC.md)

## 1. Breakpoints & Viewport Testing Grid

Tourms Agro-Solutions is a **Nigeria-first platform**, designed to perform reliably on entry-level Android smartphones, standard mobile browsers, tablets, and full desktop workstations.

| Breakpoint | Target Devices | Layout Behavior & Design Adjustments |
| :--- | :--- | :--- |
| **360px** | Compact Android (Tecno, Infinix, itel) | Single-column cards, 44px min touch targets, zero horizontal overflow, compact 1-line top `RoleBar` with expand toggle, persistent bottom apply bar capped at 12% viewport height. |
| **390px** | Standard Modern Smartphone (iPhone 12–15) | Optimized line lengths, 14px–16px container padding, bottom sheet filters (`BottomSheet`), smooth touch drawer. |
| **430px** | Large Mobile (Pro Max / Plus devices) | Fluid font scaling, responsive card grids, touch-friendly form buttons. |
| **768px** | Tablets & Foldables (iPad Mini / Portrait) | 2-column grid adaptation, visible sub-menus, table scrolling containers with horizontal touch swipe. |
| **1024px** | Laptops / Tablets Landscape | 3-column opportunities grid, persistent sidebar in admin console. |
| **1280px** | Standard Desktop Baseline | Full 4-column filter sidebar on jobs page, spacious reading rhythm. |
| **1440px+** | High-Resolution Desktop Displays | 1440px maximum content constraint, centered container alignment, zero layout jitter. |

---

## 2. High-Priority Usability Solution: Screen 06 Persistent Mobile Apply Bar

### Previous Defect:
In the initial mobile audit, application controls were located approximately 2,420px down the page, requiring extensive scrolling and causing applicant drop-off.

### Production Solution Implemented:
- A persistent bottom action bar is affixed to the mobile viewport (`md:hidden`).
- Respects CSS safe areas via `padding-bottom: max(0.75rem, env(safe-area-inset-bottom))`.
- Displays truncated job title, monthly compensation (`tabular-nums`), and an immediate `Apply Now` button.
- Clicking triggers the accessible application modal without requiring vertical navigation.
- Body container adds `pb-28 md:pb-16` padding on mobile, preventing sticky controls from obscuring content.

---

## 3. Mobile Optimization Review & Brand Integration

1. **Brand Symbol & Lockup:**
   - Implemented the official Tourms Master Symbol (angled parallelogram top crossbar in green, left deep green pillar, right amber/copper pillar).
   - Embedded the brand's signature **Frequency Graphic System** (`TourmsFrequencyRhythm`) across mobile drawers and footer sections.
2. **Reviewer Toolbar (`RoleBar`):**
   - On mobile screens (`< sm`), collapses into a sleek 1-line strip showing the active persona and a direct screen selector dropdown, with an expand toggle for full persona switching.
3. **Admin Console Navigation:**
   - On mobile viewports, the admin sidebar collapses into a compact header strip with a dropdown drawer for switching queues without page clutter.
4. **Touch Target Enforcement:**
   - All interactive controls (hamburger menu, filter triggers, apply buttons, select carets) enforce $\ge 44\text{px}$ touch zones.
