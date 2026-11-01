# Paste this whole file into a new chat

You are phase 01a of BookNest. Build only the catalog page.

## Human setup

```bash
cd /Users/danil267/projects/react/booknest
git worktree add -b lab-1/markup-catalog ../booknest-worktrees/01a docs/playbook
```

Open `/Users/danil267/projects/react/booknest-worktrees/01a`.

## Stop unless

`pwd` ends with `booknest-worktrees/01a` and `git branch --show-current` prints `lab-1/markup-catalog`.
If not, stop and ask for that folder. Do not change the branch of the main checkout.

## Read

`AGENTS.md`, `docs/design.md`, `docs/contracts/html.md`, `docs/contracts/copy.md`, `docs/contracts/featured-books.json`.

## Own only

- `index.html`
- `images/covers/*.svg` for the six featured covers and `images/covers/placeholder.svg`

## Do not touch

`book.html`, `loan.html`, `styles/`, `data/`, `api/`, `src/`, contracts, or this brief.
No CSS, no `<style>`, no `style` attributes, no stylesheet links.

## Work

1. Create `index.html` exactly as the catalog section of `docs/contracts/html.md`.
2. Fill `.catalog__books` with one card per featured book, in JSON order.
3. Draw the SVG covers described in that contract, including the placeholder.
4. Check there is one `h1`, heading levels do not skip, every image has `alt`, `width`, and `height`, and the filter controls have `label` + `name`.
5. Make two commits, for example the page shell, then the cards and covers.
6. Push `lab-1/markup-catalog`. Do not open a pull request.

## Done when

The catalog file stands alone, the six covers exist, and `git diff --name-only` against `docs/playbook` lists only `index.html` and files under `images/covers/`.

## Closing message

Say the catalog slice is committed and pushed, and that Lab 1 is not ready until `INT-1-markup.md` merges all three pages.
