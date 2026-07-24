import {
  badges,
  busRoutes,
  campusHotspots,
  classmates,
  decorations,
  games,
  navigation,
  subjects,
  type AgeBand,
  type RouteName,
  type Subject,
} from "./school-data";

export type Locale = "en" | "ar";

export function tr(locale: Locale, english: string, arabic: string) {
  return locale === "ar" ? arabic : english;
}

export function answerLabel(index: number, locale: Locale) {
  return locale === "ar"
    ? ["أ", "ب", "ج", "د", "هـ"][index] ?? String(index + 1)
    : String.fromCharCode(65 + index);
}

const arabicLevelLabels: Record<string, string> = {
  preschool: "مرحلة ما قبل المدرسة · ٣–٤ سنوات",
  kg: "رياض الأطفال · ٤–٦ سنوات",
  grade1: "الصف الأول",
  grade2: "الصف الثاني",
  grade3: "الصف الثالث",
  grade4: "الصف الرابع",
  grade5: "الصف الخامس",
  grade6: "الصف السادس",
  grade7: "الصف السابع",
  grade8: "الصف الثامن",
  grade9: "الصف التاسع",
  grade10: "الصف العاشر",
  grade11: "الصف الحادي عشر",
  grade12: "الصف الثاني عشر",
  university: "المرحلة الجامعية",
};

export function localizedLevelLabel(id: string, locale: Locale) {
  if (locale === "ar") return arabicLevelLabels[id] ?? arabicLevelLabels.grade5;
  const labels: Record<string, string> = {
    preschool: "Preschool · Ages 3–4",
    kg: "Kindergarten · Ages 4–6",
    grade1: "Grade 1",
    grade2: "Grade 2",
    grade3: "Grade 3",
    grade4: "Grade 4",
    grade5: "Grade 5",
    grade6: "Grade 6",
    grade7: "Grade 7",
    grade8: "Grade 8",
    grade9: "Grade 9",
    grade10: "Grade 10",
    grade11: "Grade 11",
    grade12: "Grade 12",
    university: "University",
  };
  return labels[id] ?? labels.grade5;
}

const arabicExperiences: Record<AgeBand, { label: string; world: string; promise: string }> = {
  early: {
    label: "المستكشفون الصغار",
    world: "حديقة الدهشة",
    promise: "المس واستمِع وعُدّ واكتشف من خلال مغامرات بصرية قصيرة.",
  },
  primary: {
    label: "روّاد المرحلة الابتدائية",
    world: "الحرم المسحور",
    promise: "ابنِ أساساً قوياً بالقصص والتحديات واللعب الهادف.",
  },
  middle: {
    label: "صنّاع المرحلة المتوسطة",
    world: "حي الاكتشاف",
    promise: "اربط الأفكار وحقّق في الأدلة وحلّ المهام التعاونية.",
  },
  secondary: {
    label: "أكاديمية المستقبل",
    world: "أكاديمية المستقبل",
    promise: "أتقن المفاهيم المتقدمة بالمشروعات والتحليل والقرارات الواقعية.",
  },
  university: {
    label: "الملتقى الجامعي",
    world: "الملتقى الجامعي",
    promise: "طوّر البحث والاستدلال الكمي والحكم المهني.",
  },
};

export function localizedExperience(
  experience: { id: AgeBand; label: string; world: string; promise: string; sessionMinutes: number; textScale: "largest" | "large" | "standard" },
  locale: Locale,
) {
  return locale === "ar" ? { ...experience, ...arabicExperiences[experience.id] } : experience;
}

const arabicSubjects: Record<Subject, { title: string; place: string; description: string }> = {
  math: {
    title: "الرياضيات",
    place: "مرصد الرياضيات",
    description: "نمِّ الحس العددي والمنطق والجبر ومهارات حل المشكلات.",
  },
  reading: {
    title: "اللغة والقراءة",
    place: "حديقة القراءة",
    description: "طوّر المفردات والفهم والكتابة والبحث.",
  },
  science: {
    title: "العلوم",
    place: "قبة العلوم",
    description: "اسأل وابحث وجرّب واكتشف.",
  },
};

export function localizedSubjects(locale: Locale) {
  return subjects.map((subject) => locale === "ar" ? { ...subject, ...arabicSubjects[subject.id] } : subject);
}

const arabicNavigation: Record<RouteName, string> = {
  campus: "الحرم",
  classes: "الفصول",
  friends: "الأصدقاء",
  playground: "ساحة اللعب",
  spaces: "مساحاتي",
  bus: "مهام الحافلة",
  rewards: "المكافآت",
  profile: "ملفي",
};

export function localizedNavigation(locale: Locale) {
  return navigation.map((item) => ({ ...item, label: locale === "ar" ? arabicNavigation[item.id] : item.label }));
}

