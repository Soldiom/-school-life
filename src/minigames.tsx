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
import { playFeedback } from "./learning-engine";
import { ageBandFor, games, type AgeBand, type Question } from "./school-data";

type GameProps = {
  gameId: string;
  level: string;
  sound: boolean;
  onClose: () => void;
  onComplete: (gameId: string, reward: number) => void;
};

type Round = Question & { scene?: string };

function GameHeader({ gameId, subtitle }: { gameId: string; subtitle: string }) {
  const game = games.find((item) => item.id === gameId)!;
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

function numberRounds(band: AgeBand): Round[] {
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

const patternRounds: Round[] = [
  { prompt: "Guide the balloon: ▲ ● ▲ ● ▲ …", answers: ["▲", "●", "■", "◆"], correct: 1, hint: "The two shapes alternate." },
  { prompt: "Choose the next altitude: 2, 4, 8, 16, …", answers: ["18", "24", "30", "32"], correct: 3, hint: "Each value doubles." },
  { prompt: "Complete the route: A, C, F, J, …", answers: ["M", "N", "O", "P"], correct: 2, hint: "The jumps grow by one: +2, +3, +4…" },
  { prompt: "What comes next? 1, 1, 2, 3, 5, …", answers: ["6", "7", "8", "10"], correct: 2, hint: "Add the previous two values." },
];

const storyRounds: Round[] = [
  { scene: "The library lantern has gone dark.", prompt: "What should your team do first?", answers: ["Inspect the clues together", "Blame the nearest learner", "Leave without telling anyone", "Hide the lantern"], correct: 0, hint: "Good investigators begin with evidence and teamwork." },
  { scene: "A map shows two paths; one is marked as protected habitat.", prompt: "Which path should the team choose?", answers: ["The marked visitor path", "The protected habitat", "Any path without checking", "A path through nesting birds"], correct: 0, hint: "Choose the route that respects the environment." },
  { scene: "You find another learner’s missing notebook.", prompt: "What completes the quest kindly?", answers: ["Return it through the school desk", "Read every private page", "Keep it as treasure", "Post its pages publicly"], correct: 0, hint: "Protect privacy and help the owner." },
];

const scienceRounds: Round[] = [
  { prompt: "Which observation is quantitative evidence?", answers: ["The plant looks healthy", "The stem grew 3 cm", "The leaf is beautiful", "The soil feels nice"], correct: 1, hint: "Quantitative evidence contains a measurement." },
  { prompt: "Which variable should stay constant when testing how light affects plant growth?", answers: ["Amount of water", "Amount of light", "Growth result", "The hypothesis"], correct: 0, hint: "Only the light condition should intentionally change." },
  { prompt: "Which result best supports repeating an experiment?", answers: ["One surprising trial", "A consistent pattern across trials", "A guess before testing", "An unrelated opinion"], correct: 1, hint: "Repeated results show whether a pattern is dependable." },
  { prompt: "A measurement differs greatly from every other trial. What should a scientist do?", answers: ["Check the method and repeat it", "Delete it without review", "Change all results to match", "Stop recording data"], correct: 0, hint: "Investigate possible error before drawing a conclusion." },
];

function ArcadeQuiz({
  gameId,
  rounds,
  reward,
  sound,
  timed = false,
  onClose,
  onComplete,
}: {
  gameId: string;
  rounds: Round[];
  reward: number;
  sound: boolean;
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
      <DialogFrame label="Number Sprint complete" onClose={onClose}>
        <GameHeader gameId={gameId} subtitle="Time is up" />
        <div className="completion-card arcade-completion">
          <span className="completion-medal">{score}</span>
          <h2>You cleared {score} checkpoints</h2>
          <p>Speed grows through calm practice. Try again or collect your earned stars.</p>
          <button className="primary-button" onClick={() => onComplete(gameId, reward + score * 5)}>
            Collect reward <Star size={17} />
          </button>
        </div>
      </DialogFrame>
    );
  }

  return (
    <DialogFrame label={games.find((item) => item.id === gameId)?.title ?? "Learning game"} onClose={onClose}>
      <GameHeader gameId={gameId} subtitle={`${rounds.length} learning checkpoints`} />
      <div className="arcade-status" aria-label={`Round ${round + 1} of ${rounds.length}`}>
        <span className="arcade-track"><i style={{ width: `${(round + 1) / rounds.length * 100}%` }} /></span>
        <strong>{round + 1}/{rounds.length}</strong>
        {timed && <span className={seconds <= 10 ? "timer-critical" : ""}><Timer size={16} /> {seconds}s</span>}
      </div>
      <div className="question-area game-question">
        {question.scene && <p className="story-scene">{question.scene}</p>}
        <h3>{question.prompt}</h3>
        <div className="answer-grid">
          {question.answers.map((answer, index) => {
            const className = selected === null ? "" : index === question.correct ? "correct" : index === selected ? "incorrect" : "";
            return (
              <button key={answer} className={className} onClick={() => choose(index)} disabled={selected !== null}>
                <span>{String.fromCharCode(65 + index)}</span>
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
              <strong>{success ? "Checkpoint cleared!" : "Study the clue and keep going."}</strong>
              <p>{success ? question.explanation ?? "Strong reasoning." : question.hint}</p>
            </div>
            <button onClick={next}>
              {round === rounds.length - 1 ? "Finish" : "Next"} <ArrowRight size={15} />
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
  onClose,
  onComplete,
}: {
  reward: number;
  level: string;
  sound: boolean;
  onClose: () => void;
  onComplete: (id: string, reward: number) => void;
}) {
  const targetByBand: Record<AgeBand, string> = {
    early: "SUN",
    primary: "PLANT",
    middle: "EVIDENCE",
    secondary: "ANALYZE",
    university: "SYNTHESIS",
  };
  const target = targetByBand[ageBandFor(level)];
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
    <DialogFrame label="Word Wizard" onClose={onClose}>
      <GameHeader gameId="words" subtitle="Build the enchanted word" />
      <div className="word-builder">
        <div className={`built-word ${complete ? "complete" : ""}`} aria-live="polite">
          {built || <span>{target.split("").map(() => "＿").join(" ")}</span>}
        </div>
        <p>Choose the letters in the correct order to spell <strong>{target.toLowerCase()}</strong>.</p>
        <div className="letter-tiles">
          {tiles.map((tile) => (
            <button
              key={tile.id}
              disabled={selected.includes(tile.id)}
              onClick={() => setSelected((items) => [...items, tile.id])}
              aria-label={`Add letter ${tile.letter}`}
            >
              {tile.letter}
            </button>
          ))}
        </div>
        <div className="word-actions">
          <button className="soft-button" onClick={() => setSelected([])} disabled={selected.length === 0}>
            <RotateCcw size={16} /> Start again
          </button>
          {complete && (
            <button className="primary-button" onClick={() => onComplete("words", reward)}>
              Word unlocked <Star size={16} />
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
  onClose,
  onComplete,
}: {
  reward: number;
  sound: boolean;
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
    <DialogFrame label="Memory Meadow" onClose={onClose}>
      <GameHeader gameId="memory" subtitle="Match the three magical pairs" />
      <div className="memory-area">
        <div className="memory-grid">
          {deck.map((card, index) => {
            const visible = open.includes(index) || matched.includes(index);
            return (
              <button
                key={card.key}
                onClick={() => choose(index)}
                className={`${visible ? "open" : ""} ${matched.includes(index) ? "matched" : ""}`}
                aria-label={visible ? card.value : "Hidden card"}
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
            Collect {reward} stars <Star size={16} fill="currentColor" />
          </button>
        ) : (
          <p><CircleHelp size={16} /> Find all pairs to win your stars.</p>
        )}
      </div>
    </DialogFrame>
  );
}

export default function GameDialog({ gameId, level, sound, onClose, onComplete }: GameProps) {
  const game = games.find((item) => item.id === gameId);
  if (!game) return null;
  if (gameId === "memory") {
    return <MemoryGame reward={game.reward} sound={sound} onClose={onClose} onComplete={onComplete} />;
  }
  if (gameId === "words") {
    return <WordWizard reward={game.reward} level={level} sound={sound} onClose={onClose} onComplete={onComplete} />;
  }
  if (gameId === "numbers") {
    return <ArcadeQuiz gameId={gameId} rounds={numberRounds(ageBandFor(level))} reward={game.reward} sound={sound} timed onClose={onClose} onComplete={onComplete} />;
  }
  if (gameId === "patterns") {
    return <ArcadeQuiz gameId={gameId} rounds={patternRounds} reward={game.reward} sound={sound} onClose={onClose} onComplete={onComplete} />;
  }
  if (gameId === "story") {
    return <ArcadeQuiz gameId={gameId} rounds={storyRounds} reward={game.reward} sound={sound} onClose={onClose} onComplete={onComplete} />;
  }
  return <ArcadeQuiz gameId={gameId} rounds={scienceRounds} reward={game.reward} sound={sound} onClose={onClose} onComplete={onComplete} />;
}
