# TOURMS AGRO-SOLUTIONS — RESPONSIVE DESIGN SPECIFICATION (RESPONSIVE_SPEC.md)

## 1. Breakpoints & Viewport Testing Grid

Tourms Agro-Solutions is a **Nigeria-first platform**, designed to perform reliably on entry-level Android smartphones, standard mobile browsers, tablets, and full desktop workstations.

| Breakpoint | Target Devices | Layout Behavior & Design Adjustments |
| :--- | :--- | :--- |
| **360px** | Compact Android (Tecno, Infinix, itel) | Single-column cards, 44px min touch targets, horizontal scroll prevention, sticky bottom apply drawer capped at 12% viewport height. |
| **390px** | Standard Modern Smartphone (iPhone 12-15) | Optimized line lengths, 16px container padding, bottom sheet filters. |
| **430px** | Large Mobile (Pro Max / Plus devices) | Fluid font scaling via clamp, spacious button touch pads. |
| **768px** | Tablets & Foldables (iPad Mini / Portrait) | 2-column grid adaptation, visible sub-menus, table scrolling containers. |
| **1024px** | Laptops / Tablets Landscape | 3-column opportunities grid, persistent sidebar in admin console. |
| **1280px** | Standard Desktop Baseline | Full 4-column filter sidebar on jobs page, spacious reading rhythm. |
| **1440px+** | High-Resolution Desktop Displays | 1440px maximum content constraint, centered container alignment, zero layout jitter. |

---

## 2. High-Priority Usability Solution: Screen 06 Persistent Mobile Apply Bar

### Previous Defect:
In the initial mobile audit, application controls were located approximately 2,420px down the page, requiring extensive scrolling and causing drop-off.

### Production Solution Implemented:
- A persistent bottom action bar is affixed to the mobile viewport (`md:hidden`).
- Respects CSS safe areas via `padding-bottom: max(0.75rem, env(safe-area-inset-bottom))`.
- Displays truncated job title, monthly compensation (`tabular-nums`), and an immediate `Apply Now` button.
- Clicking triggers the accessible application modal without requiring vertical navigation.
- Body container adds `pb-28` padding on mobile, preventing sticky controls from obscuring content.
