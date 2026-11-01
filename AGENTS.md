# BookNest agent rules

BookNest is a university book-club catalog for the course “Modern Web Technologies”.
Labs 1–5 share one repository and one visual system. Later labs continue earlier labs.

The working tree on this machine is `/Users/danil267/projects/react/booknest`.
Parallel chats must use separate git worktrees. Two chats in this folder will overwrite each other.

## Start of every chat

1. Read this file.
2. Read `docs/STATUS.md` and the phase brief the user pasted.
3. Run `pwd` and `git branch --show-current`.
4. Continue only when both match the phase brief.
5. If they do not match, stop. Tell the user which folder to open. Do not switch the branch of the main checkout.

## What you own

Edit only the files named in your phase brief.
If a file you need is missing and another phase owns it, stop and name that phase.
Do not “helpfully” build the next lab.

Frozen documents (do not edit unless your phase brief names them):

- `AGENTS.md`
- `README.md`
- `docs/design.md`
- `docs/contracts/**`
- `docs/phases/**`
- `docs/lab5/components.md`

Normative contracts, when they disagree with memory, win:

| Topic | File |
| --- | --- |
| Visual design and UX behavior | `docs/design.md` |
| CSS that implements the design | `docs/contracts/css.md` |
| Page structure, classes, copy in HTML | `docs/contracts/html.md` |
| Featured books | `docs/contracts/featured-books.json` |
| Domain model, storage, pure functions | `docs/contracts/domain.md` |
| Open Library access | `docs/contracts/api.md` |
| React tree and state | `docs/lab5/components.md` |
| UI strings shared with React | `docs/contracts/copy.md` |

## Repository workflow

- Official integration branches are only `lab-1/markup`, `lab-2/styles`, `lab-3/js-app`, `lab-4/api`, and `lab-5/react`.
- Slice work uses the branch in its phase brief, then the integrator merges slices into the official branch.
- Never commit on `main`.
- Commits are small and conventional (`feat`, `fix`, `docs`, `chore`). One concern per commit.
- Author every commit as `Danila267 <SnegirevD505@gmail.com>`.
- Do not change git config.
- Do not add `Co-authored-by` or any other author trailer.
- If a commit message gains a co-author trailer before it is pushed, amend that commit to remove the trailer, then push.
- Do not push `--force`. Do not skip hooks.
- Slice phases push their own branch and do not open a pull request.
- Only an integration phase opens a pull request into `main`.

## Guardrails

- Mobile-first. Base styles are for a 375px-wide viewport. Wider layouts start at `48rem` and `90rem`.
- Semantic elements before `div`. The React mount node `#root` is the one plain container the SPA needs.
- One `h1` per page. Do not skip heading levels.
- Every control has a `<label>` and a `name`, except buttons.
- User-facing text is Russian. Code identifiers and comments are English.
- Show user-provided text with `textContent` or React text. Do not build HTML strings from it.
- No `innerHTML`, `insertAdjacentHTML`, or `outerHTML`.
- No inline styles and no presentational HTML attributes (`align`, `bgcolor`, `border`, `style`). `width` and `height` on images stay.
- No `!important`.
- No ID selectors in CSS.
- No fixed pixel widths on page containers. Use `max-width`, `min()`, `fr`, and `rem`.
- Prefer `gap` over margins between siblings. The one allowed margin is `margin-top: auto` on `.card__actions`.
- Exactly four `@media` rules exist in the whole project, in the files named in `docs/contracts/css.md`. Do not add another.
- No direct `fetch` outside `api/client.js` or `src/api/client.ts`.
- Do not mutate source arrays (`sort`, `splice`, `reverse`, assignment into an existing book). Copy, then change the copy.
- `JSON.parse` sits inside `try/catch`.
- React: no `any`, no `key={index}`, no `document` or `querySelector` in components, no state mutation. Props use `interface`. Status, genre, and sort use union types.
- Component files stay at or under 150 lines.
- Do not invent a second palette, a hamburger menu, a login form, or a backend.

## Definition of done

- The owned files match the contracts.
- `git diff` contains no file outside the phase ownership.
- The closing message names the branch and says whether a pull request is required.
- Integration phases end with: the lab is ready, the official branch name, and a reminder to confirm the pull request and the screenshots under `docs/labN/`.
