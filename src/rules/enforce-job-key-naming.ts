import { Rule } from "eslint";
import { AST } from "yaml-eslint-parser";

type StyleOption = "kebab-case" | "snake_case" | "camelCase" | "custom";

interface Options {
  style: StyleOption;
  pattern?: string;
}

const regexes: Record<StyleOption, RegExp> = {
  "kebab-case": /^[a-z][a-z0-9-]*$/,
  snake_case: /^[a-z][a-z0-9_]*$/,
  camelCase: /^[a-z][a-zA-Z0-9]*$/,
  custom: /.*/,
};

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce naming convention for GitHub Actions job keys",
    },
    schema: [
      {
        type: "object",
        properties: {
          style: {
            enum: ["kebab-case", "snake_case", "camelCase", "custom"],
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
    const style = options?.style || "kebab-case";
    const pattern =
      style === "custom" && options?.pattern ? new RegExp(options.pattern) : regexes[style];

    return {
      YAMLMapping(node: AST.YAMLMapping) {
        for (const pair of node.pairs) {
          const key = pair.key;
          const value = pair.value;

          if (key?.type === "YAMLScalar" && key.value === "jobs" && value?.type === "YAMLMapping") {
            for (const jobPair of value.pairs) {
              const jobKey = jobPair.key;
              if (
                jobKey?.type === "YAMLScalar" &&
                typeof jobKey.value === "string" &&
                !pattern.test(jobKey.value)
              ) {
                context.report({
                  node: jobKey,
                  messageId: "invalidJobName",
                  data: {
                    name: jobKey.value,
                    style: style,
                  },
                });
              }
            }
          }
        }
      },
    };
  },
};

export default rule;
