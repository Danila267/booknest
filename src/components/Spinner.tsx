import type { ReactNode } from "react";

interface SpinnerProps {
  children: ReactNode;
}

export function Spinner({ children }: SpinnerProps) {
  return (
    <section className="state state--loading" aria-live="polite">
      <p className="spinner" aria-hidden="true" />
      <p>{children}</p>
    </section>
  );
}
