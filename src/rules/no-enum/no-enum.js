const { ESLintUtils } = require('@typescript-eslint/utils');

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/Skyscanner/eslint-plugin-rules#${name}`,
);

const noEnum = createRule({
  name: 'no-enum',
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow all usages of TypeScript enums',
      recommended: 'recommended',
    },
    messages: {
      noEnum:
        'In modern TypeScript, you should not need an enum. An object with `as const` should suffice.',
    },
    schema: [],
  },
  defaultOptions: [],
  create: (context) => ({
    TSEnumDeclaration: (node) => {
      context.report({
        node,
        messageId: 'noEnum',
      });
    },
  }),
});

module.exports = noEnum;
