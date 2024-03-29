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

module.exports = {
  create: (context) => ({
    CallExpression: (node) => {
      if (
        node.callee.name === 'require' &&
        node.arguments.length > 0 &&
        typeof node.arguments[0].value === 'string' &&
        (node.arguments[0].value === 'axios' ||
          node.arguments[0].value.indexOf('axios/') === 0)
      ) {
        context.report(node, 'Deprecated require of axios package');
      }
    },
    ImportDeclaration: (node) => {
      if (
        node.source.value === 'axios' ||
        node.source.value.indexOf('axios/') === 0
      ) {
        context.report(node, 'Deprecated import of axios package');
      }
    },
    ImportExpression: (node) => {
      if (
        typeof node.source.value === 'string' &&
        (node.source.value === 'axios' ||
          node.source.value.indexOf('axios/') === 0)
      ) {
        context.report(node, 'Deprecated import of axios package');
      }
    },
  }),
  meta: {
    docs: {
      description:
        'Deprecate the use of axios due to potential sensitive information leaks',
    },
    type: 'problem',
  },
};
