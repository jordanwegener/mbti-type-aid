# MBTI Type Aid: Maintainer Notes

This file is the durable project map for future coding sessions. Read it before
changing domain rules, drag-and-drop behavior, or deployment configuration.

## Purpose and user flow

MBTI Type Aid is a client-only React application. It has two views:

1. **Stack Builder** lets users drag cognitive functions into four primary
   positions, validates each move, derives the four shadow functions, and ranks
   candidate MBTI types.
2. **Browse Types** presents the canonical stack and descriptive information for
   every MBTI type.

There is no router, backend, persistence layer, authentication, or runtime
configuration. UI state lives in React component state and resets on reload.

## Runtime and tooling

- React 18 + TypeScript
- Vite 5 build/dev server
- Material UI 5 and Emotion
- dnd-kit for pointer/touch drag and drop
- Vitest + Testing Library with jsdom
- ESLint 9
- npm lockfile is authoritative; use `npm ci`

Commands:

```bash
npm run dev       # Vite development server
npm run build     # production bundle in dist/
npm run preview   # serve the production bundle
npm run test:run  # one-shot test suite
npm run lint      # lint the repository
```

## Architecture

- `src/main.tsx` mounts the single React root.
- `src/App.tsx` owns the theme toggle and the two top-level views.
- `src/components/playground/StackConstructor.tsx` is the interaction
  coordinator. It owns the pool, four primary slots, drag state, validation,
  shadow derivation, perfect-match lookup, and candidate matching.
- `src/components/functions/` contains pool, block, and slot presentation.
- `src/components/matching/MatchingResults.tsx` renders ranked candidates.
- `src/components/types/TypeList.tsx` renders all canonical types.
- `src/components/modals/` contains position and type detail dialogs.
- `src/data/stack.ts` is the source of truth for all 16 canonical primary
  stacks and type descriptions.
- `src/domain/function/function.ts` defines the eight cognitive functions and
  their explanatory copy.
- `src/utils/stackValidation.ts` owns legal-placement rules.
- `src/utils/stackMatching.ts` owns candidate scoring and ordering.
- `src/theme/` centralizes MUI theme overrides and design tokens.

Path aliases are defined in both `vite.config.js` and `vitest.config.ts`. Keep
the two lists synchronized when adding or changing an alias. TypeScript aliases
live separately in `tsconfig.json`.

## Domain invariants

A primary stack has exactly four positions: dominant, auxiliary, tertiary, and
inferior. Empty positions are represented by `null`.

Legal stacks obey these rules:

- A cognitive function cannot appear twice.
- Only one function from each category (T, F, N, S) can appear.
- Dominant/inferior and auxiliary/tertiary are opposite pairs.
- Function attitudes alternate introverted/extroverted as required by the
  canonical MBTI stacks.
- One axis is judging (T/F) and the other is perceiving (N/S).

Shadow functions are derived automatically by flipping each primary function's
attitude while retaining its letter. They are display-only and are not dragged.

Matching uses position weights `[4, 3, 2, 1]`. An exact-position match is worth
`10 * weight`; a function present in another position is worth `2 * weight`.
The maximum score is 100. `src/data/stack.ts` maps the canonical four-function
CSV key to its MBTI type and is used by both perfect matching and ranked
matching.

When changing any of these rules, update the focused tests under
`src/utils/__tests__/` and `src/data/__tests__/` before changing UI behavior.

## Drag-and-drop cautions

Pool items and slot items have distinct generated IDs. Empty slots use stable
IDs such as `slot-1`; occupied slots use the function item's ID inside the
sortable context. `StackConstructor` supports pool-to-slot, slot-to-slot, and
slot removal. Be careful not to identify draggable items by cognitive-function
name alone.

Touch dragging temporarily changes `document.body` overflow and touch action.
Every drag completion/cancellation path and component cleanup must restore both
styles. Input and tooltip behavior is shared through `src/hooks/`.

## Deployment

Vercel is the primary production deployment and serves `dist/index.html` from
the domain root. Vite therefore defaults to `base: "/"`.

The repository also deploys to GitHub Pages, which is hosted at the repository
subpath. `.github/workflows/deploy.yml` sets:

```text
VITE_BASE_PATH=/mbti-type-aid/
```

Do not hard-code the GitHub Pages subpath in `vite.config.js`; doing so makes
the root Vercel page load an HTML shell whose JS and CSS requests point at
nonexistent `/mbti-type-aid/assets/*` URLs, leaving a blank screen.

For deployment changes, verify both build modes:

```bash
npm run build
VITE_BASE_PATH=/mbti-type-aid/ npm run build
```

The default build's `dist/index.html` must reference `/assets/*`; the Pages
build must reference `/mbti-type-aid/assets/*`.

## Definition of done

For normal code changes:

1. Run `npm run test:run`.
2. Run `npm run lint`.
3. Run `npm run build`.
4. For UI or deployment changes, load the production build in a browser and
   exercise the affected interaction.
5. Do not commit generated `dist/` or `node_modules/`.
