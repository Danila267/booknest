import type { FormEvent } from "react";
import featured from "../../docs/contracts/featured-books.json";
import { Button } from "./Button";

interface LoanFormProps {
  onValid: () => void;
}

export function LoanForm({ onValid }: LoanFormProps) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    onValid();
  }

  return (
    <form className="loan-form" id="loan-form" action="#loan-aside" method="get" onSubmit={submit}>
      <fieldset>
        <legend>Читатель</legend>
        <p className="field">
          <label className="field__label" htmlFor="reader-name">
            Имя
          </label>
          <input
            className="field__control"
            id="reader-name"
            name="readerName"
            type="text"
            required
            maxLength={80}
            pattern="[A-Za-zА-Яа-яЁё \-']{2,80}"
            autoComplete="name"
          />
        </p>
        <p className="field">
          <label className="field__label" htmlFor="reader-email">
            Электронная почта
          </label>
          <input className="field__control" id="reader-email" name="readerEmail" type="email" required maxLength={80} autoComplete="email" />
        </p>
        <p className="field">
          <label className="field__label" htmlFor="reader-phone">
            Телефон
          </label>
          <input
            className="field__control"
            id="reader-phone"
            name="readerPhone"
            type="tel"
            required
            pattern={"\\+?[0-9\\-\\s()]{10,18}"}
            autoComplete="tel"
            aria-describedby="phone-hint"
          />
        </p>
        <p className="field__hint" id="phone-hint">
          Для связи библиотекаря, например +7 900 000-00-00.
        </p>
      </fieldset>
      <fieldset>
        <legend>Книга и срок</legend>
        <p className="field">
          <label className="field__label" htmlFor="loan-book">
            Книга
          </label>
          <select className="field__control" id="loan-book" name="loanBook" required defaultValue="">
            <option value="">Выберите книгу</option>
            {featured.books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
        </p>
        <p className="field">
          <label className="field__label" htmlFor="loan-date">
            Дата выдачи
          </label>
          <input className="field__control" id="loan-date" name="loanDate" type="date" required min="2026-01-01" max="2027-12-31" />
        </p>
        <p className="field">
          <label className="field__label" htmlFor="loan-days">
            Дней на руках
          </label>
          <input className="field__control" id="loan-days" name="loanDays" type="number" required min={1} max={30} defaultValue={14} />
        </p>
      </fieldset>
      <fieldset>
        <legend>Подтверждение</legend>
        <p className="field">
          <label className="field__label" htmlFor="loan-comment">
            Комментарий
          </label>
          <textarea className="field__control" id="loan-comment" name="loanComment" maxLength={400} aria-describedby="comment-hint" />
        </p>
        <p className="field__hint" id="comment-hint">
          Необязательно. Например, удобное время, когда забрать книгу.
        </p>
        <p className="field field--checkbox">
          <input className="field__control" id="loan-agree" name="loanAgree" type="checkbox" value="yes" required />
          <label className="field__label" htmlFor="loan-agree">
            Понимаю, что это учебная форма и она никуда не отправляется.
          </label>
        </p>
      </fieldset>
      <p className="loan-form__actions">
        <Button type="submit">Отправить заявку</Button>
        <Button type="reset" ghost>
          Очистить
        </Button>
      </p>
    </form>
  );
}
