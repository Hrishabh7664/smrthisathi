import { db, seedActivities } from "./db.js";

db.transaction(() => {
  db.prepare("DELETE FROM activities").run();
  const insert = db.prepare("INSERT INTO activities (id, title, category, icon, detail, difficulty, scheduled_time, type, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  for (const activity of seedActivities) insert.run(...activity);
})();

console.log("Smrithi Sathi demo database is ready.");
