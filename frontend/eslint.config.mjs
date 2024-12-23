import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    rules: {
      // Relax TypeScript type-checking rules
      "@typescript-eslint/no-explicit-any": "off", // Allow 'any' type
      "@typescript-eslint/explicit-module-boundary-types": "off", // Allow implicit return types
      "@typescript-eslint/no-non-null-assertion": "off", // Allow non-null assertion operator (e.g., `!`)
      "@typescript-eslint/no-inferrable-types": "off", // Allow explicit types even when they can be inferred
      "@typescript-eslint/explicit-function-return-type": "off", // Allow functions to omit return types
    },
  },
];

export default eslintConfig;
