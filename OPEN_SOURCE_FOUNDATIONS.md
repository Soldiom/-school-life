# Open-source and Hugging Face foundation map

School Life keeps its product core original and adds open components through explicit package and service boundaries. This reduces license surprises, keeps the first load small, and lets schools or countries choose cloud, on-premises, or offline deployment.

**Status:** researched roadmap; none of the models or datasets below ship in the current learner app.

**Metadata verified:** 24 July 2026. Recheck licenses and model cards at the exact pinned revision before integration.

The current release does not copy source code or dataset rows from the projects below. This map records intended, separately reviewed integrations.

## GitHub shortlist

| Foundation | License | Proposed role | Integration boundary |
| --- | --- | --- | --- |
| [Learning Equality Kolibri](https://github.com/learningequality/kolibri) | MIT | Offline-first content delivery and low-connectivity deployment patterns | Content/export adapter; do not replace the School Life interface |
| [Phaser](https://github.com/phaserjs/phaser) | MIT | Richer 2D minigames, physics, input, and scene management | Lazy-loaded `school-life-games` package |
| [Transformers.js](https://github.com/huggingface/transformers.js) | Apache-2.0 | Supported Hugging Face models in WASM or WebGPU | Optional `school-life-ai-local` package; never block the core experience |
| [H5P](https://github.com/h5p/h5p-php-library) | GPL-3.0 ([package metadata](https://github.com/h5p/h5p-php-library/blob/master/composer.json)) | Educator-authored interactive content packages | Separate GPL-compatible service or plugin |
| [Moodle](https://github.com/moodle/moodle) | GPL-3.0 | Institutional LMS interoperability | LTI/API connector rather than a product fork |

## Hugging Face model shortlist

| Model | Hub license metadata | Proposed use | Guardrail |
| --- | --- | --- | --- |
| [HuggingFaceTB/SmolLM2-360M-Instruct](https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruct) | Apache-2.0 | Optional local tutor, explanation rewriting, educator drafts | Retrieval-ground, age-scoped, filtered, clearly identified as AI, and loaded only after device capability and user consent checks |
| [onnx-community/all-MiniLM-L6-v2-ONNX](https://huggingface.co/onnx-community/all-MiniLM-L6-v2-ONNX) | Apache-2.0 | Lesson search, recommendation similarity, duplicate-question detection | Use embeddings for retrieval and ranking, never as educational truth; exclude direct learner identifiers |
| [onnx-community/whisper-tiny](https://huggingface.co/onnx-community/whisper-tiny) | Not declared on the conversion repository | Optional on-device reading-practice transcription | Verify the exact conversion and base-model license first; prefer local processing and require explicit consent, clear controls, and short retention |

Model cards and licenses can change. Production releases should pin an exact revision, archive its model card and license in a software bill of materials, evaluate safety and quality for every supported age/language group, and re-approve upgrades.

## Hugging Face dataset shortlist

| Dataset | Hub license metadata | Proposed use | Required handling |
| --- | --- | --- | --- |
| [openai/gsm8k](https://huggingface.co/datasets/openai/gsm8k) | MIT | Mathematics evaluation and educator-reviewed inspiration | Review every item for age, ambiguity, culture, currency, and curriculum alignment; do not automatically expose raw rationales |
| [allenai/ai2_arc](https://huggingface.co/datasets/allenai/ai2_arc) | CC BY-SA 4.0 | Science evaluation and attributed content packs | Preserve attribution/share-alike duties and require educator verification |
| [rajpurkar/squad](https://huggingface.co/datasets/rajpurkar/squad) | CC BY-SA 4.0 | Reading-comprehension pipeline evaluation | Preserve attribution/share-alike duties; independently assess passage suitability and cultural fit |

Datasets are not curricula. Production content needs named learning objectives, standards mapping, subject-matter review, bias and accessibility review, version history, attribution, and a retirement process.

## Recommended package boundaries

```text
school-life-core          Original world, progression, rooms, rewards
school-life-content       Versioned and attributed curriculum packages
school-life-games         Lazy-loaded Phaser experiences
school-life-ai-local      Optional Transformers.js model adapters
school-life-lti           Institution and LMS connector
school-life-h5p-service   Optional isolated GPL content service
```

The core must remain immediately usable on ordinary phones and school computers. AI models and heavy game engines should be capability-checked, opt-in, lazy-loaded, and replaceable.
