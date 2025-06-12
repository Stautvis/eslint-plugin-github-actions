import { Rule } from "eslint";
import { AST } from "yaml-eslint-parser";
import { getMappingValueByKey } from "../utils/yaml";

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Require each job to have a name field",
    },
    fixable: undefined,
    schema: [],
    messages: {
      missingJobName: "Job '{{jobKey}}' is missing a 'name' field.",
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
            const hasNameField = jobValue.pairs.some((p) => {
              return p.key?.type === "YAMLScalar" && p.key.value === "name";
            });

            if (!hasNameField) {
              context.report({
                node: jobKey,
                messageId: "missingJobName",
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
