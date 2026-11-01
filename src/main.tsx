import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

// Components must not touch document. This mount is the only lookup.
const root = document.getElementById("root");
if (!root) throw new Error("Root element #root is missing.");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
