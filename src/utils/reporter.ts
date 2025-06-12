import { Rule } from "eslint";
import { AST } from "yaml-eslint-parser";

export function reportInvalidKey(
  context: Rule.RuleContext,
  node: AST.YAMLScalar,
  keyValue: string,
  style: string,
  messageId = "invalidJobName"
) {
  context.report({
    node,
    messageId,
    data: {
      name: keyValue,
      style,
    },
  });
}
