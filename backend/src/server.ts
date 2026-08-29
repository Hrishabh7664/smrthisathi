import cors from "cors";
import express from "express";
import { db, patientId, userPasswordHash } from "./db.js";

export const app = express();
export default app;
app.use(cors());
app.use(express.json());
app.use((req, _res, next) => {
  if (req.url === "/api") req.url = "/";
  else if (req.url.startsWith("/api/")) req.url = req.url.slice(4);
  next();
});
const port = Number(process.env.PORT || 3000);
const rows = <T>(sql: string, ...params: unknown[]) => db.prepare(sql).all(...params) as T[];
const one = <T>(sql: string, ...params: unknown[]) => db.prepare(sql).get(...params) as T | undefined;
const today = () => new Date().toISOString().slice(0, 10);
const calculateStreak = (patient: string) => {
  const dates = new Set(rows<{ date: string }>("SELECT DISTINCT date(completed_at) as date FROM attempts WHERE patient_id = ?", patient).map(item => item.date));
  let current = 0;
  for (let offset = 0; dates.has(new Date(Date.now() - offset * 86400000).toISOString().slice(0, 10)); offset += 1) current += 1;
  return { current, best: Math.max(12, current) };
};

app.get("/health", (_req, res) => res.json({ ok: true, service: "smrithi-sathi-backend" }));
app.post("/auth/login", (req, res) => {
  const { email, password, role } = req.body ?? {};
  const requested = String(email || "").toLowerCase();
  const user = one<{ id: string; name: string; role: string; password_hash: string }>("SELECT * FROM users WHERE id = ? OR lower(name) = ?", requested || "patient-demo", requested);
  if (!user || user.password_hash !== userPasswordHash(String(password || "demo123")) || (role && role !== user.role)) return res.status(401).json({ message: "Invalid demo login" });
  res.json({ token: `demo-token-${user.id}`, user: { id: user.id, name: user.name, role: user.role, patientId: user.role === "patient" ? patientId : patientId } });
});

