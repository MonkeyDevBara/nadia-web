import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "@/lib/env";

/**
 * Client anon tanpa sesi/cookie, khusus pembacaan data publik yang di-cache
 * (unstable_cache tidak boleh membaca cookies). RLS membatasi ke data published/visible.
 */
export function createPublicClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
