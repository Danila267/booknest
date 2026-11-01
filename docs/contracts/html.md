# HTML contract

Lab 1 creates three documents with the structures below and no CSS.
`width` and `height` on images are required. No `style` attribute, no `<style>`, no stylesheet link.
Lab 2 is the only phase that may add stylesheet links, and it adds only these, in this order, inside `head`:

```html
<link rel="stylesheet" href="styles/tokens.css">
<link rel="stylesheet" href="styles/base.css">
<link rel="stylesheet" href="styles/layout.css">
<link rel="stylesheet" href="styles/components.css">
```

Every page uses `lang="ru"`, `<meta charset="utf-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, one `h1`, and the landmarks `header`, `nav`, `main`, `footer`.
Every page also includes `article`, `section`, `aside`, `figure`, `time`, and `dl`.
Copy comes from `docs/contracts/copy.md`. Featured books come from `docs/contracts/featured-books.json` in array order, which is already Russian title order.

## Shared chrome

```html
<a class="skip-link" href="#content">К содержанию</a>
<header class="site-header">
  <a class="site-header__brand" href="index.html">BookNest</a>
  <p class="site-header__role">Роль: читатель</p>
  <nav class="site-nav" aria-label="Основное меню">
    <ul class="site-nav__list">
      <li><a class="site-nav__link" href="index.html">Каталог</a></li>
      <li><a class="site-nav__link" href="book.html">Карточка книги</a></li>
      <li><a class="site-nav__link" href="loan.html">Выдача</a></li>
    </ul>
  </nav>
</header>
```

Add `aria-current="page"` only to the link for the open page.
Footer on every page:

```html
<footer class="site-footer">
  <p class="site-footer__note">BookNest — книжный клуб университета. Каталог для читателей и библиотекарей.</p>
  <p class="site-footer__meta"><small>Учебный проект. Заявки и отзывы проверяются в браузере и никуда не отправляются.</small></p>
</footer>
```

`main` always has `id="content"`.

## Catalog, `index.html`

- `title`: `Каталог — BookNest`
- `body data-page="catalog"`
- Outline: h1, h2 filters, h2 list, h3 card titles, h2 wishlist, h2 club facts.

```html
<main id="content" class="page">
  <header class="page-intro">
    <h1>Каталог книжного клуба</h1>
    <p class="lead">Шесть книг текущей витрины. Отложите интересное в «Хочу прочитать» или оформите выдачу.</p>
  </header>
  <section class="filters" aria-labelledby="filters-title">
    <h2 id="filters-title">Поиск и фильтры</h2>
    <form class="filters__form" id="filters-form" role="search" action="index.html" method="get">
      <p class="field">
        <label class="field__label" for="search">Название или автор</label>
        <input class="field__control" id="search" name="search" type="search" maxlength="80" placeholder="Например, Булгаков" autocomplete="off">
      </p>
      <p class="field">
        <label class="field__label" for="genre">Жанр</label>
        <select class="field__control" id="genre" name="genre">
          <option value="all" selected>Все жанры</option>
          <option value="Роман">Роман</option>
          <option value="Поэзия">Поэзия</option>
          <option value="Фантастика">Фантастика</option>
          <option value="Детектив">Детектив</option>
          <option value="Нон-фикшн">Нон-фикшн</option>
          <option value="Драма">Драма</option>
        </select>
      </p>
      <p class="field">
        <label class="field__label" for="sort">Сортировка</label>
        <select class="field__control" id="sort" name="sort">
          <option value="title-asc" selected>По названию (А–Я)</option>
          <option value="author-asc">По автору (А–Я)</option>
          <option value="year-desc">Сначала новые</option>
          <option value="year-asc">Сначала старые</option>
        </select>
      </p>
      <p class="field field--checkbox">
        <input class="field__control" id="available" name="available" type="checkbox" value="1">
        <label class="field__label" for="available">Только доступные</label>
      </p>
      <p class="filters__actions">
        <button class="button" type="submit">Показать</button>
        <button class="button button--ghost" type="reset">Сбросить</button>
      </p>
    </form>
  </section>
  <section class="layout-catalog">
    <section class="catalog" aria-labelledby="catalog-title">
      <h2 id="catalog-title">Список книг</h2>
      <p class="catalog__count" role="status" aria-live="polite">Найдено книг: 6</p>
      <section class="state state--loading" hidden aria-live="polite">
        <p class="spinner" aria-hidden="true"></p>
        <p>Загрузка каталога…</p>
      </section>
      <section class="state state--empty" hidden>
        <h3 class="state__title">Ничего не найдено</h3>
        <p class="state__message">Измените запрос или сбросьте фильтры.</p>
      </section>
      <section class="state state--error" hidden role="alert">
        <h3 class="state__title">Не удалось загрузить каталог</h3>
        <p class="state__message">Open Library временно недоступен. Попробуйте ещё раз.</p>
        <button class="button" type="button" data-action="retry">Повторить</button>
      </section>
      <ul class="catalog__books"></ul>
      <nav class="pagination" aria-label="Страницы каталога">
        <button class="button button--ghost" type="button" data-action="page-prev" disabled>Назад</button>
        <p class="pagination__status">Страница <span data-page-current>1</span> из <span data-page-total>1</span></p>
        <button class="button button--ghost" type="button" data-action="page-next" disabled>Дальше</button>
      </nav>
    </section>
    <aside class="wishlist" aria-labelledby="wishlist-title">
      <h2 id="wishlist-title">Хочу прочитать <span class="wishlist__count" aria-live="polite">0</span></h2>
      <ul class="wishlist__list">
        <li class="wishlist__empty">Пока пусто. Отметьте книги в каталоге.</li>
      </ul>
    </aside>
  </section>
  <section class="club-facts" aria-labelledby="club-facts-title">
    <h2 id="club-facts-title">Сейчас в клубе</h2>
    <dl class="facts">
      <dt>Срок выдачи</dt>
      <dd><time datetime="P14D">14 дней</time></dd>
      <dt>Встречи</dt>
      <dd>Раз в две недели</dd>
      <dt>Роль на сайте</dt>
      <dd>Читатель</dd>
    </dl>
  </section>
