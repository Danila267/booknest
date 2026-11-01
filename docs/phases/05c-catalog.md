# Paste this whole file into a new chat

You are phase 05c. Build the catalog feature from the existing UI kit and domain port.

## Human setup

```bash
cd /Users/danil267/projects/react/booknest
git fetch origin
git worktree add -b lab-5/react-catalog ../booknest-worktrees/05c origin/lab-5/react
```

The base `origin/lab-5/react` must already contain the merged UI kit and domain port.
Open `/Users/danil267/projects/react/booknest-worktrees/05c`.

## Stop unless

`pwd` ends with `booknest-worktrees/05c` and the branch is `lab-5/react-catalog`.
Also stop if `src/components/Button.tsx` or `src/api/client.ts` is missing.

## Read

`AGENTS.md`, `docs/lab5/components.md`, `docs/design.md`, `docs/contracts/domain.md`, `docs/contracts/api.md`.

## Own only

- `src/components/FilterBar.tsx`
- `src/components/BookCard.tsx`
- `src/components/Pagination.tsx`
- `src/components/WishlistPanel.tsx`
- `src/components/StateView.tsx`
- `src/components/CatalogPage.tsx`
- `src/lib/useCatalog.ts`

## Do not touch

`src/App.tsx`, book page, loan page, `src/types.ts`, styles, vanilla files, contracts.

## Work

1. `FilterBar` is controlled. It reports changes and does not store them.
2. `BookCard` takes a `Book`, `pressed`, and `onToggle`. The key will be `book.id` at the call site.
3. `useCatalog` owns filters, status, error message, the server page, and total. It derives nothing into extra state. Cleanup aborts the controller.
4. Debounce only the search box. Reset page to 1 when the query changes for a reason other than pagination.
5. `StateView` renders one of Spinner, EmptyState, ErrorBox, or its children.
6. `CatalogPage` derives visible books during render and passes wishlist callbacks in from props. It does not read `localStorage`.
7. Match the four UI states, the count sentence, and the pagination visibility rules in `docs/design.md`.
8. Stay within 150 lines per file. No `any`, no index keys, no `document`.
9. Commit presentational pieces, then the hook and page.
10. Push `lab-5/react-catalog`. Do not open a pull request.

## Done when

The page exports compile, and this branch does not rewrite `App.tsx`.

## Closing message

Say the catalog feature is pushed and waits for the shell to mount it.
