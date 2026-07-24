# Contributing to School Life

Thank you for helping make learning more welcoming and useful.

## Development

1. Fork the repository and create a focused branch.
2. Install with `npm ci`.
3. Make a small, documented change.
4. Run `npm run check`.
5. Open a pull request describing learner impact, testing, and any safety or privacy implications.

## Curriculum contributions

Every new question should include:

- a stable unique ID;
- one named learning objective;
- an age band and difficulty from 1 to 3;
- plausible, non-duplicated answer choices;
- exactly one correct answer;
- a useful hint that does not simply reveal the answer;
- an explanation of why the answer is correct; and
- source attribution and license information when material is adapted.

Avoid stereotypes, unnecessary personal-data prompts, commercial persuasion, trick wording, and culturally narrow assumptions. Content needs human educator review before it is marked production-ready.

## Interface contributions

- Preserve keyboard access and visible focus.
- Keep ordinary touch targets at least 44 by 44 CSS pixels.
- Do not rely on color alone to communicate state.
- Respect reduced-motion, high-contrast, and larger-text preferences.
- Test narrow mobile layouts and zoomed text.
- Keep learning usable without sound and without an AI model.

## Dependencies and models

Explain why a new dependency is needed and review its license, maintenance, bundle cost, and security history. Hugging Face models must be optional, revision-pinned, evaluated for the intended task and age band, and documented with their model card and license. Never send learner data to a model service by default.

By contributing, you agree that your contribution is licensed under the repository's MIT License.
