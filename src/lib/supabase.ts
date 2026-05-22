import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://usmucbgltajiipvpuixp.supabase.co'
const supabasePublishableKey = 'sb_publishable_O8tRB0CeVp4yl9KWqEvkGA_5ty80OI1'

export const supabase = createClient(supabaseUrl, supabasePublishableKey)
