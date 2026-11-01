interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="crumbs" aria-label="Хлебные крошки">
      <ol className="crumbs__list">
        {items.map((item) => (
          <li key={item.label} aria-current={item.href ? undefined : "page"}>
            {item.href ? <a href={item.href}>{item.label}</a> : item.label}
          </li>
        ))}
      </ol>
    </nav>
  );
}
