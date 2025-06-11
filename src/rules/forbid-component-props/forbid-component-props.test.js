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
const babelParser = require('@babel/eslint-parser');
const rule = require('./forbid-component-props');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    parser: babelParser,
    parserOptions: {
      requireConfigFile: false,
      babelOptions: {
        presets: ['@babel/preset-react'],
      },
    },
  },
});

ruleTester.run('forbid-component-props', rule, {
  valid: [
    {
      code: `
        var First = createReactClass({
          render: function() {
            return <div className="foo" />;
          }
        });
      `,
    },
    {
      code: `
        var First = createReactClass({
          render: function() {
            return <div style={{color: "red"}} />;
          }
        });
      `,
      options: [{ forbid: ['style'] }],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <Foo bar="baz" />;
          }
        });
      `,
    },
    {
      code: `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <Foo className="bar" />;
          }
        });
      `,
      options: [{ forbid: ['style'] }],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <Foo className="bar" />;
          }
        });
      `,
      options: [{ forbid: ['style', 'foo'] }],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <this.Foo bar="baz" />;
          }
        });
      `,
    },
    {
      code: `
        class First extends createReactClass {
          render() {
            return <this.foo className="bar" />;
          }
        }
      `,
      options: [{ forbid: ['style'] }],
    },
    {
      code: `
        const First = (props) => (
          <this.Foo {...props} />
        );
      `,
    },
    {
      code: `
        const item = (<ReactModal className="foo" />);
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              allowedFor: ['ReactModal'],
            },
          ],
        },
      ],
    },
    {
      code: `
        const item = (<AntdLayout.Content className="antdFoo" />);
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              allowedFor: ['AntdLayout.Content'],
            },
          ],
        },
      ],
    },
    {
      code: `
        const item = (<this.ReactModal className="foo" />);
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              allowedFor: ['this.ReactModal'],
            },
          ],
        },
      ],
    },
    {
      code: `
        const item = (<Foo className="foo" />);
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              disallowedFor: ['ReactModal'],
            },
          ],
        },
      ],
    },
    {
      code: `
        <fbt:param name="Total number of files" number={true} />
      `,
    },
    {
      code: `
        const item = (
          <Foo className="bar">
            <ReactModal style={{color: "red"}} />
          </Foo>
        );
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              disallowedFor: ['OtherModal', 'ReactModal'],
            },
            {
              propName: 'style',
              disallowedFor: ['Foo'],
            },
          ],
        },
      ],
    },
    {
      code: `
        const item = (
          <Foo className="bar">
            <ReactModal style={{color: "red"}} />
          </Foo>
        );
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              disallowedFor: ['OtherModal', 'ReactModal'],
            },
            {
              propName: 'style',
              allowedFor: ['ReactModal'],
            },
          ],
        },
      ],
    },
    {
      code: `
        const item = (<this.ReactModal className="foo" />);
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              disallowedFor: ['ReactModal'],
            },
          ],
        },
      ],
    },
    // Tests to support allowedForRegex
    {
      code: `
        const item = (
          <FooBar className="bar">
            <ReactModal />
          </FooBar>
        );
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              allowedForRegex: 'FooBar',
            },
          ],
        },
      ],
    },
    {
      code: `
        const item = (
          <FooBar className="bar">
            <ReactModal />
          </FooBar>
        );
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              allowedFor: ['FooBar'],
              allowedForRegex: 'SomethingElse',
            },
          ],
        },
      ],
    },
    {
      code: `
        const item = (
          <FooBar className="bar">
            <ReactModal className="modal" />
          </FooBar>
        );
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              allowedForRegex: '^Foo|ReactModal',
            },
          ],
        },
      ],
    },
    {
      code: `
        const item = (
          <FooBar className="bar">
            <ReactModal className="modal" />
          </FooBar>
        );
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              allowedFor: ['ReactModal'],
              allowedForRegex: '^Foo|ReactModal',
            },
          ],
        },
      ],
    },
    {
      code: `
        const item = (
          <FooBar className="bar">
            <BpkSomething className="one" />
            <SomethingBpk className="two" />
          </FooBar>
        );
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              allowedForRegex: 'Bpk|FooBar',
            },
          ],
        },
      ],
    },
  ],

  invalid: [
    {
      code: `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <Foo className="bar" />;
          }
        });
      `,
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'className' },
          line: 5,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <Foo style={{color: "red"}} />;
          }
        });
      `,
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'style' },
          line: 5,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <Foo className="bar" />;
          }
        });
      `,
      options: [{ forbid: ['className', 'style'] }],
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'className' },
          line: 5,
          column: 25,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <Foo style={{color: "red"}} />;
          }
        });
      `,
      options: [{ forbid: ['className', 'style'] }],
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'style' },
          line: 5,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <Foo style={{color: "red"}} />;
          }
        });
      `,
      options: [
        {
          forbid: [
            {
              propName: 'style',
              disallowedFor: ['Foo'],
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'style' },
          line: 5,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const item = (<Foo className="foo" />);
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              allowedFor: ['ReactModal'],
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'className' },
          line: 2,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const item = (<this.ReactModal className="foo" />);
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              allowedFor: ['ReactModal'],
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'className' },
          line: 2,
          column: 40,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const item = (<this.ReactModal className="foo" />);
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              disallowedFor: ['this.ReactModal'],
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'className' },
          line: 2,
          column: 40,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const item = (<ReactModal className="foo" />);
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              disallowedFor: ['ReactModal'],
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'className' },
          line: 2,
          column: 35,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const item = (<AntdLayout.Content className="antdFoo" />);
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              disallowedFor: ['AntdLayout.Content'],
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'className' },
          line: 2,
          column: 43,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const item = (<Foo className="foo" />);
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              message: 'Please use ourCoolClassName instead of ClassName',
            },
          ],
        },
      ],
      errors: [
        {
          message: 'Please use ourCoolClassName instead of ClassName',
          line: 2,
          column: 28,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const item = () => (
          <Foo className="foo">
            <Bar option="high" />
          </Foo>
        );
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              message: 'Please use ourCoolClassName instead of ClassName',
            },
            {
              propName: 'option',
              message: 'Avoid using option',
            },
          ],
        },
      ],
      errors: [
        {
          message: 'Please use ourCoolClassName instead of ClassName',
          line: 3,
          column: 16,
          type: 'JSXAttribute',
        },
        {
          message: 'Avoid using option',
          line: 4,
          column: 18,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const item = () => (
          <Foo className="foo">
            <Bar option="high" />
          </Foo>
        );
      `,
      options: [
        {
          forbid: [
            { propName: 'className' },
            {
              propName: 'option',
              message: 'Avoid using option',
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'className' },
          line: 3,
          column: 16,
          type: 'JSXAttribute',
        },
        {
          message: 'Avoid using option',
          line: 4,
          column: 18,
          type: 'JSXAttribute',
        },
      ],
    },
    // Tests to support allowedForRegex
    {
      code: `
        const item = (
          <FooBar className="bar">
            <ReactModal className="modal"/>
          </FooBar>
        );
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              allowedForRegex: 'FooBar',
            },
          ],
        },
      ],
      errors: [
        {
          message: 'Prop "className" is forbidden on Components',
          line: 4,
          column: 25,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const item = (
          <FooBar className="bar">
            <ReactModal className="modal"/>
          </FooBar>
        );
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              allowedFor: ['FooBar'],
              allowedForRegex: 'Bpk',
            },
          ],
        },
      ],
      errors: [
        {
          message: 'Prop "className" is forbidden on Components',
          line: 4,
          column: 25,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const item = (
          <FooBar className="bar">
            <ReactModal className="modal"/>
            <BpkIconOne className="icon" />
          </FooBar>
        );
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              allowedForRegex: '^BpkIcon|^Foo',
            },
          ],
        },
      ],
      errors: [
        {
          message: 'Prop "className" is forbidden on Components',
          line: 4,
          column: 25,
          type: 'JSXAttribute',
        },
      ],
    },
  ],
});
