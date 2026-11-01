# Paste this whole file into a new chat

You are phase 02c of BookNest. Add the component stylesheet.

## Human setup

```bash
cd /Users/danil267/projects/react/booknest
git worktree add -b lab-2/styles-components ../booknest-worktrees/02c docs/playbook
```

Open `/Users/danil267/projects/react/booknest-worktrees/02c`.

## Stop unless

`pwd` ends with `booknest-worktrees/02c` and the branch is `lab-2/styles-components`.

## Read

`AGENTS.md`, `docs/design.md`, `docs/contracts/css.md`.

## Own only

- `styles/components.css`

## Do not touch

HTML, the other stylesheets, JavaScript, contracts.

## Work

1. Copy the `styles/components.css` block from `docs/contracts/css.md` unchanged.
2. The only `@media` rule in this file is the final `prefers-reduced-motion: reduce` block.
3. Do not add `!important` or an ID selector.
4. Push `lab-2/styles-components`. Do not open a pull request.

## Done when

`styles/components.css` is the only change, the spinner is the only animation, and reduced motion disables it.

## Closing message

Say the component slice is pushed and that Lab 2 still needs `INT-2-styles.md` to link the CSS and capture screenshots.
