import Database from "better-sqlite3";
import { createHash } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const databasePath = process.env.DB_PATH || (process.env.VERCEL ? "/tmp/smrithi-sathi.db" : resolve(process.cwd(), "data/smrithi-sathi.db"));
mkdirSync(dirname(databasePath), { recursive: true });
export const db = new Database(databasePath);
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, password_hash TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS patients (id TEXT PRIMARY KEY, name TEXT NOT NULL, age INTEGER NOT NULL, city TEXT NOT NULL, caregiver_id TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS activities (id TEXT PRIMARY KEY, title TEXT NOT NULL, category TEXT NOT NULL, icon TEXT NOT NULL, detail TEXT NOT NULL, difficulty TEXT NOT NULL, scheduled_time TEXT NOT NULL, type TEXT NOT NULL DEFAULT 'daily_orientation', content TEXT NOT NULL DEFAULT '{}', active INTEGER NOT NULL DEFAULT 1);
  CREATE TABLE IF NOT EXISTS attempts (id INTEGER PRIMARY KEY AUTOINCREMENT, activity_id TEXT NOT NULL, patient_id TEXT NOT NULL, score INTEGER NOT NULL, completed_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS moods (id INTEGER PRIMARY KEY AUTOINCREMENT, patient_id TEXT NOT NULL, mood TEXT NOT NULL, timestamp TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS reminders (id TEXT PRIMARY KEY, patient_id TEXT NOT NULL, title TEXT NOT NULL, time TEXT NOT NULL, icon TEXT NOT NULL, done INTEGER NOT NULL DEFAULT 0);
  CREATE TABLE IF NOT EXISTS memories (id INTEGER PRIMARY KEY AUTOINCREMENT, patient_id TEXT NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, image TEXT, person TEXT NOT NULL DEFAULT 'Family', created_at TEXT NOT NULL);
`);

try { db.exec("ALTER TABLE activities ADD COLUMN type TEXT NOT NULL DEFAULT 'daily_orientation'"); } catch {}
try { db.exec("ALTER TABLE activities ADD COLUMN content TEXT NOT NULL DEFAULT '{}'"); } catch {}
try { db.exec("ALTER TABLE activities ADD COLUMN active INTEGER NOT NULL DEFAULT 1"); } catch {}
try { db.exec("ALTER TABLE memories ADD COLUMN person TEXT NOT NULL DEFAULT 'Family'"); } catch {}

const hash = (password: string) => createHash("sha256").update(password).digest("hex");
const count = (table: string) => (db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get() as { count: number }).count;

export const seedActivities = [
  ["memory-diwali", "Diwali Memory Match", "memory", "🪔", "Match familiar festival objects", "Easy", "09:15", "memory_match", JSON.stringify({ pairs: ["🪔 Diya", "🥭 Mango", "🧺 Basket"] })],
  ["memory-kitchen", "Kitchen Memory Match", "memory", "🍲", "Match things from the kitchen", "Easy", "10:00", "memory_match", JSON.stringify({ pairs: ["🍵 Chai", "🥣 Bowl", "🥭 Mango"] })],
  ["memory-family", "Family Memory Match", "memory", "👨‍👩‍👧", "Match familiar family moments", "Gentle", "11:00", "memory_match", JSON.stringify({ pairs: ["👵 Aaji", "👨‍👩‍👧 Family", "🏡 Home"] })],
  ["sequence-numbers", "Number Sequence", "sequence", "🔢", "Remember a growing number pattern", "Easy", "15:00", "sequence_recall", JSON.stringify({ rounds: [[2, 4], [1, 3, 5], [5, 10, 15, 20]] })],
  ["sequence-holi", "Holi Celebration", "sequence", "🎨", "Remember the order of Holi steps", "Gentle", "15:30", "sequence_recall", JSON.stringify({ rounds: [["🎨 Colour", "💧 Water"], ["🎨 Colour", "💧 Water", "🍬 Gujiya"], ["🎨 Colour", "💧 Water", "🍬 Gujiya", "👋 Namaste"]] })],
  ["sequence-chai", "Chai Time", "sequence", "☕", "Remember the steps for morning chai", "Easy", "16:00", "sequence_recall", JSON.stringify({ rounds: [["💧 Water", "🔥 Heat"], ["💧 Water", "🔥 Heat", "🍵 Tea"], ["💧 Water", "🔥 Heat", "🍵 Tea", "🥛 Milk"]] })],
  ["words-market", "Market Words", "recall", "🛒", "Remember a short Pune market list", "Gentle", "10:30", "word_recall", JSON.stringify({ words: ["Rice", "Mango", "Chai", "Flowers"], decoys: ["Train", "Umbrella", "Cricket", "Book", "Banana"] })],
  ["words-family", "Family Words", "recall", "💛", "Remember words for people you love", "Easy", "12:00", "word_recall", JSON.stringify({ words: ["Aaji", "Meera", "Home", "Smile"], decoys: ["River", "Bus", "Clock", "Garden", "School"] })],
  ["words-food", "Favourite Foods", "recall", "🍛", "Remember familiar foods", "Easy", "18:00", "word_recall", JSON.stringify({ words: ["Dal", "Roti", "Kheer", "Chai"], decoys: ["Pencil", "Temple", "Cloud", "Radio", "Shoes"] })],
  ["objects-home", "Objects at Home", "recognition", "🏡", "Identify things from around the home", "Easy", "11:30", "object_recognition", JSON.stringify({ objects: [{ label: "Diya", icon: "🪔", options: ["🪔 Diya", "📻 Radio", "☂️ Umbrella"] }, { label: "Chai", icon: "🍵", options: ["📖 Book", "🍵 Chai", "🧺 Basket"] }, { label: "Clock", icon: "🕰️", options: ["🕰️ Clock", "🥭 Mango", "🪁 Kite"] }] })],
  ["objects-pune", "Pune Places", "recognition", "📍", "Recognise familiar places and objects", "Gentle", "14:00", "object_recognition", JSON.stringify({ objects: [{ label: "Shaniwar Wada", icon: "🏛️", options: ["🏛️ Shaniwar Wada", "🏖️ Beach", "🏥 Hospital"] }, { label: "Auto rickshaw", icon: "🛺", options: ["🚂 Train", "🛺 Auto rickshaw", "🚲 Bicycle"] }, { label: "Tulsi plant", icon: "🌿", options: ["🌿 Tulsi plant", "🎈 Balloon", "📺 Television"] }] })],
  ["objects-festival", "Festival Objects", "recognition", "🎉", "Identify familiar celebration objects", "Easy", "19:00", "object_recognition", JSON.stringify({ objects: [{ label: "Kite", icon: "🪁", options: ["🎺 Drum", "🪁 Kite", "🍎 Apple"] }, { label: "Modak", icon: "🍡", options: ["🍡 Modak", "🧤 Glove", "🧴 Bottle"] }, { label: "Flower", icon: "🌼", options: ["🌼 Flower", "🧦 Sock", "🧲 Magnet"] }] })],
  ["orientation-morning", "Morning Welcome", "daily orientation", "🌞", "Think about the beginning of your day", "Easy", "09:00", "daily_orientation", JSON.stringify({ questions: [{ question: "What meal do we usually eat in the morning?", options: ["Breakfast", "Dinner", "Supper"], answer: "Breakfast" }, { question: "Which drink is often enjoyed with breakfast?", options: ["Chai", "Lassi", "Soup"], answer: "Chai" }, { question: "What do we say to greet someone in the morning?", options: ["Good morning", "Good night", "Goodbye"], answer: "Good morning" }] })],
  ["orientation-india", "India Around Us", "daily orientation", "🇮🇳", "Think about familiar days and places", "Gentle", "13:00", "daily_orientation", JSON.stringify({ questions: [{ question: "Which city is Asha's home?", options: ["Pune", "Jaipur", "Kochi"], answer: "Pune" }, { question: "Which season brings Diwali in many homes?", options: ["Autumn", "Monsoon", "Spring"], answer: "Autumn" }, { question: "Who might we call for a family chat?", options: ["Meera", "The postman", "A shop sign"], answer: "Meera" }] })],
  ["orientation-evening", "Evening Reflection", "daily orientation", "🌙", "Think about your familiar evening routine", "Easy", "20:00", "daily_orientation", JSON.stringify({ questions: [{ question: "What might we do before bed?", options: ["Brush our teeth", "Go to market", "Plant rice"], answer: "Brush our teeth" }, { question: "Which light may glow during a festival?", options: ["Diya", "Traffic light", "Torch tower"], answer: "Diya" }, { question: "What is a kind way to end a conversation?", options: ["Good night", "Wake up", "Run away"], answer: "Good night" }] })]
  ["card-flip-festival", "Festival Card Flip", "memory", "🪔", "Find matching festival cards", "Challenge", "16:30", "card_flip_memory", JSON.stringify({ pairs: ["🪔 Diya", "🍡 Modak", "🪁 Kite", "🌼 Marigold", "🍵 Chai"] })],
  ["light-math-market", "Market Math", "attention", "🧮", "Solve gentle everyday number questions", "Challenge", "17:00", "light_math", JSON.stringify({ questions: [{ prompt: "12 + 5", answer: 17, options: [15, 17, 19] }, { prompt: "20 − 6", answer: 14, options: [12, 14, 16] }, { prompt: "8 + 9", answer: 17, options: [16, 17, 18] }, { prompt: "25 − 10", answer: 15, options: [10, 15, 20] }] })],
  ["light-math-chai", "Chai Shop Math", "attention", "☕", "Practice simple everyday sums", "Challenge", "17:15", "light_math", JSON.stringify({ questions: [{ prompt: "6 + 7", answer: 13, options: [12, 13, 14] }, { prompt: "18 − 5", answer: 13, options: [11, 13, 15] }, { prompt: "11 + 8", answer: 19, options: [18, 19, 20] }, { prompt: "30 − 12", answer: 18, options: [16, 18, 20] }] })]
];

if (count("users") === 0) {
  const seed = db.transaction(() => {
    db.prepare("INSERT INTO users VALUES (?, ?, ?, ?)").run("caregiver-demo", "Rohan Shah", "caregiver", hash("demo123"));
    db.prepare("INSERT INTO users VALUES (?, ?, ?, ?)").run("patient-demo", "Asha Patil", "patient", hash("demo123"));
    db.prepare("INSERT INTO patients VALUES (?, ?, ?, ?, ?)").run("demo", "Asha Patil", 68, "Pune, Maharashtra", "caregiver-demo");

    /* const activities = [
      ["memory-match", "Memory Match", "memory", "🧠", "Remember familiar objects", "Easy", "09:15"],
      ["family-faces", "Family Faces", "recall", "👨‍👩‍👧", "Recognise people you love", "Easy", "10:00"],
      ["everyday-objects", "Everyday Objects", "memory", "🪔", "Name things from home", "Easy", "11:00"],
      ["number-sequence", "Number Sequence", "sequence", "🔢", "Find what comes next", "Easy", "15:00"],
      ["festival-order", "Festival Order", "sequence", "🪔", "Put Diwali steps in order", "Gentle", "15:30"],
      ["spot-the-difference", "Spot the Difference", "attention", "🔎", "Look carefully at the details", "Gentle", "16:00"],
      ["morning-orientation", "Morning Welcome", "daily orientation", "🌞", "Remember today and the weather", "Easy", "09:00"],
      ["market-list", "Market List", "recall", "🛒", "Recall a short shopping list", "Gentle", "10:30"],
      ["songs-we-know", "Songs We Know", "recall", "🎵", "Remember a familiar tune", "Easy", "12:00"],
      ["chai-routine", "Chai Routine", "daily orientation", "☕", "Recall the steps for tea", "Easy", "17:00"],
      ["colour-count", "Colour Count", "attention", "🎨", "Count colours around you", "Gentle", "17:30"],
      ["temple-route", "Temple Route", "sequence", "🛕", "Recall a familiar route", "Gentle", "18:00"],
      ["name-that-fruit", "Name That Fruit", "memory", "🥭", "Identify familiar fruit", "Easy", "18:30"],
      ["cricket-recall", "Cricket Recall", "recall", "🏏", "Remember a favourite match", "Gentle", "19:00"],
      ["evening-check", "Evening Check", "daily orientation", "🌙", "Reflect on the day", "Easy", "20:00"]
    ];
    */
    const insertActivity = db.prepare("INSERT INTO activities (id, title, category, icon, detail, difficulty, scheduled_time, type, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    for (const activity of seedActivities) insertActivity.run(...activity);

    const insertReminder = db.prepare("INSERT INTO reminders VALUES (?, ?, ?, ?, ?, ?)");
    insertReminder.run("water", "demo", "Drink some water", "10:00 AM", "💧", 0);
    insertReminder.run("meera-call", "demo", "Call Meera", "6:00 PM", "📞", 0);
    insertReminder.run("medicine", "demo", "Evening medicine", "8:00 PM", "💊", 0);

    const insertMemory = db.prepare("INSERT INTO memories (patient_id, title, description, image, created_at) VALUES (?, ?, ?, ?, ?)");
    insertMemory.run("demo", "Diwali at home", "The warm glow of diyas and family laughter.", "🪔", "2026-08-20T10:00:00.000Z");
    insertMemory.run("demo", "A day in Pune", "A peaceful afternoon with chai and the garden.", "🌿", "2026-08-18T10:00:00.000Z");
    insertMemory.run("demo", "Family celebration", "A happy moment together with Meera.", "👨‍👩‍👧", "2026-08-15T10:00:00.000Z");

    const insertMood = db.prepare("INSERT INTO moods (patient_id, mood, timestamp) VALUES (?, ?, ?)");
    for (let day = 9; day >= 0; day -= 1) insertMood.run("demo", ["Happy", "Okay", "Happy", "Okay", "Not great"][day % 5], new Date(Date.now() - day * 86400000).toISOString());
    const insertAttempt = db.prepare("INSERT INTO attempts (activity_id, patient_id, score, completed_at) VALUES (?, ?, ?, ?)");
    for (let day = 9; day >= 0; day -= 1) for (const id of ["morning-orientation", "memory-match"]) insertAttempt.run(id, "demo", 70 + (day % 4) * 7, new Date(Date.now() - day * 86400000).toISOString());
  });
  seed();
}

export const patientId = "demo";
export const userPasswordHash = hash;
