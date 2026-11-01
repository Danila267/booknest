import js from "@eslint/js";

const browserGlobals = {
  AbortController: "readonly",
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

export default [
  {
    ignores: ["dist/**", "docs/**", "node_modules/**"],
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
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
];
