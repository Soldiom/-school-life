"use client";

import {
  Accessibility,
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  BusFront,
  Check,
  ChevronRight,
  Clock3,
  Coins,
  Crown,
  Flame,
  Gamepad2,
  Gift,
  Heart,
  Lightbulb,
  LockKeyhole,
  Menu,
  MoonStar,
  Palette,
  Play,
  RotateCcw,
  School,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Volume2,
  VolumeX,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import type { CSSProperties, FormEvent } from "react";
import { useEffect, useState } from "react";
import { missionFor } from "./bus-missions";
import DialogFrame from "./DialogFrame";
import {
  answerLabel,
  formatNumber,
  localizedBadges,
  localizedBusRoutes,
  localizedClassmates,
  localizedDecorations,
  localizedGames,
  localizedHotspots,
  localizedLevelLabel,
  localizedNavigation,
  localizedSubjects,
  tr,
  type Locale,
} from "./i18n";
import {
  adaptiveQuestionSet,
  calculateMastery,
  experienceFor,
  localDateKey,
  playFeedback,
  readAloud,
  recordLearningDay,
  refreshDailyProgress,
  startOfWeekKey,
} from "./learning-engine";
import {
  goalFor,
  isGoalId,
  localizedGoals,
  progressForGoal,
  recommendedSubjectForGoal,
  type GoalCategory,
  type GoalId,
} from "./learning-goals";
import GameDialog from "./minigames";
import {
  ageBandFor,
  levels,
  type RouteName,
  type Subject,
} from "./school-data";

const STORAGE_KEY = "school-life-enchanted-v1";

type PlayerState = {
  name: string;
  level: string;
  avatar: number;
  stars: number;
  coins: number;
  xp: number;
  streak: number;
  energy: number;
  progress: Record<Subject, number>;
  progressByLevel: Record<string, Record<Subject, number>>;
  subjectWins: Record<Subject, number>;
  attempts: Record<Subject, number>;
  correctAnswers: Record<Subject, number>;
  completedChallenges: number;
  completedGames: string[];
  completedBus: string[];
  highFives: number;
  purchased: string[];
  placed: string[];
  sound: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  largerText: boolean;
  locale: Locale;
  goalId: GoalId;
  goalText: string;
  lastActiveDate: string;
  lastLearningDate: string;
  weekKey: string;
  weeklyLessons: number;
};

const initialPlayer: PlayerState = {
  name: "",
  level: "grade5",
  avatar: 0,
  stars: 100,
  coins: 80,
  xp: 0,
  streak: 0,
  energy: 5,
  progress: { math: 0, reading: 0, science: 0 },
  progressByLevel: {},
  subjectWins: { math: 0, reading: 0, science: 0 },
  attempts: { math: 0, reading: 0, science: 0 },
  correctAnswers: { math: 0, reading: 0, science: 0 },
  completedChallenges: 0,
  completedGames: [],
  completedBus: [],
  highFives: 0,
  purchased: ["moon-lamp"],
  placed: ["moon-lamp"],
  sound: true,
  reducedMotion: false,
  highContrast: false,
  largerText: false,
  locale: "en",
  goalId: "balanced",
  goalText: "",
  lastActiveDate: localDateKey(),
  lastLearningDate: "",
  weekKey: startOfWeekKey(),
  weeklyLessons: 0,
};

function restorePlayer(raw: string): PlayerState {
  const parsed = JSON.parse(raw) as Partial<PlayerState> | null;
  if (!parsed || typeof parsed !== "object") return initialPlayer;
  return refreshDailyProgress({
    ...initialPlayer,
    ...parsed,
    locale: parsed.locale === "ar" ? "ar" : "en",
    goalId: isGoalId(parsed.goalId) ? parsed.goalId : "balanced",
    goalText: typeof parsed.goalText === "string" ? parsed.goalText.slice(0, 80) : "",
    streak: parsed.lastLearningDate ? parsed.streak ?? 0 : 0,
    progress: { ...initialPlayer.progress, ...parsed.progress },
    progressByLevel: { ...initialPlayer.progressByLevel, ...parsed.progressByLevel },
    subjectWins: { ...initialPlayer.subjectWins, ...parsed.subjectWins },
    attempts: { ...initialPlayer.attempts, ...parsed.attempts },
    correctAnswers: { ...initialPlayer.correctAnswers, ...parsed.correctAnswers },
  });
}

type DialogState =
  | { type: "challenge"; subject: Subject }
  | { type: "game"; gameId: string }
  | { type: "bus"; routeId: string }
  | null;

const avatarFaces = ["🧑🏻‍🎓", "👩🏽‍🔬", "🧑🏾‍🚀", "👩🏻‍🎨"];
const avatarNames = {
  en: ["Sunny", "Nova", "Orbit", "Bloom"],
  ar: ["شمس", "نوفا", "مدار", "زهرة"],
} satisfies Record<Locale, string[]>;

function Brand({ compact = false, locale = "en" }: { compact?: boolean; locale?: Locale }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <span className="brand-emblem" aria-hidden="true">
        <span className="brand-book" />
        <Star className="brand-star" fill="currentColor" />
      </span>
      {!compact && <span className="brand-words">{tr(locale, "School Life", "الحياة المدرسية")}</span>}
    </div>
  );
}

function Avatar({ index, label, locale = "en", small = false }: { index: number; label: string; locale?: Locale; small?: boolean }) {
  return (
    <span className={`avatar avatar-${index + 1} ${small ? "avatar-small" : ""}`} role="img" aria-label={tr(locale, `${label} avatar`, `صورة ${label}`)}>
      {avatarFaces[index] ?? avatarFaces[0]}
    </span>
  );
}

function ProgressRing({ value, children }: { value: number; children: React.ReactNode }) {
  return (
    <div className="progress-ring" style={{ "--progress": `${Math.min(100, Math.max(0, value)) * 3.6}deg` } as CSSProperties}>
      <div>{children}</div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy: string; action?: React.ReactNode }) {
  return (
    <header className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
      {action}
    </header>
  );
}

function LanguageToggle({ locale, onChange, compact = false }: { locale: Locale; onChange: (locale: Locale) => void; compact?: boolean }) {
  return (
    <div className={`language-toggle ${compact ? "compact" : ""}`} role="group" aria-label={tr(locale, "Choose language", "اختر اللغة")}>
      <button type="button" className={locale === "en" ? "active" : ""} aria-pressed={locale === "en"} onClick={() => onChange("en")}>EN</button>
      <button type="button" className={locale === "ar" ? "active" : ""} aria-pressed={locale === "ar"} onClick={() => onChange("ar")}>العربية</button>
    </div>
  );
}

function GoalPicker({
  locale,
  goalId,
  goalText,
  onChange,
  compact = false,
}: {
  locale: Locale;
  goalId: GoalId;
  goalText: string;
  onChange: (goalId: GoalId, goalText: string) => void;
  compact?: boolean;
}) {
  const category = goalFor(goalId, locale, goalText).category;
  const goals = localizedGoals(locale, category);
  const selectCategory = (nextCategory: GoalCategory) => {
    onChange(nextCategory === "learn" ? "balanced" : "university", goalText);
  };

  return (
    <fieldset className={`goal-picker ${compact ? "compact" : ""}`}>
      <legend>{tr(locale, "What is your goal?", "ما هدفك؟")}</legend>
      <div className="goal-category" role="group" aria-label={tr(locale, "Goal type", "نوع الهدف")}>
        <button type="button" className={category === "learn" ? "active" : ""} aria-pressed={category === "learn"} onClick={() => selectCategory("learn")}>
          <BookOpen size={17} />
          <span><strong>{tr(locale, "I want to learn", "أريد أن أتعلم")}</strong><small>{tr(locale, "Choose a skill", "اختر مهارة")}</small></span>
        </button>
        <button type="button" className={category === "reach" ? "active" : ""} aria-pressed={category === "reach"} onClick={() => selectCategory("reach")}>
          <Target size={17} />
          <span><strong>{tr(locale, "I want to reach", "أريد أن أصل")}</strong><small>{tr(locale, "Choose a dream", "اختر حلماً")}</small></span>
        </button>
      </div>
      <div className="goal-options">
        {goals.map((goal) => (
          <button type="button" key={goal.id} className={goalId === goal.id ? "selected" : ""} aria-pressed={goalId === goal.id} onClick={() => onChange(goal.id, goalText)}>
            <span aria-hidden="true">{goal.id === "reading" && locale === "ar" ? "أب" : goal.icon}</span>
            <strong>{goal.title}</strong>
            {!compact && <small>{goal.description}</small>}
          </button>
        ))}
      </div>
      {goalId === "custom" && (
        <label className="custom-goal">
          <span>{tr(locale, "Write your personal goal", "اكتب هدفك الشخصي")}</span>
          <input
            value={goalText}
            onChange={(event) => onChange("custom", event.target.value.slice(0, 80))}
            maxLength={80}
            required={!compact}
            placeholder={tr(locale, "Example: Build my own robot", "مثال: أبني روبوتي الخاص")}
          />
        </label>
      )}
    </fieldset>
  );
}

