import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://bidgnwwibvowwhdgcwan.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpZGdud3dpYnZvd3doZGdjd2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MjczNTMsImV4cCI6MjA4MTUwMzM1M30.ATnQeYvDqKEv9WDndmZPrBQG0zZVVPMZouSkx2SQwek";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
