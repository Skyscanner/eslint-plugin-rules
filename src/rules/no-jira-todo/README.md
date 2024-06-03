## Asserting all TODO comments have a linked JIRA ticket

This rule when enabled would require every `TODO` style comnent to be linked to an associated JIRA ticket.

The format of the comment is required to match:

- `TODO:`/`FIXME:`/`@TODO:`/`@FIXME:`
- followed by the Jira url or the ticket reference in square brackets, eg:
  - `https://skyscanner.atlassian.net/browse/JIRA-0000`
  - `[JIRA-0000]`
- then an optional description about the changes needed by the linked ticket

Examples of valid comments:

```tsx
// TODO: [WALL-1234] description of the change needed
// FIXME: [CASTLE-5678]
// FIXME: [WOM-2468] comment
// @TODO: [WALL-1234] description of the change needed
// @FIXME: [WALL-1234] description of the change needed
// TODO: https://skyscanner.atlassian.net/browse/SHIBA-1234 description of the change needed
// @FIXME: https://skyscanner.atlassian.net/browse/WOODPECKER-1010 description of the change needed
// TODO: [JIRA-XXXX] fixed
```

Examples of invalid comments:

```tsx
// TODO: WALL-1234 description of the change needed
// TODO: description of the change needed
// FIXME description of the change needed WALL-1234
// @FIXME description of the change needed WALL-1234
// @TODO: https://skyscanner.atlassian.net/browse/not-a-ticket
```

If an invalid `TODO` comment is recognised, there is a auto fix available to update the comment to the format. This should be updated with the ticket and description. This is provided in the format:

```tsx
// TODO: [JIRA-XXX]
```