function Onboarding({ onStart }: { onStart: (name: string, level: string, avatar: number, locale: Locale, goalId: GoalId, goalText: string) => void }) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("grade5");
  const [avatar, setAvatar] = useState(0);
  const [locale, setLocale] = useState<Locale>(() => typeof navigator !== "undefined" && navigator.language.toLowerCase().startsWith("ar") ? "ar" : "en");
  const [step, setStep] = useState<1 | 2>(1);
  const [goalId, setGoalId] = useState<GoalId>("balanced");
  const [goalText, setGoalText] = useState("");
  const experience = experienceFor(level, locale);
  const selectedGoal = goalFor(goalId, locale, goalText);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    onStart(name.trim() || tr(locale, "Explorer", "مستكشف"), level, avatar, locale, goalId, goalText.trim());
  };

  return (
    <main className="welcome-shell" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="welcome-sky" aria-hidden="true">
        <span className="welcome-cloud cloud-a" />
        <span className="welcome-cloud cloud-b" />
        <span className="welcome-spark spark-a">✦</span>
        <span className="welcome-spark spark-b">✦</span>
      </div>
      <section className="welcome-card">
        <div className="welcome-form-panel">
          <div className="welcome-brand-row"><Brand locale={locale} /><LanguageToggle locale={locale} onChange={setLocale} /></div>
          <div className="onboarding-progress" aria-label={tr(locale, `Step ${step} of 2`, `الخطوة ${formatNumber(step, locale)} من ٢`)}>
            <span className="active"><i /></span><span className={step === 2 ? "active" : ""}><i /></span>
          </div>
          <p className="eyebrow">{step === 1 ? tr(locale, "YOUR WORLD OF LEARNING", "عالمك للتعلّم") : tr(locale, "YOUR NORTH STAR", "بوصلة رحلتك")}</p>
          <h1>{step === 1 ? tr(locale, "Every school day becomes an adventure.", "كل يوم دراسي يتحول إلى مغامرة.") : tr(locale, "Where do you want learning to take you?", "إلى أين تريد أن يقودك التعلّم؟")}</h1>
          <p className="welcome-copy">{step === 1
            ? tr(locale, "Learn at your level, make kind friends, play, create, and grow—from preschool to university.", "تعلّم وفق مستواك، وكوّن صداقات لطيفة، والعب وابتكر وتطوّر—من الروضة حتى الجامعة.")
            : tr(locale, "Choose what you want to learn or the dream you want to reach. School Life will shape your next best step around it.", "اختر ما تريد تعلّمه أو الحلم الذي تريد بلوغه. ستبني الحياة المدرسية خطوتك التالية الأفضل حوله.")}</p>
          <form onSubmit={submit} className="setup-form">
            {step === 1 ? (
              <>
                <label htmlFor="learner-name">{tr(locale, "What should we call you?", "ما الاسم الذي تحب أن نناديك به؟")}</label>
                <input id="learner-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={24} placeholder={tr(locale, "Your first name", "اسمك الأول")} autoComplete="given-name" />

                <label htmlFor="learning-level">{tr(locale, "Choose your learning level", "اختر مرحلتك التعليمية")}</label>
                <select id="learning-level" value={level} onChange={(event) => setLevel(event.target.value)}>
                  {levels.map(([value]) => <option value={value} key={value}>{localizedLevelLabel(value, locale)}</option>)}
                </select>
                <div className="experience-preview" aria-live="polite">
                  <span>{experience.label}</span>
                  <strong>{experience.world}</strong>
                  <p>{experience.promise}</p>
                </div>

                <fieldset className="avatar-picker">
                  <legend>{tr(locale, "Pick your explorer", "اختر شخصيتك")}</legend>
                  <div className="avatar-options">
                    {avatarFaces.map((face, index) => (
                      <button key={face} type="button" className={avatar === index ? "selected" : ""} onClick={() => setAvatar(index)} aria-pressed={avatar === index}>
                        <span>{face}</span><small>{avatarNames[locale][index]}</small>
                      </button>
                    ))}
                  </div>
                </fieldset>
              </>
            ) : (
              <GoalPicker locale={locale} goalId={goalId} goalText={goalText} onChange={(nextGoalId, nextGoalText) => { setGoalId(nextGoalId); setGoalText(nextGoalText); }} />
            )}
            <div className="onboarding-actions">
              {step === 2 && <button className="soft-button" type="button" onClick={() => setStep(1)}>{tr(locale, "Back", "رجوع")}</button>}
              <button className="primary-button enter-button" type="submit">
                {step === 1 ? tr(locale, "Continue", "متابعة") : tr(locale, "Start my journey", "ابدأ رحلتي")} <ArrowRight size={19} />
              </button>
            </div>
          </form>
          <p className="privacy-note"><ShieldCheck size={15} /> {tr(locale, "No account needed. Progress stays on this device.", "لا تحتاج إلى حساب. يبقى تقدمك محفوظاً على هذا الجهاز.")}</p>
        </div>
        <div className="welcome-world-panel">
          <div className="welcome-world-copy">
            <span className="live-chip"><span /> {experience.world.toUpperCase()}</span>
            <h2>{step === 1
              ? <>{tr(locale, "One learning journey.", "رحلة تعلّم واحدة.")}<br />{tr(locale, "A distinct experience at every age.", "وتجربة مميزة لكل عمر.")}</>
              : <>{tr(locale, "A goal makes every step meaningful.", "الهدف يمنح كل خطوة معنى.")}<br />{selectedGoal.title}</>}</h2>
          </div>
          {step === 1 ? (
            <div className="welcome-subjects" aria-label={tr(locale, "Learning areas", "مجالات التعلّم")}>
              <span><strong>∑</strong> {tr(locale, "Mathematics", "الرياضيات")}</span>
              <span><strong>{locale === "ar" ? "أب" : "Aa"}</strong> {tr(locale, "Reading", "اللغة والقراءة")}</span>
              <span><strong>⚗</strong> {tr(locale, "Science", "العلوم")}</span>
            </div>
          ) : (
            <div className="welcome-goal-card" aria-live="polite">
              <span aria-hidden="true">{selectedGoal.icon}</span>
              <div><strong>{selectedGoal.title}</strong><p>{selectedGoal.description}</p></div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function CampusView({ player, go, openChallenge }: { player: PlayerState; go: (route: RouteName) => void; openChallenge: (subject: Subject) => void }) {
  const locale = player.locale;
  const experience = experienceFor(player.level, locale);
  const subjectList = localizedSubjects(locale);
  const friendList = localizedClassmates(locale);
  const hotspots = localizedHotspots(locale);
  const questItems = [
    { label: tr(locale, "Solve a math puzzle", "حل لغزاً رياضياً"), complete: player.subjectWins.math > 0, subject: "math" as Subject },
    { label: tr(locale, "Read one story clue", "اقرأ دليلاً من قصة"), complete: player.subjectWins.reading > 0, subject: "reading" as Subject },
    { label: tr(locale, "Visit the Science Dome", "زُر قبة العلوم"), complete: player.subjectWins.science > 0, subject: "science" as Subject },
  ];
  const completed = questItems.filter((item) => item.complete).length;
  const selectedGoal = goalFor(player.goalId, locale, player.goalText);
  const goalProgress = progressForGoal(player.goalId, player.progress);
  const recommendedSubjectId = recommendedSubjectForGoal(player.goalId, player.progress);
  const recommendedSubject = subjectList.find((subject) => subject.id === recommendedSubjectId) ?? subjectList[0];

  return (
    <div className="page campus-page">
      <SectionHeading
        eyebrow={tr(locale, `TODAY · ${experience.label.toUpperCase()}`, `اليوم · ${experience.label}`)}
        title={tr(locale, `Welcome back, ${player.name}.`, `مرحباً بعودتك، ${player.name}.`)}
        copy={experience.promise}
        action={<button className="soft-button" onClick={() => openChallenge(recommendedSubject.id)}><WandSparkles size={18} /> {tr(locale, "Choose for me", "اختر لي")}</button>}
      />
      <div className="campus-layout">
        <section className="world-card" aria-label={tr(locale, `Interactive ${experience.world} map`, `خريطة ${experience.world} التفاعلية`)}>
          <div className="world-shade" />
          <div className="world-topline">
            <span><Sparkles size={16} /> {experience.world}</span>
            <span className="weather-chip">{tr(locale, `${experience.sessionMinutes}-minute learning path`, `مسار تعلّم لمدة ${formatNumber(experience.sessionMinutes, locale)} دقيقة`)}</span>
          </div>
          {hotspots.map((spot) => (
            <button
              type="button"
              key={spot.id}
              className={`map-hotspot hotspot-${spot.id}`}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              onClick={() => spot.id === "math" || spot.id === "reading" || spot.id === "science" ? openChallenge(spot.id) : go(spot.route)}
            >
              <span className="hotspot-pulse" />
              <span className="hotspot-label"><strong>{spot.label}</strong><small>{spot.short} <ChevronRight size={12} /></small></span>
            </button>
          ))}
          <div className="world-bottom-note"><MapPinIcon /> {tr(locale, "Select a glowing place to explore", "اختر مكاناً مضيئاً لاستكشافه")}</div>
        </section>

        <aside className="campus-rail">
          <section className="adventure-panel panel">
            <div className="panel-title-row">
              <div><p className="eyebrow">{tr(locale, "TODAY’S ADVENTURE", "مغامرة اليوم")}</p><h2>{tr(locale, "Three sparks to find", "ثلاث شرارات بانتظارك")}</h2></div>
              <ProgressRing value={(completed / 3) * 100}><strong>{completed}</strong><small>/ 3</small></ProgressRing>
            </div>
            <div className="quest-list">
              {questItems.map((item, index) => (
                <button key={item.label} type="button" className={item.complete ? "complete" : ""} onClick={() => openChallenge(item.subject)}>
                  <span className="quest-number">{item.complete ? <Check size={15} /> : formatNumber(index + 1, locale)}</span>
                  <span><strong>{item.label}</strong><small>{item.complete ? tr(locale, "Spark collected", "جُمعت الشرارة") : tr(locale, "+40 stars", "+٤٠ نجمة")}</small></span>
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
            <button className="primary-button full-button" onClick={() => go("classes")}>{tr(locale, "Continue adventure", "واصل المغامرة")} <ArrowRight size={17} /></button>
          </section>

          <section className="friend-panel panel">
            <div className="panel-title-row compact"><div><p className="eyebrow">{tr(locale, "FRIENDS ON CAMPUS", "أصدقاء الحرم")}</p><h2>{tr(locale, "Learning together", "نتعلّم معاً")}</h2></div><button className="text-button" onClick={() => go("friends")}>{tr(locale, "View all", "عرض الكل")}</button></div>
            <div className="friend-mini-list">
              {friendList.slice(0, 3).map((friend) => (
                <div key={friend.name}>
                  <span className={`friend-avatar ${friend.color}`}>{friend.avatar}</span>
                  <span><strong>{friend.name}</strong><small>{friend.activity}</small></span>
                  <span className={`online-dot ${friend.online ? "online" : ""}`} title={friend.online ? tr(locale, "Online", "متصل") : tr(locale, "Away", "غير متاح")} />
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
      <section className="quick-path">
        <div className="quick-path-copy">
          <span className="path-kicker"><Target size={15} /> {tr(locale, "MY GOAL", "هدفي")}</span>
          <h2><span aria-hidden="true">{selectedGoal.icon}</span> {selectedGoal.title}</h2>
          <p>{selectedGoal.description}</p>
          <div className="goal-progress">
            <span><i style={{ width: `${goalProgress}%` }} /></span>
            <small>{tr(locale, `${goalProgress}% toward this goal`, `${formatNumber(goalProgress, locale)}٪ نحو هذا الهدف`)}</small>
          </div>
        </div>
        <div className="path-subjects">
          {subjectList.map((subject) => (
            <button key={subject.id} className={subject.id === recommendedSubject.id ? "recommended" : ""} onClick={() => openChallenge(subject.id)}>
              <span className={`subject-glyph ${subject.color}`}>{subject.icon}</span>
              <span>
                <strong>{subject.title}</strong>
                <small>{tr(locale, `${player.progress[subject.id]}% mastery`, `إتقان ${formatNumber(player.progress[subject.id], locale)}٪`)}</small>
                {subject.id === recommendedSubject.id && <em>{tr(locale, "Best next step", "أفضل خطوة تالية")}</em>}
              </span>
              <span className="mini-progress"><span style={{ width: `${player.progress[subject.id]}%` }} /></span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function MapPinIcon() {
  return <span className="map-pin-icon" aria-hidden="true"><span /></span>;
}

function ClassesView({ player, openChallenge }: { player: PlayerState; openChallenge: (subject: Subject) => void }) {
  const locale = player.locale;
  const experience = experienceFor(player.level, locale);
  const subjectList = localizedSubjects(locale);
  const remaining = Math.max(0, 6 - player.weeklyLessons);
  return (
    <div className="page">
      <SectionHeading
        eyebrow={tr(locale, "LEARNING PATH", "مسار التعلّم")}
        title={tr(locale, "Classes that grow with you", "فصول تنمو معك")}
        copy={tr(locale, `Activities are adapted for ${localizedLevelLabel(player.level, locale)}. Master a skill, earn rewards, and unlock the next chapter.`, `أنشطة مناسبة لمستوى ${localizedLevelLabel(player.level, locale)}. أتقن مهارة واكسب المكافآت وافتح الفصل التالي.`)}
        action={<div className="goal-badge"><Target size={19} /><span><strong>{tr(locale, "Weekly goal", "الهدف الأسبوعي")}</strong><small>{tr(locale, `${Math.min(player.weeklyLessons, 6)} of 6 lessons`, `${formatNumber(Math.min(player.weeklyLessons, 6), locale)} من ٦ دروس`)}</small></span></div>}
      />
      <div className="subject-grid">
        {subjectList.map((subject, index) => (
          <article className={`subject-card subject-${subject.color}`} key={subject.id}>
            <div className="subject-card-top"><span className="subject-number">{tr(locale, `0${index + 1}`, formatNumber(index + 1, locale))}</span><span className="subject-glyph large">{subject.icon}</span></div>
            <p className="eyebrow">{subject.place.toUpperCase()}</p>
            <h2>{subject.title}</h2>
            <p>{subject.description}</p>
            <div className="mastery-row"><span><strong>{formatNumber(player.progress[subject.id], locale)}٪</strong><small>{tr(locale, "mastery", "إتقان")}</small></span><span className="mastery-bar"><span style={{ width: `${player.progress[subject.id]}%` }} /></span></div>
            <button className="card-action" onClick={() => openChallenge(subject.id)}><Play size={16} fill="currentColor" /> {tr(locale, "Start challenge", "ابدأ التحدي")}</button>
          </article>
        ))}
      </div>
      <section className="lesson-board panel">
        <div className="lesson-board-head"><div><p className="eyebrow">{tr(locale, "TODAY’S LEARNING TRAIL", "مسار تعلّم اليوم")}</p><h2>{remaining === 0 ? tr(locale, "Weekly goal complete!", "اكتمل الهدف الأسبوعي!") : tr(locale, "Small steps. Real progress.", "خطوات صغيرة، وتقدم حقيقي.")}</h2></div><span className="time-estimate"><Clock3 size={17} /> {tr(locale, `About ${experience.sessionMinutes} minutes`, `نحو ${formatNumber(experience.sessionMinutes, locale)} دقيقة`)}</span></div>
        <div className="lesson-timeline">
          {subjectList.map((subject, index) => (
            <button key={subject.id} onClick={() => openChallenge(subject.id)}>
              <span className={`timeline-node ${index === 0 ? "current" : ""}`}>{index === 0 ? <Play size={16} fill="currentColor" /> : formatNumber(index + 1, locale)}</span>
              <span>
                <small>{index === 0 ? tr(locale, "READY NOW", "جاهز الآن") : tr(locale, `STEP ${index + 1}`, `الخطوة ${formatNumber(index + 1, locale)}`)}</small>
                <strong>{subject.id === "math" ? tr(locale, "Reason with patterns", "فكّر باستخدام الأنماط") : subject.id === "reading" ? tr(locale, "Read between the lines", "اقرأ ما بين السطور") : tr(locale, "Test a fair experiment", "اختبر تجربة عادلة")}</strong>
                <em>{subject.title} · {formatNumber(Math.max(4, Math.round(experience.sessionMinutes / 3)), locale)} {tr(locale, "min", "د")}</em>
              </span>
              <ChevronRight size={18} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function FriendsView({ player, onHighFive, openChallenge }: { player: PlayerState; onHighFive: (name: string) => void; openChallenge: (subject: Subject) => void }) {
  const locale = player.locale;
  const friendList = localizedClassmates(locale);
  return (
    <div className="page">
      <SectionHeading eyebrow={tr(locale, "KINDNESS CLUB", "نادي اللطف")} title={tr(locale, "Better together", "معاً نصبح أفضل")} copy={tr(locale, "Meet safe fictional classmates, celebrate their progress, and invite them to a guided study activity.", "تعرّف إلى زملاء خياليين آمنين، واحتفل بتقدمهم، وادعُهم إلى نشاط دراسي موجّه.")} action={<div className="safety-badge"><ShieldCheck size={19} /><span><strong>{tr(locale, "Safe social", "تواصل آمن")}</strong><small>{tr(locale, "No open messaging", "لا توجد مراسلات مفتوحة")}</small></span></div>} />
      <div className="friends-grid">
        {friendList.map((friend, index) => (
          <article className="friend-card panel" key={friend.name}>
            <div className="friend-card-head">
              <span className={`friend-avatar large ${friend.color}`}>{friend.avatar}</span>
              <span className={`online-label ${friend.online ? "online" : ""}`}><i /> {friend.online ? tr(locale, "On campus", "في الحرم") : tr(locale, "Back later", "يعود لاحقاً")}</span>
            </div>
            <h2>{friend.name}</h2><p className="friend-strength">{friend.strength}</p><p className="friend-activity">{friend.activity}.</p>
            <div className="friend-actions">
              <button onClick={() => onHighFive(friend.name)}><Heart size={16} /> {tr(locale, "High-five", "شجّع")}</button>
              <button onClick={() => openChallenge((["reading", "math", "science"] as Subject[])[index % 3])}><BookOpen size={16} /> {tr(locale, "Study", "ادرس")}</button>
            </div>
          </article>
        ))}
      </div>
      <section className="kindness-banner">
        <div className="kindness-illustration" aria-hidden="true"><span>♡</span><span>✦</span><span>♡</span></div>
        <div><p className="eyebrow">{tr(locale, "THIS WEEK’S KINDNESS QUEST", "مهمة اللطف هذا الأسبوع")}</p><h2>{tr(locale, "Send three learning high-fives", "أرسل ثلاث رسائل تشجيع")}</h2><p>{tr(locale, "Kind words make the whole campus brighter.", "الكلمات الطيبة تجعل الحرم أكثر إشراقاً.")}</p></div>
        <div className="kindness-progress"><strong>{formatNumber(Math.min(player.highFives, 3), locale)} / ٣</strong><span><i style={{ width: `${Math.min(100, player.highFives / 3 * 100)}%` }} /></span><small>{tr(locale, "Reward: 60 stars", "المكافأة: ٦٠ نجمة")}</small></div>
      </section>
    </div>
  );
}

function PlaygroundView({ player, openGame }: { player: PlayerState; openGame: (gameId: string) => void }) {
  const locale = player.locale;
  const gameList = localizedGames(locale);
  return (
    <div className="page">
      <SectionHeading eyebrow={tr(locale, "PLAYGROUND ARCADE", "ألعاب ساحة المدرسة")} title={tr(locale, "Play with purpose", "العب بهدف")} copy={tr(locale, "Every minigame now has multiple rounds and adapts its challenge to your level. Play sparks never block a lesson.", "كل لعبة مصغرة تضم جولات متعددة وتتكيّف مع مستواك. شرارات اللعب لا تمنع أي درس.")} action={<div className="energy-badge"><Zap size={18} fill="currentColor" /><span><strong>{tr(locale, `${player.energy} play sparks`, `${formatNumber(player.energy, locale)} شرارات لعب`)}</strong><small>{tr(locale, "Refill daily · no learning gates", "تتجدد يومياً · لا تمنع التعلّم")}</small></span></div>} />
      <div className="games-grid">
        {gameList.map((game, index) => {
          const complete = player.completedGames.includes(game.id);
          return (
            <article className={`game-card game-${game.color}`} key={game.id}>
              <div className="game-art" aria-hidden="true"><span className="game-orb orb-one" /><span className="game-orb orb-two" /><strong>{game.icon}</strong><i>{tr(locale, String(index + 1).padStart(2, "0"), formatNumber(index + 1, locale))}</i></div>
              <div className="game-copy"><p className="eyebrow">{game.eyebrow}</p><h2>{game.title}</h2><p>{game.description}</p><div><span><Star size={14} fill="currentColor" /> +{formatNumber(game.reward, locale)}</span>{complete && <span className="complete-chip"><Check size={13} /> {tr(locale, "Played", "تم اللعب")}</span>}</div><button onClick={() => openGame(game.id)}><Play size={16} fill="currentColor" /> {complete ? tr(locale, "Play again", "العب مجدداً") : tr(locale, "Play now", "العب الآن")}</button></div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function SpacesView({ player, room, setRoom, onDecoration }: { player: PlayerState; room: "bedroom" | "classroom"; setRoom: (room: "bedroom" | "classroom") => void; onDecoration: (id: string) => void }) {
  const locale = player.locale;
  const decorationList = localizedDecorations(locale);
  const roomDecorations = decorationList.filter((item) => item.room === room);
  const placed = decorationList.filter((item) => item.room === room && player.placed.includes(item.id));
  return (
    <div className="page">
      <SectionHeading eyebrow={tr(locale, "MY SPACES", "مساحاتي")} title={tr(locale, "Make it feel like yours", "اجعلها تعبّر عنك")} copy={tr(locale, "Spend coins earned from learning. Decorations are expressive rewards—never shortcuts to mastery.", "أنفق القطع التي كسبتها بالتعلّم. الزينة مكافأة للتعبير عن نفسك وليست طريقاً مختصراً للإتقان.")} action={<div className="coin-balance"><Coins size={18} /><span><strong>{formatNumber(player.coins, locale)}</strong><small>{tr(locale, "school coins", "قطع مدرسية")}</small></span></div>} />
      <div className="room-tabs" role="tablist" aria-label={tr(locale, "Choose a space", "اختر مساحة")}>
        <button role="tab" aria-selected={room === "bedroom"} className={room === "bedroom" ? "active" : ""} onClick={() => setRoom("bedroom")}><MoonStar size={17} /> {tr(locale, "My Bedroom", "غرفة نومي")}</button>
        <button role="tab" aria-selected={room === "classroom"} className={room === "classroom" ? "active" : ""} onClick={() => setRoom("classroom")}><School size={17} /> {tr(locale, "My Classroom", "فصلي")}</button>
      </div>
      <div className="spaces-layout">
        <section className={`room-scene ${room}`} aria-label={tr(locale, `${room} preview`, room === "bedroom" ? "معاينة غرفة النوم" : "معاينة الفصل")}>
          <div className="room-window"><span /><span /><span /></div>
          <div className="room-wall-art">{room === "bedroom" ? tr(locale, "DREAM • LEARN • GROW", "احلم • تعلّم • تطوّر") : tr(locale, "CURIOSITY LIVES HERE", "هنا يعيش الفضول")}</div>
          <div className="room-furniture" aria-hidden="true">
            {room === "bedroom" ? <><span className="bed"><i /></span><span className="desk"><i /></span></> : <><span className="class-desk desk-one" /><span className="class-desk desk-two" /><span className="class-board">{tr(locale, "TODAY", "اليوم")}<br /><small>{tr(locale, "Be curious", "كن فضولياً")} ✦</small></span></>}
          </div>
          <div className="placed-items">
            {placed.length === 0 && <span className="empty-room-note"><Sparkles size={16} /> {tr(locale, "Choose an item from the collection", "اختر قطعة من المجموعة")}</span>}
            {placed.map((item, index) => <span key={item.id} className={`placed-item item-${index + 1}`} title={item.name}>{item.icon}</span>)}
          </div>
        </section>
        <aside className="decor-panel panel">
          <div className="decor-head"><div><p className="eyebrow">{tr(locale, "DECORATION COLLECTION", "مجموعة الزينة")}</p><h2>{tr(locale, "Choose something magical", "اختر شيئاً ساحراً")}</h2></div><Palette size={22} /></div>
          <div className="decor-grid">
            {roomDecorations.map((item) => {
              const owned = player.purchased.includes(item.id);
              const isPlaced = player.placed.includes(item.id);
              return (
                <button key={item.id} onClick={() => onDecoration(item.id)} className={isPlaced ? "placed" : ""}>
                  <span className="decor-icon">{item.icon}</span><strong>{item.name}</strong>
                  <small>{isPlaced ? <><Check size={13} /> {tr(locale, "Placed", "موضوعة")}</> : owned ? tr(locale, "Place item", "ضع القطعة") : <><Coins size={13} /> {formatNumber(item.price, locale)}</>}</small>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}

function BusView({ player, openBus }: { player: PlayerState; openBus: (routeId: string) => void }) {
  const locale = player.locale;
  const routeList = localizedBusRoutes(locale);
  return (
    <div className="page bus-page">
      <SectionHeading eyebrow={tr(locale, "BUS MISSIONS", "مهام الحافلة")} title={tr(locale, "Learning goes places", "التعلّم يأخذك إلى أماكن جديدة")} copy={tr(locale, "Board the Starliner for guided missions beyond campus. Each stop hides a curriculum challenge.", "اصعد إلى حافلة النجوم في مهام موجّهة خارج الحرم. في كل محطة تحدٍّ تعليمي.")} action={<div className="departure-badge"><Clock3 size={18} /><span><strong>{tr(locale, "Next departure", "الرحلة التالية")}</strong><small>{tr(locale, "Ready when you are", "جاهزة عندما تكون جاهزاً")}</small></span></div>} />
      <section className="bus-hero">
        <div className="bus-sky" aria-hidden="true"><span className="bus-moon" /><span className="bus-cloud cloud-one" /><span className="bus-cloud cloud-two" /><span className="bus-road" /><span className="magic-bus"><i className="bus-body"><b /><b /><b /></i><i className="wheel wheel-a" /><i className="wheel wheel-b" /></span></div>
        <div className="bus-hero-copy"><span className="live-chip"><span /> {tr(locale, "STARLINER 08", "حافلة النجوم ٠٨")}</span><h2>{tr(locale, "Where should we explore today?", "إلى أين نستكشف اليوم؟")}</h2><p>{tr(locale, "Pack your curiosity. Every route mixes reading, mathematics, science, and real-world thinking.", "خذ فضولك معك. يمزج كل مسار القراءة والرياضيات والعلوم والتفكير الواقعي.")}</p></div>
      </section>
      <div className="routes-grid">
        {routeList.map((route, index) => {
          const complete = player.completedBus.includes(route.id);
          return (
            <article className={`route-card route-${route.accent}`} key={route.id}>
              <div className="route-number">{tr(locale, `0${index + 1}`, formatNumber(index + 1, locale))}</div><div className="route-icon"><BusFront size={24} /></div>
              <p className="eyebrow">{route.location.toUpperCase()}</p><h2>{route.title}</h2><p>{route.description}</p>
              <div className="route-meta"><span><MapPinIcon /> {tr(locale, `${route.stops} stops`, `${formatNumber(route.stops, locale)} محطات`)}</span><span><Star size={14} fill="currentColor" /> +{formatNumber(route.reward, locale)}</span></div>
              <button onClick={() => openBus(route.id)}>{complete ? <><RotateCcw size={16} /> {tr(locale, "Ride again", "اركب مجدداً")}</> : <><BusFront size={16} /> {tr(locale, "Start mission", "ابدأ المهمة")}</>}</button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function RewardsView({ player, go }: { player: PlayerState; go: (route: RouteName) => void }) {
  const locale = player.locale;
  const badgeList = localizedBadges(locale);
  const unlocked = {
    "first-step": player.completedChallenges > 0,
    "math-mind": player.correctAnswers.math >= 5,
    "book-bloom": player.subjectWins.reading > 0,
    "lab-light": player.subjectWins.science > 0,
    "kind-friend": player.highFives >= 3,
    "road-scholar": player.completedBus.length > 0,
  } as Record<string, boolean>;
  const level = Math.floor(player.xp / 500) + 1;
  const levelProgress = (player.xp % 500) / 5;
  return (
    <div className="page">
      <SectionHeading eyebrow={tr(locale, "REWARD HALL", "قاعة المكافآت")} title={tr(locale, "Your growth, celebrated", "نحتفل بتطورك")} copy={tr(locale, "Stars show effort, XP marks your journey, and badges remember the skills and kindness you demonstrated.", "تعكس النجوم جهدك، وتسجل نقاط الخبرة رحلتك، وتحفظ الشارات مهاراتك ولطفك.")} />
      <section className="reward-hero">
        <div className="reward-crown"><Crown size={42} fill="currentColor" /></div>
        <div><p className="eyebrow">{tr(locale, `EXPLORER LEVEL ${level}`, `مستوى المستكشف ${formatNumber(level, locale)}`)}</p><h2>{level < 3 ? tr(locale, "Curious Pathfinder", "رائد فضولي") : tr(locale, "Campus Luminary", "نجم الحرم")}</h2><p>{tr(locale, `${Math.ceil(500 - (player.xp % 500))} XP until your next title`, `تبقى ${formatNumber(Math.ceil(500 - (player.xp % 500)), locale)} نقطة خبرة للقب التالي`)}</p><span className="xp-track"><i style={{ width: `${levelProgress}%` }} /></span></div>
        <div className="reward-stats"><span><Star size={20} fill="currentColor" /><strong>{formatNumber(player.stars, locale)}</strong><small>{tr(locale, "stars", "نجوم")}</small></span><span><Coins size={20} /><strong>{formatNumber(player.coins, locale)}</strong><small>{tr(locale, "coins", "قطع")}</small></span><span><Flame size={20} fill="currentColor" /><strong>{formatNumber(player.streak, locale)}</strong><small>{tr(locale, "day streak", "سلسلة أيام")}</small></span></div>
      </section>
      <section className="badge-section">
        <div className="section-subhead"><div><p className="eyebrow">{tr(locale, "BADGE CABINET", "خزانة الشارات")}</p><h2>{tr(locale, "Moments worth remembering", "لحظات تستحق التذكر")}</h2></div><span>{tr(locale, `${Object.values(unlocked).filter(Boolean).length} of ${badgeList.length} unlocked`, `فُتحت ${formatNumber(Object.values(unlocked).filter(Boolean).length, locale)} من ${formatNumber(badgeList.length, locale)}`)}</span></div>
        <div className="badge-grid">
          {badgeList.map((badge) => (
            <article className={unlocked[badge.id] ? "unlocked" : "locked"} key={badge.id}>
              <span className="badge-medallion">{unlocked[badge.id] ? badge.icon : <LockKeyhole size={22} />}</span><h3>{badge.name}</h3><p>{badge.description}</p><small>{unlocked[badge.id] ? <><Check size={13} /> {tr(locale, "Unlocked", "مفتوحة")}</> : tr(locale, "Still exploring", "واصل الاستكشاف")}</small>
            </article>
          ))}
        </div>
      </section>
      <section className="reward-cta"><div><Gift size={32} /><span><p className="eyebrow">{tr(locale, "SPEND YOUR COINS", "استخدم قطعك")}</p><h2>{tr(locale, "Turn progress into personality", "اجعل تقدمك يعبّر عنك")}</h2><p>{tr(locale, "Decorate your bedroom and classroom with rewards you earn.", "زيّن غرفة نومك وفصلك بالمكافآت التي تكسبها.")}</p></span></div><button className="primary-button" onClick={() => go("spaces")}>{tr(locale, "Visit My Spaces", "زُر مساحاتي")} <ArrowRight size={17} /></button></section>
    </div>
  );
}

function ProfileView({ player, update, reset }: { player: PlayerState; update: (patch: Partial<PlayerState>) => void; reset: () => void }) {
  const locale = player.locale;
  const stats = [
    { label: tr(locale, "Challenges", "التحديات"), value: player.completedChallenges, icon: Target },
    { label: tr(locale, "Minigames", "الألعاب"), value: player.completedGames.length, icon: Gamepad2 },
    { label: tr(locale, "Bus missions", "مهام الحافلة"), value: player.completedBus.length, icon: BusFront },
    { label: tr(locale, "High-fives", "التشجيعات"), value: player.highFives, icon: Heart },
  ];
  return (
    <div className="page">
      <SectionHeading eyebrow={tr(locale, "EXPLORER PROFILE", "ملف المستكشف")} title={tr(locale, "Your School Life", "حياتك المدرسية")} copy={tr(locale, "See your journey, shape your goal, change your level, and choose the settings that help you learn best.", "شاهد رحلتك وحدد هدفك وغيّر مرحلتك واختر الإعدادات التي تساعدك على التعلّم بصورة أفضل.")} />
      <div className="profile-layout">
        <section className="profile-identity panel">
          <div className="profile-glow" /><Avatar index={player.avatar} label={player.name} locale={locale} /><h2>{player.name}</h2><p>{localizedLevelLabel(player.level, locale)}</p><span className="profile-title"><Award size={15} /> {tr(locale, "Curious Pathfinder", "رائد فضولي")}</span>
          <label htmlFor="profile-level">{tr(locale, "Learning level", "المرحلة التعليمية")}</label><select id="profile-level" value={player.level} onChange={(event) => { const nextLevel = event.target.value; update({ level: nextLevel, progress: player.progressByLevel[nextLevel] ?? { math: 0, reading: 0, science: 0 }, progressByLevel: { ...player.progressByLevel, [player.level]: player.progress } }); }}>{levels.map(([value]) => <option key={value} value={value}>{localizedLevelLabel(value, locale)}</option>)}</select>
        </section>
        <div className="profile-main">
          <section className="stat-grid">{stats.map(({ label, value, icon: Icon }) => <article key={label}><Icon size={20} /><strong>{formatNumber(value, locale)}</strong><span>{label}</span></article>)}</section>
          <section className="goal-settings-panel panel">
            <div className="settings-head"><div><p className="eyebrow">{tr(locale, "MY NORTH STAR", "بوصلة رحلتي")}</p><h2>{tr(locale, "Choose where learning takes you", "اختر إلى أين يقودك التعلّم")}</h2><p>{tr(locale, "Your choice guides the subject School Life recommends next.", "اختيارك يوجّه المادة التي تقترحها الحياة المدرسية في خطوتك التالية.")}</p></div><Target size={25} /></div>
            <GoalPicker compact locale={locale} goalId={player.goalId} goalText={player.goalText} onChange={(goalId, goalText) => update({ goalId, goalText })} />
          </section>
          <section className="settings-panel panel"><div className="settings-head"><div><p className="eyebrow">{tr(locale, "LEARNING COMFORT", "راحة التعلّم")}</p><h2>{tr(locale, "Make School Life work for you", "اجعل الحياة المدرسية مناسبة لك")}</h2></div><Accessibility size={25} /></div>
            <div className="language-setting">
              <span><strong>{tr(locale, "Language", "اللغة")}</strong><small>{tr(locale, "Switch the full learning experience", "غيّر لغة تجربة التعلّم كاملة")}</small></span>
              <LanguageToggle locale={locale} compact onChange={(nextLocale) => update({ locale: nextLocale })} />
            </div>
            <div className="setting-list">
              <SettingToggle icon={player.sound ? Volume2 : VolumeX} title={tr(locale, "Sound effects", "المؤثرات الصوتية")} copy={tr(locale, "Gentle feedback and celebration sounds", "أصوات لطيفة للتغذية الراجعة والاحتفال")} checked={player.sound} onChange={() => update({ sound: !player.sound })} />
              <SettingToggle icon={MoonStar} title={tr(locale, "Reduce motion", "تقليل الحركة")} copy={tr(locale, "Use quieter transitions and effects", "استخدم انتقالات ومؤثرات أكثر هدوءاً")} checked={player.reducedMotion} onChange={() => update({ reducedMotion: !player.reducedMotion })} />
              <SettingToggle icon={Accessibility} title={tr(locale, "High contrast", "تباين عالٍ")} copy={tr(locale, "Strengthen borders and color contrast", "قوِّ الحدود وتباين الألوان")} checked={player.highContrast} onChange={() => update({ highContrast: !player.highContrast })} />
              <SettingToggle icon={BookOpen} title={tr(locale, "Larger text", "نص أكبر")} copy={tr(locale, "Increase reading size throughout the app", "كبّر حجم القراءة في التطبيق كله")} checked={player.largerText} onChange={() => update({ largerText: !player.largerText })} />
            </div>
          </section>
          <button className="reset-button" onClick={reset}><RotateCcw size={16} /> {tr(locale, "Start over with a new explorer", "ابدأ من جديد بمستكشف آخر")}</button>
        </div>
      </div>
    </div>
  );
}

function SettingToggle({ icon: Icon, title, copy, checked, onChange }: { icon: typeof Volume2; title: string; copy: string; checked: boolean; onChange: () => void }) {
  return <button type="button" className="setting-row" onClick={onChange} aria-pressed={checked}><span className="setting-icon"><Icon size={19} /></span><span><strong>{title}</strong><small>{copy}</small></span><i className={`switch ${checked ? "on" : ""}`}><b /></i></button>;
}

function ChallengeDialog({
  subject,
  level,
  mastery,
  sound,
  locale,
  onClose,
  onComplete,
}: {
  subject: Subject;
  level: string;
  mastery: number;
  sound: boolean;
  locale: Locale;
  onClose: () => void;
  onComplete: (subject: Subject, score: number, total: number) => void;
}) {
  const [bank] = useState(() => adaptiveQuestionSet(level, subject, mastery, 5, locale));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);
  const question = bank[index];
  const label = localizedSubjects(locale).find((item) => item.id === subject)!;

  const choose = (answerIndex: number) => {
    if (selected !== null) return;
    setSelected(answerIndex);
    const correct = answerIndex === question.correct;
    if (correct) setScore((value) => value + 1);
    playFeedback(sound, correct ? "success" : "retry");
  };
  const next = () => {
    if (index === bank.length - 1) { setFinished(true); return; }
    setIndex((value) => value + 1); setSelected(null); setShowHint(false);
  };
  if (finished) return <CompletionCard locale={locale} title={tr(locale, `${label.title} spark collected!`, `جمعت شرارة ${label.title}!`)} copy={tr(locale, `You answered ${score} of ${bank.length} correctly. Your next lesson will adapt to this result.`, `أجبت إجابة صحيحة عن ${formatNumber(score, locale)} من ${formatNumber(bank.length, locale)}. سيتكيّف درسك التالي مع هذه النتيجة.`)} reward={50 + score * 10} icon={label.icon} onClose={onClose} onCollect={() => onComplete(subject, score, bank.length)} />;

  return (
    <DialogFrame onClose={onClose} label={tr(locale, `${label.title} challenge`, `تحدي ${label.title}`)} closeLabel={tr(locale, "Close dialog", "إغلاق النافذة")}>
      <div className={`challenge-head challenge-${label.color}`}><span className="challenge-icon">{label.icon}</span><div><p className="eyebrow">{label.place.toUpperCase()}</p><h2>{tr(locale, `${label.title} challenge`, `تحدي ${label.title}`)}</h2><p>{localizedLevelLabel(level, locale)} · {tr(locale, `Question ${index + 1} of ${bank.length}`, `السؤال ${formatNumber(index + 1, locale)} من ${formatNumber(bank.length, locale)}`)}</p></div><span className="challenge-stars"><Star size={15} fill="currentColor" /> +{formatNumber(50 + score * 10, locale)}</span></div>
      <div className="challenge-progress"><span style={{ width: `${((index + 1) / bank.length) * 100}%` }} /></div>
      <div className="question-area"><p className="question-number">{tr(locale, `QUESTION ${String(index + 1).padStart(2, "0")}`, `السؤال ${formatNumber(index + 1, locale)}`)} · {question.objective}</p><h3>{question.prompt}</h3><div className="answer-grid">{question.answers.map((answer, answerIndex) => {
        let className = "";
        if (selected !== null && answerIndex === question.correct) className = "correct";
        else if (selected === answerIndex) className = "incorrect";
        return <button key={answer} className={className} onClick={() => choose(answerIndex)} disabled={selected !== null}><span>{answerLabel(answerIndex, locale)}</span>{answer}{className === "correct" && <Check size={18} />}{className === "incorrect" && <X size={18} />}</button>;
      })}</div>
      {selected === null ? <div className="question-tools"><button className="hint-button" onClick={() => setShowHint(!showHint)}><Lightbulb size={16} /> {showHint ? question.hint : tr(locale, "Show a hint", "أظهر تلميحاً")}</button><button className="hint-button" onClick={() => readAloud(`${question.prompt}. ${question.answers.join(". ")}`, locale)}><Volume2 size={16} /> {tr(locale, "Read aloud", "اقرأ بصوت عالٍ")}</button></div> : <div className={`feedback-box ${selected === question.correct ? "success" : "retry"}`} role="status"><span>{selected === question.correct ? <Check size={19} /> : <Lightbulb size={19} />}</span><div><strong>{selected === question.correct ? tr(locale, "Strong thinking!", "تفكير ممتاز!") : tr(locale, "Good try—this is how we learn.", "محاولة جيدة—هكذا نتعلّم.")}</strong><p>{selected === question.correct ? question.explanation ?? question.hint : question.hint}</p></div><button onClick={next}>{index === bank.length - 1 ? tr(locale, "See results", "شاهد النتائج") : tr(locale, "Next", "التالي")} <ArrowRight size={16} /></button></div>}
      </div>
    </DialogFrame>
  );
}

function BusDialog({ routeId, level, locale, sound, onClose, onComplete }: { routeId: string; level: string; locale: Locale; sound: boolean; onClose: () => void; onComplete: (routeId: string, reward: number) => void }) {
  const route = localizedBusRoutes(locale).find((item) => item.id === routeId)!;
  const [missionSteps] = useState(() => missionFor(routeId, level, locale));
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const question = missionSteps[step];
  const success = selected === question.correct;
  const choose = (answer: number) => {
    if (selected !== null) return;
    setSelected(answer);
    playFeedback(sound, answer === question.correct ? "success" : "retry");
  };
  const next = () => { if (step === missionSteps.length - 1) { onComplete(route.id, route.reward); return; } setStep((value) => value + 1); setSelected(null); };
  return <DialogFrame onClose={onClose} closeLabel={tr(locale, "Close dialog", "إغلاق النافذة")} label={tr(locale, `${route.title} bus mission`, `مهمة حافلة ${route.title}`)}><div className="mission-head"><div className="mini-bus"><BusFront size={26} /></div><div><p className="eyebrow">{tr(locale, `STARLINER MISSION · STOP ${step + 1}`, `مهمة حافلة النجوم · المحطة ${formatNumber(step + 1, locale)}`)}</p><h2>{route.title}</h2><p>{route.location} · {localizedLevelLabel(level, locale)}</p></div><span><Star size={15} fill="currentColor" /> +{formatNumber(route.reward, locale)}</span></div><div className="mission-route">{missionSteps.map((_, index) => <span className={index < step ? "done" : index === step ? "current" : ""} key={index}>{index < step ? <Check size={14} /> : formatNumber(index + 1, locale)}</span>)}</div><div className="question-area"><h3>{question.prompt}</h3><div className="answer-grid">{question.answers.map((answer, index) => <button key={answer} className={selected !== null ? index === question.correct ? "correct" : index === selected ? "incorrect" : "" : ""} onClick={() => choose(index)} disabled={selected !== null}><span>{answerLabel(index, locale)}</span>{answer}</button>)}</div>{selected !== null && <div className={`feedback-box ${success ? "success" : "retry"}`} role="status"><span>{success ? <Check size={19} /> : <Lightbulb size={19} />}</span><div><strong>{success ? tr(locale, "Route cleared!", "اجتزت المحطة!") : tr(locale, "Check the clue and try again.", "راجع التلميح وحاول مجدداً.")}</strong><p>{success ? question.explanation ?? tr(locale, "The Starliner can continue.", "يمكن للحافلة مواصلة الرحلة.") : question.hint}</p></div><button onClick={success ? next : () => setSelected(null)}>{success ? step === missionSteps.length - 1 ? tr(locale, "Finish mission", "أنه المهمة") : tr(locale, "Next stop", "المحطة التالية") : tr(locale, "Try again", "حاول مجدداً")} <ArrowRight size={15} /></button></div>}</div></DialogFrame>;
}

function CompletionCard({ title, copy, reward, icon, locale, onClose, onCollect }: { title: string; copy: string; reward: number; icon: string; locale: Locale; onClose: () => void; onCollect: () => void }) {
  return <DialogFrame onClose={onClose} closeLabel={tr(locale, "Close dialog", "إغلاق النافذة")} label={tr(locale, "Challenge complete", "اكتمل التحدي")}><div className="completion-card"><div className="completion-rays" aria-hidden="true" /><span className="completion-medal">{icon}</span><p className="eyebrow">{tr(locale, "CHALLENGE COMPLETE", "اكتمل التحدي")}</p><h2>{title}</h2><p>{copy}</p><div className="reward-ticket"><Star size={21} fill="currentColor" /><strong>{tr(locale, `+${reward} stars`, `+${formatNumber(reward, locale)} نجمة`)}</strong><span>{tr(locale, "and 60 XP", "و٦٠ نقطة خبرة")}</span></div><button className="primary-button" onClick={onCollect}>{tr(locale, "Collect reward", "اجمع المكافأة")} <Gift size={17} /></button></div></DialogFrame>;
}

export default function SchoolLife() {
  const [player, setPlayer] = useState<PlayerState>(initialPlayer);
  const [hasProfile, setHasProfile] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [route, setRoute] = useState<RouteName>("campus");
  const [dialog, setDialog] = useState<DialogState>(null);
  const [room, setRoom] = useState<"bedroom" | "classroom">("bedroom");
  const [toast, setToast] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [online, setOnline] = useState(() => typeof navigator === "undefined" ? true : navigator.onLine);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) { setPlayer(restorePlayer(saved)); setHasProfile(true); }
      } catch { /* Local storage can be unavailable in private contexts. */ }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated || !hasProfile) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(player)); } catch { /* Continue without persistence when storage is blocked. */ }
  }, [player, hydrated, hasProfile]);

  useEffect(() => {
    const updateConnection = () => setOnline(navigator.onLine);
    window.addEventListener("online", updateConnection);
    window.addEventListener("offline", updateConnection);
    return () => {
      window.removeEventListener("online", updateConnection);
      window.removeEventListener("offline", updateConnection);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.contrast = player.highContrast ? "high" : "standard";
    document.documentElement.dataset.motion = player.reducedMotion ? "reduced" : "full";
    document.documentElement.dataset.text = player.largerText ? "large" : "standard";
    document.documentElement.dataset.age = ageBandFor(player.level);
    document.documentElement.dataset.learningText = experienceFor(player.level, player.locale).textScale;
    document.documentElement.lang = player.locale;
    document.documentElement.dir = player.locale === "ar" ? "rtl" : "ltr";
  }, [player.highContrast, player.reducedMotion, player.largerText, player.level, player.locale]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (message: string) => setToast(message);

  const updatePlayer = (patch: Partial<PlayerState>) => setPlayer((current) => ({ ...current, ...patch }));
  const go = (nextRoute: RouteName) => { setRoute(nextRoute); setMobileMenu(false); window.scrollTo({ top: 0, behavior: player.reducedMotion ? "auto" : "smooth" }); };

  const start = (name: string, level: string, avatar: number, locale: Locale, goalId: GoalId, goalText: string) => {
    const next = refreshDailyProgress({ ...initialPlayer, name, level, avatar, locale, goalId, goalText });
    const goal = goalFor(goalId, locale, goalText);
    setPlayer(next); setHasProfile(true); showToast(tr(locale, `Your journey toward “${goal.title}” starts now!`, `تبدأ الآن رحلتك نحو «${goal.title}»!`));
  };

  const completeChallenge = (subject: Subject, score: number, total: number) => {
    const reward = 50 + score * 10;
    playFeedback(player.sound, "reward");
    setPlayer((current) => {
      const learningState = recordLearningDay(current);
      const progress = { ...current.progress, [subject]: calculateMastery(current.progress[subject], score, total) };
      return { ...learningState, stars: current.stars + reward, coins: current.coins + 20, xp: current.xp + 60, completedChallenges: current.completedChallenges + 1, weeklyLessons: current.weeklyLessons + 1, progress, progressByLevel: { ...current.progressByLevel, [current.level]: progress }, subjectWins: { ...current.subjectWins, [subject]: current.subjectWins[subject] + 1 }, attempts: { ...current.attempts, [subject]: current.attempts[subject] + total }, correctAnswers: { ...current.correctAnswers, [subject]: current.correctAnswers[subject] + score } };
    });
    const subjectTitle = localizedSubjects(player.locale).find((item) => item.id === subject)?.title;
    setDialog(null); showToast(tr(player.locale, `+${reward} stars · ${subjectTitle} mastery grew!`, `+${formatNumber(reward, player.locale)} نجمة · ازداد إتقان ${subjectTitle}!`));
  };

  const completeGame = (gameId: string, reward: number) => {
    setPlayer((current) => ({ ...current, stars: current.stars + reward, coins: current.coins + 10, xp: current.xp + 35, energy: Math.max(0, current.energy - 1), completedGames: current.completedGames.includes(gameId) ? current.completedGames : [...current.completedGames, gameId] }));
    setDialog(null); showToast(tr(player.locale, `Play reward collected · +${reward} stars`, `جُمعت مكافأة اللعب · +${formatNumber(reward, player.locale)} نجمة`));
  };

  const completeBus = (routeId: string, reward: number) => {
    setPlayer((current) => ({ ...current, stars: current.stars + reward, coins: current.coins + 35, xp: current.xp + 80, completedBus: current.completedBus.includes(routeId) ? current.completedBus : [...current.completedBus, routeId] }));
    setDialog(null); showToast(tr(player.locale, `Mission complete · +${reward} stars and +35 coins`, `اكتملت المهمة · +${formatNumber(reward, player.locale)} نجمة و+٣٥ قطعة`));
  };

  const highFive = (name: string) => {
    setPlayer((current) => ({ ...current, highFives: current.highFives + 1, stars: current.stars + 5 }));
    showToast(tr(player.locale, `High-five sent to ${name} · kindness +5`, `أرسلت تشجيعاً إلى ${name} · لطف +٥`));
  };

  const decoration = (id: string) => {
    const item = localizedDecorations(player.locale).find((entry) => entry.id === id)!;
    const owned = player.purchased.includes(id);
    const placed = player.placed.includes(id);
    if (placed) { updatePlayer({ placed: player.placed.filter((entry) => entry !== id) }); showToast(tr(player.locale, `${item.name} returned to your collection`, `أُعيد ${item.name} إلى مجموعتك`)); return; }
    if (owned) { updatePlayer({ placed: [...player.placed, id] }); showToast(tr(player.locale, `${item.name} placed!`, `وُضع ${item.name}!`)); return; }
    if (player.coins < item.price) { showToast(tr(player.locale, `You need ${item.price - player.coins} more coins`, `تحتاج إلى ${formatNumber(item.price - player.coins, player.locale)} قطعة إضافية`)); return; }
    updatePlayer({ coins: player.coins - item.price, purchased: [...player.purchased, id], placed: [...player.placed, id] }); showToast(tr(player.locale, `${item.name} unlocked and placed!`, `فُتح ${item.name} ووُضع!`));
  };

  const reset = () => {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* The in-memory reset still works. */ }
    setPlayer({ ...initialPlayer, locale: player.locale }); setHasProfile(false); setRoute("campus"); showToast(tr(player.locale, "Ready for a new explorer", "جاهزون لمستكشف جديد"));
  };

  const navItems = localizedNavigation(player.locale);
  const currentExperience = experienceFor(player.level, player.locale);

  const page = (() => {
    if (route === "campus") return <CampusView player={player} go={go} openChallenge={(subject) => setDialog({ type: "challenge", subject })} />;
    if (route === "classes") return <ClassesView player={player} openChallenge={(subject) => setDialog({ type: "challenge", subject })} />;
    if (route === "friends") return <FriendsView player={player} onHighFive={highFive} openChallenge={(subject) => setDialog({ type: "challenge", subject })} />;
    if (route === "playground") return <PlaygroundView player={player} openGame={(gameId) => setDialog({ type: "game", gameId })} />;
    if (route === "spaces") return <SpacesView player={player} room={room} setRoom={setRoom} onDecoration={decoration} />;
    if (route === "bus") return <BusView player={player} openBus={(routeId) => setDialog({ type: "bus", routeId })} />;
    if (route === "rewards") return <RewardsView player={player} go={go} />;
    return <ProfileView player={player} update={updatePlayer} reset={reset} />;
  })();

  if (!hydrated) return <div className="boot-screen"><Brand locale={player.locale} /><span className="boot-spinner" /><p>{tr(player.locale, "Preparing your learning world…", "نُجهّز عالم التعلّم الخاص بك…")}</p></div>;
  if (!hasProfile) return <><Onboarding onStart={start} />{toast && <div className="toast" role="status"><Sparkles size={17} />{toast}</div>}</>;

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">{tr(player.locale, "Skip to content", "انتقل إلى المحتوى")}</a>
      <aside className={`sidebar ${mobileMenu ? "mobile-open" : ""}`}>
        <button className="sidebar-close" onClick={() => setMobileMenu(false)} aria-label={tr(player.locale, "Close navigation", "إغلاق التنقل")}><X size={20} /></button>
        <button className="brand-button" onClick={() => go("campus")}><Brand locale={player.locale} /></button>
        <nav aria-label={tr(player.locale, "Main navigation", "التنقل الرئيسي")}>
          {navItems.map(({ id, label, icon: Icon }) => <button key={id} className={route === id ? "active" : ""} onClick={() => go(id)}><Icon size={19} strokeWidth={2.1} /><span>{label}</span>{route === id && <i />}</button>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="weekly-card"><ProgressRing value={Math.min(100, player.weeklyLessons / 6 * 100)}><strong>{formatNumber(Math.min(player.weeklyLessons, 6), player.locale)}</strong><small>/ {formatNumber(6, player.locale)}</small></ProgressRing><span><strong>{tr(player.locale, "Weekly goal", "الهدف الأسبوعي")}</strong><small>{player.weeklyLessons >= 6 ? tr(player.locale, "Goal complete", "اكتمل الهدف") : tr(player.locale, `${6 - player.weeklyLessons} lessons to go`, `تبقى ${formatNumber(6 - player.weeklyLessons, player.locale)} دروس`)}</small></span></div>
          <button className={`profile-chip ${route === "profile" ? "active" : ""}`} onClick={() => go("profile")}><Avatar index={player.avatar} label={player.name} locale={player.locale} small /><span><strong>{player.name}</strong><small>{localizedLevelLabel(player.level, player.locale)}</small></span><Settings size={16} /></button>
        </div>
      </aside>
      {mobileMenu && <button className="menu-backdrop" onClick={() => setMobileMenu(false)} aria-label={tr(player.locale, "Close menu", "إغلاق القائمة")} />}
      <div className="app-main">
        <header className="topbar">
          <button className="mobile-menu-button" onClick={() => setMobileMenu(true)} aria-label={tr(player.locale, "Open navigation", "فتح التنقل")}><Menu size={21} /></button>
          <button className="mobile-brand-button" onClick={() => go("campus")} aria-label={tr(player.locale, "School Life home", "الرئيسية")}><Brand compact locale={player.locale} /></button>
          <div className={`school-status ${online ? "" : "offline"}`}><span /><p><strong>{currentExperience.world}</strong><small>{online ? tr(player.locale, "School day · All paths open", "اليوم الدراسي · كل المسارات مفتوحة") : tr(player.locale, "Offline mode · Progress stays here", "وضع عدم الاتصال · تقدمك محفوظ هنا")}</small></p></div>
          <div className="resources" aria-label={tr(player.locale, "Your resources", "مواردك")}>
            <button onClick={() => go("rewards")} title={tr(player.locale, "Stars", "النجوم")}><Star size={18} fill="currentColor" /><strong>{formatNumber(player.stars, player.locale)}</strong><small>{tr(player.locale, "stars", "نجوم")}</small></button>
            <button onClick={() => go("spaces")} title={tr(player.locale, "School coins", "القطع المدرسية")}><Coins size={18} /><strong>{formatNumber(player.coins, player.locale)}</strong><small>{tr(player.locale, "coins", "قطع")}</small></button>
            <button onClick={() => go("rewards")} title={tr(player.locale, "Learning streak", "سلسلة التعلّم")}><Flame size={18} fill="currentColor" /><strong>{formatNumber(player.streak, player.locale)}</strong><small>{tr(player.locale, "day streak", "أيام")}</small></button>
            <button className="heart-resource" title={tr(player.locale, "Play sparks never block learning", "شرارات اللعب لا تمنع التعلّم")}><Heart size={18} fill="currentColor" /><strong>{formatNumber(player.energy, player.locale)}</strong><small>{tr(player.locale, "play sparks", "شرارات")}</small></button>
          </div>
          <LanguageToggle locale={player.locale} compact onChange={(locale) => updatePlayer({ locale })} />
          <button className="top-icon-button" onClick={() => showToast(tr(player.locale, "You’re all caught up!", "اطلعت على كل جديد!"))} aria-label={tr(player.locale, "Notifications", "الإشعارات")}><Bell size={19} /><span /></button>
        </header>
        <main id="main-content">{page}</main>
        <nav className="mobile-nav" aria-label={tr(player.locale, "Mobile navigation", "تنقل الهاتف")}>
          {[navItems[0], navItems[1], navItems[3], navItems[4]].map(({ id, label, icon: Icon }) => <button key={id} className={route === id ? "active" : ""} onClick={() => go(id)}><Icon size={20} /><small>{id === "playground" ? tr(player.locale, "Play", "العب") : id === "spaces" ? tr(player.locale, "Spaces", "مساحاتي") : label}</small></button>)}
          <button className={route === "profile" ? "active" : ""} onClick={() => go("profile")}><Avatar index={player.avatar} label={player.name} locale={player.locale} small /><small>{tr(player.locale, "Me", "أنا")}</small></button>
        </nav>
      </div>
      {dialog?.type === "challenge" && <ChallengeDialog subject={dialog.subject} level={player.level} locale={player.locale} mastery={player.progress[dialog.subject]} sound={player.sound} onClose={() => setDialog(null)} onComplete={completeChallenge} />}
      {dialog?.type === "game" && <GameDialog gameId={dialog.gameId} level={player.level} locale={player.locale} sound={player.sound} onClose={() => setDialog(null)} onComplete={completeGame} />}
      {dialog?.type === "bus" && <BusDialog routeId={dialog.routeId} level={player.level} locale={player.locale} sound={player.sound} onClose={() => setDialog(null)} onComplete={completeBus} />}
      {toast && <div className="toast" role="status"><Sparkles size={17} />{toast}</div>}
    </div>
  );
}
