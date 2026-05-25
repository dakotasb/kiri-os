---
version: alpha
name: "Agent Framework Command Center"
description: "The operating system for autonomous agent teams. Precise, minimal, and engineered for orchestration at scale."
colors:
  # Core palette - Linear-inspired dark mode
  bg-primary: "#0D0D0F"
  bg-secondary: "#151518"
  bg-tertiary: "#1E1E22"
  bg-elevated: "#25252A"
  bg-hover: "#2A2A30"
  bg-active: "#303038"
  
  # Accent colors - Data visualization & status
  accent-primary: "#6E56CF"
  accent-primary-hover: "#7C66D7"
  accent-secondary: "#3ECF8E"
  accent-tertiary: "#F59E0B"
  accent-danger: "#EF4444"
  accent-info: "#3B82F6"
  
  # Semantic status colors
  status-online: "#3ECF8E"
  status-busy: "#F59E0B"
  status-offline: "#6B7280"
  status-error: "#EF4444"
  status-degraded: "#F97316"
  
  # Text colors
  text-primary: "#FAFAFA"
  text-secondary: "#A1A1AA"
  text-tertiary: "#71717A"
  text-muted: "#52525B"
  text-accent: "#6E56CF"
  
  # Border colors
  border-primary: "#27272A"
  border-secondary: "#3F3F46"
  border-accent: "#6E56CF"
  
  # Data visualization gradient
  data-low: "#3ECF8E"
  data-mid: "#F59E0B"
  data-high: "#EF4444"
  data-gradient-start: "#6E56CF"
  data-gradient-end: "#3ECF8E"

typography:
  # Display - Large marketing headings
  display-lg:
    fontFamily: "Inter"
    fontSize: "2.5rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  
  display-md:
    fontFamily: "Inter"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  
  # Headings
  h1:
    fontFamily: "Inter"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  
  h2:
    fontFamily: "Inter"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  
  h3:
    fontFamily: "Inter"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0"
  
  h4:
    fontFamily: "Inter"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0"
  
  # UI text
  body-lg:
    fontFamily: "Inter"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  
  body-md:
    fontFamily: "Inter"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  
  body-sm:
    fontFamily: "Inter"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  
  # Monospace for data/code
  mono-lg:
    fontFamily: "JetBrains Mono"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  
  mono-md:
    fontFamily: "JetBrains Mono"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  
  mono-sm:
    fontFamily: "JetBrains Mono"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  
  # Labels and captions
  label:
    fontFamily: "Inter"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.05em"
    textTransform: "uppercase"
  
  caption:
    fontFamily: "Inter"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0"

spacing:
  "0": "0px"
  xxs: "2px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  "2xl": "24px"
  "3xl": "32px"
  "4xl": "40px"
  "5xl": "48px"
  "6xl": "64px"
  "7xl": "80px"
  "8xl": "96px"

rounded:
  none: "0px"
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  "2xl": "16px"
  full: "9999px"

elevation:
  shadow-sm: "0 1px 2px rgba(0,0,0,0.3)"
  shadow-md: "0 4px 6px -1px rgba(0,0,0,0.4), 0 2px 4px -2px rgba(0,0,0,0.3)"
  shadow-lg: "0 10px 15px -3px rgba(0,0,0,0.5), 0 4px 6px -4px rgba(0,0,0,0.3)"
  shadow-xl: "0 20px 25px -5px rgba(0,0,0,0.6), 0 8px 10px -6px rgba(0,0,0,0.4)"
  glow-primary: "0 0 20px rgba(110, 86, 207, 0.3)"
  glow-success: "0 0 20px rgba(62, 207, 142, 0.3)"
  glow-warning: "0 0 20px rgba(245, 158, 11, 0.3)"
  glow-danger: "0 0 20px rgba(239, 68, 68, 0.3)"

