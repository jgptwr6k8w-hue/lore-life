# lore-life
Lore.. Your safe space and your organized piece of the world ، Bringing together your peace of mind, daily flow, and creative soul in one warm, personal sanctuary

## Stack
React 19 + Vite + Tailwind, Firebase (Auth + Firestore), Gemini for the AI features, deployed on Netlify.

## Setup

### 1. Firebase project
1. Create a project at <https://console.firebase.google.com>.
2. **Build → Firestore Database** → Create database.
3. **Build → Authentication → Sign-in method** → enable **Anonymous**, **Email/Password** and **Google**.
4. **Authentication → Settings → Authorized domains** → add your Netlify domain (e.g. `your-site.netlify.app`).
5. **Project settings → Your apps** → add a **Web app** and copy its config values.
6. Deploy the security rules in this repo:
   ```bash
   npx firebase-tools login
   npx firebase-tools deploy --only firestore:rules --project <your-project-id>
   ```

### 2. Gemini API key
Create a key at <https://aistudio.google.com/apikey>. It stays on the server: the browser calls
`/api/gemini`, which is a Netlify Function in production and a Vite middleware in dev.

### 3. Local env
```bash
cp .env.example .env   # then fill in the values
npm install
npm run dev
```

### 4. Netlify
Add every key from `.env.example` under **Site configuration → Environment variables**, then redeploy.
`netlify.toml` already sets the build command and publish dir; functions in `netlify/functions` are picked up automatically.

## Data layout
All data lives under `artifacts/{VITE_LORE_APP_ID}/` in Firestore:
- `users/{uid}/…` – private per-user data (tasks, notes, goals, finances, workouts, diaries, AI chat, friends, profile)
- `public/data/…` – user directory, public diaries, friend requests, shared goals, direct messages

See `firestore.rules` for who can read/write what.
