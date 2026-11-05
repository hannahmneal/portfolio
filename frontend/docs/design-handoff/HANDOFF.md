# H.Neal portfolio — "Platinum Classic+" design handoff

This file carries the design decisions from a claude.ai design session into the code project.
Give it to Claude Code in VS Code as context (see **Starting prompt** at the bottom).

The live designs (private to you) are on these canvases:

- **Site pages (the chosen design):** https://claude.ai/artifact/X9mQHwsm9cFrEEz3GTyHCQ
- Remix canvas (options A–C plus the light/dark Platinum study): https://claude.ai/artifact/HhuRNWznTm5dyyzuAS4qWz
- Keep **A · After Dark** and **B · Swiss Desktop** for a separate future project. Don't use them here.

`reference-pages/` holds the exact source of each page (`.dc.html`). It's an HTML + inline-style prototype format, so treat it as a visual spec, not code to copy. The selectors, colours and pixel art in it are exact.

---

## 1. Concept

A late-90s Mac-OS-"Platinum"-style desktop, rebuilt with modern spacing and accessibility. Each content section is a **window** with a pinstriped title bar sitting on a patterned **desktop**. The site has a **light mode** and a **dark mode** with the same structure.

What the owner liked (keep these):
- Window chrome around each section, plus old-style bevelled buttons.
- Desktop icons as menu blocks, and the desktop-pattern picker.
- Stepped, GIF-like animations: the hopping pixel H, blinking crosshair sparkles and a barber-pole loading bar.
- A slim scrolling banner **above** the nav, and a nav that is obvious but doesn't overpower the banner.
- A classic footer with status, last updated and a visitor counter.
- Fonts: Pixelify Sans, Silkscreen, IBM Plex Sans and IBM Plex Mono.

## 2. Tokens

### Accent (one colour, user-selectable; white text must pass on it)
Default `#C8102E` (Swiss red). Alternatives: `#2B4FD8`, `#C2410C`, `#6B3FA0`.

### Light mode
| Token | Value |
|---|---|
| text | `#1A1A1A` |
| text-muted | `#3E3E3B` |
| window bg | `#EEEEEB` |
| window border | `#1A1A1A` |
| window shadow | `inset 1px 1px 0 #FFFFFF, 4px 4px 0 rgba(26,26,26,0.35)` |
| title bar bg | `#E2E2DE` |
| title pinstripes | `repeating-linear-gradient(#FFFFFF 0 1px, #9A9A96 1px 2px)` |
| nav bar bg | `#FFFFFF`, 2px bottom border `#1A1A1A`, `0 3px 0 rgba(26,26,26,0.18)` |
| banner | bg `#1A1A1A`, text `#D9D9D4` |
| button | bg `#EEEEEB`, border `#1A1A1A`, `inset 1px 1px 0 #FFF, inset -1px -2px 0 #A8A8A4` |
| button pressed | bg `#5E5E5A`, text `#FFF`, `inset 2px 2px 0 #2A2A28` |
| sunken panel / input | bg `#FFFFFF`, border `#1A1A1A`, `inset 1px 1px 0 #9A9A96` |
| link / visited | `#1F3FBF` / `#6B2C91`; hover inverts (bg = link colour, text white) |
| footer | bg `#E2E2DE`, 2px top border `#1A1A1A` |
| hover / current (nav, rows, icons) | invert: bg `#1A1A1A`, text `#FFFFFF` |

### Dark mode
| Token | Value |
|---|---|
| text | `#F3EFE6` |
| text-muted | `#A7ADB4` |
| window bg | `#171A20` |
| window border | `#07080A` + outer ring `0 0 0 1px #2E333B` |
| window shadow | `inset 1px 1px 0 rgba(255,255,255,0.07), 5px 5px 0 rgba(0,0,0,0.55)` |
| title bar bg | `#1F232A`; title text `#C9CDD3` |
| title pinstripes | `repeating-linear-gradient(#2E333B 0 1px, #191C22 1px 2px)` |
| nav bar bg | `#1B1F26` |
| banner | bg `#0B0D10`, text `#8E959D` |
| button | bg `#2A2F37`, border `#07080A`, `inset 1px 1px 0 rgba(255,255,255,0.14), inset -1px -2px 0 rgba(0,0,0,0.55)` |
| sunken panel / input | bg `#0B0D10`, border `#3A4048` |
| link / visited | `#67E8F9` / `#C9A7F2`; hover inverts (text `#0B0D10`) |
| footer | bg `#1B1F26` |
| hover / current | invert: bg `#F3EFE6`, text `#0B0D10` |

