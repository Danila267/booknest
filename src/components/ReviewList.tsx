import featured from "../../docs/contracts/featured-books.json";
import { Badge } from "./Badge";

export function ReviewList() {
  return (
    <section className="reviews" id="reviews" aria-labelledby="reviews-title">
      <h2 id="reviews-title">Отзывы</h2>
      {featured.reviews.map((review) => (
        <article className="review" key={`${review.author}-${review.date}`}>
          <h3>{review.author}</h3>
          <p className="review__meta">
            <time dateTime={review.date}>{review.dateLabel}</time>
            <Badge tone="neutral">Оценка: {review.rating} из 5</Badge>
          </p>
          <p>{review.text}</p>
        </article>
      ))}
    </section>
  );
}
