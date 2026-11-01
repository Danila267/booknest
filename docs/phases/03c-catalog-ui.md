# Paste this whole file into a new chat

You are phase 03c. Turn the styled catalog into a local interactive app. This is Lab 3.

## Human setup

```bash
cd /Users/danil267/projects/react/booknest
git fetch origin
git worktree add -b lab-3/js-app ../booknest-worktrees/lab3 origin/lab-2/styles
cd ../booknest-worktrees/lab3
git merge --no-ff origin/lab-3/js-data
git merge --no-ff origin/lab-3/js-lib
```

Open `/Users/danil267/projects/react/booknest-worktrees/lab3`.

## Stop unless

`pwd` ends with `booknest-worktrees/lab3` and the branch is `lab-3/js-app`.

## Read

`AGENTS.md`, `docs/design.md`, `docs/contracts/domain.md`, `docs/contracts/html.md`, `docs/contracts/copy.md`.

## Own

- `main.js`
- `ui/render.js`
- the module script tag on `index.html`
- `package.json`, `package-lock.json`, and `eslint.config.js` for a minimal Lab 3 lint setup
- the Lab 3 row of `docs/STATUS.md`

Do not edit `data/books.js` or `lib/books.js` unless a failing test proves a bug. Commit that fix separately.
Do not call `fetch`. Do not add the Open Library client. Do not build React.

## Work

1. Add `<script type="module" src="main.js"></script>` at the end of `body` in `index.html`. Add no classes and no markup.
2. `main.js` loads `getBooks()`, reads the two `localStorage` keys inside `try/catch`, and keeps the single `state` object from the domain contract.
3. `ui/render.js` exports `render(state)` and paints with `createElement`, `replaceChildren`, and `textContent`.
4. Search title and author, filter genre, filter availability, sort, count, empty state, and reset all work on the 40 local books.
5. The wish button toggles `aria-pressed` and the labels “Хочу прочитать” / “В списке”. The wishlist count and remove button work. Filters and wishlist persist across reloads.
6. Pagination stays on page 1 and its buttons stay disabled. All local matches are visible.
7. Delegate events from `document` in the order written in the domain contract. `submit` on the filter form is prevented.
8. Add ESLint with `no-undef`, `no-unused-vars`, `eqeqeq`, and `no-var`. Script `npm run lint`. No React plugin yet.
9. Commit the script tag and state shell, then render, then wishlist persistence, then the lint setup.
10. Manually exercise search, an empty result, reset, wish, remove, and reload. The console stays quiet.
11. Push `lab-3/js-app` and open a pull request into `main`.

Pull request body:

```markdown
## Summary
- The catalog searches, filters, and sorts 40 local books from one state object and one render function.
- “Хочу прочитать” and the active filters persist in localStorage.
- Empty results and a reset control are part of the same page.

## Self-check
- [ ] ESM modules: data/books.js, lib/books.js, ui/render.js, main.js
- [ ] Event delegation only
- [ ] JSON.parse is inside try/catch
- [ ] No innerHTML, no fetch, no array mutation of the source shelf
- [ ] aria-pressed on the wish button
- [ ] ESLint is clean and the console has no errors

## Artifacts
- No new screenshots. Lab 2 shots still describe the layout.
```

## Closing message

Lab 3 is ready. Please confirm the pull request for `lab-3/js-app`.