</main>
```

Each book in the JSON becomes one list item inside `.catalog__books`:

```html
<li class="catalog__item">
  <article class="card">
    <figure class="card__cover">
      <img src="COVER" alt="ALT" width="240" height="360">
    </figure>
    <h3 class="card__title">TITLE</h3>
    <p class="card__author">AUTHOR</p>
    <p class="card__meta">
      <span class="badge">GENRE</span>
      <time datetime="YEAR">YEAR</time>
    </p>
    <p class="badge badge--available">Доступна</p>
    <p class="card__actions">
      <a class="button button--ghost" href="book.html?id=ID">Подробнее</a>
      <button class="button button--wish" type="button" aria-pressed="false" data-wish="ID">Хочу прочитать</button>
    </p>
  </article>
</li>
```

When `available` is false, the status element is `<p class="badge badge--unavailable">На руках</p>`.

## Detail, `book.html`

- `title`: `Мастер и Маргарита — BookNest`
- `body data-page="book"`
- The open book is the JSON object with `detailId`.
- Similar cards are `similarIds`, using the same card template without the loan button.
- Outline: h1 title, h2 characteristics, h2 description, h2 reviews, h3 reviewer names, h2 similar, h3 similar titles.

Regions, in order, inside `main.page`:

1. Breadcrumb nav:

```html
<nav class="crumbs" aria-label="Хлебные крошки">
  <ol class="crumbs__list">
    <li><a href="index.html">Каталог</a></li>
    <li><a href="index.html">Роман</a></li>
    <li aria-current="page">Мастер и Маргарита</li>
  </ol>
