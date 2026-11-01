# Paste this whole file into a new chat

You are phase 05e. Build the loan page.

## Human setup

```bash
cd /Users/danil267/projects/react/booknest
git fetch origin
git worktree add -b lab-5/react-loan ../booknest-worktrees/05e origin/lab-5/react
```

The base must contain the UI kit. The domain port is not required.
Open `/Users/danil267/projects/react/booknest-worktrees/05e`.

## Stop unless

`pwd` ends with `booknest-worktrees/05e` and the branch is `lab-5/react-loan`.
Stop if `src/components/Button.tsx` is missing.

## Read

`AGENTS.md`, `docs/lab5/components.md`, `docs/contracts/html.md`, `docs/contracts/copy.md`, `docs/contracts/featured-books.json`.

## Own only

- `src/components/LoanPage.tsx`

If the file would pass 150 lines, also own `src/components/LoanForm.tsx` and keep the page as the container. Record that split only in the commit message. Do not edit `docs/lab5/components.md`.

## Do not touch

`App.tsx`, catalog, book page, API, styles, contracts.

## Work

1. Reproduce the three fieldsets, labels, names, and native constraints from the HTML contract.
2. Keep inputs uncontrolled. On submit, prevent the browser navigation, call `reportValidity()`, and then show “Заявка проверена в браузере и никуда не отправлена.”
3. Include the librarian aside, the library-card image, the `dl`, and the `time` element.
4. The book options are the six featured books.
5. No `any`, no `document`, no server call.
6. Push `lab-5/react-loan`. Do not open a pull request.

## Done when

A valid submit shows the confirmation and an empty required field is stopped by the browser.

## Closing message

Say the loan feature is pushed and waits for the shell.
