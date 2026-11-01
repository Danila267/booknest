# Paste this whole file into a new chat

You are phase 03a of BookNest. Create the local shelf of 40 books.

## Human setup

```bash
cd /Users/danil267/projects/react/booknest
git worktree add -b lab-3/js-data ../booknest-worktrees/03a docs/playbook
```

Open `/Users/danil267/projects/react/booknest-worktrees/03a`.

## Stop unless

`pwd` ends with `booknest-worktrees/03a` and the branch is `lab-3/js-data`.

## Read

`AGENTS.md`, `docs/contracts/domain.md`, `docs/contracts/featured-books.json`.

## Own only

- `data/books.js`

## Do not touch

HTML, CSS, `lib/`, `api/`, `src/`, contracts.

## Work

1. Export a frozen array `books` and `getBooks()` as specified in the domain contract.
2. The first six records match the featured JSON: same id, title, author, genre, year, available, cover, and description. Omit `coverColor`, `alt`, `pages`, and `language`.
3. Add 34 more real published books. Each of the six genres appears at least five times across the full 40. About a quarter are unavailable. Descriptions are original Russian sentences, not copied blurbs.
4. Extra covers use `images/covers/placeholder.svg`.
5. Commit the six featured books, then the rest of the shelf.
6. Push `lab-3/js-data`. Do not open a pull request.

## Done when

`node --input-type=module -e 'import { books, getBooks } from "./data/books.js"; const copy = getBooks(); copy.reverse(); if (books.length !== 40 || copy.length !== 40) process.exit(1)'` exits 0. Reversing the copy must not change `books`.

## Closing message

Say the data slice is pushed and that the catalog does not use it until `03c-catalog-ui.md`.
