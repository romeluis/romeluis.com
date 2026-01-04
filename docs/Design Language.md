# Design Language

## Introduction

This document defines the complete design language for the frontend. All components and pages must strictly adhere to the styles specified in this document. Colors and typography should be implemented using the globally defined CSS variables in `global.css`.

---

## Color Palette

### UI Colors

| Name | Hex Code | Purpose |
|------|----------|---------|
| UI White | `#ffffff` | Primary background, text on dark surfaces |
| UI Light 1 | `#e2e2e2` | Secondary backgrounds, subtle borders |
| UI Light 2 | `#afafaf` | Tertiary backgrounds, disabled states |
| UI Black | `#120e14` | Primary text, dark backgrounds |

### Accent Colors

The following colors are used decoratively throughout the interface to add visual interest and hierarchy:

| Name | Hex Code |
|------|----------|
| Green | `#91bf4b` |
| Yellow | `#ffd05d` |
| Orange | `#f26a2d` |
| Pink | `#f96ba4` |
| Blue | `#02a6ff` |

---

## Typography

**Typeface:** Neue Montreal (Bold & Regular)

| Style | Size | Weight | Usage |
|-------|------|--------|-------|
| Hero | 55pt | Bold | Page headings, hero sections |
| Title | 28pt | Regular | Section headings, card titles |
| Body | 18pt | Regular | Paragraphs, general content |
| Note | 12pt | Regular | Captions, footnotes, metadata |

### Links

All text links should be **underlined** to maintain clear affordance.

---

## Layout & Spacing

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight spacing, icon padding |
| sm | 8px | Small gaps between related elements |
| md | 16px | Default spacing, content padding |
| lg | 24px | Section spacing, card padding |
| xl | 32px | Large gaps between sections |
| 2xl | 48px | Extra large spacing, page margins |
| 3xl | 64px | Maximum spacing, hero sections |

---

## Borders & Corners

### Borders

All borders should be **2pt** in width.

### Corner Shapes

The design system uses two distinct corner treatments:

#### Rounded Corners (Primary)

**Value:** `40px` border-radius

Standard rounded corners for a clean, modern aesthetic.

**Usage:**
- Cards and containers
- Buttons and interactive elements
- Modal dialogs and panels

#### Pill Shape (Secondary)

**Value:** `9999px` border-radius

True pill shapes with fully rounded ends, perfect for:
- Tags and badges
- Pill-style buttons
- Status indicators
- Chip components

**Note:** The `9999px` value ensures consistent pill shapes regardless of element dimensions, unlike `100%` which creates ovals on non-square elements.
