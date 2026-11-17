import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "@/lib/env";

/** Client Supabase untuk komponen client (dipakai untuk upload gambar ke Storage). */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
