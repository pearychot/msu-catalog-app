import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Builds a public URL for an image stored in the "product-images" bucket.
export function getProductImageUrl(storagePath) {
  if (!storagePath) return null;
  const { data } = supabase.storage.from('product-images').getPublicUrl(storagePath);
  return data?.publicUrl ?? null;
}
