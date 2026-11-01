import type { ReactNode } from "react";

interface BadgeProps {
  tone: "neutral" | "available" | "unavailable";
  children: ReactNode;
}

export function Badge({ tone, children }: BadgeProps) {
  const className =
    tone === "available" ? "badge badge--available" : tone === "unavailable" ? "badge badge--unavailable" : "badge";

  return <span className={className}>{children}</span>;
}
