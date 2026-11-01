# Paste this whole file into a new chat

You are phase 05s. Scaffold React 19 + Vite + TypeScript on the Lab 4 app. Do not port features yet.

## Human setup

```bash
cd /Users/danil267/projects/react/booknest
git fetch origin
git worktree add -b lab-5/react ../booknest-worktrees/lab5 origin/lab-4/api
```

Open `/Users/danil267/projects/react/booknest-worktrees/lab5`.

## Stop unless

`pwd` ends with `booknest-worktrees/lab5` and the branch is `lab-5/react`.

## Read

`AGENTS.md`, `docs/lab5/components.md`, `docs/contracts/domain.md`, `docs/contracts/css.md`.

## Own

- `package.json` and the lockfile, by extending the Lab 3 package rather than replacing the project name
- `index.html` as the Vite shell
- `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `src/vite-env.d.ts`
- `eslint.config.js`, adding `typescript-eslint` and `react-hooks` while keeping the Lab 3 script
- `src/main.tsx`, `src/App.tsx`, `src/types.ts`
- `.gitignore` entries already listed at the repo root if any are missing

Leave `book.html`, `loan.html`, `styles/`, `api/*.js`, `lib/books.js`, and `data/books.js` in place.

## Work

1. Install React 19, React DOM 19, Vite, TypeScript, and the ESLint tooling. Do not install a component library, Tailwind, or a router.
2. Write configs by hand if `create-vite` refuses a non-empty directory. Do not keep a generated `App.css` or `index.css`.
3. `vite.config.ts` sets `base: "./"`.
4. Replace root `index.html` with a Russian document that links the four existing stylesheets in contract order, contains `<div id="root"></div>`, and loads `/src/main.tsx` with a relative script path that works with `base: "./"`.
5. `src/types.ts` exports only the domain types from `docs/contracts/domain.md`.
6. `src/main.tsx` may call `document.getElementById("root")` once. Leave a comment that components must not touch `document`.
7. `App.tsx` renders the skip link, a placeholder `main`, and the footer strings. The shell phase replaces the router. Keep this file under 150 lines.
8. `npm run lint` and `npx tsc --noEmit` succeed. `npm run build` may wait for the shell if the stub cannot build yet; if it can, run it.
9. Commit tooling, then the typed stub.
10. Push `lab-5/react`. Do not open a pull request.

## Done when

The dev server shows the skip link and footer with the Lab 2 visual system, and `src/` contains no feature page yet.

## Closing message

Say the scaffold is pushed. UI kit and domain port can start. The product pull request waits for `05f-shell.md`.
