import type { ReactNode } from "react";
import type { Status } from "../types";
import { EmptyState } from "./EmptyState";
import { ErrorBox } from "./ErrorBox";
import { Spinner } from "./Spinner";

interface StateViewProps {
  status: Status;
  loadingText: string;
  emptyTitle: string;
  emptyText: string;
  errorTitle: string;
  errorMessage: string;
  onRetry: () => void;
  children: ReactNode;
}

export function StateView({
  status,
  loadingText,
  emptyTitle,
  emptyText,
  errorTitle,
  errorMessage,
  onRetry,
  children,
}: StateViewProps) {
  if (status === "loading") return <Spinner>{loadingText}</Spinner>;
  if (status === "empty") return <EmptyState title={emptyTitle} text={emptyText} />;
  if (status === "error") return <ErrorBox title={errorTitle} message={errorMessage} onRetry={onRetry} />;
  return children;
}
