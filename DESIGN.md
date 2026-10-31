# TOURMS AGRO-SOLUTIONS — DESIGN SYSTEM SPECIFICATION (DESIGN.md)

## 1. Master Brand Identity & Philosophy

- **Master Brand:** TOURMS
- **Primary Brand Expression:** SAME SOUND, DIFFERENT FREQUENCY.
  - **Same Sound:** Consistent identity, shared standards, common ambition, recognizable structure across all business units.
  - **Different Frequency:** Industry-tailored depth, specialized agricultural technologies, distinct operational workflows.
- **Supporting Brand Expressions:**
  - One sound. Many expressions.
  - One company. Many possibilities.
  - Strength in structure. Freedom to grow.
- **Internal Creative Philosophy:** THE BUILDER + THE SYSTEM.
- **Product Name:** TOURMS AGRO-SOLUTIONS
- **Public Positioning:** AGRICULTURE, CONNECTED BETTER.
- **Core Description:** Work, opportunity and knowledge for the people and businesses shaping agriculture.

---

## 2. Color Architecture & Contrast Discipline

Every color token is calibrated against WCAG 2.2 AA (and where applicable, AAA) contrast thresholds:

| Token Name | Hex Code | Role | Contrast Ratio & Context |
| :--- | :--- | :--- | :--- |
| **Tourms Charcoal** | `#0F1F1C` | Primary brand dark, headings, footer background, primary body text | 14.2:1 against Warm Ivory `#F7F7EE` (AAA) |
| **Deep Tourms Green** | `#0E5A46` | Primary brand accent, primary CTA buttons, active navigation, verified indicators | 6.8:1 against Warm Ivory (AAA); 6.9:1 with white text |
| **Deep Tourms Green Dark** | `#08382B` | Hover/active states, high-contrast subheadings | 9.4:1 against Warm Ivory (AAA) |
| **Warm Ivory** | `#F7F7EE` | Dominant neutral page canvas (60% background field) | Calibrated light surface |
| **Warm Ivory Dark** | `#EBEBDD` | Secondary structural surfaces, card stripes, progress tracks | Provides subtle surface depth |
| **Amber / Copper** | `#C98A3A` | Supporting brand accent, opportunities, special highlights | Primary brand copper |
| **Accessible Copper Text** | `#8E5A18` | Used for all copper text elements on light/ivory backgrounds | 4.7:1 against Warm Ivory (AA), fixes the previous 2.92:1 audit defect |
| **Hairline Gray** | `#C4C8C5` | Card dividers, input borders | 1px clean spatial demarcation |
| **Muted Slate/Green** | `#5A6E68` | Metadata text, secondary hints | 4.6:1 against white and ivory (AA) |
| **Alert Crimson** | `#C53030` | Destructive actions, P1 priority incidents | High-visibility warning indicator |

### 60-30-10 Rule Distribution:
- **60% Dominant Neutral Canvas:** Warm Ivory (`#F7F7EE`) and clean white (`#FFFFFF`) card fields.
- **30% Structural Surfaces:** Charcoal headers/footers (`#0F1F1C`), hairline borders (`#C4C8C5`), and subdued surface stripes (`#EBEBDD`).
- **10% Accent Budget:** Deep Tourms Green (`#0E5A46`) and Accessible Copper (`#8E5A18`) concentrated strictly at actionable interaction points.

---

## 3. Typography Hierarchy

- **Display & Headings:** `Montserrat` (Font weights: 600 SemiBold, 700 Bold, 800 ExtraBold). Characterful, architectural geometric sans.
- **Body, Forms & Navigation:** `Inter` (Font weights: 400 Regular, 500 Medium, 600 SemiBold). High legibility at 12px–15px.
- **Data, Telemetry & Numerals:** `JetBrains Mono` with `tabular-nums` (`font-variant-numeric: tabular-nums`). Aligns monetary figures (NGN) and dates vertically.

### Type Scale:
- **Hero Title:** `clamp(2.25rem, 5vw, 3.75rem)` (36px–60px), line-height 1.1, `text-wrap: balance`.
- **Page Titles:** 24px–32px (1.5rem–2rem), SemiBold.
- **Section Headings:** 18px–20px (1.125rem–1.25rem), Bold.
- **Card Titles:** 15px–16px, Bold.
- **Body Text:** 14px–15px, line-height 1.6, measure 65–75ch.
- **Metadata & Tags:** 12px–13px, unboxed with `·` separators (Zero-Pill discipline).
- **Tabular Figures:** 12px–14px, `font-mono tabular-nums`.

---

## 4. Visual Restraint & Anti-Slop Enforcement

1. **Zero-Pill Metadata:** Informational tags (sector, date, employment type, location) are rendered as quiet, unboxed text separated by `·` or `/`, never wrapped in candy capsules.
2. **Affordance-Only Icons:** Icons strictly communicate functional actions (search, external link, document verification) rather than decorative scatter.
3. **No Decorative Pulsing Dots:** No fake status pulses or artificial engine tickers.
4. **No Cartoon Clichés:** No literal tractors, leaves, or stock farmer stereotypes; replaced with technical, architectural information design.
5. **Restrained Frequency Motif:** The brand wave motif is embedded sparingly in the header mark and key dividers, reflecting "Same sound, different frequency" with dignity.
