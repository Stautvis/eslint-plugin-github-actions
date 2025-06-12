import { AST } from "yaml-eslint-parser";

export function isScalarKey(pair: AST.YAMLPair, expected: string): boolean {
  return (
    pair.key?.type === "YAMLScalar" &&
    typeof pair.key.value === "string" &&
    pair.key.value === expected
  );
}

export function getMappingValueByKey(
  mapping: AST.YAMLMapping,
  expectedKey: string
): AST.YAMLMapping | undefined {
  for (const pair of mapping.pairs) {
    if (isScalarKey(pair, expectedKey) && pair.value?.type === "YAMLMapping") {
      return pair.value;
    }
  }
  return undefined;
}
