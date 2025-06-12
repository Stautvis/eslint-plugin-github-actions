import { defineConfig } from "eslint/config";

import eslintPluginYml from "eslint-plugin-yml";
import eslintPluginGithubActions from "./lib/index.js";

const config = defineConfig([
  ...eslintPluginYml.configs["flat/recommended"],
  ...eslintPluginGithubActions.configs["flat/recommended"],
]);

export default config;
