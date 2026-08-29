export type ApiActivity = {
  id: string;
  title: string;
  category: string;
  icon: string;
  detail: string;
  difficulty: string;
  time: string;
  type: 'memory_match' | 'sequence_recall' | 'word_recall' | 'object_recognition' | 'daily_orientation' | 'card_flip_memory' | 'light_math';
  gameData: any;
  active: boolean;
  completed: boolean;
};

export type ApiReminder = {
  id: string;
  title: string;
  time: string;
  icon: string;
  done: boolean;
  kind?: string;
};

export type ApiMemory = {
  id: number;
  title: string;
  description: string;
  image: string;
  person: string;
  createdAt: string;
};

export type ApiPatient = {
  id: string;
  name: string;
  age: number;
  city: string;
  caregiver: string;
  phone: string;
};

export type ApiMood = {
  id: number;
  mood: string;
  timestamp: string;
};

export type ApiAttempt = {
  id: number;
  activityId: string;
  score: number;
  completedAt: string;
};

export type ApiDashboard = {
  patient: ApiPatient;
  today: { completed: number; total: number; progress: number; averageScore: number };
  streak: { current: number; best: number };
  mood?: { mood: string; timestamp: string };
  weeklyEngagement: { day: string; score: number }[];
};

const DEFAULT_PATIENT: ApiPatient = {
  id: "demo",
  name: "Asha Patil",
  age: 68,
  city: "Pune, Maharashtra",
  caregiver: "Meera Patil (Daughter)",
  phone: "+91 98230 12345",
};

const DEFAULT_ACTIVITIES: ApiActivity[] = [
  {
    id: "memory-diwali",
    title: "Diwali Memory Match",
    category: "Memory",
    icon: "🪔",
    detail: "Match familiar festival objects",
    difficulty: "Easy",
    time: "09:15",
    type: "memory_match",
    gameData: { pairs: ["🪔 Diya", "🥭 Mango", "🧺 Basket"] },
    active: true,
    completed: true,
  },
  {
    id: "memory-kitchen",
    title: "Kitchen Memory Match",
    category: "Memory",
    icon: "🍲",
    detail: "Match things from the kitchen",
    difficulty: "Easy",
    time: "10:00",
    type: "memory_match",
    gameData: { pairs: ["🍵 Chai", "🥣 Bowl", "🥭 Mango"] },
    active: true,
    completed: false,
  },
  {
    id: "words-market",
    title: "Market Words",
    category: "Recall",
    icon: "🛒",
    detail: "Remember a short Pune market list",
    difficulty: "Gentle",
    time: "10:30",
    type: "word_recall",
    gameData: {
      words: ["Rice", "Mango", "Chai", "Flowers"],
      decoys: ["Train", "Umbrella", "Cricket", "Book", "Banana"],
    },
    active: true,
    completed: true,
  },
  {
    id: "objects-pune",
    title: "Pune Places",
    category: "Recognition",
    icon: "📍",
    detail: "Recognise familiar places and objects",
    difficulty: "Gentle",
    time: "14:00",
    type: "object_recognition",
    gameData: {
      objects: [
        { label: "Shaniwar Wada", icon: "🏛️", options: ["🏛️ Shaniwar Wada", "🏖️ Beach", "🏥 Hospital"] },
        { label: "Auto rickshaw", icon: "🛺", options: ["🚂 Train", "🛺 Auto rickshaw", "🚲 Bicycle"] },
        { label: "Tulsi plant", icon: "🌿", options: ["🌿 Tulsi plant", "🎈 Balloon", "📺 Television"] },
      ],
    },
    active: true,
    completed: false,
  },
  {
    id: "sequence-chai",
    title: "Chai Time",
    category: "Sequence",
    icon: "☕",
    detail: "Remember the steps for morning chai",
    difficulty: "Easy",
    time: "16:00",
    type: "sequence_recall",
    gameData: {
      rounds: [
        ["💧 Water", "🔥 Heat"],
        ["💧 Water", "🔥 Heat", "🍵 Tea"],
        ["💧 Water", "🔥 Heat", "🍵 Tea", "🥛 Milk"],
      ],
    },
    active: true,
    completed: false,
  },
  {
    id: "orientation-morning",
    title: "Morning Welcome",
    category: "Daily Orientation",
    icon: "🌞",
    detail: "Think about the beginning of your day",
    difficulty: "Easy",
    time: "09:00",
    type: "daily_orientation",
    gameData: {
      questions: [
        { question: "What meal do we usually eat in the morning?", options: ["Breakfast", "Dinner", "Supper"], answer: "Breakfast" },
        { question: "Which drink is often enjoyed with breakfast?", options: ["Chai", "Lassi", "Soup"], answer: "Chai" },
        { question: "What do we say to greet someone in the morning?", options: ["Good morning", "Good night", "Goodbye"], answer: "Good morning" },
      ],
    },
    active: true,
    completed: true,
  },
  {
    id: "card-flip-festival",
    title: "Festival Card Flip",
    category: "Memory",
    icon: "🪔",
    detail: "Find matching festival cards",
    difficulty: "Challenge",
    time: "16:30",
    type: "card_flip_memory",
    gameData: { pairs: ["🪔 Diya", "🍡 Modak", "🪁 Kite", "🌼 Marigold", "🍵 Chai"] },
    active: true,
    completed: false,
  },
  {
    id: "light-math-market",
    title: "Market Math",
    category: "Attention",
    icon: "🧮",
    detail: "Solve gentle everyday number questions",
    difficulty: "Challenge",
    time: "17:00",
    type: "light_math",
    gameData: {
      questions: [
        { prompt: "12 + 5", answer: 17, options: [15, 17, 19] },
        { prompt: "20 − 6", answer: 14, options: [12, 14, 16] },
        { prompt: "8 + 9", answer: 17, options: [16, 17, 18] },
        { prompt: "25 − 10", answer: 15, options: [10, 15, 20] },
      ],
    },
    active: true,
    completed: false,
  },
];

