# BookNest

BookNest is a university book-club catalog. Readers search Open Library, open a book, save titles in «Хочу прочитать», and check a loan form in the browser. The form is not sent to a librarian.

The running application is the React app. `index.html` loads `src/main.tsx`. Routes are `#/`, `#/book`, `#/book/<id>`, and `#/loan`.

## Install

```bash
npm ci
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
```

`npm run dev` starts the catalog. `npm run build` typechecks the app and writes the static build. `npm run lint` checks the TypeScript and React code. `node --test` runs the Open Library client and book-library tests.
