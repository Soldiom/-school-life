import { questionExtensions } from "./content-packs";
import {
  ageBandFor,
  questions,
  type AgeBand,
  type Question,
  type Subject,
} from "./school-data";

export type AgeExperience = {
  id: AgeBand;
  label: string;
  world: string;
  promise: string;
  sessionMinutes: number;
  textScale: "largest" | "large" | "standard";
};

export const ageExperiences: Record<AgeBand, AgeExperience> = {
  early: {
    id: "early",
    label: "Early Explorers",
    world: "Wonder Garden",
    promise: "Touch, listen, count and discover through short visual adventures.",
    sessionMinutes: 8,
    textScale: "largest",
  },
  primary: {
    id: "primary",
    label: "Primary Pathfinders",
    world: "Enchanted Campus",
    promise: "Build strong foundations through stories, challenges and purposeful play.",
    sessionMinutes: 15,
    textScale: "large",
  },
  middle: {
    id: "middle",
    label: "Middle School Makers",
    world: "Discovery District",
    promise: "Connect ideas, investigate evidence and solve collaborative missions.",
    sessionMinutes: 20,
    textScale: "standard",
  },
  secondary: {
    id: "secondary",
    label: "Future Academy",
    world: "Future Academy",
    promise: "Master demanding concepts through projects, analysis and real-world decisions.",
    sessionMinutes: 25,
    textScale: "standard",
  },
  university: {
    id: "university",
    label: "University Commons",
    world: "University Commons",
    promise: "Develop research, quantitative reasoning and professional judgement.",
    sessionMinutes: 30,
    textScale: "standard",
  },
};

export function experienceFor(level: string) {
  return ageExperiences[ageBandFor(level)];
}

function stableHash(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

function normalizeQuestion(question: Question, index: number, band: AgeBand, subject: Subject): Question {
  return {
    ...question,
    id: question.id ?? `${band}-${subject}-core-${index + 1}`,
    objective: question.objective ?? `Practice ${subject} reasoning for the ${band} learning band.`,
    difficulty: question.difficulty ?? ((index % 3) + 1) as 1 | 2 | 3,
    explanation: question.explanation ?? question.hint,
  };
}

export function fullQuestionBank(level: string, subject: Subject) {
  const band = ageBandFor(level);
  return [...questions[band][subject], ...questionExtensions[band][subject]]
    .map((question, index) => normalizeQuestion(question, index, band, subject));
}

export function adaptiveQuestionSet(level: string, subject: Subject, mastery: number, count = 5) {
  const bank = fullQuestionBank(level, subject);
  const targetDifficulty = mastery < 40 ? 1 : mastery < 75 ? 2 : 3;
  const ordered = [...bank].sort((left, right) => {
    const leftDistance = Math.abs((left.difficulty ?? 2) - targetDifficulty);
    const rightDistance = Math.abs((right.difficulty ?? 2) - targetDifficulty);
    if (leftDistance !== rightDistance) return leftDistance - rightDistance;
    return stableHash(`${level}-${subject}-${left.id}`) - stableHash(`${level}-${subject}-${right.id}`);
  });
  return ordered.slice(0, Math.min(count, ordered.length));
}

export function calculateMastery(current: number, score: number, total: number) {
  if (total <= 0) return current;
  const observedAccuracy = score / total * 100;
  const estimate = current * 0.68 + observedAccuracy * 0.32;
  return Math.max(0, Math.min(100, Math.round(estimate)));
}

export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function startOfWeekKey(date = new Date()) {
  const start = new Date(date);
  const weekday = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - weekday);
  return localDateKey(start);
}

export function dayDistance(from: string, to: string) {
  const fromDate = new Date(`${from}T12:00:00`);
  const toDate = new Date(`${to}T12:00:00`);
  return Math.round((toDate.getTime() - fromDate.getTime()) / 86_400_000);
}

export function refreshDailyProgress<T extends {
  lastActiveDate: string;
  energy: number;
  weekKey: string;
  weeklyLessons: number;
}>(state: T, now = new Date()): T {
  const today = localDateKey(now);
  const currentWeek = startOfWeekKey(now);
  const distance = state.lastActiveDate ? dayDistance(state.lastActiveDate, today) : 0;

  return {
    ...state,
    lastActiveDate: today,
    energy: distance === 0 ? state.energy : 5,
    weekKey: currentWeek,
    weeklyLessons: state.weekKey === currentWeek ? state.weeklyLessons : 0,
  };
}

export function recordLearningDay<T extends {
  lastLearningDate: string;
  streak: number;
}>(state: T, now = new Date()): T {
  const today = localDateKey(now);
  if (state.lastLearningDate === today) return state;
  const distance = state.lastLearningDate ? dayDistance(state.lastLearningDate, today) : 0;
  return {
    ...state,
    lastLearningDate: today,
    streak: distance === 1 ? state.streak + 1 : 1,
  };
}

export function playFeedback(enabled: boolean, tone: "success" | "retry" | "reward") {
  if (!enabled || typeof window === "undefined") return;
  const AudioContextClass = window.AudioContext
    ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;

  try {
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const frequencies = tone === "success" ? [523, 659] : tone === "reward" ? [659, 784] : [220, 196];
    oscillator.type = tone === "retry" ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(frequencies[0], context.currentTime);
    oscillator.frequency.linearRampToValueAtTime(frequencies[1], context.currentTime + 0.16);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.24);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.25);
    oscillator.addEventListener("ended", () => void context.close());
  } catch {
    // Audio feedback is optional and never blocks learning.
  }
}

export function readAloud(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.88;
  window.speechSynthesis.speak(utterance);
  return true;
}
