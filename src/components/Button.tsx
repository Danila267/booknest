import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  pressed?: boolean;
  wish?: boolean;
  ghost?: boolean;
  href?: string;
  onClick?: () => void;
}

export function Button({
  children,
  type = "button",
  disabled = false,
  pressed,
  wish = false,
  ghost = false,
  href,
  onClick,
}: ButtonProps) {
  const className = ["button", ghost ? "button--ghost" : "", wish ? "button--wish" : ""]
    .filter(Boolean)
    .join(" ");
  const pressedProps = pressed === undefined ? {} : { "aria-pressed": pressed };

  if (href) {
    return (
      <a className={className} href={href} onClick={onClick} {...pressedProps}>
        {children}
      </a>
    );
  }

  return (
    <button className={className} type={type} disabled={disabled} onClick={onClick} {...pressedProps}>
      {children}
    </button>
  );
}
