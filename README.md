# BookNest

University book-club catalog for the course “Modern Web Technologies”.
The shelf starts as three static pages, then gains local interactivity, the Open Library API, and a React + TypeScript client.
Labs continue each other in one repository. The visual system stays the same: warm paper, serif titles, one accent color.

The playbook on this branch is the source of truth for every later chat.
Product pages are not in the repository yet.

## Build it in parallel

Each chat needs its own git worktree. Do not open two phase chats in this folder.

Wave 1 can start now. These nine slices do not touch the same files:

| Paste into a new chat | Worktree | Branch |
| --- | --- | --- |
| `docs/phases/01a-catalog.md` | `../booknest-worktrees/01a` | `lab-1/markup-catalog` |
| `docs/phases/01b-detail.md` | `../booknest-worktrees/01b` | `lab-1/markup-detail` |
| `docs/phases/01c-loan.md` | `../booknest-worktrees/01c` | `lab-1/markup-loan` |
| `docs/phases/02a-tokens-base.md` | `../booknest-worktrees/02a` | `lab-2/styles-tokens` |
| `docs/phases/02b-layout.md` | `../booknest-worktrees/02b` | `lab-2/styles-layout` |
| `docs/phases/02c-components.md` | `../booknest-worktrees/02c` | `lab-2/styles-components` |
| `docs/phases/03a-data.md` | `../booknest-worktrees/03a` | `lab-3/js-data` |
| `docs/phases/03b-lib.md` | `../booknest-worktrees/03b` | `lab-3/js-lib` |
| `docs/phases/04a-api-client.md` | `../booknest-worktrees/04a` | `lab-4/api-client` |

Create a worktree from this branch, open that folder in Cursor, and paste the whole phase file:

```bash
cd /Users/danil267/projects/react/booknest
mkdir -p ../booknest-worktrees
git worktree add -b lab-1/markup-catalog ../booknest-worktrees/01a docs/playbook
```

Replace the branch, the folder, and the phase file for each row.
The full command list is in `docs/phases/README.md`.

Later waves are sequential because they join those slices:

1. `INT-1` merges the three pages onto `lab-1/markup` and opens the Lab 1 pull request.
2. `INT-2` adds the stylesheets onto `lab-2/styles` and opens the Lab 2 pull request.
3. `03c` wires the local catalog onto `lab-3/js-app`.
4. `04b` switches the catalog to Open Library onto `lab-4/api`.
5. Lab 5 scaffolds once, then splits the UI kit, domain port, and pages into parallel chats, then a shell chat connects them.

## What the reader gets

- A catalog that can be searched, filtered, and sorted, with a visible result count.
- A book page with the cover, facts, reviews, and similar books.
- A loan form that validates in the browser and says clearly that it is not delivered to a librarian.
- A “Хочу прочитать” list stored on this device.
- Loading, empty, and specific offline / 4xx / 5xx states once the API is connected.

## Course map

| Lab | Official branch | Result |
| --- | --- | --- |
| 1 | `lab-1/markup` | Semantic pages, no CSS |
| 2 | `lab-2/styles` | Tokens, adaptive layout, dark scheme |
| 3 | `lab-3/js-app` | Local shelf of 40 books |
| 4 | `lab-4/api` | Open Library search and detail |
| 5 | `lab-5/react` | The same product in React 19 + Vite + TypeScript |

`npm run dev` and `npm run build` arrive with Lab 5. Until then the pages open as files.

Read `AGENTS.md` before changing the product.