### Desktop patterns (`background` shorthand)
| id | Light | Dark |
|---|---|---|
| dither (light default) | `repeating-conic-gradient(#A3AEBA 0% 25%, #C9D0D8 0% 50%) 0 0 / 4px 4px` | `repeating-conic-gradient(#0F1216 0% 25%, #171B21 0% 50%) 0 0 / 4px 4px` |
| grid (dark default) | `linear-gradient(#A3AEBA 1px, transparent 1px) 0 0 / 14px 14px, linear-gradient(90deg, #A3AEBA 1px, #C9D0D8 1px) 0 0 / 14px 14px` | `linear-gradient(rgba(243,239,230,0.05) 1px, transparent 1px) 0 0 / 28px 28px, linear-gradient(90deg, rgba(243,239,230,0.05) 1px, #0E1013 1px) 0 0 / 28px 28px` |
| diagonal | `repeating-linear-gradient(45deg, #A3AEBA 0 2px, #C9D0D8 2px 7px)` | `repeating-linear-gradient(45deg, #171B21 0 2px, #0E1013 2px 9px)` |
| halftone | `radial-gradient(#9AA5B2 1.3px, transparent 1.6px) 0 0 / 12px 12px, #C9D0D8` | `radial-gradient(rgba(243,239,230,0.09) 1.2px, transparent 1.5px) 0 0 / 14px 14px, #0E1013` |
| solid | `#BCC5CF` | `#0E1013` |

### Typography (Google Fonts)
- **Pixelify Sans 700**: page headings (`clamp(36px, 5.4vw, 60px)`), window section titles and icon labels.
- **Silkscreen 400**: window title bars (12px), small labels, the banner and the counter digits.
- **IBM Plex Sans 400–600**: body (15–17px) and buttons (600, 14px).
- **IBM Plex Mono 400–500**: meta text, tags, the footer status bar and the changelog.

## 3. Components

- **Window**: 1px border, 1px radius. The 26px title bar has a 13px "box" at each end, pinstripes filling the space either side, and the title centred in Silkscreen.
- **Banner**: full width at the very top, 6px vertical padding. "PORTFOLIO.COM ▪" repeats and scrolls (`translateX(0 → -50%)`, 20s linear, two copies side by side).
- **Menu bar (nav)**: min-height 56px. It holds the logo (an accent square with a 2px hard shadow, then "H.Neal" in Pixelify), a divider, then Home / About / Work / Now. The current page is inverted. On the right: a blinking accent square with "ONLINE · 2026", then the **Light mode / Dark mode** toggle button with a pixel sun/moon icon and `aria-pressed`.
- **Buttons**, all at least 44px tall:
  - Primary: accent background, white text, plus a thick "default ring" `0 0 0 3px <window bg>, 0 0 0 5px <text>`. Hover brightens it.
  - Secondary: the bevelled grey button.
  - Ghost: underlined text that inverts on hover.
  - Disabled: muted colours with no bevel.
- **Desktop icon**: a 72px pixel-art glyph (16×16 grid, `shape-rendering: crispEdges`) over a bordered label box with a title and a short description. Hover or focus darkens the glyph and inverts the label.
- **Pattern picker**: square swatch buttons with `aria-pressed`. The selected one gets the ring `0 0 0 3px <window bg>, 0 0 0 5px <accent>`.
- **Footer**:
  - Row 1: logo, "© 2026", then pipe-separated links: Home | About | Work | Now | **Guestbook** | Back to top ▴.
  - Row 2: a status bar of sunken panes:
    - "Status: online", with a blinking accent square.
    - "Last updated: 2026".
    - "Visitors", shown as digit tiles 0 0 1 3 3 7.
    - "Loading", with a barber pole: `repeating-linear-gradient(-45deg, accent 0 8px, <window bg> 8px 16px)`, animating `background-position` by 22.63px.
    - "Made with nothing but CSS".
- **Animations** (stepped, not smooth):
  - Pixel H hop: `steps(3)` over 1.2s.
  - Crosshair blink: `steps(1)` over 1.2s, staggered.
  - Status blink: `steps(1)` over 1s.
- **Pixel H logo**: an 8×8 grid, accent coloured, with a 5px hard drop shadow (`#1A1A1A` in light mode, `#000` in dark). Row pattern: `01100110 ×3, 01111110 ×2, 01100110 ×3`.

## 4. Pages

