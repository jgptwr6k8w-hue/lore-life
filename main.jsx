import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const root = createRoot(document.getElementById('root'));

const requiredEnv = {
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
};
const missing = Object.keys(requiredEnv).filter((k) => !requiredEnv[k]);

if (missing.length) {
  // Firebase throws on startup without a config, so show setup help instead of a blank page.
  root.render(
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-6">
      <div className="max-w-lg space-y-3">
        <h1 className="text-xl font-bold">Lore isn't configured yet</h1>
        <p className="text-slate-300">These environment variables are missing:</p>
        <ul className="font-mono text-sm text-rose-300 list-disc pl-5">
          {missing.map((k) => <li key={k}>{k}</li>)}
        </ul>
        <p className="text-slate-300 text-sm">
          Locally: copy <code>.env.example</code> to <code>.env</code> and fill it in, then restart <code>npm run dev</code>.
          On Netlify: add them under Site configuration → Environment variables and redeploy.
        </p>
      </div>
    </div>
  );
} else {
  import('./App.jsx').then(({ default: App }) => {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  });
}
