import { describe, expect, it } from "vitest";
import { arabicMissionQuestionCount, missionFor, missionQuestionCount } from "../src/bus-missions";
import {
  adaptiveQuestionSet,
  calculateMastery,
  experienceFor,
  fullQuestionBank,
  localDateKey,
  recordLearningDay,
  refreshDailyProgress,
  startOfWeekKey,
} from "../src/learning-engine";
import { levels, type Subject } from "../src/school-data";

const subjects: Subject[] = ["math", "reading", "science"];

describe("curriculum content", () => {
  it("serves every published level with a distinct age experience", () => {
    expect(levels).toHaveLength(15);
    for (const [level] of levels) {
      const experience = experienceFor(level);
      expect(experience.world.length).toBeGreaterThan(3);
      expect(experience.sessionMinutes).toBeGreaterThanOrEqual(8);
    }
  });

  it("ships a valid 78-question adaptive curriculum", () => {
    const allQuestions = levels
      .filter(([, , band], index, list) => list.findIndex((item) => item[2] === band) === index)
      .flatMap(([level]) => subjects.flatMap((subject) => fullQuestionBank(level, subject)));

    expect(allQuestions).toHaveLength(78);
    expect(new Set(allQuestions.map((question) => question.id)).size).toBe(78);

    for (const question of allQuestions) {
      expect(question.answers.length).toBeGreaterThanOrEqual(3);
      expect(question.correct).toBeGreaterThanOrEqual(0);
      expect(question.correct).toBeLessThan(question.answers.length);
      expect(new Set(question.answers).size).toBe(question.answers.length);
      expect(question.hint.length).toBeGreaterThan(8);
      expect(question.explanation?.length).toBeGreaterThan(8);
      expect(question.objective?.length).toBeGreaterThan(8);
      expect(question.difficulty).toBeGreaterThanOrEqual(1);
      expect(question.difficulty).toBeLessThanOrEqual(3);
    }
  });

  it("ships a complete, native Arabic curriculum for every learning band", () => {
    const allQuestions = levels
      .filter(([, , band], index, list) => list.findIndex((item) => item[2] === band) === index)
      .flatMap(([level]) => subjects.flatMap((subject) => fullQuestionBank(level, subject, "ar")));

    expect(allQuestions).toHaveLength(78);
    expect(new Set(allQuestions.map((question) => question.id)).size).toBe(78);

    for (const question of allQuestions) {
      expect(question.id).toMatch(/^ar-/);
      expect(question.prompt).toMatch(/[\u0600-\u06ff]/);
      expect(question.hint).toMatch(/[\u0600-\u06ff]/);
      expect(question.explanation).toMatch(/[\u0600-\u06ff]/);
      expect(question.objective).toMatch(/[\u0600-\u06ff]/);
      expect(question.answers.length).toBeGreaterThanOrEqual(3);
      expect(question.correct).toBeGreaterThanOrEqual(0);
      expect(question.correct).toBeLessThan(question.answers.length);
      expect(new Set(question.answers).size).toBe(question.answers.length);
    }

    expect(experienceFor("preschool", "ar").world).toBe("حديقة الدهشة");
    expect(adaptiveQuestionSet("grade5", "reading", 50, 5, "ar")).toHaveLength(5);
  });

  it("moves challenge selection toward the learner's current mastery", () => {
    const foundation = adaptiveQuestionSet("grade5", "math", 10, 3);
    const extension = adaptiveQuestionSet("grade5", "math", 95, 3);
    const average = (items: typeof foundation) =>
      items.reduce((total, item) => total + (item.difficulty ?? 2), 0) / items.length;

    expect(average(foundation)).toBeLessThanOrEqual(average(extension));
  });

  it("updates mastery from observed performance without exceeding its bounds", () => {
    expect(calculateMastery(50, 5, 5)).toBe(66);
    expect(calculateMastery(50, 0, 5)).toBe(34);
    expect(calculateMastery(100, 5, 5)).toBe(100);
  });
});

describe("progress calendar", () => {
  const baseState = {
    lastActiveDate: "2026-01-11",
    streak: 4,
    energy: 0,
    weekKey: "2026-01-05",
    weeklyLessons: 5,
  };

  it("refills optional play sparks without awarding a streak for opening the app", () => {
    const now = new Date(2026, 0, 12, 12);
    expect(refreshDailyProgress(baseState, now)).toMatchObject({
      lastActiveDate: localDateKey(now),
      streak: 4,
      energy: 5,
    });
  });

  it("resets a missed streak and a new week's lesson goal", () => {
    const now = new Date(2026, 0, 19, 12);
    expect(refreshDailyProgress(baseState, now)).toMatchObject({
      streak: 4,
      weekKey: startOfWeekKey(now),
      weeklyLessons: 0,
    });
  });

  it("awards streak days only when a lesson is completed", () => {
    const now = new Date(2026, 0, 12, 12);
    expect(recordLearningDay({ lastLearningDate: "2026-01-11", streak: 4 }, now)).toEqual({
      lastLearningDate: "2026-01-12",
      streak: 5,
    });
    expect(recordLearningDay({ lastLearningDate: "2026-01-12", streak: 5 }, now).streak).toBe(5);
  });
});

describe("bus missions", () => {
  it("provides route-specific missions at every age", () => {
    expect(missionQuestionCount).toBe(36);
    expect(missionFor("museum", "preschool")).toHaveLength(3);
    expect(missionFor("eco", "grade5")).toHaveLength(4);
    expect(missionFor("space", "university")).toHaveLength(5);

    const museum = missionFor("museum", "grade5").map((question) => question.prompt);
    const forest = missionFor("eco", "grade5").map((question) => question.prompt);
    expect(museum).not.toEqual(forest);
  });

  it("provides a complete Arabic mission set", () => {
    expect(arabicMissionQuestionCount).toBe(36);
    expect(missionFor("museum", "preschool", "ar")).toHaveLength(3);
    expect(missionFor("eco", "grade5", "ar")).toHaveLength(4);
    expect(missionFor("space", "university", "ar")).toHaveLength(5);
    expect(missionFor("museum", "grade5", "ar")[0].prompt).toMatch(/[\u0600-\u06ff]/);
  });
});
