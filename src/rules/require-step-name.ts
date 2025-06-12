import { Rule } from "eslint";
import { AST } from "yaml-eslint-parser";

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Ensure each GitHub Actions step has a name field",
    },
    schema: [],
  },

  create(context) {
    return {
      YAMLMapping(node: AST.YAMLMapping) {
        for (const pair of node.pairs) {
          const keyName = pair.key?.type === "YAMLScalar" ? pair.key.value : undefined;
          const value = pair.value;

          if (keyName === "steps" && value?.type === "YAMLSequence") {
            for (const step of value.entries) {
              if (!step || step.type !== "YAMLMapping") continue;

              const hasName = step.pairs.some(
                (pair) => pair.key?.type === "YAMLScalar" && pair.key.value === "name"
              );

              if (!hasName) {
                context.report({
                  node: step,
                  message: 'Each step should have a "name" field.',
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