const DEFAULT_REMINDERS: ApiReminder[] = [
  { id: "water", title: "Drink some water", time: "10:00 AM", icon: "💧", done: false, kind: "Daily care" },
  { id: "medicine-noon", title: "Take afternoon vitamins", time: "01:30 PM", icon: "💊", done: true, kind: "Health" },
  { id: "meera-call", title: "Call Meera", time: "06:00 PM", icon: "📞", done: false, kind: "Family call" },
  { id: "walk", title: "Evening garden walk", time: "07:00 PM", icon: "🌿", done: false, kind: "Wellness" },
  { id: "medicine", title: "Evening medicine", time: "08:00 PM", icon: "💊", done: false, kind: "Health" },
];

const DEFAULT_MEMORIES: ApiMemory[] = [
  {
    id: 1,
    title: "Diwali at home",
    description: "The warm glow of diyas and laughing with Meera making modaks.",
    image: "🪔",
    person: "Family & Meera",
    createdAt: "2026-08-20T10:00:00.000Z",
  },
  {
    id: 2,
    title: "A day in Pune",
    description: "A peaceful afternoon sipping fragrant ginger chai in the backyard garden.",
    image: "🌿",
    person: "Asha",
    createdAt: "2026-08-18T10:00:00.000Z",
  },
  {
    id: 3,
    title: "Family celebration",
    description: "Grand family dinner celebrating Meera's achievement, everyone smiles together.",
    image: "👨‍👩‍👧",
    person: "Meera & Family",
    createdAt: "2026-08-15T10:00:00.000Z",
  },
  {
    id: 4,
    title: "Morning temple visit",
    description: "Listening to early morning bells and fresh jasmine garlands.",
    image: "🌼",
    person: "Aaji & Asha",
    createdAt: "2026-08-10T09:30:00.000Z",
  },
];

const DEFAULT_MOODS: ApiMood[] = [
  { id: 1, mood: "Happy", timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 2, mood: "Okay", timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 3, mood: "Happy", timestamp: new Date().toISOString() },
];

