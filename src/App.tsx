import { useEffect, useState } from "react";
import { BookPage } from "./components/BookPage";
import { CatalogPage } from "./components/CatalogPage";
import { LoanPage } from "./components/LoanPage";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { isWished } from "./lib/books";
import { parseHash } from "./lib/routes";
import { useWishlist } from "./lib/useWishlist";
import type { Route } from "./types";

export function App() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  const { wishlist, toggle, remove } = useWishlist();

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <>
      <a className="skip-link" href="#content">
        К содержанию
      </a>
      <SiteHeader current={route.name} />
      <main id="content" className="page">
        {route.name === "catalog" ? (
          <CatalogPage wishlist={wishlist} onToggleWish={toggle} onRemoveWish={remove} />
        ) : null}
        {route.name === "book" ? (
          <BookPage bookId={route.bookId} isSaved={(id) => isWished(wishlist, id)} onToggleWish={toggle} />
        ) : null}
        {route.name === "loan" ? <LoanPage /> : null}
      </main>
      <SiteFooter />
    </>
  );
}
