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
    "@skyscanner/rules/no-axios": "error"
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
