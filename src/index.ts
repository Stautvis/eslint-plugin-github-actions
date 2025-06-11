import type { Rule } from "eslint";
import expressionSpacing from "./rules/expression-spacing";

const rules: Rule.RuleModule[] = [expressionSpacing];

export = {
  rules,
};
