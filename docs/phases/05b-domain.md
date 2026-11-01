# Paste this whole file into a new chat

You are phase 05b. Port the pure library and the API client to TypeScript.

## Human setup

```bash
cd /Users/danil267/projects/react/booknest
git fetch origin
git worktree add -b lab-5/react-domain ../booknest-worktrees/05b origin/lab-5/react
```

Open `/Users/danil267/projects/react/booknest-worktrees/05b`.

## Stop unless

`pwd` ends with `booknest-worktrees/05b` and the branch is `lab-5/react-domain`.

## Read

`AGENTS.md`, `docs/contracts/domain.md`, `docs/contracts/api.md`, `docs/lab5/components.md`, and the existing `lib/books.js` plus `api/client.js` on this branch.

## Own only

- `src/lib/books.ts`
- `src/lib/storage.ts`
- `src/lib/debounce.ts`
- `src/lib/routes.ts`
- `src/api/client.ts`
- `src/api/mapBook.ts`
- `src/api/openLibraryTypes.ts`
- `src/lib/books.test.ts` if you add a test. Prefer porting the existing node:test cases if the runner can import TypeScript without new tooling. Otherwise keep behavior aligned and do not add a second test framework.

## Do not touch

Components, `src/App.tsx`, `src/types.ts`, the vanilla `api/` and `lib/` files, styles, contracts.
`fetch` may appear only in `src/api/client.ts`.

## Work

1. Port the pure functions without changing their decisions. Copy arrays before sorting.
2. `storage.ts` reads and writes the two keys inside `try/catch` and sanitizes with the pure helpers.
3. `debounce.ts` waits 350ms and returns a cancel function.
4. `routes.ts` parses and builds the hash routes from the domain contract.
5. The client matches `docs/contracts/api.md`, including `AbortSignal`, `URLSearchParams`, `response.ok`, and `ApiError`.
6. HTTP payload types live in `src/api/openLibraryTypes.ts`. Domain types are imported from `src/types.ts`.
7. No `any`. If a payload field is unknown, type it as optional and narrow it.
8. Commit library, storage and routes, then the API port.
9. Push `lab-5/react-domain`. Do not open a pull request.

## Done when

`npx tsc --noEmit` passes and the vanilla files are unchanged.

## Closing message

Say the domain port is pushed and should be merged into `lab-5/react` before the catalog and book pages.