const DEFAULT_ATTEMPTS: ApiAttempt[] = [
  { id: 1, activityId: "orientation-morning", score: 100, completedAt: new Date().toISOString() },
  { id: 2, activityId: "memory-diwali", score: 92, completedAt: new Date().toISOString() },
  { id: 3, activityId: "words-market", score: 85, completedAt: new Date().toISOString() },
];

// In-Memory & LocalStorage Store
class LocalStore {
  private patient: ApiPatient;
  private activities: ApiActivity[];
  private reminders: ApiReminder[];
  private memories: ApiMemory[];
  private moods: ApiMood[];
  private attempts: ApiAttempt[];

  constructor() {
    const p = localStorage.getItem("ss_patient");
    this.patient = p ? JSON.parse(p) : DEFAULT_PATIENT;

    const a = localStorage.getItem("ss_activities");
    this.activities = a ? JSON.parse(a) : DEFAULT_ACTIVITIES;

    const r = localStorage.getItem("ss_reminders");
    this.reminders = r ? JSON.parse(r) : DEFAULT_REMINDERS;

    const m = localStorage.getItem("ss_memories");
    this.memories = m ? JSON.parse(m) : DEFAULT_MEMORIES;

    const mo = localStorage.getItem("ss_moods");
    this.moods = mo ? JSON.parse(mo) : DEFAULT_MOODS;

    const at = localStorage.getItem("ss_attempts");
    this.attempts = at ? JSON.parse(at) : DEFAULT_ATTEMPTS;
  }

  private save() {
    localStorage.setItem("ss_patient", JSON.stringify(this.patient));
    localStorage.setItem("ss_activities", JSON.stringify(this.activities));
    localStorage.setItem("ss_reminders", JSON.stringify(this.reminders));
    localStorage.setItem("ss_memories", JSON.stringify(this.memories));
    localStorage.setItem("ss_moods", JSON.stringify(this.moods));
    localStorage.setItem("ss_attempts", JSON.stringify(this.attempts));
  }

  getPatient() {
    return { ...this.patient };
  }

  updatePatient(updates: Partial<ApiPatient>) {
    this.patient = { ...this.patient, ...updates };
    this.save();
    return this.patient;
  }

  getActivities(todayOnly = false) {
    const active = this.activities.filter(item => (todayOnly ? item.active : true));
    return active;
  }

  createActivity(activity: Partial<ApiActivity>) {
    const newActivity: ApiActivity = {
      id: `act-${Date.now()}`,
      title: activity.title || "New Activity",
      category: activity.category || "Memory",
      icon: activity.icon || "🧠",
      detail: activity.detail || "Gentle engagement exercise",
      difficulty: activity.difficulty || "Gentle",
      time: activity.time || "12:00",
      type: activity.type || "daily_orientation",
      gameData: activity.gameData || {
        questions: [
          { question: "How are you feeling today?", options: ["Wonderful", "Peaceful", "Relaxed"], answer: "Wonderful" },
        ],
      },
      active: true,
      completed: false,
    };
    this.activities = [newActivity, ...this.activities];
    this.save();
    return newActivity;
  }

  updateActivity(id: string, updates: Partial<ApiActivity>) {
    this.activities = this.activities.map(item => (item.id === id ? { ...item, ...updates } : item));
    this.save();
    return this.activities.find(item => item.id === id)!;
  }

  recordAttempt(activityId: string, score: number) {
    const newAttempt: ApiAttempt = {
      id: Date.now(),
      activityId,
      score,
      completedAt: new Date().toISOString(),
    };
    this.attempts.push(newAttempt);
    this.activities = this.activities.map(item => (item.id === activityId ? { ...item, completed: true } : item));
    this.save();
    return newAttempt;
  }

  getReminders() {
    return [...this.reminders];
  }

