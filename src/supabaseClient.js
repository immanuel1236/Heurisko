import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly at build/runtime rather than silently falling back to empty
  // data everywhere — a missing env var here should be obvious, not a mystery
  // "why is the directory always empty" bug report later.
  console.error(
    "Heurisko: missing Supabase environment variables. Set VITE_SUPABASE_URL and " +
    "VITE_SUPABASE_ANON_KEY (see .env.example) before the app can load or save data."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