app.get("/patients/:id", (req, res) => {
  const patient = one("SELECT id, name, age, city, caregiver_id as caregiverId FROM patients WHERE id = ?", req.params.id);
  patient ? res.json(patient) : res.status(404).json({ message: "Patient not found" });
});
app.patch("/patients/:id", (req, res) => {
  const current = one<{ id: string; name: string; age: number; city: string }>("SELECT id, name, age, city FROM patients WHERE id = ?", req.params.id);
  if (!current) return res.status(404).json({ message: "Patient not found" });
  const patient = { name: String(req.body?.name || current.name), age: Number(req.body?.age || current.age), city: String(req.body?.city || current.city) };
  db.prepare("UPDATE patients SET name = ?, age = ?, city = ? WHERE id = ?").run(patient.name, patient.age, patient.city, req.params.id);
  return res.json({ id: req.params.id, ...patient });
});
app.get("/patients/:id/dashboard", (req, res) => {
  const patient = one("SELECT id, name, age, city FROM patients WHERE id = ?", req.params.id);
  if (!patient) return res.status(404).json({ message: "Patient not found" });
  const completed = one<{ count: number }>("SELECT COUNT(*) as count FROM attempts WHERE patient_id = ? AND date(completed_at) = date('now')", req.params.id)?.count ?? 0;
  const average = one<{ score: number }>("SELECT COALESCE(ROUND(AVG(score)), 0) as score FROM attempts WHERE patient_id = ?", req.params.id)?.score ?? 0;
  const streak = calculateStreak(req.params.id);
  return res.json({ patient, today: { completed, total: 4, progress: Math.min(100, Math.round((completed / 4) * 100)), averageScore: average }, streak, mood: one("SELECT mood, timestamp FROM moods WHERE patient_id = ? ORDER BY timestamp DESC LIMIT 1", req.params.id) });
});
const activityRows = (where = "") => rows<{ content: string } & Record<string, unknown>>(`SELECT id, title, category, icon, detail, difficulty, scheduled_time as time, type, content, active = 1 as active, EXISTS(SELECT 1 FROM attempts x WHERE x.activity_id = activities.id AND date(x.completed_at) = date('now')) as completed FROM activities ${where} ORDER BY scheduled_time`).map(({ content, ...activity }) => ({ ...activity, gameData: JSON.parse(content) }));
app.get("/activities/today", (_req, res) => res.json(activityRows("WHERE active = 1").slice(0, 20)));
app.get("/activities", (_req, res) => res.json(activityRows()));
app.post("/activities", (req, res) => { const id = `activity-${Date.now()}`; const activity = { id, title: String(req.body?.title || "Gentle Activity"), category: String(req.body?.category || "memory"), icon: String(req.body?.icon || "🧠"), detail: String(req.body?.detail || "A gentle activity for today"), difficulty: String(req.body?.difficulty || "Easy"), time: String(req.body?.time || "12:00"), type: String(req.body?.type || "daily_orientation"), gameData: req.body?.gameData || { questions: [{ question: "What is a kind greeting?", options: ["Hello", "Never", "Stop"], answer: "Hello" }] } }; db.prepare("INSERT INTO activities (id, title, category, icon, detail, difficulty, scheduled_time, type, content, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)").run(activity.id, activity.title, activity.category, activity.icon, activity.detail, activity.difficulty, activity.time, activity.type, JSON.stringify(activity.gameData)); return res.status(201).json({ ...activity, active: true, completed: false }); });
app.patch("/activities/:id", (req, res) => { const activity = one<{ id: string; title: string; active: number }>("SELECT id, title, active FROM activities WHERE id = ?", req.params.id); if (!activity) return res.status(404).json({ message: "Activity not found" }); const title = req.body?.title === undefined ? activity.title : String(req.body.title); const active = req.body?.active === undefined ? activity.active : Number(Boolean(req.body.active)); db.prepare("UPDATE activities SET title = ?, active = ? WHERE id = ?").run(title, active, req.params.id); return res.json({ id: req.params.id, title, active: Boolean(active) }); });
app.post("/activities/:id/attempt", (req, res) => { const activity = one("SELECT id FROM activities WHERE id = ?", req.params.id); if (!activity) return res.status(404).json({ message: "Activity not found" }); const score = Math.max(0, Math.min(100, Number(req.body?.score ?? 0))); const result = db.prepare("INSERT INTO attempts (activity_id, patient_id, score, completed_at) VALUES (?, ?, ?, ?)").run(req.params.id, patientId, score, new Date().toISOString()); return res.status(201).json({ id: result.lastInsertRowid, activityId: req.params.id, score, completed: true }); });
app.get("/moods", (_req, res) => res.json(rows("SELECT id, mood, timestamp FROM moods WHERE patient_id = ? ORDER BY timestamp DESC", patientId)));
app.post("/moods", (req, res) => { const mood = String(req.body?.mood || "Okay"); const timestamp = String(req.body?.timestamp || new Date().toISOString()); const result = db.prepare("INSERT INTO moods (patient_id, mood, timestamp) VALUES (?, ?, ?)").run(patientId, mood, timestamp); return res.status(201).json({ id: result.lastInsertRowid, mood, timestamp }); });
app.get("/reminders", (_req, res) => res.json(rows("SELECT id, title, time, icon, done = 1 as done FROM reminders WHERE patient_id = ? ORDER BY time", patientId)));
app.post("/reminders", (req, res) => { const id = `reminder-${Date.now()}`; const reminder = { id, title: String(req.body?.title || "New reminder"), time: String(req.body?.time || "09:00 AM"), icon: String(req.body?.icon || "🔔"), done: false }; db.prepare("INSERT INTO reminders VALUES (?, ?, ?, ?, ?, 0)").run(id, patientId, reminder.title, reminder.time, reminder.icon); return res.status(201).json(reminder); });
app.patch("/reminders/:id", (req, res) => { const current = one<{ id: string; title: string; time: string; icon: string; done: number }>("SELECT id, title, time, icon, done FROM reminders WHERE id = ? AND patient_id = ?", req.params.id, patientId); if (!current) return res.status(404).json({ message: "Reminder not found" }); const reminder = { title: req.body?.title === undefined ? current.title : String(req.body.title), time: req.body?.time === undefined ? current.time : String(req.body.time), icon: req.body?.icon === undefined ? current.icon : String(req.body.icon), done: req.body?.completed === undefined && req.body?.done === undefined ? current.done === 1 : Boolean(req.body.completed ?? req.body.done) }; db.prepare("UPDATE reminders SET title = ?, time = ?, icon = ?, done = ? WHERE id = ? AND patient_id = ?").run(reminder.title, reminder.time, reminder.icon, reminder.done ? 1 : 0, req.params.id, patientId); return res.json({ id: req.params.id, ...reminder, completed: reminder.done }); });
app.delete("/reminders/:id", (req, res) => { const result = db.prepare("DELETE FROM reminders WHERE id = ? AND patient_id = ?").run(req.params.id, patientId); return result.changes ? res.status(204).end() : res.status(404).json({ message: "Reminder not found" }); });
app.get("/patients/:id/streak", (req, res) => { const streak = calculateStreak(req.params.id); return res.json({ patientId: req.params.id, ...streak, days: rows("SELECT date(completed_at) as date, COUNT(*) as completed FROM attempts WHERE patient_id = ? GROUP BY date(completed_at) ORDER BY date DESC LIMIT 10", req.params.id) }); });
app.get("/patients/:id/progress", (req, res) => res.json({ patientId: req.params.id, activities: rows("SELECT date(completed_at) as date, COUNT(*) as completed, ROUND(AVG(score)) as averageScore FROM attempts WHERE patient_id = ? GROUP BY date(completed_at) ORDER BY date DESC LIMIT 14", req.params.id) }));
app.get("/memories", (_req, res) => res.json(rows("SELECT id, title, description, image, person, created_at as createdAt FROM memories WHERE patient_id = ? ORDER BY created_at DESC", patientId)));
app.post("/memories", (req, res) => { const memory = { title: String(req.body?.title || "New memory"), description: String(req.body?.description || ""), image: String(req.body?.image || "💭"), person: String(req.body?.person || "Family"), createdAt: new Date().toISOString() }; const result = db.prepare("INSERT INTO memories (patient_id, title, description, image, person, created_at) VALUES (?, ?, ?, ?, ?, ?)").run(patientId, memory.title, memory.description, memory.image, memory.person, memory.createdAt); return res.status(201).json({ id: result.lastInsertRowid, ...memory }); });

if (!process.env.VERCEL) app.listen(port, "0.0.0.0", () => console.log(`Smrithi Sathi backend listening on http://localhost:${port}`));