  createReminder(reminder: { title: string; time: string; icon?: string; kind?: string }) {
    const newRem: ApiReminder = {
      id: `rem-${Date.now()}`,
      title: reminder.title,
      time: reminder.time,
      icon: reminder.icon || "🔔",
      done: false,
      kind: reminder.kind || "Daily care",
    };
    this.reminders = [...this.reminders, newRem];
    this.save();
    return newRem;
  }

  toggleReminder(id: string, done: boolean) {
    this.reminders = this.reminders.map(r => (r.id === id ? { ...r, done } : r));
    this.save();
    return this.reminders.find(r => r.id === id);
  }

  updateReminder(id: string, updates: Partial<ApiReminder>) {
    this.reminders = this.reminders.map(r => (r.id === id ? { ...r, ...updates } : r));
    this.save();
    return this.reminders.find(r => r.id === id)!;
  }

  deleteReminder(id: string) {
    this.reminders = this.reminders.filter(r => r.id !== id);
    this.save();
  }

  getMemories() {
    return [...this.memories].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addMemory(memory: { title: string; description: string; image?: string; person?: string }) {
    const newMem: ApiMemory = {
      id: Date.now(),
      title: memory.title,
      description: memory.description,
      image: memory.image || "🌼",
      person: memory.person || "Family",
      createdAt: new Date().toISOString(),
    };
    this.memories = [newMem, ...this.memories];
    this.save();
    return newMem;
  }

  getMoods() {
    return [...this.moods];
  }

  recordMood(mood: string) {
    const newMood: ApiMood = {
      id: Date.now(),
      mood,
      timestamp: new Date().toISOString(),
    };
    this.moods.push(newMood);
    this.save();
    return newMood;
  }

  getDashboard(): ApiDashboard {
    const activeActs = this.activities.filter(a => a.active);
    const completedActs = activeActs.filter(a => a.completed);
    const total = activeActs.length;
    const completed = completedActs.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    const scores = this.attempts.map(a => a.score);
    const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 84;

    const latestMood = this.moods.length > 0 ? this.moods[this.moods.length - 1] : undefined;

    return {
      patient: this.getPatient(),
      today: {
        completed,
        total,
        progress,
        averageScore,
      },
      streak: {
        current: 5 + (completed > 0 ? 1 : 0),
        best: 8,
      },
      mood: latestMood,
      weeklyEngagement: [
        { day: "Mon", score: 75 },
        { day: "Tue", score: 85 },
        { day: "Wed", score: 60 },
        { day: "Thu", score: 95 },
        { day: "Fri", score: 80 },
        { day: "Sat", score: 90 },
        { day: "Sun", score: averageScore },
      ],
    };
  }
}

const store = new LocalStore();

export const webApi = {
  login: async () => ({
    token: "mock-token",
    user: { id: "patient-demo", name: "Asha Patil", role: "patient", patientId: "demo" },
  }),
  dashboard: async () => store.getDashboard(),
  activities: async () => store.getActivities(true),
  allActivities: async () => store.getActivities(false),
  createActivity: async (activity: Partial<ApiActivity>) => store.createActivity(activity),
  updateActivity: async (id: string, activity: Partial<ApiActivity>) => store.updateActivity(id, activity),
  attempt: async (id: string, score: number) => store.recordAttempt(id, score),
  moods: async () => store.getMoods(),
  mood: async (mood: string) => store.recordMood(mood),
  reminders: async () => store.getReminders(),
  createReminder: async (reminder: { title: string; time: string; icon?: string; kind?: string }) =>
    store.createReminder(reminder),
  reminder: async (id: string, done: boolean) => store.toggleReminder(id, done),
  updateReminder: async (id: string, reminder: Partial<ApiReminder>) => store.updateReminder(id, reminder),
  deleteReminder: async (id: string) => store.deleteReminder(id),
  memories: async () => store.getMemories(),
  memory: async (memory: { title: string; description: string; image?: string; person?: string }) =>
    store.addMemory(memory),
  patient: async () => store.getPatient(),
  updatePatient: async (patient: Partial<ApiPatient>) => store.updatePatient(patient),
};
