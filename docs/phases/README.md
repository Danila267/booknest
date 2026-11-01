# Phase briefs

Paste one brief into a new Cursor chat after opening its worktree.
Wave 1 slices can run at the same time. Later rows wait for the branches in the “after” column.

The main checkout is `/Users/danil267/projects/react/booknest` on `docs/playbook`.
Do not point a slice chat at that folder.

```bash
cd /Users/danil267/projects/react/booknest
mkdir -p ../booknest-worktrees

git worktree add -b lab-1/markup-catalog ../booknest-worktrees/01a docs/playbook
git worktree add -b lab-1/markup-detail  ../booknest-worktrees/01b docs/playbook
git worktree add -b lab-1/markup-loan    ../booknest-worktrees/01c docs/playbook
git worktree add -b lab-2/styles-tokens  ../booknest-worktrees/02a docs/playbook
git worktree add -b lab-2/styles-layout  ../booknest-worktrees/02b docs/playbook
git worktree add -b lab-2/styles-components ../booknest-worktrees/02c docs/playbook
git worktree add -b lab-3/js-data        ../booknest-worktrees/03a docs/playbook
git worktree add -b lab-3/js-lib         ../booknest-worktrees/03b docs/playbook
git worktree add -b lab-4/api-client     ../booknest-worktrees/04a docs/playbook
```

| Brief | Folder to open | After |
| --- | --- | --- |
| `01a-catalog.md` | `../booknest-worktrees/01a` | playbook |
| `01b-detail.md` | `../booknest-worktrees/01b` | playbook |
| `01c-loan.md` | `../booknest-worktrees/01c` | playbook |
| `02a-tokens-base.md` | `../booknest-worktrees/02a` | playbook |
| `02b-layout.md` | `../booknest-worktrees/02b` | playbook |
| `02c-components.md` | `../booknest-worktrees/02c` | playbook |
| `03a-data.md` | `../booknest-worktrees/03a` | playbook |
| `03b-lib.md` | `../booknest-worktrees/03b` | playbook |
| `04a-api-client.md` | `../booknest-worktrees/04a` | playbook |
| `INT-1-markup.md` | `../booknest-worktrees/lab1` | 01a, 01b, 01c pushed |
| `INT-2-styles.md` | `../booknest-worktrees/lab2` | Lab 1 branch and 02a, 02b, 02c |
| `03c-catalog-ui.md` | `../booknest-worktrees/lab3` | Lab 2 branch, 03a, 03b |
| `04b-api-ui.md` | `../booknest-worktrees/lab4` | Lab 3 branch and 04a |
| `05s-scaffold.md` | `../booknest-worktrees/lab5` | Lab 4 branch |
| `05a-ui-kit.md` | `../booknest-worktrees/05a` | 05s pushed |
| `05b-domain.md` | `../booknest-worktrees/05b` | 05s pushed |
| `05c-catalog.md` | `../booknest-worktrees/05c` | 05a and 05b merged into `lab-5/react` |
| `05d-book.md` | `../booknest-worktrees/05d` | same base as 05c |
| `05e-loan.md` | `../booknest-worktrees/05e` | same base as 05c |
| `05f-shell.md` | `../booknest-worktrees/lab5` | 05c, 05d, 05e merged |
| `INT-assemble.md` | основная папка `booknest` | после срезов, которые уже есть |

Integration worktrees are created in those briefs, from the official previous lab branch, not all from the playbook.

Screenshots:

- Lab 1: Lighthouse accessibility for all three pages in `docs/lab1/`.
- Lab 2: each page at 375, 768, and 1440, in light and dark, in `docs/lab2/`. Name files `{catalog|book|loan}-{375|768|1440}-{light|dark}.png`.
- Lab 4: `docs/lab4/api-collection.json` is created by phase 04a.
