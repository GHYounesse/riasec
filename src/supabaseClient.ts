


import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
console.log('SUPABASE_URL',supabaseUrl);
console.log('SUPABASE_ANON_KEY', supabaseKey);
export const supabase = createClient(supabaseUrl, supabaseKey);



