# Curriculum and adaptation model

School Life currently provides a versioned foundation pack for mathematics, reading, and science. It is designed to prove the learning loop, not to claim universal curriculum coverage.

## Learning bands

| Band | Levels | Experience | Suggested session |
| --- | --- | --- | --- |
| Early explorers | Preschool, kindergarten | Wonder Garden | 8 minutes |
| Primary pathfinders | Grades 1–5 | Enchanted Campus | 15 minutes |
| Middle school makers | Grades 6–8 | Discovery District | 20 minutes |
| Secondary learners | Grades 9–12 | Future Academy | 25 minutes |
| University learners | University | University Commons | 30 minutes |

The current challenge bank has 78 questions. Bus missions add 36 route-specific questions, and the six minigames contain their own learning rounds.

## Transparent adaptation

Each challenge:

1. reads the learner's current subject mastery;
2. targets foundation, developing, or extension difficulty;
3. chooses five deterministic questions near that difficulty;
4. records correct answers and attempts; and
5. updates mastery using 68% of the previous estimate and 32% of the latest observed accuracy.

The weighting avoids dramatic jumps after one short session while still making progress visible. It is a simple explainable heuristic, not a validated psychometric model.

## Content lifecycle

The foundation pack is currently marked `prototype-awaiting-expert-review`. Before a content pack is called classroom-ready, it should have:

- named subject and age-band reviewers;
- curriculum-standard mappings by jurisdiction;
- reading-level and accessibility review;
- factual sources and attribution where needed;
- bias and cultural-context review;
- pilot evidence and a documented correction process; and
- a versioned release note with retired or changed items.

Automated tests verify structural quality—valid answer indices, unique IDs, non-duplicated choices, and required hints/objectives/explanations—but automation does not replace educator review.
