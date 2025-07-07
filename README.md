# @skyscanner/eslint-plugin-rules

Eslint plugin containing custom rules used at Skyscanner.

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `@skyscanner/eslint-plugin-rules`:

```
$ npm install @skyscanner/eslint-plugin-rules --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `@skyscanner/eslint-plugin-rules` globally.

## Usage

Add `@skyscanner/eslint-plugin-rules` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` part:

```json
{
  "plugins": ["@skyscanner/rules"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "@skyscanner/rules/no-axios": "error",
    "@skyscanner/rules/forbid-component-props": "error"
  }
}
```

## Supported Rules

### no-axios

Detects code importing `axios`.

Axios it prone to sensitive information leaks due to inclusion of headers in errors it throws.

```json
{
  "rules": {
    "@skyscanner/rules/no-axios": "<severity>"
  }
}
```

Where `<severity>` can be one of: `error`, `warn` `off`.

### no-enum

A fork of the unmaintained [eslint-plugin-typescript-enum](https://github.com/shian15810/eslint-plugin-typescript-enum).

Detects code using a TypeScript `enum`.

Alternatives such as `as const` are a preferred option over non-native language features.

```json
{
  "rules": {
    "@skyscanner/rules/no-enum": "<severity>"
  }
}
```

### forbid-component-props

A fork of [forbid-component-props](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/forbid-component-props.md). For details on why this is used in Skyscanner repositories, see: [why](src/rules/forbid-component-props/README.md#why-classname-usage-can-cause-specificity-problems).

For alternatives to using `className`, see [guidance](src/rules/forbid-component-props/README.md#guidance).

#### Rule options

This rule extends the functionality of the upstream rule with a new property within the `forbid` config object, `allowedForRegex`.

Full api docs for upsteam see: [forbid-component-props](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/forbid-component-props.md).

##### `forbid.allowedForRegex`

A string specifying a pattern of component names. Components that match this pattern are included in an allow list.

```json
{
  "propName": "someProp",
  "allowedForRegex": "^Special",
  "message": "Avoid using someProp except on prefixed 'Special' components"
}
```
