# Paste this whole file into a new chat

You are phase 01b of BookNest. Build only the book detail page.

## Human setup

```bash
cd /Users/danil267/projects/react/booknest
git worktree add -b lab-1/markup-detail ../booknest-worktrees/01b docs/playbook
```

Open `/Users/danil267/projects/react/booknest-worktrees/01b`.

## Stop unless

`pwd` ends with `booknest-worktrees/01b` and the branch is `lab-1/markup-detail`.
If not, stop. Do not switch the main checkout.

## Read

`AGENTS.md`, `docs/design.md`, `docs/contracts/html.md`, `docs/contracts/copy.md`, `docs/contracts/featured-books.json`.

## Own only

- `book.html`

## Do not touch

`index.html`, `loan.html`, anything under `images/`, styles, scripts, or contracts.
Cover files are created by phase 01a. Reference their paths. Do not recreate them.
No CSS, no `<style>`, no `style` attributes, no stylesheet links.

## Work

1. Create `book.html` for the featured book `master-i-margarita`, following the detail section of `docs/contracts/html.md`.
2. Include both sample reviews and the three similar books.
3. Set `aria-current="page"` on “Карточка книги” only.
4. Keep one `h1` and do not skip heading levels.
5. The review form uses the required, min, max, minlength, maxlength, and pattern values from the contract.
6. Commit the breadcrumbs and book facts first, then the reviews and similar books.
7. Push `lab-1/markup-detail`. Do not open a pull request.

## Done when

`git diff --name-only` against `docs/playbook` lists only `book.html`.

## Closing message

Say the detail slice is pushed and that Lab 1 waits for `INT-1-markup.md`.
