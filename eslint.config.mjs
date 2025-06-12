import { defineConfig } from "eslint/config";

import eslintPluginYml from "eslint-plugin-yml";
import githubActions from "./lib/index.js";

const config = defineConfig([
  ...eslintPluginYml.configs["flat/recommended"],
  {
    plugins: {
      "github-actions": githubActions,
    },
  },
  {
    files: ["**/*.yml", "**/*.yaml"],
    rules: {
      "github-actions/require-step-name": "error",
      "github-actions/enforce-job-key-naming": [
        "error",
        {
          style: "kebab-case",
        },
      ],
      "github-actions/enforce-env-key-naming": [
        "error",
        {
          style: "UPPER_CASE",
        },
      ],
    },
  },
]);

export default config;
