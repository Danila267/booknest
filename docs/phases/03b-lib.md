# Paste this whole file into a new chat

You are phase 03b of BookNest. Write the pure book functions and their tests.

## Human setup

```bash
cd /Users/danil267/projects/react/booknest
git worktree add -b lab-3/js-lib ../booknest-worktrees/03b docs/playbook
```

Open `/Users/danil267/projects/react/booknest-worktrees/03b`.

## Stop unless

`pwd` ends with `booknest-worktrees/03b` and the branch is `lab-3/js-lib`.

## Read

`AGENTS.md`, `docs/contracts/domain.md`.

## Own only

- `lib/books.js`
- `lib/books.test.js`

## Do not touch

HTML, CSS, `data/`, `api/`, `ui/`, `main.js`, contracts.
Do not add a dependency. Use the built-in `node:test` runner.

## Work

1. Implement `PAGE_SIZE`, `FILTER_DEFAULTS`, `sanitizeFilters`, `filterBooks`, `sortBooks`, `applyAvailability`, `pageCount`, `isWished`, `addWish`, `removeWish`, and `mergeWishlist` exactly as the domain contract describes.
2. Tests must prove: case-insensitive title and author search, genre, availability, unknown genre yields an empty list, sort does not mutate the input, Russian title order, corrupt filter input falls back, add/remove/merge do not mutate, and a wishlist snapshot survives when that id is absent from the page.
3. Use fixture objects inside the test. Do not import `data/books.js`.
4. Commit the functions, then the tests.
5. Push `lab-3/js-lib`. Do not open a pull request.

## Done when

`node --test lib/books.test.js` passes.

## Closing message

Say the library slice is pushed and that the UI must not be built in this chat.