</nav>
```

2. `article.book` containing a header (`h1` title, `p.card__author`), then `section.layout-book`.
3. Inside the layout, `section.book__main` holds the cover figure (`book__cover card__cover`), characteristics, description, actions, and reviews.
4. Characteristics use `h2` “Характеристики” and `dl.specs` with Автор, Жанр, Год (`time`), Страниц, Язык экземпляра, Статус.
5. Description uses `h2` “Описание” and `p.book__description`.
6. Actions: a link `a.button` to `loan.html` with “Оформить выдачу”, and the wish button for this id.
7. Reviews use `section.reviews` and `h2` “Отзывы”. Each JSON review is an `article.review` with `h3` author, `p.review__meta` containing `time` and `span.badge` “Оценка: N из 5”, then a paragraph of the text.
8. The review form follows the reviews, `id="review-form"`, `action="#reviews"`, `method="get"`.
9. `aside.similar` with `h2` “Похожие книги” and `ul.similar__list`.

Review fields, each wrapped in `p.field` with a label:

| id | name | type | Constraints |
| --- | --- | --- | --- |
| review-name | reviewName | text | required, maxlength 80, pattern `[A-Za-zА-Яа-яЁё \-']{2,80}`, autocomplete `name`, label Имя |
| review-rating | reviewRating | number | required, min 1, max 5, label Оценка |
| review-text | reviewText | textarea | required, minlength 10, maxlength 500, label Текст отзыва |

Submit button “Опубликовать отзыв”. Under the form, `p.field__hint` with the review note from the copy file.

## Loan, `loan.html`

- `title`: `Заявка на выдачу — BookNest`
- `body data-page="loan"`
- Outline: h1, h2 Анкета, h2 Для библиотекаря.

```html
<main id="content" class="page">
  <header class="page-intro">
    <h1>Заявка на выдачу</h1>
    <p class="lead">Заполните анкету. В настоящем клубе её подтвердил бы библиотекарь. Этот учебный макет никуда её не отправляет.</p>
  </header>
  <section class="layout-loan">
    <article class="loan">
      <h2>Анкета</h2>
      <form class="loan-form" id="loan-form" action="#loan-aside" method="get"></form>
      <p class="loan-note" id="loan-note" hidden>Заявка проверена в браузере и никуда не отправлена.</p>
    </article>
    <aside class="loan-aside" id="loan-aside">
      <h2>Для библиотекаря</h2>
      <figure class="loan-figure">
        <img src="images/library-card.svg" width="320" height="200" alt="Макет читательского билета BookNest: имя читателя и срок выдачи 14 дней">
        <figcaption>Макет билета. Клуб не выпускает настоящие билеты в этом проекте.</figcaption>
      </figure>
      <dl class="facts">
        <dt>Срок</dt>
        <dd><time datetime="P14D">14 дней</time></dd>
        <dt>Кто подтверждает</dt>
        <dd>Библиотекарь клуба</dd>
        <dt>Где</dt>
        <dd>Читальный зал, учебный макет</dd>
      </dl>
    </aside>
  </section>
</main>
```

The form contains three `fieldset` elements. Each has a `legend`.

| Fieldset legend | Fields |
| --- | --- |
| Читатель | name, email, phone |
| Книга и срок | book select, date, days |
| Подтверждение | comment, agreement |

| id | name | type | Constraints and label |
| --- | --- | --- | --- |
| reader-name | readerName | text | required, maxlength 80, same name pattern, autocomplete `name`. Label: Имя |
| reader-email | readerEmail | email | required, maxlength 80, autocomplete `email`. Label: Электронная почта |
| reader-phone | readerPhone | tel | required, pattern `\+?[0-9\-\s()]{10,18}`, autocomplete `tel`, `aria-describedby="phone-hint"`. Label: Телефон. Hint id `phone-hint`: “Для связи библиотекаря, например +7 900 000-00-00.” |
| loan-book | loanBook | select | required. Label: Книга. First option value `""` and text “Выберите книгу”. Then one option per featured book, value = id, text = title. |
| loan-date | loanDate | date | required, min `2026-01-01`, max `2027-12-31`. Label: Дата выдачи |
| loan-days | loanDays | number | required, min 1, max 30, value 14. Label: Дней на руках |
| loan-comment | loanComment | textarea | maxlength 400. Label: Комментарий. Not required. |
| loan-agree | loanAgree | checkbox | required, value `yes`. Label: Понимаю, что это учебная форма и она никуда не отправляется. |

Hints use `p.field__hint`. Checkbox uses `p.field.field--checkbox` with the input before the label.
Actions: submit “Отправить заявку”, reset “Очистить”, both in `p.loan-form__actions`.

## Covers

`01a` creates `images/covers/*.svg` for every featured `cover`, plus `images/covers/placeholder.svg`.
Each SVG is 240 by 360. Draw a full-bleed rectangle in `coverColor`, a narrow darker spine, and the title and author in `#fff8f4` using Georgia, wrapping the title so it stays inside the canvas.
The placeholder uses fill `#e7dece`, ink `#1c1714`, and the words “BookNest”.
`01c` creates `images/library-card.svg` at 320 by 200: cream ground `#f3eee4`, a terracotta band `#7a2e22`, and the words “BookNest” and “Читательский билет”.
SVG files are images, not CSS. They still must not be referenced through a `style` attribute in HTML.
