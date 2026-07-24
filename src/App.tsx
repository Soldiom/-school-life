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
import GameDialog from "./minigames";
import {
  ageBandFor,
  badges,
  busRoutes,
  campusHotspots,
  classmates,
  decorations,
  games,
  levelLabel,
  levels,
  navigation,
  subjects,
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
const avatarNames = ["Sunny", "Nova", "Orbit", "Bloom"];

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <span className="brand-emblem" aria-hidden="true">
        <span className="brand-book" />
        <Star className="brand-star" fill="currentColor" />
      </span>
      {!compact && <span className="brand-words">School Life</span>}
    </div>
  );
}

function Avatar({ index, label, small = false }: { index: number; label: string; small?: boolean }) {
  return (
    <span className={`avatar avatar-${index + 1} ${small ? "avatar-small" : ""}`} role="img" aria-label={`${label} avatar`}>
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

function Onboarding({ onStart }: { onStart: (name: string, level: string, avatar: number) => void }) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("grade5");
  const [avatar, setAvatar] = useState(0);
  const experience = experienceFor(level);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onStart(name.trim() || "Explorer", level, avatar);
  };

  return (
    <main className="welcome-shell">
      <div className="welcome-sky" aria-hidden="true">
        <span className="welcome-cloud cloud-a" />
        <span className="welcome-cloud cloud-b" />
        <span className="welcome-spark spark-a">✦</span>
        <span className="welcome-spark spark-b">✦</span>
      </div>
      <section className="welcome-card">
        <div className="welcome-form-panel">
          <Brand />
          <p className="eyebrow">YOUR WORLD OF LEARNING</p>
          <h1>Every school day becomes an adventure.</h1>
          <p className="welcome-copy">Learn at your level, make kind friends, play, create, and grow—from preschool to university.</p>
          <form onSubmit={submit} className="setup-form">
            <label htmlFor="learner-name">What should we call you?</label>
            <input id="learner-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={24} placeholder="Your first name" autoComplete="given-name" />

            <label htmlFor="learning-level">Choose your learning level</label>
            <select id="learning-level" value={level} onChange={(event) => setLevel(event.target.value)}>
              {levels.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
            </select>
            <div className="experience-preview" aria-live="polite">
              <span>{experience.label}</span>
              <strong>{experience.world}</strong>
              <p>{experience.promise}</p>
            </div>

            <fieldset className="avatar-picker">
              <legend>Pick your explorer</legend>
              <div className="avatar-options">
                {avatarFaces.map((face, index) => (
                  <button key={face} type="button" className={avatar === index ? "selected" : ""} onClick={() => setAvatar(index)} aria-pressed={avatar === index}>
                    <span>{face}</span><small>{avatarNames[index]}</small>
                  </button>
                ))}
              </div>
            </fieldset>
            <button className="primary-button enter-button" type="submit">
              Enter my school <ArrowRight size={19} />
            </button>
          </form>
          <p className="privacy-note"><ShieldCheck size={15} /> No account needed. Progress stays on this device.</p>
        </div>
        <div className="welcome-world-panel">
          <div className="welcome-world-copy">
            <span className="live-chip"><span /> {experience.world.toUpperCase()}</span>
            <h2>One learning journey.<br />A distinct experience at every age.</h2>
          </div>
          <div className="welcome-subjects" aria-label="Learning areas">
            <span><strong>∑</strong> Mathematics</span>
            <span><strong>Aa</strong> Reading</span>
            <span><strong>⚗</strong> Science</span>
          </div>
        </div>
      </section>
    </main>
  );
}

function CampusView({ player, go, openChallenge }: { player: PlayerState; go: (route: RouteName) => void; openChallenge: (subject: Subject) => void }) {
  const experience = experienceFor(player.level);
  const questItems = [
    { label: "Solve a math puzzle", complete: player.subjectWins.math > 0, subject: "math" as Subject },
    { label: "Read one story clue", complete: player.subjectWins.reading > 0, subject: "reading" as Subject },
    { label: "Visit the Science Dome", complete: player.subjectWins.science > 0, subject: "science" as Subject },
  ];
  const completed = questItems.filter((item) => item.complete).length;
  const recommendedSubject = subjects.reduce((lowest, subject) =>
    player.progress[subject.id] < player.progress[lowest.id] ? subject : lowest,
  );

  return (
    <div className="page campus-page">
      <SectionHeading
        eyebrow={`TODAY · ${experience.label.toUpperCase()}`}
        title={`Welcome back, ${player.name}.`}
        copy={experience.promise}
        action={<button className="soft-button" onClick={() => openChallenge(recommendedSubject.id)}><WandSparkles size={18} /> Choose for me</button>}
      />
      <div className="campus-layout">
        <section className="world-card" aria-label={`Interactive ${experience.world} map`}>
          <div className="world-shade" />
          <div className="world-topline">
            <span><Sparkles size={16} /> {experience.world}</span>
            <span className="weather-chip">{experience.sessionMinutes}-minute learning path</span>
          </div>
          {campusHotspots.map((spot) => (
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
          <div className="world-bottom-note"><MapPinIcon /> Select a glowing place to explore</div>
        </section>

        <aside className="campus-rail">
          <section className="adventure-panel panel">
            <div className="panel-title-row">
              <div><p className="eyebrow">TODAY’S ADVENTURE</p><h2>Three sparks to find</h2></div>
              <ProgressRing value={(completed / 3) * 100}><strong>{completed}</strong><small>/ 3</small></ProgressRing>
            </div>
            <div className="quest-list">
              {questItems.map((item, index) => (
                <button key={item.label} type="button" className={item.complete ? "complete" : ""} onClick={() => openChallenge(item.subject)}>
                  <span className="quest-number">{item.complete ? <Check size={15} /> : index + 1}</span>
                  <span><strong>{item.label}</strong><small>{item.complete ? "Spark collected" : "+40 stars"}</small></span>
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
            <button className="primary-button full-button" onClick={() => go("classes")}>Continue adventure <ArrowRight size={17} /></button>
          </section>

          <section className="friend-panel panel">
            <div className="panel-title-row compact"><div><p className="eyebrow">FRIENDS ON CAMPUS</p><h2>Learning together</h2></div><button className="text-button" onClick={() => go("friends")}>View all</button></div>
            <div className="friend-mini-list">
              {classmates.slice(0, 3).map((friend) => (
                <div key={friend.name}>
                  <span className={`friend-avatar ${friend.color}`}>{friend.avatar}</span>
                  <span><strong>{friend.name}</strong><small>{friend.activity}</small></span>
                  <span className={`online-dot ${friend.online ? "online" : ""}`} title={friend.online ? "Online" : "Away"} />
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
      <section className="quick-path">
        <div className="quick-path-copy"><span className="path-kicker"><Zap size={15} fill="currentColor" /> YOUR NEXT BEST STEP</span><h2>Keep your learning streak glowing</h2><p>Ten focused minutes today moves every subject forward.</p></div>
        <div className="path-subjects">
          {subjects.map((subject) => (
            <button key={subject.id} onClick={() => openChallenge(subject.id)}>
              <span className={`subject-glyph ${subject.color}`}>{subject.icon}</span>
              <span><strong>{subject.title}</strong><small>{player.progress[subject.id]}% mastery</small></span>
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
  const experience = experienceFor(player.level);
  const remaining = Math.max(0, 6 - player.weeklyLessons);
  return (
    <div className="page">
      <SectionHeading eyebrow="LEARNING PATH" title="Classes that grow with you" copy={`Activities are adapted for ${levelLabel(player.level)}. Master a skill, earn rewards, and unlock the next chapter.`} action={<div className="goal-badge"><Target size={19} /><span><strong>Weekly goal</strong><small>{Math.min(player.weeklyLessons, 6)} of 6 lessons</small></span></div>} />
      <div className="subject-grid">
        {subjects.map((subject, index) => (
          <article className={`subject-card subject-${subject.color}`} key={subject.id}>
            <div className="subject-card-top"><span className="subject-number">0{index + 1}</span><span className="subject-glyph large">{subject.icon}</span></div>
            <p className="eyebrow">{subject.place.toUpperCase()}</p>
            <h2>{subject.title}</h2>
            <p>{subject.description}</p>
            <div className="mastery-row"><span><strong>{player.progress[subject.id]}%</strong><small>mastery</small></span><span className="mastery-bar"><span style={{ width: `${player.progress[subject.id]}%` }} /></span></div>
            <button className="card-action" onClick={() => openChallenge(subject.id)}><Play size={16} fill="currentColor" /> Start challenge</button>
          </article>
        ))}
      </div>
      <section className="lesson-board panel">
        <div className="lesson-board-head"><div><p className="eyebrow">TODAY’S LEARNING TRAIL</p><h2>{remaining === 0 ? "Weekly goal complete!" : "Small steps. Real progress."}</h2></div><span className="time-estimate"><Clock3 size={17} /> About {experience.sessionMinutes} minutes</span></div>
        <div className="lesson-timeline">
          {subjects.map((subject, index) => (
            <button key={subject.id} onClick={() => openChallenge(subject.id)}>
              <span className={`timeline-node ${index === 0 ? "current" : ""}`}>{index === 0 ? <Play size={16} fill="currentColor" /> : index + 1}</span>
              <span><small>{index === 0 ? "READY NOW" : `STEP ${index + 1}`}</small><strong>{subject.id === "math" ? "Reason with patterns" : subject.id === "reading" ? "Read between the lines" : "Test a fair experiment"}</strong><em>{subject.title} · {Math.max(4, Math.round(experience.sessionMinutes / 3))} min</em></span>
              <ChevronRight size={18} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function FriendsView({ player, onHighFive, openChallenge }: { player: PlayerState; onHighFive: (name: string) => void; openChallenge: (subject: Subject) => void }) {
  return (
    <div className="page">
      <SectionHeading eyebrow="KINDNESS CLUB" title="Better together" copy="Meet safe fictional classmates, celebrate their progress, and invite them to a guided study activity." action={<div className="safety-badge"><ShieldCheck size={19} /><span><strong>Safe social</strong><small>No open messaging</small></span></div>} />
      <div className="friends-grid">
        {classmates.map((friend, index) => (
          <article className="friend-card panel" key={friend.name}>
            <div className="friend-card-head">
              <span className={`friend-avatar large ${friend.color}`}>{friend.avatar}</span>
              <span className={`online-label ${friend.online ? "online" : ""}`}><i /> {friend.online ? "On campus" : "Back later"}</span>
            </div>
            <h2>{friend.name}</h2><p className="friend-strength">{friend.strength}</p><p className="friend-activity">{friend.activity}.</p>
            <div className="friend-actions">
              <button onClick={() => onHighFive(friend.name)}><Heart size={16} /> High-five</button>
              <button onClick={() => openChallenge((["reading", "math", "science"] as Subject[])[index % 3])}><BookOpen size={16} /> Study</button>
            </div>
          </article>
        ))}
      </div>
      <section className="kindness-banner">
        <div className="kindness-illustration" aria-hidden="true"><span>♡</span><span>✦</span><span>♡</span></div>
        <div><p className="eyebrow">THIS WEEK’S KINDNESS QUEST</p><h2>Send three learning high-fives</h2><p>Kind words make the whole campus brighter.</p></div>
        <div className="kindness-progress"><strong>{Math.min(player.highFives, 3)} / 3</strong><span><i style={{ width: `${Math.min(100, player.highFives / 3 * 100)}%` }} /></span><small>Reward: 60 stars</small></div>
      </section>
    </div>
  );
}

function PlaygroundView({ player, openGame }: { player: PlayerState; openGame: (gameId: string) => void }) {
  return (
    <div className="page">
      <SectionHeading eyebrow="PLAYGROUND ARCADE" title="Play with purpose" copy="Every minigame now has multiple rounds and adapts its challenge to your level. Play sparks never block a lesson." action={<div className="energy-badge"><Zap size={18} fill="currentColor" /><span><strong>{player.energy} play sparks</strong><small>Refill daily · no learning gates</small></span></div>} />
      <div className="games-grid">
        {games.map((game, index) => {
          const complete = player.completedGames.includes(game.id);
          return (
            <article className={`game-card game-${game.color}`} key={game.id}>
              <div className="game-art" aria-hidden="true"><span className="game-orb orb-one" /><span className="game-orb orb-two" /><strong>{game.icon}</strong><i>{String(index + 1).padStart(2, "0")}</i></div>
              <div className="game-copy"><p className="eyebrow">{game.eyebrow}</p><h2>{game.title}</h2><p>{game.description}</p><div><span><Star size={14} fill="currentColor" /> +{game.reward}</span>{complete && <span className="complete-chip"><Check size={13} /> Played</span>}</div><button onClick={() => openGame(game.id)}><Play size={16} fill="currentColor" /> {complete ? "Play again" : "Play now"}</button></div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function SpacesView({ player, room, setRoom, onDecoration }: { player: PlayerState; room: "bedroom" | "classroom"; setRoom: (room: "bedroom" | "classroom") => void; onDecoration: (id: string) => void }) {
  const roomDecorations = decorations.filter((item) => item.room === room);
  const placed = decorations.filter((item) => item.room === room && player.placed.includes(item.id));
  return (
    <div className="page">
      <SectionHeading eyebrow="MY SPACES" title="Make it feel like yours" copy="Spend coins earned from learning. Decorations are expressive rewards—never shortcuts to mastery." action={<div className="coin-balance"><Coins size={18} /><span><strong>{player.coins}</strong><small>school coins</small></span></div>} />
      <div className="room-tabs" role="tablist" aria-label="Choose a space">
        <button role="tab" aria-selected={room === "bedroom"} className={room === "bedroom" ? "active" : ""} onClick={() => setRoom("bedroom")}><MoonStar size={17} /> My Bedroom</button>
        <button role="tab" aria-selected={room === "classroom"} className={room === "classroom" ? "active" : ""} onClick={() => setRoom("classroom")}><School size={17} /> My Classroom</button>
      </div>
      <div className="spaces-layout">
        <section className={`room-scene ${room}`} aria-label={`${room} preview`}>
          <div className="room-window"><span /><span /><span /></div>
          <div className="room-wall-art">{room === "bedroom" ? "DREAM • LEARN • GROW" : "CURIOSITY LIVES HERE"}</div>
          <div className="room-furniture" aria-hidden="true">
            {room === "bedroom" ? <><span className="bed"><i /></span><span className="desk"><i /></span></> : <><span className="class-desk desk-one" /><span className="class-desk desk-two" /><span className="class-board">TODAY<br /><small>Be curious ✦</small></span></>}
          </div>
          <div className="placed-items">
            {placed.length === 0 && <span className="empty-room-note"><Sparkles size={16} /> Choose an item from the collection</span>}
            {placed.map((item, index) => <span key={item.id} className={`placed-item item-${index + 1}`} title={item.name}>{item.icon}</span>)}
          </div>
        </section>
        <aside className="decor-panel panel">
          <div className="decor-head"><div><p className="eyebrow">DECORATION COLLECTION</p><h2>Choose something magical</h2></div><Palette size={22} /></div>
          <div className="decor-grid">
            {roomDecorations.map((item) => {
              const owned = player.purchased.includes(item.id);
              const isPlaced = player.placed.includes(item.id);
              return (
                <button key={item.id} onClick={() => onDecoration(item.id)} className={isPlaced ? "placed" : ""}>
                  <span className="decor-icon">{item.icon}</span><strong>{item.name}</strong>
                  <small>{isPlaced ? <><Check size={13} /> Placed</> : owned ? "Place item" : <><Coins size={13} /> {item.price}</>}</small>
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
  return (
    <div className="page bus-page">
      <SectionHeading eyebrow="BUS MISSIONS" title="Learning goes places" copy="Board the Starliner for guided missions beyond campus. Each stop hides a curriculum challenge." action={<div className="departure-badge"><Clock3 size={18} /><span><strong>Next departure</strong><small>Ready when you are</small></span></div>} />
      <section className="bus-hero">
        <div className="bus-sky" aria-hidden="true"><span className="bus-moon" /><span className="bus-cloud cloud-one" /><span className="bus-cloud cloud-two" /><span className="bus-road" /><span className="magic-bus"><i className="bus-body"><b /><b /><b /></i><i className="wheel wheel-a" /><i className="wheel wheel-b" /></span></div>
        <div className="bus-hero-copy"><span className="live-chip"><span /> STARLINER 08</span><h2>Where should we explore today?</h2><p>Pack your curiosity. Every route mixes reading, mathematics, science, and real-world thinking.</p></div>
      </section>
      <div className="routes-grid">
        {busRoutes.map((route, index) => {
          const complete = player.completedBus.includes(route.id);
          return (
            <article className={`route-card route-${route.accent}`} key={route.id}>
              <div className="route-number">0{index + 1}</div><div className="route-icon"><BusFront size={24} /></div>
              <p className="eyebrow">{route.location.toUpperCase()}</p><h2>{route.title}</h2><p>{route.description}</p>
              <div className="route-meta"><span><MapPinIcon /> {route.stops} stops</span><span><Star size={14} fill="currentColor" /> +{route.reward}</span></div>
              <button onClick={() => openBus(route.id)}>{complete ? <><RotateCcw size={16} /> Ride again</> : <><BusFront size={16} /> Start mission</>}</button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function RewardsView({ player, go }: { player: PlayerState; go: (route: RouteName) => void }) {
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
      <SectionHeading eyebrow="REWARD HALL" title="Your growth, celebrated" copy="Stars show effort, XP marks your journey, and badges remember the skills and kindness you demonstrated." />
      <section className="reward-hero">
        <div className="reward-crown"><Crown size={42} fill="currentColor" /></div>
        <div><p className="eyebrow">EXPLORER LEVEL {level}</p><h2>{level < 3 ? "Curious Pathfinder" : "Campus Luminary"}</h2><p>{Math.ceil(500 - (player.xp % 500))} XP until your next title</p><span className="xp-track"><i style={{ width: `${levelProgress}%` }} /></span></div>
        <div className="reward-stats"><span><Star size={20} fill="currentColor" /><strong>{player.stars}</strong><small>stars</small></span><span><Coins size={20} /><strong>{player.coins}</strong><small>coins</small></span><span><Flame size={20} fill="currentColor" /><strong>{player.streak}</strong><small>day streak</small></span></div>
      </section>
      <section className="badge-section">
        <div className="section-subhead"><div><p className="eyebrow">BADGE CABINET</p><h2>Moments worth remembering</h2></div><span>{Object.values(unlocked).filter(Boolean).length} of {badges.length} unlocked</span></div>
        <div className="badge-grid">
          {badges.map((badge) => (
            <article className={unlocked[badge.id] ? "unlocked" : "locked"} key={badge.id}>
              <span className="badge-medallion">{unlocked[badge.id] ? badge.icon : <LockKeyhole size={22} />}</span><h3>{badge.name}</h3><p>{badge.description}</p><small>{unlocked[badge.id] ? <><Check size={13} /> Unlocked</> : "Still exploring"}</small>
            </article>
          ))}
        </div>
      </section>
      <section className="reward-cta"><div><Gift size={32} /><span><p className="eyebrow">SPEND YOUR COINS</p><h2>Turn progress into personality</h2><p>Decorate your bedroom and classroom with rewards you earn.</p></span></div><button className="primary-button" onClick={() => go("spaces")}>Visit My Spaces <ArrowRight size={17} /></button></section>
    </div>
  );
}

function ProfileView({ player, update, reset }: { player: PlayerState; update: (patch: Partial<PlayerState>) => void; reset: () => void }) {
  const stats = [
    { label: "Challenges", value: player.completedChallenges, icon: Target },
    { label: "Minigames", value: player.completedGames.length, icon: Gamepad2 },
    { label: "Bus missions", value: player.completedBus.length, icon: BusFront },
    { label: "High-fives", value: player.highFives, icon: Heart },
  ];
  return (
    <div className="page">
      <SectionHeading eyebrow="EXPLORER PROFILE" title="Your School Life" copy="See your journey, change your level, and choose the accessibility settings that help you learn best." />
      <div className="profile-layout">
        <section className="profile-identity panel">
          <div className="profile-glow" /><Avatar index={player.avatar} label={player.name} /><h2>{player.name}</h2><p>{levelLabel(player.level)}</p><span className="profile-title"><Award size={15} /> Curious Pathfinder</span>
          <label htmlFor="profile-level">Learning level</label><select id="profile-level" value={player.level} onChange={(event) => { const nextLevel = event.target.value; update({ level: nextLevel, progress: player.progressByLevel[nextLevel] ?? { math: 0, reading: 0, science: 0 }, progressByLevel: { ...player.progressByLevel, [player.level]: player.progress } }); }}>{levels.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        </section>
        <div className="profile-main">
          <section className="stat-grid">{stats.map(({ label, value, icon: Icon }) => <article key={label}><Icon size={20} /><strong>{value}</strong><span>{label}</span></article>)}</section>
          <section className="settings-panel panel"><div className="settings-head"><div><p className="eyebrow">LEARNING COMFORT</p><h2>Make School Life work for you</h2></div><Accessibility size={25} /></div>
            <div className="setting-list">
              <SettingToggle icon={player.sound ? Volume2 : VolumeX} title="Sound effects" copy="Gentle feedback and celebration sounds" checked={player.sound} onChange={() => update({ sound: !player.sound })} />
              <SettingToggle icon={MoonStar} title="Reduce motion" copy="Use quieter transitions and effects" checked={player.reducedMotion} onChange={() => update({ reducedMotion: !player.reducedMotion })} />
              <SettingToggle icon={Accessibility} title="High contrast" copy="Strengthen borders and color contrast" checked={player.highContrast} onChange={() => update({ highContrast: !player.highContrast })} />
              <SettingToggle icon={BookOpen} title="Larger text" copy="Increase reading size throughout the app" checked={player.largerText} onChange={() => update({ largerText: !player.largerText })} />
            </div>
          </section>
          <button className="reset-button" onClick={reset}><RotateCcw size={16} /> Start over with a new explorer</button>
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
  onClose,
  onComplete,
}: {
  subject: Subject;
  level: string;
  mastery: number;
  sound: boolean;
  onClose: () => void;
  onComplete: (subject: Subject, score: number, total: number) => void;
}) {
  const [bank] = useState(() => adaptiveQuestionSet(level, subject, mastery));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);
  const question = bank[index];
  const label = subjects.find((item) => item.id === subject)!;

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
  if (finished) return <CompletionCard title={`${label.title} spark collected!`} copy={`You answered ${score} of ${bank.length} correctly. Your next lesson will adapt to this result.`} reward={50 + score * 10} icon={label.icon} onClose={onClose} onCollect={() => onComplete(subject, score, bank.length)} />;

  return (
    <DialogFrame onClose={onClose} label={`${label.title} challenge`}>
      <div className={`challenge-head challenge-${label.color}`}><span className="challenge-icon">{label.icon}</span><div><p className="eyebrow">{label.place.toUpperCase()}</p><h2>{label.title} challenge</h2><p>{levelLabel(level)} · Question {index + 1} of {bank.length}</p></div><span className="challenge-stars"><Star size={15} fill="currentColor" /> +{50 + score * 10}</span></div>
      <div className="challenge-progress"><span style={{ width: `${((index + 1) / bank.length) * 100}%` }} /></div>
      <div className="question-area"><p className="question-number">QUESTION {String(index + 1).padStart(2, "0")} · {question.objective}</p><h3>{question.prompt}</h3><div className="answer-grid">{question.answers.map((answer, answerIndex) => {
        let className = "";
        if (selected !== null && answerIndex === question.correct) className = "correct";
        else if (selected === answerIndex) className = "incorrect";
        return <button key={answer} className={className} onClick={() => choose(answerIndex)} disabled={selected !== null}><span>{String.fromCharCode(65 + answerIndex)}</span>{answer}{className === "correct" && <Check size={18} />}{className === "incorrect" && <X size={18} />}</button>;
      })}</div>
      {selected === null ? <div className="question-tools"><button className="hint-button" onClick={() => setShowHint(!showHint)}><Lightbulb size={16} /> {showHint ? question.hint : "Show a hint"}</button><button className="hint-button" onClick={() => readAloud(`${question.prompt}. ${question.answers.join(". ")}`)}><Volume2 size={16} /> Read aloud</button></div> : <div className={`feedback-box ${selected === question.correct ? "success" : "retry"}`} role="status"><span>{selected === question.correct ? <Check size={19} /> : <Lightbulb size={19} />}</span><div><strong>{selected === question.correct ? "Strong thinking!" : "Good try—this is how we learn."}</strong><p>{selected === question.correct ? question.explanation ?? question.hint : question.hint}</p></div><button onClick={next}>{index === bank.length - 1 ? "See results" : "Next"} <ArrowRight size={16} /></button></div>}
      </div>
    </DialogFrame>
  );
}

function BusDialog({ routeId, level, sound, onClose, onComplete }: { routeId: string; level: string; sound: boolean; onClose: () => void; onComplete: (routeId: string, reward: number) => void }) {
  const route = busRoutes.find((item) => item.id === routeId)!;
  const [missionSteps] = useState(() => missionFor(routeId, level));
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
  return <DialogFrame onClose={onClose} label={`${route.title} bus mission`}><div className="mission-head"><div className="mini-bus"><BusFront size={26} /></div><div><p className="eyebrow">STARLINER MISSION · STOP {step + 1}</p><h2>{route.title}</h2><p>{route.location} · {levelLabel(level)}</p></div><span><Star size={15} fill="currentColor" /> +{route.reward}</span></div><div className="mission-route">{missionSteps.map((_, index) => <span className={index < step ? "done" : index === step ? "current" : ""} key={index}>{index < step ? <Check size={14} /> : index + 1}</span>)}</div><div className="question-area"><h3>{question.prompt}</h3><div className="answer-grid">{question.answers.map((answer, index) => <button key={answer} className={selected !== null ? index === question.correct ? "correct" : index === selected ? "incorrect" : "" : ""} onClick={() => choose(index)} disabled={selected !== null}><span>{String.fromCharCode(65 + index)}</span>{answer}</button>)}</div>{selected !== null && <div className={`feedback-box ${success ? "success" : "retry"}`} role="status"><span>{success ? <Check size={19} /> : <Lightbulb size={19} />}</span><div><strong>{success ? "Route cleared!" : "Check the clue and try again."}</strong><p>{success ? question.explanation ?? "The Starliner can continue." : question.hint}</p></div><button onClick={success ? next : () => setSelected(null)}>{success ? step === missionSteps.length - 1 ? "Finish mission" : "Next stop" : "Try again"} <ArrowRight size={15} /></button></div>}</div></DialogFrame>;
}

function CompletionCard({ title, copy, reward, icon, onClose, onCollect }: { title: string; copy: string; reward: number; icon: string; onClose: () => void; onCollect: () => void }) {
  return <DialogFrame onClose={onClose} label="Challenge complete"><div className="completion-card"><div className="completion-rays" aria-hidden="true" /><span className="completion-medal">{icon}</span><p className="eyebrow">CHALLENGE COMPLETE</p><h2>{title}</h2><p>{copy}</p><div className="reward-ticket"><Star size={21} fill="currentColor" /><strong>+{reward} stars</strong><span>and 60 XP</span></div><button className="primary-button" onClick={onCollect}>Collect reward <Gift size={17} /></button></div></DialogFrame>;
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
    document.documentElement.dataset.learningText = experienceFor(player.level).textScale;
  }, [player.highContrast, player.reducedMotion, player.largerText, player.level]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (message: string) => setToast(message);

  const updatePlayer = (patch: Partial<PlayerState>) => setPlayer((current) => ({ ...current, ...patch }));
  const go = (nextRoute: RouteName) => { setRoute(nextRoute); setMobileMenu(false); window.scrollTo({ top: 0, behavior: player.reducedMotion ? "auto" : "smooth" }); };

  const start = (name: string, level: string, avatar: number) => {
    const next = refreshDailyProgress({ ...initialPlayer, name, level, avatar });
    setPlayer(next); setHasProfile(true); showToast(`Welcome to ${experienceFor(level).world}, ${name}!`);
  };

  const completeChallenge = (subject: Subject, score: number, total: number) => {
    const reward = 50 + score * 10;
    playFeedback(player.sound, "reward");
    setPlayer((current) => {
      const learningState = recordLearningDay(current);
      const progress = { ...current.progress, [subject]: calculateMastery(current.progress[subject], score, total) };
      return { ...learningState, stars: current.stars + reward, coins: current.coins + 20, xp: current.xp + 60, completedChallenges: current.completedChallenges + 1, weeklyLessons: current.weeklyLessons + 1, progress, progressByLevel: { ...current.progressByLevel, [current.level]: progress }, subjectWins: { ...current.subjectWins, [subject]: current.subjectWins[subject] + 1 }, attempts: { ...current.attempts, [subject]: current.attempts[subject] + total }, correctAnswers: { ...current.correctAnswers, [subject]: current.correctAnswers[subject] + score } };
    });
    setDialog(null); showToast(`+${reward} stars · ${subjects.find((item) => item.id === subject)?.title} mastery grew!`);
  };

  const completeGame = (gameId: string, reward: number) => {
    setPlayer((current) => ({ ...current, stars: current.stars + reward, coins: current.coins + 10, xp: current.xp + 35, energy: Math.max(0, current.energy - 1), completedGames: current.completedGames.includes(gameId) ? current.completedGames : [...current.completedGames, gameId] }));
    setDialog(null); showToast(`Play reward collected · +${reward} stars`);
  };

  const completeBus = (routeId: string, reward: number) => {
    setPlayer((current) => ({ ...current, stars: current.stars + reward, coins: current.coins + 35, xp: current.xp + 80, completedBus: current.completedBus.includes(routeId) ? current.completedBus : [...current.completedBus, routeId] }));
    setDialog(null); showToast(`Mission complete · +${reward} stars and +35 coins`);
  };

  const highFive = (name: string) => {
    setPlayer((current) => ({ ...current, highFives: current.highFives + 1, stars: current.stars + 5 }));
    showToast(`High-five sent to ${name} · kindness +5`);
  };

  const decoration = (id: string) => {
    const item = decorations.find((entry) => entry.id === id)!;
    const owned = player.purchased.includes(id);
    const placed = player.placed.includes(id);
    if (placed) { updatePlayer({ placed: player.placed.filter((entry) => entry !== id) }); showToast(`${item.name} returned to your collection`); return; }
    if (owned) { updatePlayer({ placed: [...player.placed, id] }); showToast(`${item.name} placed!`); return; }
    if (player.coins < item.price) { showToast(`You need ${item.price - player.coins} more coins`); return; }
    updatePlayer({ coins: player.coins - item.price, purchased: [...player.purchased, id], placed: [...player.placed, id] }); showToast(`${item.name} unlocked and placed!`);
  };

  const reset = () => {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* The in-memory reset still works. */ }
    setPlayer(initialPlayer); setHasProfile(false); setRoute("campus"); showToast("Ready for a new explorer");
  };

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

  if (!hydrated) return <div className="boot-screen"><Brand /><span className="boot-spinner" /><p>Preparing your learning world…</p></div>;
  if (!hasProfile) return <><Onboarding onStart={start} />{toast && <div className="toast" role="status"><Sparkles size={17} />{toast}</div>}</>;

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <aside className={`sidebar ${mobileMenu ? "mobile-open" : ""}`}>
        <button className="sidebar-close" onClick={() => setMobileMenu(false)} aria-label="Close navigation"><X size={20} /></button>
        <button className="brand-button" onClick={() => go("campus")}><Brand /></button>
        <nav aria-label="Main navigation">
          {navigation.map(({ id, label, icon: Icon }) => <button key={id} className={route === id ? "active" : ""} onClick={() => go(id)}><Icon size={19} strokeWidth={2.1} /><span>{label}</span>{route === id && <i />}</button>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="weekly-card"><ProgressRing value={Math.min(100, player.weeklyLessons / 6 * 100)}><strong>{Math.min(player.weeklyLessons, 6)}</strong><small>/ 6</small></ProgressRing><span><strong>Weekly goal</strong><small>{player.weeklyLessons >= 6 ? "Goal complete" : `${6 - player.weeklyLessons} lessons to go`}</small></span></div>
          <button className={`profile-chip ${route === "profile" ? "active" : ""}`} onClick={() => go("profile")}><Avatar index={player.avatar} label={player.name} small /><span><strong>{player.name}</strong><small>{levelLabel(player.level)}</small></span><Settings size={16} /></button>
        </div>
      </aside>
      {mobileMenu && <button className="menu-backdrop" onClick={() => setMobileMenu(false)} aria-label="Close menu" />}
      <div className="app-main">
        <header className="topbar">
          <button className="mobile-menu-button" onClick={() => setMobileMenu(true)} aria-label="Open navigation"><Menu size={21} /></button>
          <button className="mobile-brand-button" onClick={() => go("campus")} aria-label="School Life home"><Brand compact /></button>
          <div className={`school-status ${online ? "" : "offline"}`}><span /><p><strong>{experienceFor(player.level).world}</strong><small>{online ? "School day · All paths open" : "Offline mode · Progress stays here"}</small></p></div>
          <div className="resources" aria-label="Your resources">
            <button onClick={() => go("rewards")} title="Stars"><Star size={18} fill="currentColor" /><strong>{player.stars.toLocaleString()}</strong><small>stars</small></button>
            <button onClick={() => go("spaces")} title="School coins"><Coins size={18} /><strong>{player.coins}</strong><small>coins</small></button>
            <button onClick={() => go("rewards")} title="Learning streak"><Flame size={18} fill="currentColor" /><strong>{player.streak}</strong><small>day streak</small></button>
            <button className="heart-resource" title="Play sparks never block learning"><Heart size={18} fill="currentColor" /><strong>{player.energy}</strong><small>play sparks</small></button>
          </div>
          <button className="top-icon-button" onClick={() => showToast("You’re all caught up!")} aria-label="Notifications"><Bell size={19} /><span /></button>
        </header>
        <main id="main-content">{page}</main>
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {[navigation[0], navigation[1], navigation[3], navigation[4]].map(({ id, label, icon: Icon }) => <button key={id} className={route === id ? "active" : ""} onClick={() => go(id)}><Icon size={20} /><small>{label === "Playground" ? "Play" : label === "My Spaces" ? "Spaces" : label}</small></button>)}
          <button className={route === "profile" ? "active" : ""} onClick={() => go("profile")}><Avatar index={player.avatar} label={player.name} small /><small>Me</small></button>
        </nav>
      </div>
      {dialog?.type === "challenge" && <ChallengeDialog subject={dialog.subject} level={player.level} mastery={player.progress[dialog.subject]} sound={player.sound} onClose={() => setDialog(null)} onComplete={completeChallenge} />}
      {dialog?.type === "game" && <GameDialog gameId={dialog.gameId} level={player.level} sound={player.sound} onClose={() => setDialog(null)} onComplete={completeGame} />}
      {dialog?.type === "bus" && <BusDialog routeId={dialog.routeId} level={player.level} sound={player.sound} onClose={() => setDialog(null)} onComplete={completeBus} />}
      {toast && <div className="toast" role="status"><Sparkles size={17} />{toast}</div>}
    </div>
  );
}
