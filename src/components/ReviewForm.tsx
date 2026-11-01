import type { FormEvent } from "react";
import { Button } from "./Button";

export function ReviewForm() {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.currentTarget.reportValidity();
  }

  return (
    <form className="review-form" id="review-form" action="#reviews" method="get" onSubmit={submit}>
      <p className="field">
        <label className="field__label" htmlFor="review-name">
          Имя
        </label>
        <input
          className="field__control"
          id="review-name"
          name="reviewName"
          type="text"
          required
          maxLength={80}
          pattern="[A-Za-zА-Яа-яЁё \-']{2,80}"
          autoComplete="name"
        />
      </p>
      <p className="field">
        <label className="field__label" htmlFor="review-rating">
          Оценка
        </label>
        <input className="field__control" id="review-rating" name="reviewRating" type="number" required min={1} max={5} />
      </p>
      <p className="field">
        <label className="field__label" htmlFor="review-text">
          Текст отзыва
        </label>
        <textarea className="field__control" id="review-text" name="reviewText" required minLength={10} maxLength={500} />
      </p>
      <p className="review-form__actions">
        <Button type="submit">Опубликовать отзыв</Button>
      </p>
      <p className="field__hint">Отзыв проверяется только браузером и никуда не отправляется.</p>
    </form>
  );
}
