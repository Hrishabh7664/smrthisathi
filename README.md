# Smrithi Sathi

Smrithi Sathi is a cognitive-support demo for gentle activities, moods, memories, reminders, and caregiver check-ins. The web app and backend share one seeded SQLite database.

## Web + backend demo

Use two terminals from the repository root.

### Terminal 1: backend

```bash
cd backend
npm install
npm run seed
npm run dev
```

The API runs at `http://localhost:3000`.

### Terminal 2: web app

```bash
npm install
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`. The web app logs into the seeded demo account automatically and reads/writes activities, moods, memories, reminders, and dashboard data through the backend API.

Demo credentials are `patient-demo` / `demo123`. The caregiver view is available through **Switch role**.

## Build checks

```bash
npm run build
```

The tool is for cognitive support and engagement only; it does not diagnose or treat medical conditions.

## Mobile app

`mobile/` remains a backend-compatible Expo Router app and uses the same REST contract. It is paused for now and requires a native Android development build, not Expo Go. See [mobile/BUILD-APK.md](mobile/BUILD-APK.md) for the later Android handoff.
