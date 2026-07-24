import {
  ArrowRight,
  Check,
  CircleHelp,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Star,
  Timer,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DialogFrame from "./DialogFrame";
import { answerLabel, formatNumber, localizedGames, tr, type Locale } from "./i18n";
import { playFeedback } from "./learning-engine";
import { ageBandFor, type AgeBand, type Question } from "./school-data";

type GameProps = {
  gameId: string;
  level: string;
  locale: Locale;
  sound: boolean;
  onClose: () => void;
  onComplete: (gameId: string, reward: number) => void;
};

type Round = Question & { scene?: string };

function GameHeader({ gameId, subtitle, locale }: { gameId: string; subtitle: string; locale: Locale }) {
  const game = localizedGames(locale).find((item) => item.id === gameId)!;
  return (
    <div className={`game-dialog-head game-${game.color}`}>
      <span aria-hidden="true">{game.icon}</span>
      <div>
        <p className="eyebrow">{game.eyebrow}</p>
        <h2>{game.title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function numberRounds(band: AgeBand, locale: Locale): Round[] {
  if (locale === "ar") {
    if (band === "early") {
      return [
        { prompt: "عُد الأقمار: ☾ ☾ ☾", answers: ["٢", "٣", "٤"], correct: 1, hint: "المس كل قمر وأنت تعد." },
        { prompt: "ما العدد الذي يأتي بعد ٦؟", answers: ["٥", "٧", "٩"], correct: 1, hint: "تحرك خطوة واحدة إلى الأمام." },
        { prompt: "أي مجموعة فيها خمس نجوم؟", answers: ["★★★", "★★★★★", "★★★★"], correct: 1, hint: "عُد كل نجمة." },
        { prompt: "ما ناتج ٢ + ٢؟", answers: ["٣", "٤", "٥"], correct: 1, hint: "ارفع إصبعين في كل يد." },
      ];
    }
    if (band === "primary") {
      return [
        { prompt: "ما ناتج ٧ × ٨؟", answers: ["٥٤", "٥٦", "٦٤", "٧٢"], correct: 1, hint: "فكّر في سبع مجموعات من ثمانية." },
        { prompt: "ما ناتج ٣٦٠ ÷ ٩؟", answers: ["٣٠", "٤٠", "٤٥", "٥٠"], correct: 1, hint: "تسعة مضروبة في كم تساوي ٣٦٠؟" },
        { prompt: "أي عدد هو الأكبر؟", answers: ["٠٫٤٥", "٠٫٥", "٠٫٠٩", "٠٫٤٠٥"], correct: 1, hint: "اكتب كل عدد حتى منزلة الجزء من مئة." },
        { prompt: "ما قيمة ٣⁄٤ من ٢٠؟", answers: ["٥", "١٠", "١٥", "١٨"], correct: 2, hint: "أوجد الربع أولاً ثم اضرب في ثلاثة." },
        { prompt: "طول ضلع مربع ٩ سم. ما محيطه؟", answers: ["١٨", "٢٧", "٣٦", "٨١"], correct: 2, hint: "للمربع أربعة أضلاع متساوية." },
      ];
    }
    if (band === "middle") {
      return [
        { prompt: "حل المعادلة ٥س = ٤٥.", answers: ["٧", "٨", "٩", "١٠"], correct: 2, hint: "اقسم الطرفين على خمسة." },
        { prompt: "ما قيمة ٣٠٪ من ٨٠؟", answers: ["١٨", "٢٤", "٣٠", "٤٠"], correct: 1, hint: "عشرة بالمئة تساوي ثمانية." },
        { prompt: "بسّط ٣(س + ٤).", answers: ["٣س + ٤", "٣س + ٧", "٣س + ١٢", "٧س"], correct: 2, hint: "اضرب الحدين في ثلاثة." },
        { prompt: "ما وسيط الأعداد ٣، ٥، ٨، ٩، ٢٠؟", answers: ["٥", "٨", "٩", "٢٠"], correct: 1, hint: "اختر القيمة التي في وسط الترتيب." },
        { prompt: "ضلعَا مثلث قائم ٦ و٨. ما طول الوتر؟", answers: ["٩", "١٠", "١٢", "١٤"], correct: 1, hint: "استخدم أ² + ب² = ج²." },
      ];
    }
    if (band === "secondary") {
      return [
        { prompt: "حل س² − ٩ = ٠.", answers: ["س = ٣ فقط", "س = −٣ فقط", "س = ±٣", "س = ٩"], correct: 2, hint: "استخدم فرق مربعين." },
        { prompt: "ما قيمة لو₁₀(١٠٠٠)؟", answers: ["٢", "٣", "١٠", "١٠٠"], correct: 1, hint: "عشرة مرفوعة لأي قوة تساوي ١٠٠٠؟" },
        { prompt: "أوجد مشتقة ٤س³.", answers: ["٤س²", "٧س²", "١٢س²", "١٢س³"], correct: 2, hint: "اضرب في الأس ثم أنقص الأس واحداً." },
        { prompt: "إذا كان جا θ = ١⁄٢ وθ حادة، فإن θ تساوي...", answers: ["١٥°", "٣٠°", "٤٥°", "٦٠°"], correct: 1, hint: "تذكّر المثلث ذي الزوايا الخاصة." },
        { prompt: "تنمو قيمة ٥٪ سنوياً. أي معامل يمثل سنة واحدة؟", answers: ["٠٫٠٥", "٠٫٩٥", "١٫٠٥", "١٫٥"], correct: 2, hint: "احتفظ بنسبة ١٠٠٪ الأصلية وأضف ٥٪." },
      ];
    }
    return [
      { prompt: "احسب النهاية عندما س←٠: جا(س)⁄س.", answers: ["٠", "١", "∞", "غير معرّفة"], correct: 1, hint: "استخدم النهاية المثلثية القياسية." },
      { prompt: "ما مشتقة لو(س) الطبيعي؟", answers: ["لو(س)", "س", "١⁄س", "هـ^س"], correct: 2, hint: "تذكّر مشتقة اللوغاريتم الطبيعي." },
      { prompt: "إذا كان ح(أ)=٠٫٤ وح(ب)=٠٫٥ مستقلين، فما ح(أ∩ب)؟", answers: ["٠٫٢", "٠٫٤", "٠٫٥", "٠٫٩"], correct: 0, hint: "اضرب احتمالي الحدثين المستقلين." },
      { prompt: "متوسط التوزيع الطبيعي المعياري هو...", answers: ["−١", "٠", "١", "متغير"], correct: 1, hint: "يتمركز التوزيع عند هذه القيمة." },
      { prompt: "احسب ∫ ٣س² د س.", answers: ["س³ + ثابت", "٣س³ + ثابت", "٦س + ثابت", "س² + ثابت"], correct: 0, hint: "زد الأس واحداً واقسم على الأس الجديد." },
    ];
  }
  if (band === "early") {
    return [
      { prompt: "Count the moons: ☾ ☾ ☾", answers: ["2", "3", "4"], correct: 1, hint: "Touch each moon while counting." },
      { prompt: "What comes after 6?", answers: ["5", "7", "9"], correct: 1, hint: "Count one step forward." },
      { prompt: "Which group has five stars?", answers: ["★★★", "★★★★★", "★★★★"], correct: 1, hint: "Count every star." },
      { prompt: "What is 2 + 2?", answers: ["3", "4", "5"], correct: 1, hint: "Hold up two fingers on each hand." },
    ];
  }
  if (band === "primary") {
    return [
      { prompt: "What is 7 × 8?", answers: ["54", "56", "64", "72"], correct: 1, hint: "Think of seven groups of eight." },
      { prompt: "What is 360 ÷ 9?", answers: ["30", "40", "45", "50"], correct: 1, hint: "Nine multiplied by what equals 360?" },
      { prompt: "Which is largest?", answers: ["0.45", "0.5", "0.09", "0.405"], correct: 1, hint: "Write each number to the hundredths place." },
      { prompt: "What is 3/4 of 20?", answers: ["5", "10", "15", "18"], correct: 2, hint: "Find one quarter, then multiply by three." },
      { prompt: "A square has side length 9 cm. What is its perimeter?", answers: ["18", "27", "36", "81"], correct: 2, hint: "A square has four equal sides." },
    ];
  }
  if (band === "middle") {
    return [
      { prompt: "Solve 5x = 45.", answers: ["7", "8", "9", "10"], correct: 2, hint: "Divide both sides by five." },
      { prompt: "What is 30% of 80?", answers: ["18", "24", "30", "40"], correct: 1, hint: "Ten percent is eight." },
      { prompt: "Simplify 3(a + 4).", answers: ["3a + 4", "3a + 7", "3a + 12", "7a"], correct: 2, hint: "Multiply both terms by three." },
      { prompt: "What is the median of 3, 5, 8, 9, 20?", answers: ["5", "8", "9", "20"], correct: 1, hint: "Choose the middle ordered value." },
      { prompt: "A right triangle has legs 6 and 8. Find the hypotenuse.", answers: ["9", "10", "12", "14"], correct: 1, hint: "Use a² + b² = c²." },
    ];
  }
  if (band === "secondary") {
    return [
      { prompt: "Solve x² − 9 = 0.", answers: ["x = 3 only", "x = −3 only", "x = ±3", "x = 9"], correct: 2, hint: "Use the difference of two squares." },
      { prompt: "What is log₁₀(1000)?", answers: ["2", "3", "10", "100"], correct: 1, hint: "Ten raised to what power equals 1000?" },
      { prompt: "Differentiate 4x³.", answers: ["4x²", "7x²", "12x²", "12x³"], correct: 2, hint: "Multiply by the power, then reduce the power by one." },
      { prompt: "If sin θ = 1/2 and θ is acute, θ equals…", answers: ["15°", "30°", "45°", "60°"], correct: 1, hint: "Recall the special-angle triangle." },
      { prompt: "A value grows by 5% annually. Which multiplier models one year?", answers: ["0.05", "0.95", "1.05", "1.5"], correct: 2, hint: "Keep the original 100% and add 5%." },
    ];
  }
  return [
    { prompt: "Evaluate limₓ→0 sin(x)/x.", answers: ["0", "1", "∞", "Undefined"], correct: 1, hint: "Use the standard trigonometric limit." },
    { prompt: "What is the derivative of ln(x)?", answers: ["ln(x)", "x", "1/x", "eˣ"], correct: 2, hint: "Recall the natural logarithm derivative." },
    { prompt: "If P(A)=0.4 and P(B)=0.5 independently, P(A∩B) is…", answers: ["0.2", "0.4", "0.5", "0.9"], correct: 0, hint: "Multiply independent probabilities." },
    { prompt: "The mean of a standard normal distribution is…", answers: ["−1", "0", "1", "It varies"], correct: 1, hint: "The distribution is centred at this value." },
    { prompt: "Evaluate ∫ 3x² dx.", answers: ["x³ + C", "3x³ + C", "6x + C", "x² + C"], correct: 0, hint: "Increase the exponent and divide by the new exponent." },
  ];
}

const patternRoundsEnglish: Round[] = [
  { prompt: "Guide the balloon: ▲ ● ▲ ● ▲ …", answers: ["▲", "●", "■", "◆"], correct: 1, hint: "The two shapes alternate." },
  { prompt: "Choose the next altitude: 2, 4, 8, 16, …", answers: ["18", "24", "30", "32"], correct: 3, hint: "Each value doubles." },
  { prompt: "Complete the route: A, C, F, J, …", answers: ["M", "N", "O", "P"], correct: 2, hint: "The jumps grow by one: +2, +3, +4…" },
  { prompt: "What comes next? 1, 1, 2, 3, 5, …", answers: ["6", "7", "8", "10"], correct: 2, hint: "Add the previous two values." },
];

const patternRoundsArabic: Round[] = [
  { prompt: "قد المنطاد: ▲ ● ▲ ● ▲ …", answers: ["▲", "●", "■", "◆"], correct: 1, hint: "يتناوب الشكلان." },
  { prompt: "اختر الارتفاع التالي: ٢، ٤، ٨، ١٦، …", answers: ["١٨", "٢٤", "٣٠", "٣٢"], correct: 3, hint: "تتضاعف كل قيمة." },
  { prompt: "أكمل المسار: أ، ج، و، ي، …", answers: ["م", "ن", "س", "ع"], correct: 2, hint: "تزداد القفزة حرفاً في كل مرة." },
  { prompt: "ما العدد التالي؟ ١، ١، ٢، ٣، ٥، …", answers: ["٦", "٧", "٨", "١٠"], correct: 2, hint: "اجمع العددين السابقين." },
];

const storyRoundsEnglish: Round[] = [
  { scene: "The library lantern has gone dark.", prompt: "What should your team do first?", answers: ["Inspect the clues together", "Blame the nearest learner", "Leave without telling anyone", "Hide the lantern"], correct: 0, hint: "Good investigators begin with evidence and teamwork." },
  { scene: "A map shows two paths; one is marked as protected habitat.", prompt: "Which path should the team choose?", answers: ["The marked visitor path", "The protected habitat", "Any path without checking", "A path through nesting birds"], correct: 0, hint: "Choose the route that respects the environment." },
  { scene: "You find another learner’s missing notebook.", prompt: "What completes the quest kindly?", answers: ["Return it through the school desk", "Read every private page", "Keep it as treasure", "Post its pages publicly"], correct: 0, hint: "Protect privacy and help the owner." },
];

const storyRoundsArabic: Round[] = [
  { scene: "انطفأ مصباح المكتبة.", prompt: "ماذا يفعل الفريق أولاً؟", answers: ["يفحص الأدلة معاً", "يلوم أقرب طالب", "يغادر من دون إخبار أحد", "يخفي المصباح"], correct: 0, hint: "يبدأ المحقق الجيد بالأدلة والعمل الجماعي." },
  { scene: "تُظهر الخريطة مسارين، أحدهما موطن طبيعي محمي.", prompt: "أي مسار يختار الفريق؟", answers: ["مسار الزوار المحدد", "الموطن المحمي", "أي مسار بلا تحقق", "طريق يمر بأعشاش الطيور"], correct: 0, hint: "اختر الطريق الذي يحترم البيئة." },
  { scene: "وجدت دفتر طالب آخر المفقود.", prompt: "كيف تنهي المهمة بلطف؟", answers: ["تسلّمه إلى مكتب المدرسة", "تقرأ كل صفحاته الخاصة", "تحتفظ به ككنز", "تنشر صفحاته"], correct: 0, hint: "احمِ الخصوصية وساعد صاحب الدفتر." },
];

const scienceRoundsEnglish: Round[] = [
  { prompt: "Which observation is quantitative evidence?", answers: ["The plant looks healthy", "The stem grew 3 cm", "The leaf is beautiful", "The soil feels nice"], correct: 1, hint: "Quantitative evidence contains a measurement." },
  { prompt: "Which variable should stay constant when testing how light affects plant growth?", answers: ["Amount of water", "Amount of light", "Growth result", "The hypothesis"], correct: 0, hint: "Only the light condition should intentionally change." },
  { prompt: "Which result best supports repeating an experiment?", answers: ["One surprising trial", "A consistent pattern across trials", "A guess before testing", "An unrelated opinion"], correct: 1, hint: "Repeated results show whether a pattern is dependable." },
  { prompt: "A measurement differs greatly from every other trial. What should a scientist do?", answers: ["Check the method and repeat it", "Delete it without review", "Change all results to match", "Stop recording data"], correct: 0, hint: "Investigate possible error before drawing a conclusion." },
];

const scienceRoundsArabic: Round[] = [
  { prompt: "أي ملاحظة تُعد دليلاً كمياً؟", answers: ["تبدو النبتة سليمة", "نما الساق ٣ سم", "الورقة جميلة", "التربة مريحة"], correct: 1, hint: "يحتوي الدليل الكمي على قياس." },
  { prompt: "أي متغير يجب تثبيته عند اختبار أثر الضوء في نمو النبات؟", answers: ["كمية الماء", "كمية الضوء", "نتيجة النمو", "الفرضية"], correct: 0, hint: "يجب أن يتغير مقدار الضوء وحده عمداً." },
  { prompt: "أي نتيجة تدعم تكرار التجربة بصورة أفضل؟", answers: ["محاولة مفاجئة واحدة", "نمط ثابت عبر المحاولات", "تخمين قبل الاختبار", "رأي غير مرتبط"], correct: 1, hint: "تكشف النتائج المتكررة مدى ثبات النمط." },
  { prompt: "اختلف قياس كثيراً عن كل المحاولات الأخرى. ماذا يفعل العالِم؟", answers: ["يفحص الطريقة ويكرر القياس", "يحذفه بلا مراجعة", "يغيّر النتائج لتتطابق", "يتوقف عن تسجيل البيانات"], correct: 0, hint: "تحقق من الخطأ المحتمل قبل الاستنتاج." },
];

function ArcadeQuiz({
  gameId,
  rounds,
  reward,
  sound,
  locale,
  timed = false,
  onClose,
  onComplete,
}: {
  gameId: string;
  rounds: Round[];
  reward: number;
  sound: boolean;
  locale: Locale;
  timed?: boolean;
  onClose: () => void;
  onComplete: (id: string, reward: number) => void;
}) {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(timed ? 60 : 0);
  const question = rounds[round];
  const finished = timed ? seconds === 0 : false;
  const success = selected === question.correct;

  useEffect(() => {
    if (!timed || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [seconds, timed]);

  const choose = (answer: number) => {
    if (selected !== null || finished) return;
    setSelected(answer);
    const correct = answer === question.correct;
    if (correct) setScore((value) => value + 1);
    playFeedback(sound, correct ? "success" : "retry");
  };

  const next = () => {
    if (round === rounds.length - 1) {
      playFeedback(sound, "reward");
      onComplete(gameId, reward + score * 5 + (success ? 5 : 0));
      return;
    }
    setRound((value) => value + 1);
    setSelected(null);
  };

  if (finished) {
    return (
      <DialogFrame label={tr(locale, "Number Sprint complete", "اكتمل سباق الأرقام")} closeLabel={tr(locale, "Close dialog", "إغلاق النافذة")} onClose={onClose}>
        <GameHeader gameId={gameId} locale={locale} subtitle={tr(locale, "Time is up", "انتهى الوقت")} />
        <div className="completion-card arcade-completion">
          <span className="completion-medal">{formatNumber(score, locale)}</span>
          <h2>{tr(locale, `You cleared ${score} checkpoints`, `اجتزت ${formatNumber(score, locale)} محطات`)}</h2>
          <p>{tr(locale, "Speed grows through calm practice. Try again or collect your earned stars.", "تزداد السرعة بالتدريب الهادئ. حاول مجدداً أو اجمع نجومك.")}</p>
          <button className="primary-button" onClick={() => onComplete(gameId, reward + score * 5)}>
            {tr(locale, "Collect reward", "اجمع المكافأة")} <Star size={17} />
          </button>
        </div>
      </DialogFrame>
    );
  }

  return (
    <DialogFrame label={localizedGames(locale).find((item) => item.id === gameId)?.title ?? tr(locale, "Learning game", "لعبة تعليمية")} closeLabel={tr(locale, "Close dialog", "إغلاق النافذة")} onClose={onClose}>
      <GameHeader gameId={gameId} locale={locale} subtitle={tr(locale, `${rounds.length} learning checkpoints`, `${formatNumber(rounds.length, locale)} محطات تعليمية`)} />
      <div className="arcade-status" aria-label={tr(locale, `Round ${round + 1} of ${rounds.length}`, `الجولة ${formatNumber(round + 1, locale)} من ${formatNumber(rounds.length, locale)}`)}>
        <span className="arcade-track"><i style={{ width: `${(round + 1) / rounds.length * 100}%` }} /></span>
        <strong>{formatNumber(round + 1, locale)}/{formatNumber(rounds.length, locale)}</strong>
        {timed && <span className={seconds <= 10 ? "timer-critical" : ""}><Timer size={16} /> {formatNumber(seconds, locale)}{tr(locale, "s", "ث")}</span>}
      </div>
      <div className="question-area game-question">
        {question.scene && <p className="story-scene">{question.scene}</p>}
        <h3>{question.prompt}</h3>
        <div className="answer-grid">
          {question.answers.map((answer, index) => {
            const className = selected === null ? "" : index === question.correct ? "correct" : index === selected ? "incorrect" : "";
            return (
              <button key={answer} className={className} onClick={() => choose(index)} disabled={selected !== null}>
                <span>{answerLabel(index, locale)}</span>
                {answer}
                {className === "correct" && <Check size={18} />}
                {className === "incorrect" && <X size={18} />}
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <div className={`feedback-box ${success ? "success" : "retry"}`} role="status">
            <span>{success ? <Check size={19} /> : <Lightbulb size={19} />}</span>
            <div>
              <strong>{success ? tr(locale, "Checkpoint cleared!", "اجتزت المحطة!") : tr(locale, "Study the clue and keep going.", "راجع التلميح وواصل المحاولة.")}</strong>
              <p>{success ? question.explanation ?? tr(locale, "Strong reasoning.", "تفكير قوي.") : question.hint}</p>
            </div>
            <button onClick={next}>
              {round === rounds.length - 1 ? tr(locale, "Finish", "إنهاء") : tr(locale, "Next", "التالي")} <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </DialogFrame>
  );
}

function WordWizard({
  reward,
  level,
  sound,
  locale,
  onClose,
  onComplete,
}: {
  reward: number;
  level: string;
  sound: boolean;
  locale: Locale;
  onClose: () => void;
  onComplete: (id: string, reward: number) => void;
}) {
  const targetByBand: Record<Locale, Record<AgeBand, string>> = {
    en: {
      early: "SUN",
      primary: "PLANT",
      middle: "EVIDENCE",
      secondary: "ANALYZE",
      university: "SYNTHESIS",
    },
    ar: {
      early: "شمس",
      primary: "نبات",
      middle: "دليل",
      secondary: "تحليل",
      university: "منهجية",
    },
  };
  const target = targetByBand[locale][ageBandFor(level)];
  const tiles = useMemo(
    () => target.split("").map((letter, index) => ({ letter, id: index })).sort(() => Math.random() - 0.5),
    [target],
  );
  const [selected, setSelected] = useState<number[]>([]);
  const built = selected.map((id) => tiles.find((tile) => tile.id === id)?.letter ?? "").join("");
  const complete = built === target;

  useEffect(() => {
    if (complete) playFeedback(sound, "reward");
  }, [complete, sound]);

  return (
    <DialogFrame label={tr(locale, "Word Wizard", "ساحر الكلمات")} closeLabel={tr(locale, "Close dialog", "إغلاق النافذة")} onClose={onClose}>
      <GameHeader gameId="words" locale={locale} subtitle={tr(locale, "Build the enchanted word", "كوّن الكلمة السحرية")} />
      <div className="word-builder">
        <div className={`built-word ${complete ? "complete" : ""}`} aria-live="polite">
          {built || <span>{target.split("").map(() => "＿").join(" ")}</span>}
        </div>
        <p>{tr(locale, "Choose the letters in the correct order to spell", "اختر الحروف بالترتيب الصحيح لكتابة")} <strong>{locale === "ar" ? target : target.toLowerCase()}</strong>.</p>
        <div className="letter-tiles">
          {tiles.map((tile) => (
            <button
              key={tile.id}
              disabled={selected.includes(tile.id)}
              onClick={() => setSelected((items) => [...items, tile.id])}
              aria-label={tr(locale, `Add letter ${tile.letter}`, `أضف حرف ${tile.letter}`)}
            >
              {tile.letter}
            </button>
          ))}
        </div>
        <div className="word-actions">
          <button className="soft-button" onClick={() => setSelected([])} disabled={selected.length === 0}>
            <RotateCcw size={16} /> {tr(locale, "Start again", "ابدأ من جديد")}
          </button>
          {complete && (
            <button className="primary-button" onClick={() => onComplete("words", reward)}>
              {tr(locale, "Word unlocked", "فُتحت الكلمة")} <Star size={16} />
            </button>
          )}
        </div>
      </div>
    </DialogFrame>
  );
}

function MemoryGame({
  reward,
  sound,
  locale,
  onClose,
  onComplete,
}: {
  reward: number;
  sound: boolean;
  locale: Locale;
  onClose: () => void;
  onComplete: (id: string, reward: number) => void;
}) {
  const [deck] = useState(() => ["★", "☾", "⚗", "★", "☾", "⚗"].map((value, index) => ({ value, key: `${value}-${index}` })).sort(() => Math.random() - 0.5));
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (open.length !== 2) return;
    const [first, second] = open;
    const timer = window.setTimeout(() => {
      if (deck[first].value === deck[second].value) {
        setMatched((items) => [...items, first, second]);
        playFeedback(sound, "success");
      } else {
        playFeedback(sound, "retry");
      }
      setOpen([]);
      setLocked(false);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [deck, open, sound]);

  const choose = (index: number) => {
    if (locked || open.includes(index) || matched.includes(index)) return;
    if (open.length === 0) {
      setOpen([index]);
      return;
    }
    setOpen([open[0], index]);
    setLocked(true);
  };
  const complete = matched.length === deck.length;

  return (
    <DialogFrame label={tr(locale, "Memory Meadow", "مرج الذاكرة")} closeLabel={tr(locale, "Close dialog", "إغلاق النافذة")} onClose={onClose}>
      <GameHeader gameId="memory" locale={locale} subtitle={tr(locale, "Match the three magical pairs", "طابق الأزواج السحرية الثلاثة")} />
      <div className="memory-area">
        <div className="memory-grid">
          {deck.map((card, index) => {
            const visible = open.includes(index) || matched.includes(index);
            return (
              <button
                key={card.key}
                onClick={() => choose(index)}
                className={`${visible ? "open" : ""} ${matched.includes(index) ? "matched" : ""}`}
                aria-label={visible ? card.value : tr(locale, "Hidden card", "بطاقة مخفية")}
                aria-pressed={visible}
              >
                <span className="card-back"><Sparkles size={22} /></span>
                <span className="card-face">{card.value}</span>
              </button>
            );
          })}
        </div>
        {complete ? (
          <button className="primary-button collect-button" onClick={() => onComplete("memory", reward)}>
            {tr(locale, `Collect ${reward} stars`, `اجمع ${formatNumber(reward, locale)} نجمة`)} <Star size={16} fill="currentColor" />
          </button>
        ) : (
          <p><CircleHelp size={16} /> {tr(locale, "Find all pairs to win your stars.", "اعثر على كل الأزواج لتفوز بالنجوم.")}</p>
        )}
      </div>
    </DialogFrame>
  );
}

export default function GameDialog({ gameId, level, locale, sound, onClose, onComplete }: GameProps) {
  const game = localizedGames(locale).find((item) => item.id === gameId);
  if (!game) return null;
  if (gameId === "memory") {
    return <MemoryGame reward={game.reward} locale={locale} sound={sound} onClose={onClose} onComplete={onComplete} />;
  }
  if (gameId === "words") {
    return <WordWizard reward={game.reward} level={level} locale={locale} sound={sound} onClose={onClose} onComplete={onComplete} />;
  }
  if (gameId === "numbers") {
    return <ArcadeQuiz gameId={gameId} rounds={numberRounds(ageBandFor(level), locale)} reward={game.reward} locale={locale} sound={sound} timed onClose={onClose} onComplete={onComplete} />;
  }
  if (gameId === "patterns") {
    return <ArcadeQuiz gameId={gameId} rounds={locale === "ar" ? patternRoundsArabic : patternRoundsEnglish} reward={game.reward} locale={locale} sound={sound} onClose={onClose} onComplete={onComplete} />;
  }
  if (gameId === "story") {
    return <ArcadeQuiz gameId={gameId} rounds={locale === "ar" ? storyRoundsArabic : storyRoundsEnglish} reward={game.reward} locale={locale} sound={sound} onClose={onClose} onComplete={onComplete} />;
  }
  return <ArcadeQuiz gameId={gameId} rounds={locale === "ar" ? scienceRoundsArabic : scienceRoundsEnglish} reward={game.reward} locale={locale} sound={sound} onClose={onClose} onComplete={onComplete} />;
}
