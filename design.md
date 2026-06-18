---
name: AGENT.ARCADE
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#d2bbff'
  on-secondary: '#3f008e'
  secondary-container: '#6001d1'
  on-secondary-container: '#c9aeff'
  tertiary: '#ffb783'
  on-tertiary: '#4f2500'
  tertiary-container: '#d97721'
  on-tertiary-container: '#452000'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#eaddff'
  secondary-fixed-dim: '#d2bbff'
  on-secondary-fixed: '#25005a'
  on-secondary-fixed-variant: '#5a00c6'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb783'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#703700'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-xl:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-xl-mobile:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 48px
  margin-mobile: 16px
  stack-gap: 12px
---

## Brand & Style
The design system embodies a "Deep Dark" premium gaming aesthetic, merging the functional density of high-end developer tools with the immersive atmosphere of modern arcade hubs. The target audience is discerning gamers and competitive players who value technical precision and a sophisticated, "dark mode first" environment. 

The visual style is a hybrid of **Glassmorphism** and **High-Contrast Modernism**. It utilizes deep obsidian surfaces layered with translucent glass panels to create a sense of infinite depth. High-energy neon accents provide a technical "pulse" to the interface, ensuring that interactive elements feel powered-on and responsive. The emotional response is one of focus, exclusivity, and high-performance reliability.

## Colors
The palette is rooted in the darkest spectrum of Zinc and Slate to minimize eye strain during long gaming sessions. 

- **Foundation:** The base background is `Zinc-950` (#09090b), providing a true-black foundation that allows glass effects to pop.
- **Accents:** A signature 'active-accent' gradient transitions from `Indigo-500` to `Violet-600`. This is reserved for primary actions, progress indicators, and active states.
- **Surfaces:** The 'surface-glass' token uses a white-5 opacity with a mandatory `backdrop-blur-md` (12px) to create professional-grade depth and separation from the background.
- **Feedback:** Success and alerts should use vibrant, desaturated versions of green and red to maintain the premium feel without breaking the neon language.

## Typography
The typography strategy balances high-impact display faces with technical utility.

- **Headlines:** Use `Geist` for its sharp, technical geometry and tight tracking. Large headings should be bold and high-contrast (Pure White on Zinc-950).
- **Body:** `Inter` is used for all long-form text and interface controls to ensure maximum legibility at smaller scales.
- **Data/Metadata:** `JetBrains Mono` is used for player stats, timestamps, and "Agent" IDs to reinforce the technical/hacker aesthetic of the arcade.
- **Hierarchy:** Maintain a clear distinction between content titles (Geist) and UI labels (JetBrains Mono).

## Layout & Spacing
This design system utilizes a **Fluid Grid** model centered within a maximum container width of 1440px.

- **Grid:** A 12-column layout on desktop with 24px gutters. For mobile, shift to a 4-column layout with 16px margins.
- **Rhythm:** All spacing (padding, margins, gaps) must be a multiple of the 4px base unit. 
- **Density:** The interface should feel "snug" but organized, similar to a cockpit. Use `stack-gap` (12px) for related items within glass cards and `gutter` (24px) for spacing between primary modules.
- **Safe Areas:** On mobile, ensure all interactive "Agent" controls are within the thumb-zone, utilizing a bottom-pinned navigation bar for core arcade functions.

## Elevation & Depth
Depth is communicated through **Glassmorphism** and **Inner Glows** rather than traditional drop shadows.

- **Level 0 (Base):** Zinc-950 background.
- **Level 1 (Panels):** Surface-glass (5% white) with `backdrop-blur-md`. This is for primary content containers and sidebars.
- **Level 2 (Modals/Popovers):** Surface-glass (8% white) with an increased `backdrop-blur-lg` and a subtle 1px border using `white-10`.
- **Interactive Depth:** When an item is hovered, increase the glass opacity to 10% and add a faint `0 0 15px` outer glow using the Primary color (Indigo-500) to simulate a "power-on" state.

## Shapes
The shape language is "Soft-Technical." Elements use refined, small corner radii to maintain a crisp, professional edge while avoiding the harshness of 90-degree angles.

- **Cards/Panels:** Use `rounded-lg` (0.5rem) to provide a soft container for game art and stats.
- **Buttons/Inputs:** Use `rounded` (0.25rem) to keep them feeling like precision tools.
- **Status Badges:** Use `rounded-xl` (0.75rem) or fully pill-shaped for high-visibility labels like "LIVE" or "ONLINE."

## Components

### Buttons
- **Primary:** Filled with the 'active-accent' gradient. Text is white. On hover, add a `0 0 20px` indigo glow.
- **Secondary:** Transparent background with a 1px border of `white-20`. On hover, the background becomes `white-5`.
- **Ghost:** No border or background. Used for utility actions.

### Glassmorphic Cards
Cards are the primary content vessel. They must feature:
- Background: `surface-glass`.
- Border: 1px top and left border (white-10) to simulate a light catch.
- Backdrop: `backdrop-blur-md`.

### Glowing Status Badges
Used for "Live" streams or "Active" games.
- Small pill shape with a `2px` solid dot of the accent color.
- The dot features a pulsing `0 0 8px` animation using the gradient colors.

### Input Fields
- Background: `rgba(0, 0, 0, 0.3)` with a 1px `white-10` border.
- Focus State: The border transitions to the primary gradient and gains a subtle inner shadow.

### Game Grids
- Use a "Masonry-lite" or standard 4-column grid for game posters.
- Posters should have a subtle `white-5` overlay that disappears on hover to reveal the full-color artwork.