import requireStepName from "./rules/require-step-name";
import requireJobName from "./rules/require-job-name";
import requireJobTimeout from "./rules/require-job-timeout";
import enforceJobKeyNaming from "./rules/enforce-job-key-naming";
import enforceEnvKeyNaming from "./rules/enforce-env-key-naming";

import flatBase from "./configs/flat/base";
import flatRecommended from "./configs/flat/recommended";

export = {
  configs: {
    "flat/base": flatBase,
    "flat/recommended": flatRecommended,
  },
  rules: {
    "require-step-name": requireStepName,
    "require-job-name": requireJobName,
    "require-job-timeout": requireJobTimeout,
    "enforce-job-key-naming": enforceJobKeyNaming,
    "enforce-env-key-naming": enforceEnvKeyNaming,
  },
};
