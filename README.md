# School Life | الحياة المدرسية

An open-source bilingual learning world in English and Arabic for preschool, kindergarten, Grades 1–12, and university learners.

[![Quality checks](https://github.com/Soldiom/-school-life/actions/workflows/ci.yml/badge.svg)](https://github.com/Soldiom/-school-life/actions/workflows/ci.yml)
[![Deploy to GitHub Pages](https://github.com/Soldiom/-school-life/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/Soldiom/-school-life/actions/workflows/deploy-pages.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-286b72.svg)](LICENSE)

![School Life learning world](public/enchanted-campus.webp)

## Live app

Once GitHub Pages is enabled, the production site is:

**https://soldiom.github.io/-school-life/**

The app is installable and works offline after its first successful load.

## What works today

- 15 selectable levels across five genuinely different age experiences
- Instant English/Arabic switching with a true right-to-left Arabic interface
- Goal-driven onboarding for both learning targets and future aspirations, including personal goals
- Goal-aware subject recommendations and visible progress toward each learner's destination
- 78 adaptive mathematics, language/reading, and science questions in each language
- Purpose-written Modern Standard Arabic literacy activities, hints, explanations, and read-aloud support
- Transparent mastery updates based on the learner's latest result
- Six complete educational minigames with multi-round play
- 36 route- and age-specific questions in each language across three school-bus missions
- Fictional classmates with guided kindness actions and no open messaging
- Bedroom and classroom decoration using rewards earned through learning
- Real daily streak, weekly lesson goal, stars, coins, XP, and badges
- Local read-aloud, sound controls, high contrast, larger text, reduced motion, keyboard dialogs, and responsive layouts
- Private on-device profiles with no account, advertising, analytics, or remote learner database
- Offline Progressive Web App support

## Run locally

Requirements: Node.js 22 or newer.

```bash
npm ci
npm run dev
```

Run the same release checks used in CI:

```bash
npm run check
```

Individual commands:

```bash
npm run typecheck
npm test
npm run build
npm run preview
```

## Architecture

| Path | Responsibility |
| --- | --- |
| `src/App.tsx` | Product screens, local profile state, rewards, and accessibility settings |
| `src/learning-engine.ts` | Age experiences, adaptive question selection, mastery, streaks, audio |
| `src/learning-goals.ts` | Bilingual goals, aspiration pathways, progress, and subject recommendations |
| `src/arabic-content.ts` | Purpose-written Arabic curriculum across every age band |
| `src/i18n.ts` | English/Arabic labels, localized product data, and locale helpers |
| `src/content-packs.ts` | Versioned curriculum extensions and review metadata |
| `src/minigames.tsx` | Six interactive educational game loops |
| `src/bus-missions.ts` | Route-specific missions across three age groupings |
| `src/DialogFrame.tsx` | Accessible modal focus management |
| `src/school-data.ts` | Core levels, subjects, world data, and starter questions |
| `src/styles.css` | Responsive design system and age-specific themes |
| `tests/` | Curriculum, progression, and mission validation |

The app is a static React and TypeScript client built with Vite. Progress is stored under `school-life-enchanted-v1` in browser local storage. The service worker precaches the production shell and assets.

## Important boundaries

This release is a polished open prototype, not an accredited curriculum or a hosted school information system. It currently has no teacher dashboard, cloud sync, real-user social network, payments, generative AI tutor, or institutional authentication. English and Arabic seed learning content still requires independent subject-matter, linguistic, and local-curriculum review before formal classroom adoption.

Read the project policies before deploying to children:

- [Curriculum model](CURRICULUM.md)
- [Privacy](PRIVACY.md)
- [Child safety](SAFETY.md)
- [Security](SECURITY.md)
- [Open-source and Hugging Face foundation map](OPEN_SOURCE_FOUNDATIONS.md)
- [Contributing](CONTRIBUTING.md)

## Deployment

Every push to `main` runs quality checks through `.github/workflows/deploy-pages.yml` and force-pushes the built `dist/` output to the `gh-pages` branch. GitHub activates Pages for public repositories automatically when a `gh-pages` branch appears; if the site does not come up after the first deployment, confirm **Settings → Pages → Build and deployment → Source: Deploy from a branch → `gh-pages`**.

## License

School Life is available under the [MIT License](LICENSE).
