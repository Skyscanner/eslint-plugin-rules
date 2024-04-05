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
// Constants
// ------------------------------------------------------------------------------

const DEFAULTS = ['className', 'style'];

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  propIsForbidden: 'Prop "{{prop}}" is forbidden on Components',
};

// ------------------------------------------------------------------------------
// Utils
// ------------------------------------------------------------------------------

function getMessageData(messageId, message) {
  return messageId ? { messageId } : { message };
}

function report(context, message, messageId, data) {
  context.report(Object.assign(getMessageData(messageId, message), data));
}

module.exports = {
  meta: {
    docs: {
      description: 'Disallow certain props on components',
      category: 'Best Practices',
      recommended: false,
    },

    messages,

    schema: [
      {
        type: 'object',
        properties: {
          forbid: {
            type: 'array',
            items: {
              anyOf: [
                { type: 'string' },
                {
                  type: 'object',
                  properties: {
                    propName: { type: 'string' },
                    allowedFor: {
                      type: 'array',
                      uniqueItems: true,
                      items: { type: 'string' },
                    },
                    allowedForRegex: { type: 'string' },
                    message: { type: 'string' },
                  },
                  additionalProperties: false,
                },
                {
                  type: 'object',
                  properties: {
                    propName: { type: 'string' },
                    disallowedFor: {
                      type: 'array',
                      uniqueItems: true,
                      minItems: 1,
                      items: { type: 'string' },
                    },
                    message: { type: 'string' },
                  },
                  required: ['disallowedFor'],
                  additionalProperties: false,
                },
              ],
            },
          },
        },
      },
    ],
  },
  create(context) {
    const configuration = context.options[0] || {};
    const forbid = new Map(
      (configuration.forbid || DEFAULTS).map((value) => {
        const propName = typeof value === 'string' ? value : value.propName;
        const options = {
          allowList: typeof value === 'string' ? [] : value.allowedFor || [],
          disallowList:
            typeof value === 'string' ? [] : value.disallowedFor || [],
          message: typeof value === 'string' ? null : value.message,

          // New feature: Support Allow List regex input.
          allowRegex:
            typeof value !== 'string' && value.allowedForRegex
              ? new RegExp(value.allowedForRegex)
              : null,
        };
        return [propName, options];
      }),
    );

    function isForbidden(prop, tagName) {
      const options = forbid.get(prop);
      if (!options) {
        return false;
      }

      if (typeof tagName === 'undefined') {
        return true;
      }

      // Disallow List takes precedence over Allow List
      // tagName is forbidden if it is in the Disallow List
      if (options.disallowList.length > 0) {
        return options.disallowList.indexOf(tagName) !== -1;
      }

      const isInAllowList = options.allowList.indexOf(tagName) !== -1;

      // tagName is forbidden if it is not in the Allow List
      // Exit early here to avoid cases of needlessly running the regex
      if (isInAllowList) {
        return false;
      }

      return !options.allowRegex || !options.allowRegex.test(tagName);
    }

    return {
      JSXAttribute(node) {
        debugger;
        const parentName = node.parent.name;
        // Extract a component name when using a "namespace", e.g. `<AntdLayout.Content />`.
        const tag =
          parentName.name ||
          `${parentName.object.name}.${parentName.property.name}`;
        const componentName = parentName.name || parentName.property.name;
        if (
          componentName &&
          typeof componentName[0] === 'string' &&
          componentName[0] !== componentName[0].toUpperCase()
        ) {
          // This is a DOM node, not a Component, so exit.
          return;
        }

        const prop = node.name.name;

        if (!isForbidden(prop, tag)) {
          return;
        }

        const customMessage = forbid.get(prop).message;

        report(
          context,
          customMessage || messages.propIsForbidden,
          !customMessage && 'propIsForbidden',
          {
            node,
            data: {
              prop,
            },
          },
        );
      },
    };
  },
};
