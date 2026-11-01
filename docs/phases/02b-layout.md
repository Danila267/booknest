# Paste this whole file into a new chat

You are phase 02b of BookNest. Add the layout stylesheet.

## Human setup

```bash
cd /Users/danil267/projects/react/booknest
git worktree add -b lab-2/styles-layout ../booknest-worktrees/02b docs/playbook
```

Open `/Users/danil267/projects/react/booknest-worktrees/02b`.

## Stop unless

`pwd` ends with `booknest-worktrees/02b` and the branch is `lab-2/styles-layout`.

## Read

`AGENTS.md`, `docs/design.md`, `docs/contracts/css.md`, `docs/contracts/html.md`.

## Own only

- `styles/layout.css`

## Do not touch

HTML, `styles/tokens.css`, `styles/base.css`, `styles/components.css`, JavaScript, contracts.

## Work

1. Copy the `styles/layout.css` block from `docs/contracts/css.md` unchanged.
2. The only `@media` rules in your file are `(min-width: 48rem)` and `(min-width: 90rem)`.
3. Do not set colors, borders, fonts, or shadows in this file.
4. One commit is enough if the file is a straight copy. If you split work, keep commits focused.
5. Push `lab-2/styles-layout`. Do not open a pull request.

## Done when

`styles/layout.css` is the only change. The catalog grid uses `repeat(auto-fit, minmax(...))`. The header uses flexbox.

## Closing message

Say the layout slice is pushed and that Lab 2 still needs `INT-2-styles.md`.
