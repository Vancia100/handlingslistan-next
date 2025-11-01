import { defineConfig, globalIgnores } from "eslint/config"
// @ts-expect-error Has no declatation files
import nextVitals from "eslint-config-next/core-web-vitals"
// @ts-expect-error Has no declatation files
import nextTs from "eslint-config-next/typescript"

import tseslint from "typescript-eslint"

import prettierPlugin from "eslint-config-prettier"
import hooksPlugin from "eslint-plugin-react-hooks"
import compilerPlugin from "eslint-plugin-react-compiler"

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "/src/generated/**",
  ]),
  {
    ignores: ["./src/generated/**", ".next/**", "node_modules/**"],
  },
  {
    files: ["./src/**/*.tsx", "./src/**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "react-hook": hooksPlugin,
      "react-compiler": compilerPlugin,
    },
    extends: [prettierPlugin],
    rules: {
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
      "react-hook/preserve-manual-memoization": "warn",
    },
  },
])