components:
  # Cards
  card:
    backgroundColor: "{colors.bg-secondary}"
    borderColor: "{colors.border-primary}"
    borderWidth: "1px"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
  
  card-hover:
    backgroundColor: "{colors.bg-tertiary}"
    borderColor: "{colors.border-secondary}"
    shadow: "{elevation.shadow-md}"
  
  # Primary button
  button-primary:
    backgroundColor: "{colors.accent-primary}"
    textColor: "#FFFFFF"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    fontWeight: 500
  
  button-primary-hover:
    backgroundColor: "{colors.accent-primary-hover}"
    shadow: "{elevation.glow-primary}"
  
  # Secondary button
  button-secondary:
    backgroundColor: "{colors.bg-tertiary}"
    textColor: "{colors.text-primary}"
    borderColor: "{colors.border-secondary}"
    borderWidth: "1px"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    fontWeight: 500
  
  button-secondary-hover:
    backgroundColor: "{colors.bg-hover}"
    borderColor: "{colors.border-accent}"
  
  # Badge variants
  badge-online:
    backgroundColor: "rgba(62, 207, 142, 0.15)"
    textColor: "{colors.status-online}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  
  badge-busy:
    backgroundColor: "rgba(245, 158, 11, 0.15)"
    textColor: "{colors.status-busy}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  
  badge-error:
    backgroundColor: "rgba(239, 68, 68, 0.15)"
    textColor: "{colors.status-error}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  
  # Input fields
  input:
    backgroundColor: "{colors.bg-tertiary}"
    borderColor: "{colors.border-primary}"
    borderWidth: "1px"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
  
  input-focus:
    borderColor: "{colors.accent-primary}"
    shadow: "0 0 0 2px rgba(110, 86, 207, 0.2)"
  
  # Navigation
  nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  
  nav-item-hover:
    backgroundColor: "{colors.bg-hover}"
    textColor: "{colors.text-primary}"
  
  nav-item-active:
    backgroundColor: "{colors.bg-active}"
    textColor: "{colors.text-accent}"

animation:
  # Durations
  duration-fast: "150ms"
  duration-normal: "200ms"
  duration-slow: "300ms"
  duration-slower: "500ms"
  
  # Easing
  ease-default: "cubic-bezier(0.4, 0, 0.2, 1)"
  ease-in: "cubic-bezier(0.4, 0, 1, 1)"
  ease-out: "cubic-bezier(0, 0, 0.2, 1)"
  ease-spring: "cubic-bezier(0.34, 1.56, 0.64, 1)"
  
  # Common patterns
  hover: "{duration-fast} {ease-default}"
  appear: "{duration-normal} {ease-out}"
  modal: "{duration-slow} {ease-spring}"

breakpoints:
  sm: "640px"
  md: "768px"
  lg: "1024px"
  xl: "1280px"
  "2xl": "1536px"

grid:
  columns: 12
  gutter: "{spacing.lg}"
  container-max: "1440px"
---

## Overview

The Agent Framework Command Center is the **operating system for autonomous agent teams**. It is not a tools dashboard or competitive intelligence platform—it is the cockpit for orchestrating intelligent agents that get smarter, execute faster, and never degrade.

### Core Philosophy

1. **Precision Over Decoration**: Every pixel serves a purpose. Visual hierarchy is established through typography scale, spacing rhythm, and subtle color distinctions—not ornamentation.

2. **Dark Mode First**: The interface lives in the dark. This reduces eye strain during extended monitoring sessions and makes data visualizations pop with vibrant accent colors against the deep background.

3. **Information Density**: Operators need to see the big picture at a glance. The design supports high information density without clutter through careful use of spacing, borders, and typography.

4. **Developer Feel**: The aesthetic borrows from developer tools (Linear, Vercel, VS Code) because agent orchestration is fundamentally a technical operation. Commands, keyboard shortcuts, and code-like data presentation feel natural.

5. **Motion with Meaning**: Animations are fast (150-300ms), purposeful, and communicate state changes. No bouncing, no delays—just immediate feedback.

## Colors

