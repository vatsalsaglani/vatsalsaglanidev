# Component catalogue

Reuse before you build. All in `src/components/`.

| Component | Kind | Notes |
| --- | --- | --- |
| `Nav` | client | Fixed 64px bar, blur after 24px scroll, active-section underline (`layoutId`), mobile overlay, palette trigger. |
| `Hero` | client | `id="top"`, flow-field canvas, live Bengaluru clock, rotating role word, bio via `linkCompany`, stats, includes `Marquee`. |
| `FieldCanvas` | client | Pointer-reactive flow field; `className` prop; parent must be `relative`. |
| `Marquee` | client | `items: string[]`, `speed` seconds. Pauses on hover, static under reduced motion. |
| `CommandPalette` | client | ⌘K palette: Navigate / Links / Theme / Copy groups. Reads `nav` and `profile.links`. |
| `ThemeToggle` | client | Sun/moon morph, `useTheme()`. |
| `SectionHeading` | server | `{ index, eyebrow, title, lede, action }`. Use for every section. |
| `Systems` | client | Numbered expandable rows from `systems.js` with maturity chips. |
| `Work` + `ProjectCard` | client | Featured 12-col grid with tilt cards, filter pills, dense project list. Data via `getProjects()`. |
| `Experience` | client | Scroll-progress timeline, expandable highlights, `employerNote`. |
| `Writing` | client | Feature row + card grid. Data via `getWriting()`. |
| `About` | client | Halftone portrait (`PortraitCanvas`), about paragraphs, Toolbox, Publications. |
| `PortraitCanvas` | client | `{ src, alt, focus: {x,y}, zoom }`. Hover/tap reveals the photo. |
| `Contact` | client | Email + copy, link rows, form posting to the Apps Script endpoint with a honeypot. |
| `Footer` | server | Big name, back to top, deploy links, resume link. |
| `Resume`, `PrintButton` | server / client | `/resume` page built from data; `window.print()`. |
| `Icons`, `SectionIcons` | — | Named inline SVG exports. Add new icons here. |
| `ThemeProvider` | client | Context + pre-paint init script. |

Helpers: `src/lib/utils.js` (`cn`, `formatDate`, `formatStars`), `src/lib/data.js` (`getProjects`, `getWriting`), `src/lib/linkify.js` (`linkCompany`).
