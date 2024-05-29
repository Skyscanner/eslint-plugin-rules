/*
# What is this?

Builds on eslint-plugin-react/forbid-component-props and extends to allow and Allow List to be provided as a regex.

Aside from providing an `allowedForRegex` option the implementation remains the same. A `disallowedForRegex` is not provided as no use case currently exists, so we avoid the extra complexity.

https://github.com/jsx-eslint/eslint-plugin-react/blob/9f4b2b96d92bf61ae61e8fc88c413331efe6f0da/lib/rules/forbid-component-props.js#L2

An issue has been raised with eslint-plugin-react to ask for this feature, if provided we should switch to:
- https://github.com/jsx-eslint/eslint-plugin-react/issues/3686


# Why do we need a custom rule?

We use this linting specifically for linting on className usage. This has been seen to cause specificity problems when working in a code-split app.

Our allowlist for the medium to long term will include Bpk* components, and backpack-component-icon Icons. The former is a static list, which could be maintained in an .eslintrc with minimum toil.

However, when used with the `withDefaultProps` HOC that Backpack provide the names become more dynamic and more toil to maintain. Additionally, and significantly, Icons are also much higher volume, and have dynamic names.

Maintaining a list of components and managing contributors confusion is higher toil than maintaining this custom rule.
*/

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  'todo-error': 'All TODO comments must have a JIRA ticket',
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
          `https://skyscanner.atlassian.net/browse/${ticket.source}`,
        );
        const regex = new RegExp(
          `${prefix.source}:\\s(${jiraUrl.source}|\\[${ticket.source}\\])(\\s.*)?`,
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
