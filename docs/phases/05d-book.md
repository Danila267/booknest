# Paste this whole file into a new chat

You are phase 05d. Build the book detail feature.

## Human setup

```bash
cd /Users/danil267/projects/react/booknest
git fetch origin
git worktree add -b lab-5/react-book ../booknest-worktrees/05d origin/lab-5/react
```

The base must already contain the merged UI kit and domain port.
Open `/Users/danil267/projects/react/booknest-worktrees/05d`.

## Stop unless

`pwd` ends with `booknest-worktrees/05d` and the branch is `lab-5/react-book`.
Stop if `src/api/client.ts` or `src/components/ErrorBox.tsx` is missing.

## Read

`AGENTS.md`, `docs/lab5/components.md`, `docs/design.md`, `docs/contracts/api.md`, `docs/contracts/featured-books.json`.

## Own only

- `src/components/ReviewList.tsx`
- `src/components/ReviewForm.tsx`
- `src/components/BookPage.tsx`

## Do not touch

`App.tsx`, catalog files, loan files, `src/types.ts`, styles, contracts.
You may import `BookCard`, `Button`, `Badge`, `Specs`, `Breadcrumbs`, `StateView`, `EmptyState`, and `getWork`.

## Work

1. `BookPage` reads `bookId` from props. No id renders `EmptyState` with “Выберите книгу в каталоге.”
2. An id starting with `/works/` fetches `getWork` and aborts on cleanup. 404 and other failures use `ErrorBox` and the copy contract.
3. The static featured book is the fallback only when `bookId` is `master-i-margarita`. Similar books are the three featured snapshots, skipping the book that is open.
4. `ReviewList` renders the two sample reviews with `Badge` for the rating. Keys are author plus date.
5. `ReviewForm` is uncontrolled, validates natively, prevents navigation, and shows the review note. It does not append a fake published review.
6. The wish control calls `onToggleWish`. This page does not touch `localStorage`.
7. No `any`, no `document`, no files over 150 lines.
8. Commit reviews, then the page.
9. Push `lab-5/react-book`. Do not open a pull request.

## Done when

`BookPage` compiles without editing the shell.

## Closing message

Say the book feature is pushed and waits for the shell.
