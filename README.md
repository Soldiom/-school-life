# School Life — Enchanted Campus

An interactive learning world for preschool, kindergarten, Grades 1–12, and university learners.

![School Life Enchanted Campus](public/enchanted-campus.webp)

## GitHub Pages

After GitHub Pages is enabled for this repository, the platform is available at:

**https://soldiom.github.io/-school-life/**

Every push to `main` is built and deployed automatically by `.github/workflows/deploy-pages.yml`.

## Included

- Fifteen selectable learning levels from preschool through university
- Adaptive mathematics, reading, and science challenges
- Six educational minigames
- Safe fictional classmates and guided kindness actions
- Bedroom and classroom decoration
- Three multi-stop school-bus missions
- Stars, coins, XP, mastery, streaks, energy, quests, and badges
- Local browser persistence without requiring an account
- Mobile, tablet, and desktop layouts
- High-contrast, larger-text, and reduced-motion controls
- A documented GitHub and Hugging Face integration roadmap

## Run locally

```bash
npm install
npm run dev
```

Build and verify:

```bash
npm test
```

## Project structure

```text
src/App.tsx                Product screens, state, games, and missions
src/school-data.ts         Levels, question banks, friends, and rewards
src/styles.css             Enchanted Campus design system
public/                    Campus artwork, icon, and web manifest
.github/workflows/         Automatic GitHub Pages deployment
OPEN_SOURCE_FOUNDATIONS.md GitHub and Hugging Face integration map
```

## Safety boundary

The current social layer uses fictional classmates and predefined positive actions. A production child-facing launch still requires verified guardian or school groups, moderation and reporting, curriculum review, privacy review, security testing, and human accessibility testing.
