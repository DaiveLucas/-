import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://usmucbgltajiipvpuixp.supabase.co'
const supabasePublishableKey = 'sb_publishable_O8tRB0CeVp4yl9KWqEvkGA_5ty80OI1'
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbXVjYmdsdGFqaWlwdnB1aXhwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTI5NDA1NSwiZXhwIjoyMDk0ODcwMDU1fQ.bapVv40qzYogBRsohZtacL6JLKnbBxbdAjsCl7JfNRw'

export const supabase = createClient(supabaseUrl, supabasePublishableKey)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
