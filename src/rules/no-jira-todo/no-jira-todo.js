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

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  'todo-error':
    'JIRA ticket numbers must be added to all TODO/FIXME comments (e.g. TODO: DINGO-123)',
};

const verifyCommentPrefix = (comment) =>
  ['TODO', 'FIXME', '@TODO', '@FIXME'].find((prefix) =>
    comment.startsWith(prefix),
  );

module.exports = {
  meta: {
    docs: {
      description: 'All TODO comments must have a linked JIRA ticket',
      category: 'Best Practices',
      recommended: 'error',
      url: 'https://github.com/Skyscanner/eslint-plugin-rules#no-jira-todo',
    },
    messages,
    type: 'suggestion',
    schema: [],
    fixable: 'code',
  },
  create(context) {
    return {
      Program() {
        const prefix = new RegExp('@?(TODO|FIXME)');
        const ticket = new RegExp('[A-Z]{2,255}-(\\d|X){2,8}');
        const jiraUrl = new RegExp(
          `https://([a-zA-Z0-9.\/-]\+)/${ticket.source}`,
        );
        const regex = new RegExp(
          `${prefix.source}:\\s(${jiraUrl.source}|\\[\?${ticket.source}\\]\?)(\\s.*)?`,
          'g',
        );

        for (const comment of context.getSourceCode().getAllComments()) {
          const value = comment.value.trimStart();

          if (verifyCommentPrefix(value) && !regex.test(value)) {
            context.report({
              node: comment,
              messageId: 'todo-error',
              fix: (fixer) =>
                fixer.replaceText(comment, '// TODO: [JIRA-XXXX]'),
            });
          }
        }
      },
    };
  },
};
