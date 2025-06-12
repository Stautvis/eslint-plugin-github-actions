import { Rule } from "eslint";
import { AST } from "yaml-eslint-parser";

interface Options {
  order: string[];
}

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce the order of top-level keys in a GitHub Actions workflow file",
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          order: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["order"],
        additionalProperties: false,
      },
    ],
    messages: {
      incorrectOrder: "Top-level keys are not in the expected order.",
    },
  },

  create(context) {
    const [options] = context.options as [Options];
    const desiredOrder = options.order;

    return {
      YAMLDocument(node: AST.YAMLDocument) {
        const root = node.content;
        if (!root || root.type !== "YAMLMapping") return;

        const sourceCode = context.getSourceCode();

        const actualPairs = root.pairs.filter(
          (p): p is AST.YAMLPair => p.key?.type === "YAMLScalar" && typeof p.key.value === "string"
        );

        const sortedPairs: typeof actualPairs = [];

        for (const key of desiredOrder) {
          const match = actualPairs.find((p) => {
            const keyValue = (p.key as AST.YAMLScalar).value;
            return typeof keyValue === "string" && keyValue === key;
          });
          if (match) sortedPairs.push(match);
        }

        for (const pair of actualPairs) {
          const key = (pair.key as AST.YAMLScalar).value;
          if (typeof key === "string" && !desiredOrder.includes(key)) {
            sortedPairs.push(pair);
          }
        }

        const isOrderCorrect = actualPairs.every((pair, index) => pair === sortedPairs[index]);

        if (!isOrderCorrect) {
          context.report({
            node: root,
            messageId: "incorrectOrder",
            fix(fixer) {
              const fixedText = sortedPairs
                .map((pair) => {
                  if (!pair.range) return "";
                  const [start, end] = pair.range;
                  return sourceCode.getText().slice(start, end);
                })
                .join("\n");

              if (!root.range) return null;

              return fixer.replaceTextRange([root.range[0], root.range[1]], `\n${fixedText}`);
            },
          });
        }
      },
    };
  },
};

export default rule;
