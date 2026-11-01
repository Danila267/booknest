# Paste this whole file into a new chat

You are phase 02a of BookNest. Add the design tokens and the base stylesheet.

## Human setup

```bash
cd /Users/danil267/projects/react/booknest
git worktree add -b lab-2/styles-tokens ../booknest-worktrees/02a docs/playbook
```

Open `/Users/danil267/projects/react/booknest-worktrees/02a`.

## Stop unless

`pwd` ends with `booknest-worktrees/02a` and the branch is `lab-2/styles-tokens`.

## Read

`AGENTS.md`, `docs/design.md`, `docs/contracts/css.md`.

## Own only

- `styles/tokens.css`
- `styles/base.css`

## Do not touch

HTML, `styles/layout.css`, `styles/components.css`, JavaScript, contracts.

## Work

1. Copy the `styles/tokens.css` block from `docs/contracts/css.md` unchanged.
2. Copy the `styles/base.css` block unchanged.
3. The only `@media` rule you may write is `prefers-color-scheme: dark` inside `tokens.css`.
4. Commit tokens, then base styles.
5. Push `lab-2/styles-tokens`. Do not open a pull request.

## Done when

Those two files match the contract and no other file changed.
Dark colors exist only as variable overrides.

## Closing message

Say the token slice is pushed and that pages stay unstyled until `INT-2-styles.md` links the sheets.
