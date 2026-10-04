# Token reference

Source of truth: `src/app/globals.css` (`:root` and `:root[data-theme="dark"]`) and `tailwind.config.mjs`.

## CSS variables (RGB channels)

| Variable | Light | Dark |
| --- | --- | --- |
| `--bg` | 245 242 234 | 11 11 14 |
| `--surface` | 250 248 243 | 17 17 22 |
| `--raised` | 255 255 255 | 24 24 30 |
| `--fg` | 20 19 18 | 243 239 230 |
| `--muted` | 101 97 89 | 154 150 140 |
| `--line` | 20 19 18 | 243 239 230 |
| `--accent` | 229 70 26 | 255 92 42 |
| `--accent-fg` | 255 255 255 | 20 19 18 |
| `--signal` | 22 163 74 | 74 222 128 |
| `--grain-opacity` | 0.06 | 0.09 |

Use in Tailwind as `bg-bg`, `text-muted`, `border-line/10`, `bg-accent/20`, etc. In raw CSS or canvas: `rgb(var(--accent) / 0.4)`.

## Type scale (tailwind `fontSize` extensions)

| Class | Size | Line height | Tracking |
| --- | --- | --- | --- |
| `text-display-xl` | clamp(3rem, 9vw, 8.5rem) | 0.92 | -0.03em |
| `text-display-lg` | clamp(2.5rem, 6vw, 5.5rem) | 0.95 | -0.025em |
| `text-display-md` | clamp(2rem, 4vw, 3.5rem) | 1.02 | -0.02em |

## Spacing and shape

- `max-w-wrap` = 80rem; `px-gutter` = clamp(1rem, 4vw, 3rem)
- `rounded-xl2` = 1.25rem (cards), `rounded-full` (pills, buttons)
- `shadow-card`, `shadow-glow` (accent ring + bloom, hover only)

## Component classes (globals.css `@layer components`)

`.wrap`, `.eyebrow`, `.hairline`, `.link-underline`, `.btn`, `.btn-primary`, `.btn-ghost`, `.chip`, `.card`

## Keyframes / animations

`animate-marquee` (40s linear), `animate-pulseDot` (2.2s), `animate-caret` (1s steps). Easing utilities: `ease-out` = cubic-bezier(0.22, 1, 0.36, 1), `ease-in-out` = cubic-bezier(0.65, 0, 0.35, 1).

## Motion presets (`src/lib/motion.js`)

```js
EASE = [0.22, 1, 0.36, 1]
fadeUp  = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }
fade    = { hidden: { opacity: 0 },        show: { opacity: 1,        transition: { duration: 0.6, ease: EASE } } }
stagger(staggerChildren = 0.08, delayChildren = 0)
viewportOnce = { once: true, margin: "-10% 0px -10% 0px" }
```

Hover spring used by cards: `{ stiffness: 220, damping: 22, mass: 0.6 }`, max tilt 5°.
