import { Rule } from "eslint";
import { AST } from "yaml-eslint-parser";
import { NamingStyle, getStyleRegex } from "../utils/naming-style";
import { getMappingValueByKey } from "../utils/yaml";
import { reportInvalidKey } from "../utils/reporter";

interface Options {
  style: NamingStyle;
  pattern?: string;
}

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce naming convention for job output keys",
    },
    fixable: undefined,
    schema: [
      {
        type: "object",
        properties: {
          style: {
            enum: ["snake_case", "kebab-case", "camelCase", "UPPER_CASE", "custom"],
          },
          pattern: {
            type: "string",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalidKey: "Output key '{{name}}' does not match {{style}} naming convention.",
    },
  },

  create(context) {
    const [options] = context.options as [Options];
    const style: NamingStyle = options?.style || "kebab-case";
    const regex = getStyleRegex(style, options?.pattern);

    return {
      YAMLMapping(node: AST.YAMLMapping) {
        const jobsMapping = getMappingValueByKey(node, "jobs");
        if (!jobsMapping) return;

        for (const jobPair of jobsMapping.pairs) {
          const jobValue = jobPair.value;
          if (jobValue?.type !== "YAMLMapping") continue;

          const outputsMapping = getMappingValueByKey(jobValue, "outputs");
          if (!outputsMapping) continue;

          for (const outputPair of outputsMapping.pairs) {
            const outputKey = outputPair.key;
            if (
              outputKey?.type === "YAMLScalar" &&
              typeof outputKey.value === "string" &&
              !regex.test(outputKey.value)
            ) {
              reportInvalidKey(context, outputKey, outputKey.value, style, "invalidKey");
            }
          }
        }
      },
    };
  },
};

export default rule;
