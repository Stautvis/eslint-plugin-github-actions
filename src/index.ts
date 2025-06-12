import requireStepName from "./rules/require-step-name";
import enforceJobKeyNaming from "./rules/enforce-job-key-naming";

export = {
  rules: {
    "require-step-name": requireStepName,
    "enforce-job-key-naming": enforceJobKeyNaming,
  },
};
