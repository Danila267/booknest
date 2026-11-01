import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

const browserGlobals = {
  AbortController: "readonly",
  DOMException: "readonly",
  Element: "readonly",
  FormData: "readonly",
  HTMLButtonElement: "readonly",
  HTMLElement: "readonly",
  HTMLFormElement: "readonly",
  HTMLInputElement: "readonly",
  HTMLSelectElement: "readonly",
  URL: "readonly",
  URLSearchParams: "readonly",
  console: "readonly",
  document: "readonly",
  fetch: "readonly",
  localStorage: "readonly",
  navigator: "readonly",
  window: "readonly",
};

export default tseslint.config(
  {
    ignores: ["dist/**", "docs/**", "node_modules/**"],
  },
  {
    files: ["**/*.js"],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: browserGlobals,
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "error",
      eqeqeq: "error",
      "no-var": "error",
    },
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.{ts,tsx}"],
  })),
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.flat.recommended.rules,
      eqeqeq: "error",
      "no-var": "error",
    },
  },
);