| Page | Contents |
|---|---|
| **Home** | Welcome window: pixel H, "Hi, I'm H. Neal.", an intro, and the buttons See selected work / About me / Sign the guestbook. A desktop-icon row: About, Selected Work, Now, Guestbook. A "Featured — Variant Calling" window. A Control Panel window with the pattern picker. |
| **About** | "About Me.txt" with a photo placeholder (240×280) and bio. A Toolbox window with tag groups: Front end, Back end, Data, Bioinformatics, Automation. "Get in Touch" (email, GitHub, LinkedIn, guestbook link) and "Resume.pdf". |
| **Work** | A file-browser window titled "Selected Work" with **Icons / List** toggle buttons and "4 items · sorted by kind". Icons view: pixel glyphs (DNA, Lego bricks, database, magnifier). List view: Name / Kind / Stack columns with inverting row hover. Clicking a project stores its id and opens the Project Viewer. |
| **Project Viewer** | One page for all projects. A sidebar list (selected item inverted, accent dot) and a content pane with: kind, title, summary, screenshot placeholder, "How it flows" numbered step chips with arrows, "What I built" bullets, Stack tags, a Results panel, code/demo links and Previous/Next buttons. |
| **Now** | "Now.txt" rows: Building / Learning / Exploring / Reading / Listening. "To-do.app" with real checkboxes (`accent-color`), strike-through when done, and "N of M done". "Changelog.log". |
| **Guestbook** | Header window: pixel book icon, intro, "You are visitor No. 001337". "New Entry" form: Name\*, Website (optional), Message\* (280-character limit with a counter), a stamp picker, a validation alert, a success status, and Sign / Clear buttons. "Entries (N)" list, newest first: stamp, name, site link, date, message. |

Project content comes from the owner's real projects: the germline variant-calling pipeline (Nextflow DSL2; FastQC → BWA-MEM → GATK MarkDuplicates → HaplotypeCaller → hap.py → MultiQC; benchmarked against GIAB HG001), ClauseKit, Comics Callosum and Job Scraper. The exact copy is in `reference-pages/CaseStudy.dc.html`. Anything in `[brackets]` is a placeholder the owner still needs to fill in.

### Guestbook stamps (9×9 pixel art, 1 = filled with accent)
```
smiley:  001111100 011111110 111111111 110111011 111111111 101111101 110000011 011111110 001111100
thumbs:  000011000 000111000 000110000 110111111 110111110 110111111 110111110 110111111 110011110
heart:   011000110 111101111 111111111 111111111 111111111 011111110 001111100 000111000 000010000
comment: 011111110 111111111 111111111 110101011 111111111 011111110 011100000 011000000 010000000
idea:    001111100 011111110 110111111 111111111 111111111 011111110 001111100 000000000 001111100
```
The default stamp is smiley. When a stamp button is selected, it inverts (dark background with light pixels).

## 5. Behaviour

- **Persisted preferences** (localStorage in the prototype): `hneal-theme` (`light` | `dark`), `hneal-pattern` (pattern id) and `hneal-project` (last opened project id).
- **Theme switching**: both modes share all markup. Only the tokens change.
- **Guestbook**: the prototype keeps entries in memory only. Production needs storage, plus moderation and spam protection, before it goes live.
- **Responsive**: the nav bar and footer wrap, two-column window rows collapse at about 440px, and the Work list scrolls horizontally inside its panel.
- **Accessibility**:
  - Real `<button>` and `<a>` elements, with `aria-pressed` on toggles and `aria-current="page"` on nav and footer links.
  - Visible dashed focus outlines.
  - Text contrast of at least 4.5:1.
  - Decorative pixel art marked `aria-hidden`.

## 6. Suggested implementation

The owner prefers React + Vite, styled-components (not Tailwind) and Zustand. The suggested shape:
- `ThemeProvider` with a light and a dark token object, using the tables above.
- A persisted Zustand store for `theme`, `pattern`, `accent` and `lastProject`.
- Shared components: `Window`, `MenuBar`, `Banner`, `Footer`, `Button`, `DesktopIcon`, `PixelArt` (takes a bit-string and a column count), `PatternPicker`, `StatusBar`.
- Data files for projects, now-items and guestbook stamps.

## Starting prompt (paste into Claude Code in VS Code)

> Read `docs/design-handoff/HANDOFF.md` and look at the files in `docs/design-handoff/reference-pages/`. They are the approved "Platinum Classic+" design for this portfolio, with light and dark modes. Look at how this project is currently structured, then propose a plan to implement the design (shared tokens, components, then the six pages: Home, About, Work, Project Viewer, Now, Guestbook). Ask me before replacing anything that already exists.
