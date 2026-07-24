import {
  BookOpen,
  BusFront,
  FlaskConical,
  Gamepad2,
  Home,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

export type RouteName =
  | "campus"
  | "classes"
  | "friends"
  | "playground"
  | "spaces"
  | "bus"
  | "rewards"
  | "profile";

export type Subject = "math" | "reading" | "science";
export type AgeBand = "early" | "primary" | "middle" | "secondary" | "university";

export const navigation = [
  { id: "campus" as RouteName, label: "Campus", icon: Home },
  { id: "classes" as RouteName, label: "Classes", icon: BookOpen },
  { id: "friends" as RouteName, label: "Friends", icon: Users },
  { id: "playground" as RouteName, label: "Playground", icon: Gamepad2 },
  { id: "spaces" as RouteName, label: "My Spaces", icon: Sparkles },
  { id: "bus" as RouteName, label: "Bus Missions", icon: BusFront },
  { id: "rewards" as RouteName, label: "Rewards", icon: Trophy },
];

export const levels = [
  ["preschool", "Preschool · Ages 3–4", "early"],
  ["kg", "Kindergarten · Ages 4–6", "early"],
  ["grade1", "Grade 1", "primary"],
  ["grade2", "Grade 2", "primary"],
  ["grade3", "Grade 3", "primary"],
  ["grade4", "Grade 4", "primary"],
  ["grade5", "Grade 5", "primary"],
  ["grade6", "Grade 6", "middle"],
  ["grade7", "Grade 7", "middle"],
  ["grade8", "Grade 8", "middle"],
  ["grade9", "Grade 9", "secondary"],
  ["grade10", "Grade 10", "secondary"],
  ["grade11", "Grade 11", "secondary"],
  ["grade12", "Grade 12", "secondary"],
  ["university", "University", "university"],
] as const;

export function levelLabel(id: string) {
  return levels.find(([value]) => value === id)?.[1] ?? "Grade 5";
}

export function ageBandFor(id: string): AgeBand {
  return (levels.find(([value]) => value === id)?.[2] ?? "primary") as AgeBand;
}

export type Question = {
  id?: string;
  prompt: string;
  answers: string[];
  correct: number;
  hint: string;
  explanation?: string;
  objective?: string;
  difficulty?: 1 | 2 | 3;
};

type QuestionBank = Record<AgeBand, Record<Subject, Question[]>>;

export const questions: QuestionBank = {
  early: {
    math: [
      { prompt: "Which group has three stars?", answers: ["★ ★", "★ ★ ★", "★ ★ ★ ★"], correct: 1, hint: "Touch each star as you count: one, two, three." },
      { prompt: "What comes after 4?", answers: ["3", "5", "7"], correct: 1, hint: "Count forward: 3, 4, ..." },
    ],
    reading: [
      { prompt: "Which word begins with the /b/ sound?", answers: ["Ball", "Sun", "Cat"], correct: 0, hint: "Say each word slowly and listen to its first sound." },
      { prompt: "Choose the letter A.", answers: ["M", "A", "T"], correct: 1, hint: "A has a pointed top and a line across." },
    ],
    science: [
      { prompt: "Which one is a living thing?", answers: ["Tree", "Rock", "Spoon"], correct: 0, hint: "Living things grow and need water or food." },
      { prompt: "What helps us see during the day?", answers: ["The moon", "The sun", "A pillow"], correct: 1, hint: "It is bright, warm, and high in the sky." },
    ],
  },
  primary: {
    math: [
      { prompt: "A library has 8 shelves with 7 books on each. How many books?", answers: ["48", "56", "64", "72"], correct: 1, hint: "Multiply 8 × 7." },
      { prompt: "Which fraction is equivalent to one half?", answers: ["2/3", "3/6", "4/10", "5/12"], correct: 1, hint: "The numerator should be half the denominator." },
      { prompt: "What is 125 + 378?", answers: ["493", "503", "513", "523"], correct: 1, hint: "Add ones, then tens, then hundreds." },
    ],
    reading: [
      { prompt: "Mina packed an umbrella because dark clouds gathered. What can we infer?", answers: ["It may rain", "It is very hot", "She lost her bag", "School is closed"], correct: 0, hint: "Connect the dark clouds with the object Mina chose." },
      { prompt: "Which word is closest in meaning to ‘enormous’?", answers: ["Tiny", "Silent", "Huge", "Quick"], correct: 2, hint: "Imagine something much bigger than usual." },
      { prompt: "Which sentence uses a simile?", answers: ["The bell rang.", "Her smile was like sunshine.", "We walked home.", "Books teach us."], correct: 1, hint: "A simile compares using ‘like’ or ‘as’." },
    ],
    science: [
      { prompt: "Which change can be reversed?", answers: ["Burning paper", "Melting ice", "Baking bread", "Rusting iron"], correct: 1, hint: "Think about what happens when it becomes cold again." },
      { prompt: "Plants mainly absorb water through their…", answers: ["Flowers", "Leaves", "Roots", "Fruit"], correct: 2, hint: "This part grows down into the soil." },
      { prompt: "Earth completes one orbit around the Sun in about…", answers: ["24 hours", "7 days", "1 month", "1 year"], correct: 3, hint: "One orbit defines a familiar calendar period." },
    ],
  },
  middle: {
    math: [
      { prompt: "Solve: 3x + 7 = 25", answers: ["x = 4", "x = 6", "x = 8", "x = 10"], correct: 1, hint: "Subtract 7, then divide by 3." },
      { prompt: "A triangle has angles 48° and 67°. Find the third angle.", answers: ["55°", "65°", "75°", "85°"], correct: 1, hint: "Angles in a triangle total 180°." },
    ],
    reading: [
      { prompt: "What is the main purpose of a counterargument in an essay?", answers: ["Change the topic", "Address another viewpoint", "Repeat the title", "Add a quotation only"], correct: 1, hint: "Strong arguments recognize and respond to different views." },
      { prompt: "‘The city never sleeps’ is an example of…", answers: ["Personification", "Alliteration", "Onomatopoeia", "Irony"], correct: 0, hint: "A human action is given to a place." },
    ],
    science: [
      { prompt: "Which organelle releases usable energy from food?", answers: ["Nucleus", "Mitochondrion", "Ribosome", "Vacuole"], correct: 1, hint: "It is sometimes called the powerhouse of the cell." },
      { prompt: "If force stays constant and mass doubles, acceleration…", answers: ["Doubles", "Halves", "Stays equal", "Becomes zero"], correct: 1, hint: "Use a = F ÷ m." },
    ],
  },
  secondary: {
    math: [
      { prompt: "For f(x) = 2x² − 3x + 1, what is f(2)?", answers: ["2", "3", "5", "7"], correct: 1, hint: "Substitute 2 for every x and simplify." },
      { prompt: "What is the gradient of the line through (1, 3) and (5, 11)?", answers: ["1", "2", "3", "4"], correct: 1, hint: "Use change in y divided by change in x." },
    ],
    reading: [
      { prompt: "A narrator whose account may be biased or incomplete is called…", answers: ["Omniscient", "Unreliable", "Objective", "Second-person"], correct: 1, hint: "The reader cannot fully trust this narrator’s version." },
      { prompt: "Which evidence best supports an analytical claim?", answers: ["A vague opinion", "A relevant quotation explained in context", "A repeated claim", "An unrelated statistic"], correct: 1, hint: "Evidence needs both relevance and interpretation." },
    ],
    science: [
      { prompt: "Increasing temperature usually speeds a reaction because particles…", answers: ["Become heavier", "Collide more often and energetically", "Stop moving", "Lose all energy"], correct: 1, hint: "Think about kinetic energy and successful collisions." },
      { prompt: "Which process produces genetically varied gametes?", answers: ["Mitosis", "Meiosis", "Binary fission", "Cloning"], correct: 1, hint: "Crossing over occurs during this type of division." },
    ],
  },
  university: {
    math: [
      { prompt: "What is the derivative of x³eˣ?", answers: ["3x²eˣ", "x³eˣ", "eˣ(x³ + 3x²)", "eˣ(x² + 3x)"], correct: 2, hint: "Apply the product rule." },
      { prompt: "A p-value below the chosen α most directly suggests…", answers: ["The null is proven false", "Rejecting the null under that threshold", "The effect is large", "The study is unbiased"], correct: 1, hint: "It is a decision rule, not proof or effect size." },
    ],
    reading: [
      { prompt: "Which source feature most strengthens an academic claim?", answers: ["Confident wording", "Transparent methods and replicable evidence", "A long title", "Many images"], correct: 1, hint: "Consider how another scholar could evaluate the work." },
      { prompt: "A literature review should primarily…", answers: ["List sources independently", "Synthesize patterns, gaps, and debates", "Avoid critique", "Report new participant data"], correct: 1, hint: "Go beyond summary to show relationships between studies." },
    ],
    science: [
      { prompt: "In a controlled experiment, random assignment mainly reduces…", answers: ["Measurement units", "Selection bias and confounding", "Sample size", "External validity"], correct: 1, hint: "It balances known and unknown participant differences." },
      { prompt: "Peer review is best described as…", answers: ["A guarantee of truth", "Expert scrutiny before or after publication", "A popularity vote", "Automated plagiarism checking"], correct: 1, hint: "It is quality control, but not an absolute guarantee." },
    ],
  },
};

export const subjects = [
  {
    id: "math" as Subject,
    title: "Mathematics",
    place: "Math Observatory",
    description: "Build number sense, logic, algebra, and problem-solving.",
    icon: "∑",
    color: "violet",
  },
  {
    id: "reading" as Subject,
    title: "Reading",
    place: "Reading Garden",
    description: "Grow vocabulary, comprehension, writing, and research.",
    icon: "Aa",
    color: "mint",
  },
  {
    id: "science" as Subject,
    title: "Science",
    place: "Science Dome",
    description: "Question, investigate, experiment, and discover.",
    icon: "⚗",
    color: "blue",
  },
];

export const classmates = [
  { name: "Ava", avatar: "A", color: "coral", activity: "is exploring the Reading Garden", online: true, strength: "Story seeker" },
  { name: "Leo", avatar: "L", color: "blue", activity: "solved 5 mathematics puzzles", online: true, strength: "Number navigator" },
  { name: "Zara", avatar: "Z", color: "gold", activity: "earned a Curious Scientist badge", online: false, strength: "Experiment expert" },
  { name: "Noah", avatar: "N", color: "mint", activity: "designed a new classroom", online: true, strength: "Creative builder" },
  { name: "Maya", avatar: "M", color: "violet", activity: "finished today’s bus mission", online: false, strength: "Kind teammate" },
];

export const games = [
  { id: "memory", title: "Memory Meadow", eyebrow: "FOCUS", description: "Match magical school treasures before time runs out.", icon: "✦", color: "violet", reward: 35 },
  { id: "numbers", title: "Number Sprint", eyebrow: "MATHEMATICS", description: "Race the cloud trail by solving quick number puzzles.", icon: "×", color: "blue", reward: 40 },
  { id: "words", title: "Word Wizard", eyebrow: "READING", description: "Repair enchanted words and unlock the library gate.", icon: "Aa", color: "mint", reward: 40 },
  { id: "patterns", title: "Pattern Flight", eyebrow: "LOGIC", description: "Choose what comes next to guide your balloon home.", icon: "◇", color: "gold", reward: 30 },
  { id: "story", title: "Story Quest", eyebrow: "IMAGINATION", description: "Make choices, read clues, and shape a tiny adventure.", icon: "❦", color: "coral", reward: 45 },
  { id: "science", title: "Science Hunt", eyebrow: "DISCOVERY", description: "Find the best evidence for curious campus mysteries.", icon: "⚗", color: "teal", reward: 45 },
];

export const decorations = [
  { id: "moon-lamp", name: "Moonlight Lamp", price: 80, room: "bedroom", icon: "☾" },
  { id: "star-rug", name: "Starlight Rug", price: 110, room: "bedroom", icon: "✦" },
  { id: "book-nook", name: "Cozy Book Nook", price: 140, room: "bedroom", icon: "▤" },
  { id: "plant", name: "Curious Plant", price: 65, room: "bedroom", icon: "♧" },
  { id: "solar-model", name: "Solar System", price: 150, room: "classroom", icon: "◎" },
  { id: "idea-board", name: "Idea Board", price: 95, room: "classroom", icon: "□" },
  { id: "class-pet", name: "Classroom Owl", price: 125, room: "classroom", icon: "◉" },
  { id: "lab-corner", name: "Mini Lab", price: 170, room: "classroom", icon: "⚗" },
];

export const busRoutes = [
  { id: "museum", title: "Museum of Time", location: "Old Clock District", description: "Solve history and sequencing clues across three stops.", stops: 3, reward: 90, accent: "gold" },
  { id: "eco", title: "Eco Forest Rescue", location: "Emerald Valley", description: "Use science evidence to restore a magical woodland.", stops: 4, reward: 110, accent: "mint" },
  { id: "space", title: "Mission: Moon Library", location: "Skyway Terminal", description: "Read coordinates and guide the book bus through space.", stops: 5, reward: 140, accent: "violet" },
];

export const badges = [
  { id: "first-step", name: "First Step", description: "Complete your first challenge", icon: "✦", target: 1 },
  { id: "math-mind", name: "Math Mind", description: "Answer 5 mathematics questions", icon: "∑", target: 5 },
  { id: "book-bloom", name: "Book Bloom", description: "Complete a reading challenge", icon: "❦", target: 1 },
  { id: "lab-light", name: "Lab Light", description: "Complete a science challenge", icon: "⚗", target: 1 },
  { id: "kind-friend", name: "Kind Friend", description: "Send three high-fives", icon: "♡", target: 3 },
  { id: "road-scholar", name: "Road Scholar", description: "Complete a bus mission", icon: "◆", target: 1 },
];

export const campusHotspots = [
  { id: "math", label: "Math Observatory", short: "Math", route: "classes" as RouteName, x: 24, y: 33 },
  { id: "reading", label: "Reading Garden", short: "Reading", route: "classes" as RouteName, x: 51, y: 26 },
  { id: "science", label: "Science Dome", short: "Science", route: "classes" as RouteName, x: 76, y: 40 },
  { id: "art", label: "Art Studio", short: "Create", route: "spaces" as RouteName, x: 25, y: 70 },
  { id: "play", label: "Playground", short: "Play", route: "playground" as RouteName, x: 52, y: 67 },
  { id: "station", label: "Bus Station", short: "Missions", route: "bus" as RouteName, x: 78, y: 75 },
];

export const subjectIcons = {
  math: Sparkles,
  reading: BookOpen,
  science: FlaskConical,
};
