# System Design: Structural Blueprint

This document establishes a non-chromatic structural framework for building high-performance, calm, and professional web applications. It synthesizes the architectural logic of industry leaders—Google, Apple, OpenAI, Claude, and Linear—into a definitive set of rules for spatial grids, typographic hierarchies, depth models, and geometric continuity.

---

## 1. Spatial Engine: The 8-Point Grid System

A professional interface is defined by mathematical consistency. To ensure visual rhythm and reduce cognitive load, all layouts must be governed by an **8-pixel base unit**, with a 4-pixel "half-unit" reserved for fine-tuning compact components.

### Core Spacing Scale

Spacing values should always be multiples of the base unit to maintain a harmonious relationship between elements.

| Token | Pixels | Application |
| :--- | :--- | :--- |
| `space-2xs` | 4px | Internal icon padding; text-to-icon gaps |
| `space-xs` | 8px | Button internal padding; list item vertical gap |
| `space-sm` | 12px | Spacing between related input fields |
| `space-md` | 16px | Default component internal padding; card gutters |
| `space-lg` | 24px | Spacing between sections or major groups |
| `space-xl` | 32px | Page margins; header-to-content separation |
| `space-2xl` | 48px | Significant layout breaks; hero section margins |

> [!IMPORTANT]
> **Layout Constraints**
> - **Max Content Width**: Limit text-heavy containers to $560px - 640px$ to ensure optimal line lengths (45–75 characters).
> - **Logical Properties**: Use `margin-block` and `padding-inline` (CSS logical properties) to ensure future-proofing for internationalization.
> - **Touch Targets**: Interactive elements must maintain a minimum hit target of $44 \times 44pt$ ($48 \times 48px$ recommended) with $8px$ of separation.

---

## 2. Typographic Hierarchy and Voice

Typography must establish a clear hierarchy that guides the user through the content without relying on color. Professional systems utilize a modular scale to ensure consistency across all screen sizes.

### Type Scale Roles

| Role | Size | Line Height | Use Case |
| :--- | :--- | :--- | :--- |
| **Display** | 57px+ | 1.1 - 1.2 | Impactful hero text; major headlines |
| **Headline** | 24px - 32px | 1.2 - 1.25 | Section headers; dashboard titles |
| **Title** | 16px - 22px | 1.3 - 1.4 | Component headers; card titles |
| **Body** | 14px - 16px | 1.5 - 1.6 | Standard prose; message content |
| **Label** | 11px - 12px | 1.4 - 1.45 | Metadata; captions; button labels |

### Rules for Vertical Rhythm
- **Contrast Pairing**: Use a high-quality serif for long-form content (intellectual depth) and a precise sans-serif for UI controls and navigation.
- **Line Height Calculation**: Line heights should be rounded to the nearest 4px. Use a 1.5 ratio for body copy to prevent visual fatigue.
- **Hierarchy**: Adjust font weight and size rather than color to emphasize important information.

---

## 3. Depth and Physics: The Elevation Model

Elevation communicates the relationship between surfaces on the z-axis. Depth should be used functionally to direct attention rather than decoratively.

### Elevation Levels

| Level | Value | Primary Component | Interaction State |
| :--- | :--- | :--- | :--- |
| **0** | 0dp | Main background surface | Base / Resting |
| **1** | 1dp | Card containers; sidebars | Resting |
| **2** | 3dp | Buttons; search bars; chips | Resting |
| **3** | 6dp | Floating Action Buttons (FABs) | Resting |
| **4** | 8dp | Active components | Hover / Focus |
| **5** | 12dp | Modals; dialogs; dragged items | Dominant |

### Shadow Architecture

To achieve realistic depth, avoid single "muddy" shadows. Instead, layer two distinct shadows:
1. **Key-light Shadow**: Defines the direction of the light source (higher offset).
2. **Ambient Shadow**: Defines the intensity and distance (lower offset, higher blur).

```css
:root {
  --shadow-professional: 
    0 1px 3px rgba(0,0,0,0.1), /* Key-light */
    0 1px 2px rgba(0,0,0,0.06); /* Ambient */
}
```

---

## 4. Geometric Continuity: Corner Radii

The curvature of an element dictates the "vibe" of the interface. Small radii ($2px-4px$) feel formal and technical; moderate radii ($8px-12px$) feel modern and friendly.

### Consistent Radius Scale
- **XS (4px)**: Input fields, small tags, tooltips.
- **S (8px)**: Standard buttons, dropdown menus.
- **M (12px)**: Content cards, notification banners.
- **L (16px)**: Floating panels, sidebars.
- **XL (28px+)**: Modals, hero elements.

> [!TIP]
> **The Concentric Radius Formula**
> To maintain geometric harmony when nesting components (e.g., a button inside a card), the radii must be perfectly concentric.
> $$R_{outer} = R_{inner} + \text{Padding}$$
> *Example: If a card has $16px$ of padding and contains a button with an $8px$ radius, the card's border-radius must be $24px$.*

---

## 5. Interaction Mechanics and Momentum

A calm UI responds predictably and minimizes "work around work".

### Feedback Thresholds

| Time Gap | Required UI Feedback | Perceived Speed |
| :--- | :--- | :--- |
| **< 100ms** | Instant state change; no animation | Simultaneous |
| **100ms - 1s** | Smooth micro-animation (e.g., slide/fade) | Connected Action |
| **1s - 10s** | Indeterminate loader (shimmer effect) | System Working |
| **10s - 60s** | Determinate progress bar with % | Long-running Task |

### Principles of Momentum
- **Single Action, Single Outcome**: Limit cards to a maximum of two actions to prevent choice paralysis.
- **No Nested Scrolling**: Containers must auto-fit their content to avoid dual scrollbars within the same viewport.
- **Progressive Disclosure**: Hide complex settings or secondary information until explicitly requested.

---

## 6. Synthesis for Agent Implementation

Enforce these three non-negotiable structural rules:

1. **Strict Grid**: All widths, heights, margins, and paddings must come from the defined spacing scale (multiples of 8px).
2. **Mathematical Harmony**: All nested border-radii must follow the $R_{outer} = R_{inner} + P$ formula.
3. **Elevation Logic**: Use elevation levels (0–5) to manage focus. Higher elevation implies higher priority.