Project Bolt (copied) — integration notes

Files copied from the external project are under:

  src/external/project-bolt/

What was included:
- src/components/* (AuthForm, Dashboard, TaskList, TaskForm, EmailSync, CalendarSync)
- src/lib/supabase.ts (Supabase client + types)
- src/contexts/AuthContext.tsx (a lightweight mock provider to allow demo usage)
- public/assets/project-bolt/* (index.html, index.css, tailwind/postcss configs)

Dependencies required to run these components:
- lucide-react
- @supabase/supabase-js
- tailwindcss (if you want to process the copied index.css)

How to use (quick):
1. Install dependencies in the frontend workspace:
   npm install lucide-react @supabase/supabase-js

2. Set Supabase environment variables in the frontend `.env` (Vite):
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key

3. Wrap a part of your app with the provider (example):
   import { ExternalAuthProvider } from './external/project-bolt/src/contexts/AuthContext';
   import { Dashboard } from './external/project-bolt/src/components/Dashboard';

   <ExternalAuthProvider>
     <Dashboard />
   </ExternalAuthProvider>

Notes:
- The provider is a demo stub; replace with your real auth wiring for production.
- Some TypeScript implicit-any complaints may appear; they are harmless for demo usage but should be typed more strictly for production.
