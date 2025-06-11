import { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Ensure spacing inside GitHub Actions expressions like `${{ secrets.X }}`",
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          requireSpace: {
            type: "boolean",
            description: "Require a space after '{{' and before '}}' in expressions.",
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const requireSpace = context.options[0]?.requireSpace ?? true;
    const { sourceCode } = context;
    return {
      Program() {
        const text = sourceCode.getText();
        // Regex to match ${{ ... }} expressions
        const regex = /\$\{\{([\s\S]*?)\}\}/g;
        let match;
        while ((match = regex.exec(text)) !== null) {
          const fullMatch = match[0];
          const inner = match[1];
          const start = match.index;
          const end = start + fullMatch.length;
          const hasLeadingSpace = /^\s/.test(inner);
          const hasTrailingSpace = /\s$/.test(inner);
          if (requireSpace) {
            if (!hasLeadingSpace || !hasTrailingSpace) {
              context.report({
                loc: sourceCode.getLocFromIndex(start),
                message: "Expression should have a space after '{{' and before '}}'",
                fix(fixer) {
                  let fixed = fullMatch;
                  if (!hasLeadingSpace) fixed = fixed.replace(/\$\{\{/, "${{ ");
                  if (!hasTrailingSpace) fixed = fixed.replace(/\}\}$/, " }}");
                  return fixer.replaceTextRange([start, end], fixed);
                },
              });
            }
          } else {
            if (hasLeadingSpace || hasTrailingSpace) {
              context.report({
                loc: sourceCode.getLocFromIndex(start),
                message: "Expression should not have spaces after '{{' or before '}}'",
                fix(fixer) {
                  let fixed = fullMatch.replace(/\$\{\{\s+/, "${{").replace(/\s+\}\}/, "}}");
                  return fixer.replaceTextRange([start, end], fixed);
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
