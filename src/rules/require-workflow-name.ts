import { Rule } from "eslint";
import { AST } from "yaml-eslint-parser";

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Require a top-level 'name' field in the workflow",
    },
    fixable: undefined,
    schema: [],
    messages: {
      missingName: "Workflow must have a top-level 'name' field.",
    },
  },

  create(context) {
    return {
      YAMLDocument(node: AST.YAMLDocument) {
        const root = node.content;
        if (!root || root.type !== "YAMLMapping") return;

        const hasName = root.pairs.some(
          (pair) => pair.key?.type === "YAMLScalar" && pair.key.value === "name"
        );

        if (!hasName) {
          context.report({
            node,
            messageId: "missingName",
          });
        }
      },
    };
  },
};

export default rule;
