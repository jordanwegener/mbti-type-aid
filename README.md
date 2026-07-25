# MBTI Type Aid

A browser-based aid for exploring Myers-Briggs cognitive-function stacks. Build
a partial stack by dragging functions into the dominant, auxiliary, tertiary,
and inferior positions; the app validates placements and ranks the closest MBTI
types in real time. A separate view lists all 16 types and their canonical
stacks.

## Features

- Drag-and-drop cognitive stack builder with mouse and touch support
- Placement validation based on function attitude, category, and opposite pairs
- Live, position-weighted matching against all 16 MBTI types
- Automatically mirrored shadow functions
- Type descriptions, strengths, and challenges
- Responsive Material UI interface with light and dark themes

## Local development

Requires a current Node.js LTS release and npm.

```bash
npm ci
npm run dev
```

Vite prints the local URL. Useful checks:

```bash
npm run test:run
npm run lint
npm run build
npm run preview
```

## Project structure

```text
src/
  components/    UI grouped by feature
  data/          MBTI stacks, descriptions, and position copy
  domain/        Cognitive-function types and stack primitives
  hooks/         Input-mode and tooltip behavior
  theme/         Material UI theme and design tokens
  utils/         Stack validation and matching rules
```

See [`AGENTS.md`](./AGENTS.md) for the detailed architecture, domain invariants,
testing notes, and deployment behavior.

## Deployment

The production Vercel build is served from `/`, which is the default
`VITE_BASE_PATH`. The GitHub Pages workflow serves the same bundle from
`/mbti-type-aid/` and sets `VITE_BASE_PATH` explicitly during its build.

If another host serves the app from a subdirectory, set `VITE_BASE_PATH` to an
absolute path with leading and trailing slashes, for example:

```bash
VITE_BASE_PATH=/example-subpath/ npm run build
```
