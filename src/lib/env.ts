// Harus ditulis literal agar Next.js meng-inline variabel NEXT_PUBLIC_* ke bundle client.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = supabaseUrl !== "" && supabaseAnonKey !== "";
