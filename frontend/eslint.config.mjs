import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

export default [
	js.configs.recommended, // base JS rules
	...compat.extends("next/core-web-vitals"), // Next.js rules
	{
		files: ["**/*.{js,jsx}"],
		plugins: {
			react,
			"react-hooks": reactHooks,
		},
		rules: {
			"no-undef": "error", // catch undefined variables
			"no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // warn unused
			"react/jsx-uses-react": "error",
			"react/jsx-uses-vars": "error",
			"react-hooks/rules-of-hooks": "error", // enforce hook rules
			"react-hooks/exhaustive-deps": "warn",
		},
		settings: {
			react: {
				version: "detect",
			},
		},
	},
	{
		ignores: [
			"node_modules/**",
			".next/**",
			"out/**",
			"build/**",
			"next-env.d.ts",
		],
	},
];
