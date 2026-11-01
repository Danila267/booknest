# Paste this whole file into a new chat

You are the Lab 2 integrator. Link the stylesheets, check the three widths and both color schemes, and open the Lab 2 pull request.

## Human setup

```bash
cd /Users/danil267/projects/react/booknest
git fetch origin
git worktree add -b lab-2/styles ../booknest-worktrees/lab2 origin/lab-1/markup
cd ../booknest-worktrees/lab2
git merge --no-ff origin/lab-2/styles-tokens
git merge --no-ff origin/lab-2/styles-layout
git merge --no-ff origin/lab-2/styles-components
```

Open `/Users/danil267/projects/react/booknest-worktrees/lab2`.

## Stop unless

`pwd` ends with `booknest-worktrees/lab2` and the branch is `lab-2/styles`.

## Read

`AGENTS.md`, `docs/contracts/css.md`, `docs/contracts/html.md`, `docs/design.md`.

## Own

- Stylesheet `<link>` tags in the three HTML files
- `docs/lab2/*.png`
- the Lab 2 row of `docs/STATUS.md`

Do not rename classes, wrap elements, or edit the CSS except to fix a defect against `docs/contracts/css.md`.

## Work

1. Add the four stylesheet links to `index.html`, `book.html`, and `loan.html` in the order fixed by the HTML contract.
2. Count `@media` rules. The project must contain exactly the four named in the CSS contract.
3. Search the styles for `!important` and for selectors that start with `#`. There should be none.
4. Serve the folder and screenshot every page at 375, 768, and 1440 in light and in dark. Save 18 files in `docs/lab2/` using `{catalog|book|loan}-{375|768|1440}-{light|dark}.png`.
5. In the browser, check the skip link, a visible focus ring, wrapped navigation at 375px, a single column of cards there, a wrapping filter row at 768px, and the aside beside the main column at 1440px.
6. Update `docs/STATUS.md`.
7. Push `lab-2/styles` and open a pull request into `main`.

Pull request body:

```markdown
## Summary
- Paper-and-ink tokens, base styles, layout, and components for the three Lab 1 pages.
- Mobile-first layout at 375, 768, and 1440.
- Dark scheme by overriding variables. The spinner is the only animation and it stops for reduced motion.

## Self-check
- [ ] styles/tokens.css, base.css, layout.css, components.css
- [ ] At least 14 custom properties
- [ ] Header uses flexbox
- [ ] Catalog uses repeat(auto-fit, minmax(...))
- [ ] Exactly four media queries, in the files the contract names
- [ ] No !important, no ID selectors, no fixed pixel page widths
- [ ] Focus ring is visible
- [ ] HTML structure is unchanged apart from stylesheet links

## Artifacts
- docs/lab2/catalog-375-light.png
- docs/lab2/catalog-375-dark.png
- docs/lab2/catalog-768-light.png
- docs/lab2/catalog-768-dark.png
- docs/lab2/catalog-1440-light.png
- docs/lab2/catalog-1440-dark.png
- docs/lab2/book-375-light.png
- docs/lab2/book-375-dark.png
- docs/lab2/book-768-light.png
- docs/lab2/book-768-dark.png
- docs/lab2/book-1440-light.png
- docs/lab2/book-1440-dark.png
- docs/lab2/loan-375-light.png
- docs/lab2/loan-375-dark.png
- docs/lab2/loan-768-light.png
- docs/lab2/loan-768-dark.png
- docs/lab2/loan-1440-light.png
- docs/lab2/loan-1440-dark.png
```

## Closing message

Lab 2 is ready. Please confirm the pull request for `lab-2/styles`. Screenshots belong in `docs/lab2/`.
