module.exports = {
    "env": {
      "browser": true,
      "commonjs": true,
      "es6": true,
      "node": true
    },
    "parserOptions": {
      "ecmaFeatures": {
        "jsx": true
      },
      "sourceType": "module"
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    "extends":     ["eslint:recommended",
    "plugin:vue/recommended"],
    // required to lint *.vue files
    "plugins": [
      "vue"
    ],
    "rules": {
      "import/no-unresolved": 0,
      "import/no-unassigned-import": 0,
      "semi": ["error", "never"],
      "no-console": "off",
      "space-before-function-paren": [
        "error",
        {
          "anonymous": "always",
          "named": "always",
          "asyncArrow": "always"
        }
      ]
  }
};
