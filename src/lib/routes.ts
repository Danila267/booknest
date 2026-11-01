import type { Route } from "../types";

export function parseHash(hash: string): Route {
  const value = hash.startsWith("#") ? hash.slice(1) : hash;
  const parts = value.split("/").filter((part) => part.length > 0);

  if (parts.length === 0) return { name: "catalog" };
  if (parts[0] === "loan") return { name: "loan" };
  if (parts[0] === "book") {
    if (!parts[1]) return { name: "book" };
    return { name: "book", bookId: decodeURIComponent(parts.slice(1).join("/")) };
  }
  return { name: "catalog" };
}

export function catalogHash(): string {
  return "#/";
}

export function bookHash(id?: string): string {
  if (!id) return "#/book";
  return `#/book/${encodeURIComponent(id)}`;
}

export function loanHash(): string {
  return "#/loan";
}
