import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";
import js from "@eslint/js";
import { fixupConfigRules } from "@eslint/compat";
import nx from "@nx/eslint-plugin";
import baseConfig from "../../eslint.config.mjs";

const compat = new FlatCompat({
    baseDirectory: dirname(fileURLToPath(import.meta.url)),
    recommendedConfig: js.configs.recommended,
});

export default [
    // Extending Next.js configurations
    ...fixupConfigRules(compat.extends("next")),
    ...fixupConfigRules(compat.extends("next/core-web-vitals")),

    // Including root ESLint base config
    ...baseConfig,

    // Adding Nx specific configurations
    ...nx.configs["flat/react-typescript"],

    // Custom rules from provided ESLint config
    {
        ignores: [
            ".next/**/*",
            "**/out-tsc",
            "node_modules/",
            "build/",
            "dist/",
            "out/",
            "next-env.d.ts",
            "*.config.js",
            "*.config.mjs",
            "*.config.ts",
            ".eslintrc.js",
            "tailwind.config.js",
            "postcss.config.js",
        ],
    },
    {
        files: ["/*.{ts,tsx,js,jsx}"],
        languageOptions: {
            parser: compat.parser("@typescript-eslint/parser"),
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            "@typescript-eslint": compat.plugin("@typescript-eslint/eslint-plugin"),
            react: compat.plugin("eslint-plugin-react"),
            "react-hooks": compat.plugin("eslint-plugin-react-hooks"),
            "jsx-a11y": compat.plugin("eslint-plugin-jsx-a11y"),
            import: compat.plugin("eslint-plugin-import"),
            "unused-imports": compat.plugin("eslint-plugin-unused-imports"),
            "simple-import-sort": compat.plugin("eslint-plugin-simple-import-sort"),
            tailwindcss: compat.plugin("eslint-plugin-tailwindcss"),
        },
        rules: {
            // TypeScript rules
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/prefer-const": "error",
            "@typescript-eslint/no-inferrable-types": "error",
            "@typescript-eslint/no-empty-function": "warn",
            "@typescript-eslint/no-non-null-assertion": "warn",
            "@typescript-eslint/prefer-optional-chain": "error",
            "@typescript-eslint/prefer-nullish-coalescing": "error",
            "@typescript-eslint/no-unnecessary-type-assertion": "error",
            "@typescript-eslint/array-type": ["error", { default: "array" }],
            "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
            "@typescript-eslint/method-signature-style": ["error", "property"],
            "@typescript-eslint/prefer-function-type": "error",

            // React rules
            "react/jsx-uses-react": "error",
            "react/jsx-uses-vars": "error",
            "react/no-unused-prop-types": "error",
            "react/jsx-fragments": ["error", "syntax"],
            "react/jsx-no-useless-fragment": "error",
            "react/jsx-pascal-case": "error",
            "react/no-array-index-key": "warn",
            "react/self-closing-comp": ["error", { component: true, html: true }],
            "react/jsx-sort-props": [
                "error",
                {
                    callbacksLast: true,
                    shorthandFirst: true,
                    multiline: "last",
                    reservedFirst: true,
                },
            ],
            "react/jsx-max-props-per-line": ["error", { maximum: 1, when: "multiline" }],
            "react/jsx-first-prop-new-line": ["error", "multiline"],
            "react/jsx-closing-bracket-location": ["error", "tag-aligned"],
            "react/jsx-wrap-multilines": [
                "error",
                {
                    declaration: "parens-new-line",
                    assignment: "parens-new-line",
                    return: "parens-new-line",
                    arrow: "parens-new-line",
                    condition: "parens-new-line",
                    logical: "parens-new-line",
                    prop: "parens-new-line",
                },
            ],

            // React Hooks rules
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",

            // Accessibility rules
            "jsx-a11y/alt-text": "error",
            "jsx-a11y/anchor-has-content": "error",
            "jsx-a11y/anchor-is-valid": "error",
            "jsx-a11y/aria-props": "error",
            "jsx-a11y/aria-proptypes": "error",
            "jsx-a11y/click-events-have-key-events": "error",
            "jsx-a11y/interactive-supports-focus": "error",

            // Import rules
            "simple-import-sort/imports": [
                "error",
                {
                    groups: [
                        ["^react", "^next"],
                        ["^@?\\w"],
                        ["^(@|components|utils|hooks|types|constants|lib)(/.*|$)"],
                        ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
                        ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
                        ["^.+\\.s?css$"],
                    ],
                },
            ],
            "simple-import-sort/exports": "error",
            "import/order": "off", // Using simple-import-sort instead

            // Cleanup unused imports
            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": [
                "error",
                {
                    vars: "all",
                    varsIgnorePattern: "^_",
                    args: "after-used",
                    argsIgnorePattern: "^_",
                },
            ],

            // Tailwind CSS rules
            "tailwindcss/classnames-order": "error",
            "tailwindcss/enforces-negative-arbitrary-values": "error",
            "tailwindcss/no-contradicting-classname": "error",
        },
        settings: {
            react: {
                version: "detect",
            },
            "import/resolver": {
                typescript: {
                    alwaysTryTypes: true,
                },
            },
        },
    },

    // Component-specific rules
    {
        files: ["/components//.{ts,tsx}", "/ui//.{ts,tsx}"],
        rules: {
            "react/prop-types": "off",
            "react/display-name": "error",
            "react/jsx-key": "error",
            "no-multiple-empty-lines": ["error", { max: 0, maxEOF: 0, maxBOF: 0 }],
            "no-trailing-spaces": "error",
            "eol-last": ["error", "never"],
            "react/jsx-newline": ["error", { prevent: true }],
            "react/jsx-no-leaked-render": "error",
        },
    },

    // Utility and hook-specific rules
    {
        files: ["/utils//.{ts,tsx}", "/hooks//.{ts,tsx}", "/lib//*.{ts,tsx}"],
        rules: {
            "prefer-const": "error",
            "no-magic-numbers": [
                "warn",
                {
                    ignore: [0, 1, -1],
                    ignoreArrayIndexes: true,
                    enforceConst: true,
                },
            ],
        },
    },

    // Configuration file rules
    {
        files: ["/.config.{js,mjs,ts}", "*/next.config.{js,mjs,ts}"],
        rules: {
            "import/no-default-export": "off",
            "@typescript-eslint/no-var-requires": "off",
            "no-console": "off",
        },
    },
];
