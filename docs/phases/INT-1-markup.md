# Paste this whole file into a new chat

You are the Lab 1 integrator. Join the three pages, validate them, and open the Lab 1 pull request.

## Human setup

```bash
cd /Users/danil267/projects/react/booknest
git fetch origin
git worktree add -b lab-1/markup ../booknest-worktrees/lab1 origin/docs/playbook
cd ../booknest-worktrees/lab1
git merge --no-ff origin/lab-1/markup-catalog
git merge --no-ff origin/lab-1/markup-detail
git merge --no-ff origin/lab-1/markup-loan
```

Open `/Users/danil267/projects/react/booknest-worktrees/lab1`.
If a slice is only local, merge that local branch instead of `origin/...`.

## Stop unless

`pwd` ends with `booknest-worktrees/lab1` and the branch is `lab-1/markup`.

## Read

`AGENTS.md`, `docs/contracts/html.md`, `docs/STATUS.md`.

## Own

The merged HTML and images, plus screenshots under `docs/lab1/`.
Do not add CSS or JavaScript. Do not restructure a page to “improve” it.
If a merged page disagrees with `docs/contracts/html.md`, fix only that mismatch and commit the fix on `lab-1/markup`.

## Work

1. Confirm `index.html`, `book.html`, and `loan.html` each have one `h1`, the required landmarks, labels, and native validation attributes.
2. Validate with the W3C NU API:

```bash
curl -fsS -F out=json -F file=@index.html https://validator.w3.org/nu/ > docs/lab1/index-validator.json
curl -fsS -F out=json -F file=@book.html https://validator.w3.org/nu/ > docs/lab1/book-validator.json
curl -fsS -F out=json -F file=@loan.html https://validator.w3.org/nu/ > docs/lab1/loan-validator.json
```

Fix real errors. Warnings that do not fail the course can remain if you list them in the pull request.
3. Run Lighthouse accessibility against each page and save screenshots in `docs/lab1/` as `lighthouse-index.png`, `lighthouse-book.png`, and `lighthouse-loan.png`. Accessibility should be at least 90. If Lighthouse cannot run, say exactly what blocked it and do not invent a score.
4. Update the INT-1 row in `docs/STATUS.md`.
5. Push `lab-1/markup` and open a pull request into `main`.

Pull request body:

```markdown
## Summary
- Semantic catalog, book detail, and loan pages with no CSS.
- Shared header, footer, and the BookNest reading-room copy.
- Native validation on the loan and review forms.

## Self-check
- [ ] One h1 per page, no skipped headings
- [ ] header, nav, main, article, section, aside, footer, figure, time, dl on each page
- [ ] Labels, names, required, min, maxlength, pattern
- [ ] lang, charset, viewport, image width and height
- [ ] No style attributes, no stylesheets, no !important
- [ ] W3C NU errors are zero
- [ ] Lighthouse accessibility is at least 90, or the blocker is stated

## Artifacts
- docs/lab1/lighthouse-index.png
- docs/lab1/lighthouse-book.png
- docs/lab1/lighthouse-loan.png
- docs/lab1/*-validator.json
```

## Closing message

Lab 1 is ready. Please confirm the pull request for `lab-1/markup`. Screenshots belong in `docs/lab1/`.
