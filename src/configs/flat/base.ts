import type { ESLint, Linter } from "eslint";
import * as parser from "yaml-eslint-parser";

export default [
  {
    plugins: {
      get "github-actions"(): ESLint.Plugin {
        return require("../../index");
      },
    },
  },
  {
    files: [
      ".github/workflows/**/*.yml",
      ".github/workflows/**/*.yaml",
      "**/action.yml",
      "**/action.yaml",
    ],
    languageOptions: {
      parser,
    },
    rules: {},
  },
] satisfies Linter.Config[];
