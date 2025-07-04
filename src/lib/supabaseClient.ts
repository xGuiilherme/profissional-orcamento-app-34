import { createClient } from '@supabase/supabase-js';

// Pegue essas informações do seu painel do Supabase em:
// Settings > API
const supabaseUrl = 'https://tzrromxjnhewjkrhlbwv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6cnJvbXhqbmhld2prcmhsYnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzOTc0NjksImV4cCI6MjA2Njk3MzQ2OX0.6u7ote4-hPnVdlZzhy0XgL79eTMdFaJzKEmqBFpvrnM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);