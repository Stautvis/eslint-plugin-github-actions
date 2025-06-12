export type NamingStyle = "kebab-case" | "snake_case" | "camelCase" | "UPPER_CASE" | "custom";

export function getStyleRegex(style: NamingStyle, pattern?: string): RegExp {
  switch (style) {
    case "kebab-case":
      return /^[a-z][a-z0-9-]*$/;
    case "snake_case":
      return /^[a-z][a-z0-9_]*$/;
    case "camelCase":
      return /^[a-z][a-zA-Z0-9]*$/;
    case "UPPER_CASE":
      return /^[A-Z][A-Z0-9_]*$/;
    case "custom":
      return new RegExp(pattern ?? ".*");
  }
}

export function convertToStyle(input: string, style: NamingStyle): string {
  const words = input
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_\- ]+/g, " ")
    .trim()
    .toLowerCase()
    .split(" ");

  switch (style) {
    case "kebab-case":
      return words.join("-");
    case "snake_case":
      return words.join("_");
    case "camelCase":
      return (
        words[0] +
        words
          .slice(1)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join("")
      );
    case "UPPER_CASE":
      return words.join("_").toUpperCase();
    default:
      return input;
  }
}