### Background Layers
The depth hierarchy uses increasingly lighter backgrounds:
- **bg-primary (#0D0D0F)**: The void. Main application background.
- **bg-secondary (#151518)**: Card and panel backgrounds.
- **bg-tertiary (#1E1E22)**: Elevated elements, inputs, secondary surfaces.
- **bg-elevated (#25252A)**: Hover states, active selections.
- **bg-hover (#2A2A30)**: Interactive hover feedback.
- **bg-active (#303038)**: Active/pressed states.

### Accent System
- **accent-primary (#6E56CF)**: Purple is the hero color—associated with intelligence, AI, and creativity. Used for primary actions, active states, and key data highlights.
- **accent-secondary (#3ECF8E)**: Green for success, health metrics, online status.
- **accent-tertiary (#F59E0B)**: Amber for warnings, busy states, attention-needing items.
- **accent-danger (#EF4444)**: Red for errors, critical alerts, degraded performance.
- **accent-info (#3B82F6)**: Blue for informational states, links.

### Status Semantics
Status colors are used consistently across all modules:
- **Online/Healthy**: Green glow, green badges
- **Busy/Processing**: Amber pulse animations
- **Offline/Idle**: Gray muted states
- **Error/Critical**: Red badges, red borders, urgent notifications
- **Degraded**: Orange alerts indicating attention needed

## Typography

### Font Families
- **Inter**: The workhorse. All UI text, headings, labels. Chosen for its large x-height, excellent readability at small sizes, and professional appearance.
- **JetBrains Mono**: The technical accent. All data, timestamps, IDs, metrics. Monospace naturally aligns numbers and creates a "system" feel.

### Scale Strategy
The type scale uses a 1.125 major second ratio for compact hierarchy:
- Display sizes for hero sections and empty states
- H1-H4 for module and section headings
- Body sizes for content (lg/md/sm based on hierarchy)
- Mono for all data points and metrics
- Label style for captions, timestamps, metadata

### Text Colors
Three levels of importance:
- **Primary**: Near-white for headings and critical data
- **Secondary**: Light gray for body text and descriptions
- **Tertiary**: Medium gray for metadata and timestamps
- **Muted**: Dark gray for disabled states and placeholders

## Layout

### Grid System
12-column responsive grid with 16px gutters. The dashboard uses a "cards in rows" layout where modules are self-contained cards that can be rearranged.

### Spacing Scale
4px base unit, multiplied through the scale:
- **xs (4px)**: Tight internal spacing, icon gaps
- **sm (8px)**: Element padding, inline gaps
- **md (12px)**: Card internal spacing
- **lg (16px)**: Section gaps, card margins
- **xl+ (20px+)**: Major section breaks

### Card Pattern
Cards are the primary container:
- Background: bg-secondary
- Border: 1px solid border-primary
- Border radius: 12px (xl)
- Internal padding: 16px (lg)
- Shadow: None by default, subtle on hover

## Components

### Cards
Cards use the floating panel pattern against the deep background. They never use heavy shadows—the depth comes from the background color layers. Hover states add subtle elevation.

### Buttons
- **Primary**: Purple fill, white text. The only highly saturated button on any screen.
- **Secondary**: Dark fill, subtle border. For secondary actions.
- **Ghost**: No background until hover. For icon buttons and tertiary actions.

All buttons use the same padding (10px vertical, 16px horizontal) and border radius (6px).

### Badges
Small, pill-shaped status indicators with colored text on a tinted background:
- Online: Green text on green-tinted background
- Busy: Amber text on amber-tinted background
- Error: Red text on red-tinted background

### Navigation
The sidebar uses a "minimal rail" pattern:
- Icons + compact labels
- Active item has subtle background highlight and primary color text
- Hover reveals elevated background

### Data Tables
Tables are borderless with row hover effects:
- Headers use label typography (uppercase, letter-spaced)
- Rows have 48px minimum touch targets
- Selected rows get left border accent

## Elevation & Depth

Depth is communicated through:
1. **Background color layers** (primary → secondary → tertiary)
2. **Borders** (subtle separators)
3. **Shadows** (used sparingly for modals and dropdowns)

Shadow values are subtle to maintain the dark aesthetic:
- **sm**: Barely visible lift
- **md**: Card hover elevation
- **lg**: Dropdowns, popovers
- **xl**: Modals, full-screen overlays

Glow effects are used for accent emphasis:
- Primary glow: Purple aura on focused/activated elements
- Success glow: Green for online/healthy states
- Warning glow: Amber for attention items
- Danger glow: Red for critical alerts

## Animation

### Timing Philosophy
- **Fast (150ms)**: Hover feedback, color transitions
- **Normal (200ms)**: Button states, collapses
- **Slow (300ms)**: Modals, page transitions
- **Slower (500ms)**: Complex sequences

### Easing
- **Default (ease)**: Most transitions
- **Spring**: Modals and attention-grabbing animations
- **Linear**: Progress bars, determinate loaders

### Patterns
All interactive elements animate on hover:
- Cards: Background color transition
- Buttons: Background + subtle glow
- Navigation items: Background fade-in
- Data visualizations: Staggered entry

## Semantic Tokens

The following tokens should be used semantically in code:

### Status
- Use `status-*` colors for health indicators only
- Never use semantic colors for decoration

### Elevated Surfaces
- Use `bg-elevated` for hover states (like dropdown items)
- Use `bg-active` for selected/pressed states

### Text Hierarchy
- `text-primary`: Headings, important data, primary actions
- `text-secondary`: Body text, descriptions
- `text-tertiary`: Metadata, timestamps, hints
- `text-muted`: Disabled states, placeholders

### Interactive States
- Hover: 150ms transition to `bg-hover` or `bg-elevated`
- Active: Immediate switch to `bg-active`
- Focus: 2px outline using accent color at 20% opacity
- Disabled: Reduce opacity to 50%, remove interactions

## Do's and Don'ts

**Do:**
- Use generous whitespace around major sections
- Keep accent colors consistent (purple = AI, green = healthy, red = error)
- Animate all state changes smoothly
- Use monospace for any numeric data or timestamps
- Maintain the dark, developer-tool aesthetic

**Don't:**
- Use gradients for backgrounds (flat colors only)
- Add decorations without functional purpose
- Use light colors for text on light backgrounds
- Mix multiple accent colors in one view
- Create heavy shadows (subtle only)
- Use decorative border-radius (functional only)
