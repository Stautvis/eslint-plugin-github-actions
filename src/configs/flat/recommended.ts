import type { Linter } from "eslint";
import base from "./base";
export default [
  ...base,
  {
    rules: {
      "github-actions/require-workflow-name": "error",
      "github-actions/require-step-name": "error",
      "github-actions/require-job-name": "error",
      "github-actions/require-job-timeout": "error",
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
] satisfies Linter.Config[];
