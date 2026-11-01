# Paste this whole file into a new chat

You are phase 05a. Build the presentational UI kit.

## Human setup

```bash
cd /Users/danil267/projects/react/booknest
git fetch origin
git worktree add -b lab-5/react-ui ../booknest-worktrees/05a origin/lab-5/react
```

Open `/Users/danil267/projects/react/booknest-worktrees/05a`.

## Stop unless

`pwd` ends with `booknest-worktrees/05a` and the branch is `lab-5/react-ui`.

## Read

`AGENTS.md`, `docs/lab5/components.md`, `docs/contracts/copy.md`, `docs/contracts/html.md`.

## Own only

- `src/components/Button.tsx`
- `src/components/Badge.tsx`
- `src/components/Spinner.tsx`
- `src/components/EmptyState.tsx`
- `src/components/ErrorBox.tsx`
- `src/components/SiteHeader.tsx`
- `src/components/SiteFooter.tsx`
- `src/components/Breadcrumbs.tsx`
- `src/components/Specs.tsx`

## Do not touch

`src/App.tsx`, pages, `src/api/`, `src/lib/`, `src/types.ts`, stylesheets, contracts.
If a prop needs a new domain type, stop and report it.

## Work

1. Each file declares its props with `interface` and renders Lab 2 classes. No new CSS.
2. `Button` supports `type`, `disabled`, `aria-pressed`, and an optional `href`. A href renders an `a.button`. The wish modifier is a prop, not a second component.
3. `Badge` accepts `tone: "neutral" | "available" | "unavailable"`.
4. `Spinner` is the existing `.spinner` plus the loading text passed as children. It does not read the clock or animate in JavaScript.
5. `EmptyState` takes `title` and `text`. `ErrorBox` takes `title`, `message`, and `onRetry`.
6. `SiteHeader` takes `current: "catalog" | "book" | "loan"` and uses hash links `#/`, `#/book`, and `#/loan`.
7. `SiteFooter` uses the footer strings. `Breadcrumbs` and `Specs` follow the detail-page structure.
8. No `any`, no `document`, no `key={index}`, no state.
9. Keep each file at or under 150 lines. Commit the kit in two commits: controls, then chrome.
10. Push `lab-5/react-ui`. Do not open a pull request.

## Done when

`npx tsc --noEmit` passes and these components are not imported by a half-built page in this branch.

## Closing message

Say the UI kit is pushed and should be merged into `lab-5/react` before the page phases.
