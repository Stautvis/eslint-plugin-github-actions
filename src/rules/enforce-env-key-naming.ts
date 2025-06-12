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
      description: "Enforce naming convention for environment variable keys",
    },
    fixable: undefined,
    schema: [
      {
        type: "object",
        properties: {
          style: {
            enum: ["UPPER_CASE", "camelCase", "kebab-case", "snake_case", "custom"],
          },
          pattern: {
            type: "string",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalidKey: 'Environment variable key "{{name}}" does not match {{style}} style.',
    },
  },

  create(context) {
    const [options] = context.options as [Options];
    const style: NamingStyle = options?.style || "UPPER_CASE";
    const regex = getStyleRegex(style, options?.pattern);

    return {
      YAMLMapping(node: AST.YAMLMapping) {
        const envMapping = getMappingValueByKey(node, "env");
        if (!envMapping) return;

        for (const pair of envMapping.pairs) {
          const envKey = pair.key;
          if (
            envKey?.type === "YAMLScalar" &&
            typeof envKey.value === "string" &&
            !regex.test(envKey.value)
          ) {
            reportInvalidKey(context, envKey, envKey.value, style, "invalidKey");
          }
        }
      },
    };
  },
};

export default rule;
