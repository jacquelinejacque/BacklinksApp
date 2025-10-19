module.exports = {
    root: true,
    env: {
      browser: true,
      node: true,
      es2021: true,
    },
    parser: "vue-eslint-parser",
    parserOptions: {
      parser: "@babel/eslint-parser",
      requireConfigFile: false,
      ecmaVersion: 2021,
      sourceType: "module",
    },
    extends: [
      "plugin:vue/vue3-essential", // basic Vue 3 linting rules
      "eslint:recommended",         // basic JS linting rules
    ],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  };
  