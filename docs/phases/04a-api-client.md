# Paste this whole file into a new chat

You are phase 04a of BookNest. Build the Open Library client, the mapper, and the API collection. Do not wire them to a page.

## Human setup

```bash
cd /Users/danil267/projects/react/booknest
git worktree add -b lab-4/api-client ../booknest-worktrees/04a docs/playbook
```

Open `/Users/danil267/projects/react/booknest-worktrees/04a`.

## Stop unless

`pwd` ends with `booknest-worktrees/04a` and the branch is `lab-4/api-client`.

## Read

`AGENTS.md`, `docs/contracts/api.md`, `docs/contracts/domain.md`, `docs/contracts/copy.md`.

## Own only

- `api/client.js`
- `api/mapBook.js`
- `api/client.test.js`
- `docs/lab4/api-collection.json`

## Do not touch

HTML, CSS, `data/`, `lib/`, `ui/`, `main.js`, `src/`, contracts.
`fetch` may appear only in `api/client.js`.

## Work

1. Implement `ApiError`, `searchBooks`, `getWork`, and `describeError` from the API contract.
2. Implement pure mapping in `api/mapBook.js`. Search hits have an empty description. Availability is `ebook_access` of `public` or `borrowable`.
3. Never send `sort=author`. It returns HTTP 500.
4. Tests use `node:test` and stub `globalThis.fetch`. Cover a 200 search, a 404 work, a 500 response, a thrown `TypeError`, and `AbortError` passing through. No live network in the test file.
5. Save a Postman Collection v2.1 at `docs/lab4/api-collection.json` with the four requests named in the contract.
6. You may send one live request while writing the collection to confirm the documented params. If `subject` or `sort=title` fails, stop and report it. Do not quietly change the contract.
7. Commit the mapper, the client, the tests, and the collection as separate commits.
8. Push `lab-4/api-client`. Do not open a pull request.

## Done when

`node --test api/client.test.js` passes, and a search of the repo shows `fetch` only in `api/client.js`.

## Closing message

Say the client slice is pushed and that the catalog still uses local data until `04b-api-ui.md`.
