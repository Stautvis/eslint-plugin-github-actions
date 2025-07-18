import requireWorkflowName from "./rules/require-workflow-name";
import requireStepName from "./rules/require-step-name";
import requireJobName from "./rules/require-job-name";
import requireJobTimeout from "./rules/require-job-timeout";
import enforceJobKeyNaming from "./rules/enforce-job-key-naming";
import enforceEnvKeyNaming from "./rules/enforce-env-key-naming";
import enforceOutputKeyNaming from "./rules/enforce-output-key-naming";
import enforceUsesVersion from "./rules/enforce-uses-version";
import orderWorkflow from "./rules/order-workflow";

import flatBase from "./configs/flat/base";
import flatRecommended from "./configs/flat/recommended";

export = {
  configs: {
    "flat/base": flatBase,
    "flat/recommended": flatRecommended,
  },
  rules: {
    "order-workflow": orderWorkflow,
    "require-workflow-name": requireWorkflowName,
    "require-step-name": requireStepName,
    "require-job-name": requireJobName,
    "require-job-timeout": requireJobTimeout,
    "enforce-job-key-naming": enforceJobKeyNaming,
    "enforce-env-key-naming": enforceEnvKeyNaming,
    "enforce-output-key-naming": enforceOutputKeyNaming,
    "enforce-uses-version": enforceUsesVersion,
  },
};
