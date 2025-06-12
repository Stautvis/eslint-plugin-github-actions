import requireStepName from "./rules/require-step-name";
import enforceJobKeyNaming from "./rules/enforce-job-key-naming";
import enforceEnvKeyNaming from "./rules/enforce-env-key-naming";

export = {
  rules: {
    "require-step-name": requireStepName,
    "enforce-job-key-naming": enforceJobKeyNaming,
    "enforce-env-key-naming": enforceEnvKeyNaming,
  },
};
