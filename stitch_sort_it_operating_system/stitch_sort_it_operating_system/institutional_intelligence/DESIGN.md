---
name: Institutional Intelligence
colors:
  surface: '#0c160e'
  surface-dim: '#0c160e'
  surface-bright: '#323c33'
  surface-container-lowest: '#071009'
  surface-container-low: '#141e16'
  surface-container: '#18221a'
  surface-container-high: '#222c24'
  surface-container-highest: '#2d372e'
  on-surface: '#dae6d8'
  on-surface-variant: '#b9cbb9'
  inverse-surface: '#dae6d8'
  inverse-on-surface: '#29332a'
  outline: '#849585'
  outline-variant: '#3b4b3d'
  surface-tint: '#00e47a'
  primary: '#f1ffef'
  on-primary: '#00391a'
  primary-container: '#00ff89'
  on-primary-container: '#007139'
  inverse-primary: '#006d37'
  secondary: '#ffb3ad'
  on-secondary: '#680009'
  secondary-container: '#b60119'
  on-secondary-container: '#ffc2bd'
  tertiary: '#fffaf8'
  on-tertiary: '#3d2e00'
  tertiary-container: '#ffdb7a'
  on-tertiary-container: '#795f03'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#60ff9a'
  primary-fixed-dim: '#00e47a'
  on-primary-fixed: '#00210c'
  on-primary-fixed-variant: '#005228'
  secondary-fixed: '#ffdad7'
  secondary-fixed-dim: '#ffb3ad'
  on-secondary-fixed: '#410004'
  on-secondary-fixed-variant: '#930012'
  tertiary-fixed: '#ffe08e'
  tertiary-fixed-dim: '#e5c365'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#584400'
  background: '#0c160e'
  on-background: '#dae6d8'
  surface-variant: '#2d372e'
typography:
  h1:
    fontFamily: Syne
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  body-main:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
  body-strong:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.5'
    letterSpacing: 0em
  data-lg:
    fontFamily: Space Mono
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: -0.02em
  data-sm:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1'
    letterSpacing: 0em
  terminal:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 12px
  margin: 24px
---

## Brand & Style

This design system is built on the philosophy of **Institutional Minimalism**. It communicates cold, surgical precision through high-density layouts and monolithic surfaces. The aesthetic prioritizes information density over white space, evoking the feeling of a high-stakes command center.

The style combines elements of **Corporate Minimalism** and **Technical Brutalism**. It avoids unnecessary ornamentation, relying on strict border hierarchies and monospaced typography to create an atmosphere of controlled restraint and absolute authority. The UI should feel like a high-end physical hardware interface—unyielding, reliable, and profoundly focused.

## Colors

The palette is strictly functional. The **Base Black (#0A0A0A)** serves as the void—the background upon which all intelligence is layered. Surface colors define the monolithic structure, using subtle shifts in dark grays to indicate hierarchy without breaking the dark-mode immersion.

**Signal Green (#00FF89)** is reserved exclusively for intelligence insights, positive deltas, and system "on" states. It should be used sparingly to maintain its impact. **Danger Red (#FF4444)** is utilized for anomalies, critical risks, and negative deltas. All borders follow a rigorous 1px solid hierarchy to define containment zones without the use of shadows.

## Typography

Typography in this design system is a tool for categorization. 
- **Syne** is used for high-level headers, providing a modern, institutional weight.
- **DM Sans** handles the bulk of legible communication, ensuring clarity in descriptions and reports.
- **Space Mono** is the "Financial Intelligence" layer. Every currency, percentage, and raw number must be rendered in Space Mono to distinguish data from prose.
- **JetBrains Mono** is strictly for terminal-style inputs, AI reasoning logs, and system statuses.

All financial numbers should implement `font-variant-numeric: tabular-nums` to ensure perfect vertical alignment in data tables.

## Layout & Spacing

This design system employs a **high-density fluid grid**. Layouts are structured on a 12-column system with tight 12px gutters, allowing for maximum information display on a single screen. 

The spacing rhythm is built on a 4px baseline. Components should be packed tightly to reflect an "Institutional Dashboard" feel. Containers should use `16px` (md) internal padding for general content and `8px` (sm) for dense data readouts. Margin areas are kept at a constant `24px` to frame the central monolithic interface.

## Elevation & Depth

Depth is achieved through **Tonal Layering** and **Border Hierarchy** rather than shadows. In this design system, "higher" elements are represented by lighter surface fills and more prominent border colors.

1.  **Base Layer:** `#0A0A0A` (The canvas).
2.  **Surface Layer:** `#111111` with a `#1E1E1E` border (Standard cards, navigation bars).
3.  **Elevated Layer:** `#1A1A1A` with a `#2A2A2A` border (Modals, popovers, active states).
4.  **Interactive Layer:** Border moves to `#3A3A3A` on hover to indicate tactility.

Avoid all blurs or soft shadows. Transitions between layers must be sharp and definitive.

## Shapes

The shape language is strictly geometric. While the system is predominantly "sharp," subtle rounding is applied to prevent the UI from feeling aggressive. 

**Standard Rounding:**
- **Cards & Containers:** 8px radius for a monolithic, structured appearance.
- **Buttons:** 6px radius, creating a distinct "interactable" shape that is softer than the containers.
- **Inputs:** 4px radius for a more technical, precise feel.

No elements should ever exceed a 10px border radius. Pill-shapes are prohibited.

## Components

**Buttons**
Buttons are flat, using the `Elevated` surface color with a `1px` border. The primary action button uses a `Signal Green` ghost-border or a subtle 10% green tint on background. Text is uppercase `Space Mono` for a technical feel.

**Data Tables**
The core of the platform. Rows are `40px` high with 1px borders at the bottom (`#1E1E1E`). Financial numbers are always right-aligned in `Space Mono`.

**Terminal Inputs**
AI and Command Line inputs use a `#0A0A0A` background with a `JetBrains Mono` typeface. Use a "typewriter" animation for AI-generated text responses.

**Motion & Interaction**
- **Number Rolls:** When financial values update, use a vertical digit roll animation.
- **Transitions:** Use `cubic-bezier(0.2, 1, 0.3, 1)` for all surface transitions—fast, precise, and decelerating.
- **Micro-interactions:** Active states should feel instantaneous. Use a 1px border shift to `Signal Green` to indicate focus or selection.