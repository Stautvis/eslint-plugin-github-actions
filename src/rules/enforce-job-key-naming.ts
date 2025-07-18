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
      description: "Enforce naming convention for GitHub Actions job keys",
    },
    fixable: undefined,
    schema: [
      {
        type: "object",
        properties: {
          style: {
            enum: ["kebab-case", "snake_case", "camelCase", "UPPER_CASE", "custom"],
          },
          pattern: {
            type: "string",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalidJobName: "Job key '{{name}}' does not match the {{style}} naming convention.",
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

        for (const pair of jobsMapping.pairs) {
          const jobKey = pair.key;
          if (
            jobKey?.type === "YAMLScalar" &&
            typeof jobKey.value === "string" &&
            !regex.test(jobKey.value)
          ) {
            reportInvalidKey(context, jobKey, jobKey.value, style);
          }
        }
      },
    };
  },
};

export default rule;