const arabicGames: Record<string, { title: string; eyebrow: string; description: string }> = {
  memory: { title: "مرج الذاكرة", eyebrow: "التركيز", description: "طابق كنوز المدرسة السحرية قبل انتهاء الوقت." },
  numbers: { title: "سباق الأرقام", eyebrow: "الرياضيات", description: "تسابق عبر درب الغيوم بحل مسائل رقمية سريعة." },
  words: { title: "ساحر الكلمات", eyebrow: "القراءة", description: "رتّب الحروف وافتح بوابة المكتبة." },
  patterns: { title: "رحلة الأنماط", eyebrow: "المنطق", description: "اختر ما يأتي تالياً لتعيد المنطاد إلى موطنه." },
  story: { title: "مهمة القصة", eyebrow: "الخيال", description: "اتخذ قرارات واقرأ الأدلة وشكّل مغامرتك." },
  science: { title: "رحلة العلوم", eyebrow: "الاكتشاف", description: "اعثر على أفضل دليل لألغاز الحرم العجيبة." },
};

export function localizedGames(locale: Locale) {
  return games.map((game) => locale === "ar" ? { ...game, ...arabicGames[game.id] } : game);
}

const arabicDecorations: Record<string, string> = {
  "moon-lamp": "مصباح ضوء القمر",
  "star-rug": "سجادة النجوم",
  "book-nook": "ركن القراءة الدافئ",
  plant: "نبتة الفضول",
  "solar-model": "النظام الشمسي",
  "idea-board": "لوحة الأفكار",
  "class-pet": "بومة الفصل",
  "lab-corner": "المختبر الصغير",
};

export function localizedDecorations(locale: Locale) {
  return decorations.map((item) => ({ ...item, name: locale === "ar" ? arabicDecorations[item.id] : item.name }));
}

const arabicRoutes: Record<string, { title: string; location: string; description: string }> = {
  museum: {
    title: "متحف الزمن",
    location: "حي الساعة القديمة",
    description: "حلّ ألغاز التاريخ والتسلسل عبر ثلاث محطات.",
  },
  eco: {
    title: "إنقاذ الغابة الخضراء",
    location: "وادي الزمرد",
    description: "استخدم الأدلة العلمية لإعادة الحياة إلى الغابة السحرية.",
  },
  space: {
    title: "مهمة مكتبة القمر",
    location: "محطة الطريق السماوي",
    description: "اقرأ الإحداثيات وقد حافلة الكتب عبر الفضاء.",
  },
};

export function localizedBusRoutes(locale: Locale) {
  return busRoutes.map((route) => locale === "ar" ? { ...route, ...arabicRoutes[route.id] } : route);
}

const arabicBadges: Record<string, { name: string; description: string }> = {
  "first-step": { name: "الخطوة الأولى", description: "أكمل أول تحدٍّ" },
  "math-mind": { name: "عقل رياضي", description: "أجب عن خمسة أسئلة في الرياضيات" },
  "book-bloom": { name: "زهرة القراءة", description: "أكمل تحدياً في القراءة" },
  "lab-light": { name: "نور المختبر", description: "أكمل تحدياً في العلوم" },
  "kind-friend": { name: "الصديق اللطيف", description: "أرسل ثلاث تحيات تشجيعية" },
  "road-scholar": { name: "باحث الطريق", description: "أكمل مهمة حافلة" },
};

export function localizedBadges(locale: Locale) {
  return badges.map((badge) => locale === "ar" ? { ...badge, ...arabicBadges[badge.id] } : badge);
}

const arabicHotspots: Record<string, { label: string; short: string }> = {
  math: { label: "مرصد الرياضيات", short: "رياضيات" },
  reading: { label: "حديقة القراءة", short: "قراءة" },
  science: { label: "قبة العلوم", short: "علوم" },
  art: { label: "مرسم الفنون", short: "ابتكر" },
  play: { label: "ساحة اللعب", short: "العب" },
  station: { label: "محطة الحافلة", short: "المهام" },
};

export function localizedHotspots(locale: Locale) {
  return campusHotspots.map((spot) => locale === "ar" ? { ...spot, ...arabicHotspots[spot.id] } : spot);
}

const arabicClassmates: Record<string, { activity: string; strength: string }> = {
  Ava: { activity: "تستكشف حديقة القراءة", strength: "باحثة عن القصص" },
  Leo: { activity: "حلّ خمسة ألغاز رياضية", strength: "مستكشف الأرقام" },
  Zara: { activity: "حصلت على شارة العالمة الفضولية", strength: "خبيرة التجارب" },
  Noah: { activity: "صمّم فصلاً دراسياً جديداً", strength: "بنّاء مبدع" },
  Maya: { activity: "أنهت مهمة الحافلة اليوم", strength: "زميلة لطيفة" },
};

export function localizedClassmates(locale: Locale) {
  return classmates.map((friend) => locale === "ar" ? { ...friend, ...arabicClassmates[friend.name] } : friend);
}

export function formatNumber(value: number, locale: Locale) {
  return value.toLocaleString(locale === "ar" ? "ar-KW" : "en-US");
}
