# eslint-plugin-github-actions

Custom ESLint rules for GitHub Actions YAML files.

## 📦 Installation

You'll first need to install [ESLint](https://eslint.org):

```bash
npm install --save-dev eslint
```

Next, install this plugin:

```bash
npm install --save-dev eslint-plugin-github-actions
```

## 🛠 Usage

Add `github-actions` to the plugins section of your ESLint config, and configure the rules you want:

```js
// eslint.config.js
import githubActions from "eslint-plugin-github-actions";

export default [
  {
    files: ["**/*.yml", "**/*.yaml"],
    languageOptions: {
      parser: "yaml-eslint-parser",
    },
    plugins: {
      "github-actions": githubActions,
    },
    rules: {
      "github-actions/expression-spacing": "error",
    },
  },
];
```

## ✅ Supported Rules

| Rule ID                             | Description                                      |
| ----------------------------------- | ------------------------------------------------ |
| `github-actions/expression-spacing` | Enforces spacing inside `${{ ... }}` expressions |
