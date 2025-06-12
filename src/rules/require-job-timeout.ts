import { Rule } from "eslint";
import { AST } from "yaml-eslint-parser";
import { getMappingValueByKey } from "../utils/yaml";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Ensure every job defines 'timeout-minutes'",
    },
    fixable: undefined,
    schema: [],
    messages: {
      missingTimeout: "Job '{{jobKey}}' must have a 'timeout-minutes' field defined.",
    },
  },

  create(context) {
    return {
      YAMLMapping(node: AST.YAMLMapping) {
        const jobsMapping = getMappingValueByKey(node, "jobs");
        if (!jobsMapping) return;

        for (const pair of jobsMapping.pairs) {
          const jobKey = pair.key;
          const jobValue = pair.value;

          if (
            jobKey?.type === "YAMLScalar" &&
            typeof jobKey.value === "string" &&
            jobValue?.type === "YAMLMapping"
          ) {
            const hasTimeout = jobValue.pairs.some((p) => {
              return p.key?.type === "YAMLScalar" && p.key.value === "timeout-minutes";
            });

            if (!hasTimeout) {
              context.report({
                node: jobKey,
                messageId: "missingTimeout",
                data: {
                  jobKey: jobKey.value,
                },
              });
            }
          }
        }
      },
    };
  },
};

export default rule;
