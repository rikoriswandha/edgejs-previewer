# Repository Guidelines

## Project Overview

A Vite + React 18 + TypeScript SPA scaffolded with **shadcn/ui** via the **@coss/style** registry. Uses **Tailwind CSS v4** for styling and **@base-ui/react** primitives (not Radix) for accessible UI components. The project is in early scaffolding — `App.tsx` still contains Vite boilerplate and no business logic has been added yet.

## Architecture & Data Flow

Standard Vite React SPA architecture:

```
vite dev server → React 18 (StrictMode) → DOM
                ↓
         src/App.tsx (entry component)
                ↓
         src/components/ui/* (UI layer)
                ↓
         src/lib/utils.ts, src/hooks/* (shared primitives)
```

- **No state management** library installed — use React hooks or add a library as needed.
- **No router** installed — add `react-router` or `@tanstack/react-router` if navigation is required.
- **No API client** configured — fetch/axios integration is application-specific.

### Component Architecture

All UI components in `src/components/ui/` follow the same layered pattern:

1. **Base UI primitive** (`@base-ui/react`) — accessibility, keyboard handling, focus management
2. **Tailwind CSS** — visual styling via utility classes
3. **`cn()` utility** — conditional class merging (`clsx` + `tailwind-merge`)
4. **CVA** (`class-variance-authority`) — typed variant definitions
5. **`useRender` + `mergeProps`** — polymorphic `render` prop support (e.g., `<Button render={<Link />} />`)

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/components/ui/` | 54 shadcn/coss UI components (button, dialog, form, table, etc.) |
| `src/lib/` | Shared utilities (`utils.ts` — `cn()` class merger) |
| `src/hooks/` | Custom React hooks (`use-media-query.ts`) |
| `src/assets/` | Static assets (SVGs, images) |
| `public/` | Unprocessed public assets served at root |

## Development Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start Vite dev server |
| `bun run build` | Type-check (`tsc`) then Vite production build |
| `bun run preview` | Preview production build locally |
| `bun run lint` | ESLint on `.ts`/`.tsx` files |
| `bunx --bun shadcn@latest add <component>` | Add a shadcn/coss UI component |

## Code Conventions & Common Patterns

### Path Aliases

Use these aliases instead of relative paths:

```ts
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
```

Configured in `tsconfig.json`:
- `@/*` → `./src/*`
- `@/components` → `@/components`
- `@/lib` → `@/lib`
- `@/hooks` → `@/hooks`

### Class Name Composition

Always use `cn()` for merging classes:

```ts
import { cn } from "@/lib/utils";

function MyComponent({ className }: { className?: string }) {
  return <div className={cn("base-class", className)} />;
}
```

### Component Variants (CVA)

Components expose typed variants via CVA. Reuse variant objects for consistency:

```ts
import { buttonVariants } from "@/components/ui/button";

<a className={buttonVariants({ variant: "outline", size: "sm" })}>Link</a>
```

### Polymorphic Components

Many components support a `render` prop for polymorphism:

```tsx
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

<Button render={<Link to="/" />}>Go home</Button>
```

### Responsive Breakpoints

Use the `useMediaQuery` hook (not raw CSS media queries) for responsive logic in JS:

```ts
import { useMediaQuery, useIsMobile } from "@/hooks/use-media-query";

const isMobile = useIsMobile();          // max-md
const isDesktop = useMediaQuery("md");   // md and up
```

Breakpoints: `sm:640`, `md:800`, `lg:1024`, `xl:1280`, `2xl:1536`, `3xl:1600`, `4xl:2000`.

### Styling with Tailwind v4

Theme tokens are defined as CSS custom properties in `src/index.css` (colors, radius, animations, fonts). Do not edit `tailwind.config.js` for theme extensions — prefer CSS custom properties and the `@theme inline` block in `index.css`.

## Important Files

| File | Role |
|------|------|
| `src/main.tsx` | Application entry point — mounts React to `#root` |
| `src/App.tsx` | Root component (currently Vite boilerplate) |
| `src/index.css` | Global styles + Tailwind v4 `@theme` tokens + light/dark CSS variables |
| `src/lib/utils.ts` | `cn()` — the only shared utility |
| `components.json` | shadcn/ui configuration (style, registry, aliases) |
| `vite.config.ts` | Vite config (minimal — only `@vitejs/plugin-react`) |
| `tsconfig.json` | TypeScript config with path aliases and strict mode |
| `tailwind.config.js` | Tailwind content globs only |

## Runtime/Tooling Preferences

- **Package manager:** `bun` (lockfile is `bun.lock`)
- **Runtime:** Bun or Node (Vite handles bundling)
- **Module system:** ESM (`"type": "module"` in `package.json`)
- **TypeScript:** Strict mode enabled (`strict`, `noUnusedLocals`, `noUnusedParameters`)
- **CSS:** Tailwind CSS v4 via PostCSS
- **Icons:** `lucide-react`
- **Fonts:** Inter (sans), Geist Mono (monospace) — loaded via CSS

### Adding Dependencies

```bash
bun add <package>
bun add -d <dev-package>
```

### Adding UI Components

```bash
bunx --bun shadcn@latest add <component-name>
```

The `@coss` registry is configured in `components.json`. Do not switch to the default `new-york` registry — it lacks coss-specific components (e.g., `combobox`).

## Testing & QA

**No test framework is currently configured.** To add testing:

1. **Unit tests:** Install `vitest` + `@testing-library/react` + `jsdom`
2. **E2E tests:** Install `playwright`
3. Add a `test` script to `package.json`

Current QA tooling:

| Tool | Command | Purpose |
|------|---------|---------|
| ESLint | `bun run lint` | TS/React linting with react-hooks and react-refresh rules |
| TypeScript | `bun run build` (includes `tsc`) | Type checking |

There is no Prettier, formatting config, commit hooks, or CI/CD pipeline configured yet.
