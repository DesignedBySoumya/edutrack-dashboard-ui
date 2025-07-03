import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log("Supabase client loaded");
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log("AuthContextProvider mounted");
console.log("Signup form mounted");

console.log("Attempting signup with:", email, password, name);