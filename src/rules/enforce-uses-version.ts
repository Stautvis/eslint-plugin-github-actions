import { Rule } from "eslint";
import { AST } from "yaml-eslint-parser";

type Policy = "commit" | "patch" | "minor" | "major";

interface Options {
  policy: Policy;
}

const COMMIT_SHA_REGEX = /^[a-f0-9]{40}$/i;
const PATCH_REGEX = /^v?\d+\.\d+\.\d+$/;
const MINOR_REGEX = /^v?\d+\.\d+$/;
const MAJOR_REGEX = /^v?\d+$/;

function matchesVersion(version: string, policy: Policy): boolean {
  const isCommit = COMMIT_SHA_REGEX.test(version);
  const isPatch = PATCH_REGEX.test(version);
  const isMinor = MINOR_REGEX.test(version);
  const isMajor = MAJOR_REGEX.test(version);

  switch (policy) {
    case "commit":
      return isCommit;
    case "patch":
      return isCommit || isPatch;
    case "minor":
      return isCommit || isPatch || isMinor;
    case "major":
      return isCommit || isPatch || isMinor || isMajor;
    default:
      return false;
  }
}

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: "Enforce version policy for all `uses:` values",
      // ...
    },
    schema: [
      {
        type: "object",
        properties: {
          policy: {
            enum: ["commit", "patch", "minor", "major"],
          },
        },
        required: ["policy"],
      },
    ],
    messages: {
      invalidVersion: "'{{value}}' does not match the '{{policy}}' version policy.",
    },
  },

  create(context) {
    const [options] = context.options as [Options];
    const policy = options?.policy ?? "patch";

    return {
      YAMLPair(node: AST.YAMLPair) {
        if (
          node.key?.type === "YAMLScalar" &&
          node.key.value === "uses" &&
          node.value?.type === "YAMLScalar" &&
          typeof node.value.value === "string"
        ) {
          const value = node.value.value;
          const atIndex = value.lastIndexOf("@");
          if (atIndex === -1) return;

          const version = value.slice(atIndex + 1);
          if (!matchesVersion(version, policy)) {
            context.report({
              node: node.value,
              messageId: "invalidVersion",
              data: {
                value,
                policy,
              },
            });
          }
        }
      },
    };
  },
};

export default rule;
