module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'standard'
  ],
  // add your custom rules here
  rules: {
    'vue/html-self-closing': 0,
    'vue/attribute-hyphenation': 0,
    'prefer-const': 0,
    'no-console': 0
  }
}
