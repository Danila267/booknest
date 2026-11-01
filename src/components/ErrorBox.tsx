import { Button } from "./Button";

interface ErrorBoxProps {
  title: string;
  message: string;
  onRetry: () => void;
}

export function ErrorBox({ title, message, onRetry }: ErrorBoxProps) {
  return (
    <section className="state state--error" role="alert">
      <h3 className="state__title">{title}</h3>
      <p className="state__message">{message}</p>
      <Button type="button" onClick={onRetry}>
        Повторить
      </Button>
    </section>
  );
}
