import { createClient } from '@supabase/supabase-js';

// Pegue essas informações do seu painel do Supabase em:
// Settings > API
const supabaseUrl = 'https://zqylfhyztiewympoizpi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxeWxmaHl6dGlld3ltcG9penBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MzgxMzAsImV4cCI6MjA4OTQxNDEzMH0.jJvsCsK0kxF2Zp3Xd_vVM2AQ90hPITE81tg0Ucxt2JM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);