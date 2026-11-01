# CSS contract

The blocks below are the stylesheets. Copy them into the path named on the fence.
Do not add a fifth `@media` rule. Do not restyle tokens, radii, or the accent.

Allowed queries:

| Query | File |
| --- | --- |
| `(prefers-color-scheme: dark)` | `styles/tokens.css` |
| `(min-width: 48rem)` and `(min-width: 90rem)` | `styles/layout.css` |
| `(prefers-reduced-motion: reduce)` | end of `styles/components.css` |

`layout.css` may set `display`, `flex`, `grid`, `gap`, `position`, `width`, `max-width`, `min-width`, and page padding.
`components.css` may set `display` only on `.badge`, `.button`, `.spinner`, `a.button`, and the `[hidden]` rules.
`tokens.css` contains custom properties and the dark override, not component selectors.

## `styles/tokens.css`

```css
:root {
  color-scheme: light;
  --color-bg: #f3eee4;
  --color-bg-elevated: #fffdf9;
  --color-bg-muted: #e7dece;
  --color-ink: #1c1714;
  --color-ink-muted: #5c534b;
  --color-line: #d9cdb8;
  --color-accent: #7a2e22;
  --color-accent-ink: #fff8f4;
  --color-available: #1d6b43;
  --color-unavailable: #8a5a12;
  --color-focus: #1e4d8c;
  --color-danger: #8e2f2f;
  --color-danger-bg: #f8e6e1;
  --font-serif: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
  --font-sans: "Avenir Next", "Segoe UI", sans-serif;
  --text-sm: 0.875rem;
  --text-md: 1.0625rem;
  --text-lg: 1.5rem;
  --text-xl: 2.125rem;
  --space-2xs: 0.25rem;
  --space-xs: 0.5rem;
  --space-sm: 0.75rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2.5rem;
  --radius-sm: 0.375rem;
  --radius-md: 0.75rem;
  --shadow-card: 0 0.125rem 0.5rem rgb(28 23 20 / 8%);
  --content-max: 72rem;
  --measure: 65ch;
  --track-min: 16rem;
  --sidebar: 22rem;
  --header-offset: 4.5rem;
  --duration: 0.8s;
  --ease: linear;
}

@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
    --color-bg: #161311;
    --color-bg-elevated: #221e1b;
    --color-bg-muted: #2c2622;
    --color-ink: #f6efe6;
    --color-ink-muted: #cbbba8;
    --color-line: #3f362f;
    --color-accent: #f0b2a4;
    --color-accent-ink: #1c1714;
    --color-available: #8fceab;
    --color-unavailable: #e6c07b;
    --color-focus: #9ec1e6;
    --color-danger: #f0a8a0;
    --color-danger-bg: #3a2422;
    --shadow-card: 0 0.125rem 0.5rem rgb(0 0 0 / 35%);
  }
}
```

## `styles/base.css`

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-ink);
  font-family: var(--font-sans);
  font-size: var(--text-md);
  line-height: 1.6;
}

h1,
h2,
h3,
p,
figure,
dl,
dd,
ul,
ol {
  margin: 0;
  padding: 0;
}

ul,
ol {
  list-style: none;
}

h1,
h2,
h3 {
  font-family: var(--font-serif);
  font-weight: 600;
  line-height: 1.25;
}

h1 {
  font-size: var(--text-xl);
}

h2 {
  font-size: var(--text-lg);
}

h3 {
  font-size: var(--text-md);
}

a {
  color: var(--color-accent);
}

img {
  display: block;
  max-width: 100%;
  height: auto;
}

button,
input,
select,
textarea {
  font: inherit;
  color: inherit;
}

:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}

::placeholder {
  color: var(--color-ink-muted);
  opacity: 1;
}

.skip-link {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

.skip-link:focus {
  position: fixed;
  top: var(--space-sm);
  left: var(--space-sm);
  z-index: 3;
  width: auto;
  height: auto;
  margin: 0;
  padding: var(--space-xs) var(--space-md);
  overflow: visible;
  clip: auto;
  background: var(--color-accent);
  color: var(--color-accent-ink);
  border-radius: var(--radius-sm);
}
```

## `styles/layout.css`

```css
.page {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  width: min(100% - 2 * var(--space-md), var(--content-max));
  margin-inline: auto;
  padding-block: var(--space-lg);
}

.page-intro,
.filters,
.club-facts,
.layout-catalog,
.layout-book,
.layout-loan,
.book__main,
.field,
.card,
.review,
.review-form,
.loan,
.loan-aside,
.wishlist,
.state {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.site-header,
.site-footer {
  padding: var(--space-md);
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm) var(--space-md);
}

.site-nav__list,
.crumbs__list,
.pagination,
.card__meta,
.review__meta,
.card__actions,
.filters__actions,
.loan-form__actions,
.review-form__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-sm);
}

