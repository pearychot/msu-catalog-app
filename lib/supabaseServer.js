import { createClient } from '@supabase/supabase-js';

// Server-side client. Uses the same public env vars as the browser client
// since RLS policies already allow public read on products/categories/product_images -
// no service role key needed for this read-only use case.
export function getServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
