import type { Locale } from "./i18n";
import type { Subject } from "./school-data";

export type GoalCategory = "learn" | "reach";
export type GoalId =
  | "balanced"
  | "math"
  | "reading"
  | "science"
  | "exams"
  | "university"
  | "engineer"
  | "doctor"
  | "scientist"
  | "creator"
  | "custom";

export type LearningGoal = {
  id: GoalId;
  category: GoalCategory;
  icon: string;
  title: string;
  description: string;
  subjects: Subject[];
};

type GoalDefinition = Omit<LearningGoal, "title" | "description"> & {
  en: { title: string; description: string };
  ar: { title: string; description: string };
};

const allSubjects: Subject[] = ["math", "reading", "science"];

const goalDefinitions: GoalDefinition[] = [
  {
    id: "balanced",
    category: "learn",
    icon: "✨",
    subjects: allSubjects,
    en: { title: "Grow in every subject", description: "Build balanced confidence in mathematics, reading, and science." },
    ar: { title: "أتطور في كل المواد", description: "أبني ثقتي بصورة متوازنة في الرياضيات واللغة والعلوم." },
  },
  {
    id: "math",
    category: "learn",
    icon: "∑",
    subjects: ["math"],
    en: { title: "Become stronger in mathematics", description: "Strengthen number sense, reasoning, algebra, and problem-solving." },
    ar: { title: "أصبح أقوى في الرياضيات", description: "أطوّر الحس العددي والاستدلال والجبر وحل المشكلات." },
  },
  {
    id: "reading",
    category: "learn",
    icon: "Aa",
    subjects: ["reading"],
    en: { title: "Read and write with confidence", description: "Grow vocabulary, comprehension, communication, and research skills." },
    ar: { title: "أقرأ وأكتب بثقة", description: "أطوّر المفردات والفهم والتواصل ومهارات البحث." },
  },
  {
    id: "science",
    category: "learn",
    icon: "⚗",
    subjects: ["science"],
    en: { title: "Understand how the world works", description: "Ask better questions, investigate evidence, and think like a scientist." },
    ar: { title: "أفهم كيف يعمل العالم", description: "أطرح أسئلة أفضل وأبحث في الأدلة وأفكر كالعلماء." },
  },
  {
    id: "exams",
    category: "learn",
    icon: "🎯",
    subjects: allSubjects,
    en: { title: "Prepare for tests and school", description: "Practice consistently, close skill gaps, and feel ready for assessments." },
    ar: { title: "أستعد للاختبارات والمدرسة", description: "أتدرّب باستمرار وأسُد فجوات المهارات وأستعد للتقييمات." },
  },
  {
    id: "university",
    category: "reach",
    icon: "🎓",
    subjects: allSubjects,
    en: { title: "Reach university ready", description: "Build the independence, analysis, and study habits needed for higher learning." },
    ar: { title: "أصل إلى الجامعة مستعداً", description: "أبني الاستقلالية والتحليل وعادات الدراسة اللازمة للتعليم العالي." },
  },
  {
    id: "engineer",
    category: "reach",
    icon: "⚙️",
    subjects: ["math", "science"],
    en: { title: "Become an engineer", description: "Grow the mathematical, scientific, and design thinking behind engineering." },
    ar: { title: "أصبح مهندساً", description: "أطوّر التفكير الرياضي والعلمي والتصميمي الذي تقوم عليه الهندسة." },
  },
  {
    id: "doctor",
    category: "reach",
    icon: "🩺",
    subjects: ["science", "reading"],
    en: { title: "Become a doctor", description: "Strengthen science, careful reading, evidence, and compassionate decision-making." },
    ar: { title: "أصبح طبيباً", description: "أقوّي العلوم والقراءة الدقيقة وفهم الأدلة واتخاذ القرار بتعاطف." },
  },
  {
    id: "scientist",
    category: "reach",
    icon: "🔬",
    subjects: ["science", "math"],
    en: { title: "Become a scientist", description: "Learn to investigate, measure, test explanations, and communicate discoveries." },
    ar: { title: "أصبح عالماً", description: "أتعلّم البحث والقياس واختبار التفسيرات والتواصل حول الاكتشافات." },
  },
  {
    id: "creator",
    category: "reach",
    icon: "💡",
    subjects: allSubjects,
    en: { title: "Build ideas that help people", description: "Combine creativity, communication, evidence, and numbers to make ideas real." },
    ar: { title: "أبني أفكاراً تفيد الناس", description: "أجمع الإبداع والتواصل والأدلة والأرقام لأحوّل الأفكار إلى واقع." },
  },
  {
    id: "custom",
    category: "reach",
    icon: "🌟",
    subjects: allSubjects,
    en: { title: "Choose my own dream", description: "Write the personal destination you want School Life to help you reach." },
    ar: { title: "أختار حلمي الخاص", description: "اكتب الهدف الشخصي الذي تريد من الحياة المدرسية مساعدتك على بلوغه." },
  },
];

export function isGoalId(value: unknown): value is GoalId {
  return typeof value === "string" && goalDefinitions.some((goal) => goal.id === value);
}

export function localizedGoals(locale: Locale, category?: GoalCategory): LearningGoal[] {
  return goalDefinitions
    .filter((goal) => !category || goal.category === category)
    .map((goal) => ({
      ...goal,
      icon: goal.id === "reading" && locale === "ar" ? "أب" : goal.icon,
      ...(locale === "ar" ? goal.ar : goal.en),
    }));
}

export function goalFor(id: GoalId, locale: Locale, customText = ""): LearningGoal {
  const goal = localizedGoals(locale).find((item) => item.id === id) ?? localizedGoals(locale)[0];
  if (goal.id !== "custom" || !customText.trim()) return goal;
  return {
    ...goal,
    title: customText.trim(),
    description: locale === "ar"
      ? "سنربط تعلّمك اليومي بهذا الهدف الشخصي ونبني نحوه خطوة بعد خطوة."
      : "We’ll connect daily learning to this personal goal and build toward it one step at a time.",
  };
}

export function recommendedSubjectForGoal(id: GoalId, progress: Record<Subject, number>): Subject {
  const definition = goalDefinitions.find((goal) => goal.id === id) ?? goalDefinitions[0];
  return definition.subjects.reduce((lowest, subject) =>
    progress[subject] < progress[lowest] ? subject : lowest,
  );
}

export function progressForGoal(id: GoalId, progress: Record<Subject, number>) {
  const definition = goalDefinitions.find((goal) => goal.id === id) ?? goalDefinitions[0];
  const total = definition.subjects.reduce((sum, subject) => sum + progress[subject], 0);
  return Math.round(total / definition.subjects.length);
}
