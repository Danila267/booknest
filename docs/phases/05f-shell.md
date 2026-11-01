# Paste this whole file into a new chat

You are phase 05f. Connect the React features, prove the build, and open the Lab 5 pull request.

## Human setup

```bash
cd /Users/danil267/projects/react/booknest
git fetch origin
cd ../booknest-worktrees/lab5
git switch lab-5/react
git merge --no-ff origin/lab-5/react-ui
git merge --no-ff origin/lab-5/react-domain
git merge --no-ff origin/lab-5/react-catalog
git merge --no-ff origin/lab-5/react-book
git merge --no-ff origin/lab-5/react-loan
```

If `../booknest-worktrees/lab5` does not exist, create it from `origin/lab-5/react` before merging.
Open that folder.

## Stop unless

`pwd` ends with `booknest-worktrees/lab5` and the branch is `lab-5/react`.
Stop if any of CatalogPage, BookPage, or LoanPage is missing after the merges.

## Read

`AGENTS.md`, `docs/lab5/components.md`, `docs/design.md`, `docs/contracts/domain.md`.

## Own

- `src/App.tsx`
- `src/main.tsx` only if the root mount needs a comment or import fix
- `src/lib/useWishlist.ts`
- the Lab 5 row of `docs/STATUS.md`

Do not restyle the kit. Do not change API behavior. A compile fix in a merged file is allowed when the merge itself does not compile; commit it as `fix`.

## Work

1. `useWishlist` loads `booknest.wishlist` through `storage.ts`, exposes toggle and remove, and writes a new array after each change.
2. `App` listens to `hashchange`, parses a `Route`, and renders SiteHeader, the matching page, and SiteFooter.
3. Pass wishlist callbacks into the catalog and the book page. The loan page does not receive the wishlist.
4. Derived pressed flags are computed where the cards are rendered.
5. `npm run lint` is clean. `npm run build` succeeds.
6. In the browser, exercise search, an empty query, a forced failure if you can simulate offline, pagination, wish, remove, reload, the book route, the missing-book route, and a valid loan submit.
7. Check one phone-width viewport and one wide viewport. The Lab 2 stylesheet is doing the layout.
8. Push `lab-5/react` and open a pull request into `main`.

Pull request body:

```markdown
## Summary
- Lab 4 behavior now runs as a React 19 + Vite + TypeScript app.
- Search, filters, sort, pagination, wishlist, and the four request states share the Lab 2 styles.
- The loan and review forms still validate in the browser and do not pretend to reach a server.

## Self-check
- [ ] docs/lab5/components.md matches the tree that shipped
- [ ] At least 8 components and at least 5 presentational components
- [ ] Button, Badge, Spinner, EmptyState, and ErrorBox are each used at least twice
- [ ] Props use interfaces. Status, genre, and sort use unions. No any.
- [ ] No key={index}, no document access in components, no state mutation
- [ ] Derived lists are computed during render
- [ ] Component files are within 150 lines
- [ ] ESLint react-hooks and typescript-eslint are clean
- [ ] npm run build succeeds

## Artifacts
- docs/lab5/components.md
- Build output from npm run build
```

## Closing message

Lab 5 is ready. Please confirm the pull request for `lab-5/react`. The component map is `docs/lab5/components.md`. Start the app with `npm run dev`.
