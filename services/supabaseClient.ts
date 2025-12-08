import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qlnybqttcdijapkadywe.supabase.co';
const SUPABASE_KEY = 'sb_publishable_QvIuPb5hjJOM4LF88LznFg_nz0KErI-';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);