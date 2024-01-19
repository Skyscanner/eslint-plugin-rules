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

const noAxios = require('./no-axios');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
});

ruleTester.run('no-axios', noAxios, {
  valid: [
    {
      code: 'const test = require("foo-axios");',
    },
    {
      code: 'import test from "foo-axios";',
    },
    {
      // we can only detect actual strings,
      // not string templates and other things that evaluate to string
      code: 'const axios = await import(`axios`);',
    },
  ],
  invalid: [
    {
      code: 'const axios = require("axios");',
      errors: [
        {
          message: 'Deprecated require of axios package',
        },
      ],
    },
    {
      code: 'import axios from "axios";',
      errors: [
        {
          message: 'Deprecated import of axios package',
        },
      ],
    },
    {
      code: 'const foo = require("axios/some/internal/thing");',
      errors: [
        {
          message: 'Deprecated require of axios package',
        },
      ],
    },
    {
      code: 'import foo from "axios/some/internal/thing";',
      errors: [
        {
          message: 'Deprecated import of axios package',
        },
      ],
    },
    {
      code: 'const { foo } = require("axios");',
      errors: [
        {
          message: 'Deprecated require of axios package',
        },
      ],
    },
    {
      code: 'const foo = require("axios").default;',
      errors: [
        {
          message: 'Deprecated require of axios package',
        },
      ],
    },
    {
      code: 'import { foo } from "axios";',
      errors: [
        {
          message: 'Deprecated import of axios package',
        },
      ],
    },

    {
      code: 'import("axios").then(() => console.log("foo"));',
      errors: [
        {
          message: 'Deprecated import of axios package',
        },
      ],
    },

    {
      code: 'const axios = await import("axios");',
      errors: [
        {
          message: 'Deprecated import of axios package',
        },
      ],
    },

    {
      code: 'import("axios").then(() => console.log("foo"));',
      errors: [
        {
          message: 'Deprecated import of axios package',
        },
      ],
    },
  ],
});
