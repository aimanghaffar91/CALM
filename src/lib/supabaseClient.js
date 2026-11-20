import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bwmwmltbcppajlhxguzd.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_pNakDXok2HSO-yJQ4-gbSQ_P3eYlyNd';

export const supabase = createClient(supabaseUrl, supabaseKey);
