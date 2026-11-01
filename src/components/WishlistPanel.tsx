import type { WishItem } from "../types";
import { Button } from "./Button";
import { EmptyState } from "./EmptyState";

interface WishlistPanelProps {
  items: WishItem[];
  onRemove: (id: string) => void;
}

export function WishlistPanel({ items, onRemove }: WishlistPanelProps) {
  return (
    <aside className="wishlist" aria-labelledby="wishlist-title">
      <h2 id="wishlist-title">
        Хочу прочитать <span className="wishlist__count">{items.length}</span>
      </h2>
      {items.length === 0 ? (
        <EmptyState title="Хочу прочитать" text="Пока пусто. Отметьте книги в каталоге." />
      ) : (
        <ul className="wishlist__list">
          {items.map((item) => (
            <li className="wishlist__item" key={item.id}>
              <span>{item.title}</span>
              <Button type="button" ghost onClick={() => onRemove(item.id)}>
                Убрать
              </Button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
