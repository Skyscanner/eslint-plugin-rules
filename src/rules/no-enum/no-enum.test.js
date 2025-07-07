const { RuleTester } = require('@typescript-eslint/rule-tester');
const rule = require('./no-enum');

const ruleTester = new RuleTester();

ruleTester.run('no-enum', rule, {
  valid: [
    'const x = 1;',
    'const oneEnum = { "ONE": "one" };',
    'const enumTwo = { "TWO": "two" };',
  ],
  invalid: [
    {
      code: 'enum a { "KEY" = "VALUE" };',
      errors: [
        {
          messageId: 'noEnum',
        },
      ],
    },
    {
      code: 'const enum a { "KEY" = "VALUE" };',
      errors: [
        {
          messageId: 'noEnum',
        },
      ],
    },
  ],
});
