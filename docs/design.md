# BookNest design and behavior

BookNest is a quiet reading-room interface for a university book club.
A reader searches the shelf, opens a book, saves “Хочу прочитать”, and fills in a loan form.
A librarian is mentioned as the person who would confirm a loan. There is no login and no server-side save.

The look is paper and ink: a warm background, serif titles, sans-serif controls, and one terracotta accent.
Token values and CSS live in `docs/contracts/css.md`. This file decides behavior. If a later lab needs a widget, it reuses these patterns instead of introducing a new visual language.

## Who it is for

- A reader on a phone in a hallway, then on a laptop in the reading room.
- Keyboard users and screen-reader users. Every control has a visible name, a focus ring, and a hit area of at least `2.75rem`.
- Someone who has `prefers-color-scheme: dark` or `prefers-reduced-motion: reduce` set on the system. The app follows the system. It does not add a theme toggle.

## Reading order

1. Skip link “К содержанию”.
2. Sticky header: wordmark, “Роль: читатель”, and three links (Каталог, Карточка книги, Выдача).
3. One page title.
4. The task of that page (filters, book, or loan form).
5. Supporting material (wishlist, similar books, or the librarian note).
6. Footer that tells the truth: reviews and loan requests are checked in the browser and are not sent anywhere.

The header nav stays visible at 375px. It wraps. It does not collapse into a menu button.

## Catalog

- The filter form is the first task. Labels are always visible. Placeholders never replace labels.
- Search matches title and author, ignoring case, for the local shelf. With Open Library, search is the request `q`, debounced at 350ms.
- Genre, sort, “Только доступные”, reset, and pagination apply immediately and cancel an in-flight request.
- Changing search, genre, sort, or availability returns to page 1.
- The status line `Найдено книг: N` is the number of cards currently shown.
- Pagination `Страница X из Y` carries the larger result size. In the local catalog Y is 1.
- “Только доступные” filters the books already loaded. Open Library does not provide a trustworthy shelf-availability query. A short comment in the catalog code records that.
- If a filtered Open Library page has zero cards but later pages exist, the empty state says so and pagination stays usable.
- Loading, empty, error, and the card list are mutually exclusive. The wishlist stays on the page during all four.
- Pagination is hidden while loading or in error, and shown on success and on an empty page.
- The spinner is the only animation. Reduced motion sets its duration to zero and removes the animation. Nothing else moves, autoplays, or uses smooth scrolling.

## Wishlist

- The button reads “Хочу прочитать” and `aria-pressed="false"`.
- When saved, the button reads “В списке” and `aria-pressed="true"`. Activating it again removes the book.
- The wishlist panel shows the count and a remove button per item.
- Empty copy: “Пока пусто. Отметьте книги в каталоге.”
- Storage key `booknest.wishlist` holds snapshots `{ id, title, author, cover }` so the list still renders when the current page of results does not include those books.
- Matching is by `id` only. Local shelf slugs and later Open Library work keys are different identities. Old snapshots remain visible; they are not guessed into work keys.

## Book detail

- Breadcrumbs, cover with a specific `alt`, characteristics in a `dl`, description, reviews, a review form, and similar books.
- The static page features “Мастер и Маргарита”.
- With the API, `?id=` equal to an Open Library work key loads that work. A missing id keeps the featured static book. An unknown id shows “Такой книги нет в Open Library.”
- The review form validates in the browser and does not post to a server.

## Loan form

- Three groups: reader, book and dates, confirmation.
- The reader can see why each field is there (a hint under phone and comment).
- Submit runs native validation. Nothing is stored on a server.
- The aside explains that a librarian would confirm a real loan, and that this build does not do that.
- The React form shows a confirmation in the page after a valid submit: “Заявка проверена в браузере и никуда не отправлена.”

## Errors

| Situation | Message |
| --- | --- |
| Offline or network failure | Нет соединения. Проверьте сеть и повторите. |
| HTTP 4xx other than a missing book | Запрос отклонён. Проверьте условия поиска. |
| HTTP 404 on a book | Такой книги нет в Open Library. |
| HTTP 5xx | Open Library временно недоступен. Попробуйте ещё раз. |

Each error offers “Повторить”. Retry repeats the last catalog or detail request. An aborted request is not an error.

## Responsive behavior

| Width | What changes |
| --- | --- |
| 375px | One column. Filters stacked. Cards in one column. Wishlist below the list. |
| 768px (`48rem`) | Filters sit in a wrapping row. Characteristics use two columns. |
| 1440px (`90rem`) | The main task and the aside sit side by side. The aside sticks under the header. |

The card grid uses `repeat(auto-fit, minmax(...))`, so column count follows the width inside those layouts.

## Honesty rules

- Do not fake accounts, saved loans, published reviews, or live shelf counts.
- Do not show a successful loan as if a librarian received it.
- Do not hide a failed request behind an empty catalog.
- Do not animate layout changes.
