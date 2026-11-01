# Paste this whole file into a new chat

You are phase 01c of BookNest. Build only the loan page.

## Human setup

```bash
cd /Users/danil267/projects/react/booknest
git worktree add -b lab-1/markup-loan ../booknest-worktrees/01c docs/playbook
```

Open `/Users/danil267/projects/react/booknest-worktrees/01c`.

## Stop unless

`pwd` ends with `booknest-worktrees/01c` and the branch is `lab-1/markup-loan`.
If not, stop. Do not switch the main checkout.

## Read

`AGENTS.md`, `docs/design.md`, `docs/contracts/html.md`, `docs/contracts/copy.md`, `docs/contracts/featured-books.json`.

## Own only

- `loan.html`
- `images/library-card.svg`

## Do not touch

`index.html`, `book.html`, `images/covers/`, styles, scripts, or contracts.
No CSS, no `<style>`, no `style` attributes, no stylesheet links.

## Work

1. Create `loan.html` from the loan section of `docs/contracts/html.md`.
2. Use three fieldsets. Include date, number, email, select, textarea, tel, text, and the required checkbox.
3. Every control has a visible `<label>` and a `name`.
4. The book select lists the six featured titles and ids.
5. Draw `images/library-card.svg` as specified.
6. Set `aria-current="page"` on “Выдача” only.
7. Commit the form first, then the librarian aside and illustration.
8. Push `lab-1/markup-loan`. Do not open a pull request.

## Done when

The form can be checked by the browser’s built-in validation, and the diff contains only `loan.html` and `images/library-card.svg`.

## Closing message

Say the loan slice is pushed and that Lab 1 waits for `INT-1-markup.md`.
