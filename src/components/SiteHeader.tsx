interface SiteHeaderProps {
  current: "catalog" | "book" | "loan";
}

const LINKS = [
  { id: "catalog", href: "#/", label: "Каталог" },
  { id: "book", href: "#/book", label: "Карточка книги" },
  { id: "loan", href: "#/loan", label: "Выдача" },
] as const;

export function SiteHeader({ current }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <a className="site-header__brand" href="#/">
        BookNest
      </a>
      <p className="site-header__role">Роль: читатель</p>
      <nav className="site-nav" aria-label="Основное меню">
        <ul className="site-nav__list">
          {LINKS.map((link) => (
            <li key={link.id}>
              <a
                className="site-nav__link"
                href={link.href}
                aria-current={current === link.id ? "page" : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
