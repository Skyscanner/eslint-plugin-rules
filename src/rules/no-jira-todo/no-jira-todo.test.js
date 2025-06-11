/**
 * Copyright 2023-present Skyscanner Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const { RuleTester } = require('eslint');

const rule = require('./no-jira-todo');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
});

ruleTester.run('no-jira-todo', rule, {
  valid: [
    'const variable = "Non comment"',
    '// TODO: [WALL-1234] description',
    '// TODO: DINGO-123 description',
    '// TODO: [JIRA-XXXX] fixed',
    '// FIXME: [CASTLE-5678]',
    '// FIXME: [WOM-2468] comment',
    '// @TODO: [WALL-1234] description',
    '// @FIXME: [WALL-1234] description',
    '// TODO: https://skyscanner.atlassian.net/browse/SHIBA-1234 description',
    '// TODO: https://atlassian-upgrade.net/browse/WALL-1234',
    '// @FIXME: https://skyscanner.atlassian.net/browse/WOODPECKER-1010 description',
    'const regex = new RegExp("expression", "i"); // TODO: [JIRA-4321] comment',
    `// TODO: ST-123 first of multiple TODOs
    const { locale } = context[requestContextParameters.CULTURE];
    // TODO: DINGO-123 another TODO`,
  ],
  invalid: [
    {
      code: '// TODO: please fail',
      errors: [{ messageId: 'todo-error' }],
    },
    {
      code: '// TODO: this should also fail WALL-1234',
      errors: [{ messageId: 'todo-error' }],
    },
    {
      code: '// FIXME another fail WALL-1234',
      errors: [{ messageId: 'todo-error' }],
    },
    {
      code: '// @FIXME and this too [WALL-1234]',
      errors: [{ messageId: 'todo-error' }],
    },
    {
      code: '// @TODO: https://skyscanner.atlassian.net/browse/not-a-ticket',
      errors: [{ messageId: 'todo-error' }],
    },
  ],
});
