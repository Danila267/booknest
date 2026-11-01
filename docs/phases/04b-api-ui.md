# Paste this whole file into a new chat

You are phase 04b. Replace the local shelf with Open Library and open the Lab 4 pull request.

## Human setup

```bash
cd /Users/danil267/projects/react/booknest
git fetch origin
git worktree add -b lab-4/api ../booknest-worktrees/lab4 origin/lab-3/js-app
cd ../booknest-worktrees/lab4
git merge --no-ff origin/lab-4/api-client
```

Open `/Users/danil267/projects/react/booknest-worktrees/lab4`.

## Stop unless

`pwd` ends with `booknest-worktrees/lab4` and the branch is `lab-4/api`.

## Read

`AGENTS.md`, `docs/design.md`, `docs/contracts/api.md`, `docs/contracts/domain.md`, `docs/contracts/copy.md`.

## Own

- `main.js`
- `ui/render.js`
- `book.js` only if the detail page cannot share `main.js` cleanly. Prefer one `main.js` that branches on `document.body.dataset.page`.
- a module script tag on `book.html`
- the Lab 4 row of `docs/STATUS.md`

Do not add a second `fetch` wrapper. Import `searchBooks`, `getWork`, and `describeError` from `api/client.js`.
Do not delete `data/books.js`. The detail page may still show the static featured book when there is no work id.

## Work

1. On the catalog, the first load and every filter change call `searchBooks`. Search input debounces 350ms. Other controls start at once. Each start aborts the previous controller.
2. Render exactly one of loading, success, empty, or error. Clear loading in `finally`, and do not let an aborted request’s `finally` overwrite a newer request.
3. Use the Russian messages from the copy contract for offline, 4xx, 5xx, and not-found. The error panel contains “Повторить”.
4. Page size is 20. Prev/Next stay inside `pageCount(total)`. Changing search, genre, sort, or availability sets page to 1.
5. Apply “Только доступные” with `applyAvailability` on the loaded page. For `author-asc`, sort that page with `sortBooks`. Leave a one-line comment that Open Library rejects `sort=author`.
6. The count is the number of visible cards. Pagination uses the API total. On an empty filtered page with a non-zero total, use the empty-page sentence and keep pagination available.
7. Wishlist snapshots still merge by id through `mergeWishlist`. A saved local slug may remain in the list even though new API cards use `/works/...` ids.
8. On `book.html`, an id that starts with `/works/` calls `getWork`. Missing id or `master-i-margarita` keeps the static page. Any other id shows the not-found state. Update the visible title, author, description, cover `alt`, and `img` `src` with `textContent` and attribute setters, not HTML strings.
9. Commit debounce and cancellation, then the four states, then pagination, then the detail request.
10. Check in the browser: a fast burst of typing sends one search, offline mode shows the offline message, retry runs again, and a bad work id shows not-found.
11. Push `lab-4/api` and open a pull request into `main`.

Pull request body:

```markdown
## Summary
- Catalog search uses Open Library with a 350ms debounce, abort of stale requests, and pages of 20.
- Loading, results, empty, and error are mutually exclusive, with separate offline, 4xx, and 5xx copy.
- Book detail loads a work by id and handles 404. The wishlist still comes from localStorage.

## Self-check
- [ ] fetch lives only in api/client.js
- [ ] async/await, response.ok, ApiError, URLSearchParams
- [ ] loading cleared in finally
- [ ] AbortController cancels the previous search
- [ ] Wishlist merge does not drop snapshots that are absent from the page
- [ ] No innerHTML

## Artifacts
- docs/lab4/api-collection.json
```

## Closing message

Lab 4 is ready. Please confirm the pull request for `lab-4/api`. The collection is `docs/lab4/api-collection.json`.
