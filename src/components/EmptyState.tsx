interface EmptyStateProps {
  title: string;
  text: string;
}

export function EmptyState({ title, text }: EmptyStateProps) {
  return (
    <section className="state state--empty">
      <h3 className="state__title">{title}</h3>
      <p className="state__message">{text}</p>
    </section>
  );
}
