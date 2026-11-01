import { useEffect, useState } from "react";
import type { Book, WishItem } from "../types";
import { addWish, isWished, removeWish } from "./books";
import { readWishlist, writeWishlist } from "./storage";

interface WishlistController {
  wishlist: WishItem[];
  toggle: (book: Book) => void;
  remove: (id: string) => void;
}

export function useWishlist(): WishlistController {
  const [wishlist, setWishlist] = useState<WishItem[]>(() => readWishlist());

  useEffect(() => {
    writeWishlist(wishlist);
  }, [wishlist]);

  return {
    wishlist,
    toggle: (book) => {
      setWishlist((current) => (isWished(current, book.id) ? removeWish(current, book.id) : addWish(current, book)));
    },
    remove: (id) => {
      setWishlist((current) => removeWish(current, id));
    },
  };
}