.filters__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.field--checkbox,
.wishlist__item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--space-sm);
}

.catalog__books,
.similar__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--track-min)), 1fr));
  gap: var(--space-md);
}

.catalog__item {
  display: flex;
}

.card {
  flex: 1 1 auto;
  width: 100%;
}

.specs,
.facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-sm) var(--space-lg);
}

.facts {
  grid-template-columns: auto 1fr;
}

@media (min-width: 48rem) {
  .filters__form {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-end;
  }

  .filters__form .field {
    flex: 1 1 12rem;
  }
}

@media (min-width: 90rem) {
  .layout-catalog,
  .layout-book,
  .layout-loan {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(var(--track-min), var(--sidebar));
    align-items: start;
  }

  .wishlist,
  .similar,
  .loan-aside {
    position: sticky;
    top: var(--header-offset);
  }
}
```

## `styles/components.css`

```css
.site-header,
.site-footer {
  background: var(--color-bg-elevated);
  border-bottom: 1px solid var(--color-line);
}

.site-footer {
  border-bottom: 0;
  border-top: 1px solid var(--color-line);
}

.site-header__brand {
  color: var(--color-ink);
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  text-decoration: none;
}

.site-header__role,
.site-footer__meta,
.card__author,
.catalog__count,
.field__hint,
.lead {
  color: var(--color-ink-muted);
  font-size: var(--text-sm);
}

.lead,
.book__description {
  max-width: var(--measure);
  font-size: var(--text-md);
}

.site-nav__link {
  color: var(--color-ink);
  text-decoration: none;
}

.site-nav__link[aria-current="page"] {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 0.25rem;
}

.card,
.review,
.loan,
.wishlist,
.state {
  padding: var(--space-md);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
}

.card {
  height: 100%;
}

.card__cover img,
.book__cover img {
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  background: var(--color-bg-muted);
  border-radius: var(--radius-sm);
}

.book__cover {
  width: min(100%, var(--track-min));
}

.card__actions {
  margin-top: auto;
}

.badge {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: var(--space-2xs) var(--space-xs);
  border-radius: var(--radius-sm);
  background: var(--color-bg-muted);
  color: var(--color-ink);
  font-size: var(--text-sm);
}

.badge--available {
  color: var(--color-available);
}

.badge--unavailable {
  color: var(--color-unavailable);
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: var(--space-xs) var(--space-md);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  background: var(--color-accent);
  color: var(--color-accent-ink);
  text-align: center;
  cursor: pointer;
}

a.button {
  text-decoration: none;
}

.button--ghost {
  background: transparent;
  color: var(--color-ink);
  border-color: var(--color-line);
}

.button--wish[aria-pressed="true"] {
  background: var(--color-accent);
  color: var(--color-accent-ink);
  border-color: transparent;
}

.button:disabled {
  opacity: 0.55;
}

.field__control {
  min-height: 2.75rem;
  width: 100%;
  padding: var(--space-xs) var(--space-sm);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  background: var(--color-bg-elevated);
}

.field--checkbox .field__control {
  width: 1.25rem;
  min-height: 1.25rem;
}

textarea.field__control {
  min-height: 8rem;
  resize: vertical;
}

.state--empty {
  background: var(--color-bg-muted);
  box-shadow: none;
}

.state--error {
  background: var(--color-danger-bg);
  color: var(--color-danger);
  box-shadow: none;
}

.state--loading {
  background: transparent;
  border-color: transparent;
  box-shadow: none;
}

.spinner {
  display: block;
  width: 1.25rem;
  height: 1.25rem;
  border: 3px solid var(--color-line);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: booknest-spin var(--duration) var(--ease) infinite;
}

@keyframes booknest-spin {
  to {
    transform: rotate(1turn);
  }
}

.crumbs a {
  color: var(--color-ink-muted);
}

.loan-figure img {
  width: min(100%, 20rem);
  background: var(--color-bg-muted);
  border-radius: var(--radius-sm);
}

.state[hidden],
.catalog__books[hidden],
.pagination[hidden],
.wishlist__empty[hidden],
.loan-note[hidden] {
  display: none;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --duration: 0s;
  }

  .spinner {
    animation: none;
  }
}
```

`width: 100%` on a control is the control filling its flex item, not a fixed page container.
The card action margin is the only sibling margin: it pins the buttons to the bottom of a stretched card.
