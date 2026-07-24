# Security policy

## Supported version

The latest release on `main` is the supported open-source version.

## Reporting a vulnerability

Please use the repository's private **Security → Report a vulnerability** flow when available. Do not publish exploitable details or learner information in a public issue.

Include:

- the affected version or commit;
- clear reproduction steps;
- the impact you observed; and
- a suggested fix, if known.

## Current security boundary

School Life is a static client application. It has no application server, authentication, remote database, payment flow, or secret API keys. Browser local storage contains the local learner profile and should not be treated as secure storage for sensitive information.

Dependencies are locked in `package-lock.json`, checked in CI, and monitored through Dependabot. Any future backend, account, AI, or school-roster integration requires its own threat model, authorization tests, privacy review, incident response plan, and data-retention controls.
