import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/env";

const LOGIN_PATH = "/admin/login";

/**
 * URL absolut berdasarkan host yang dilihat pengunjung. Di belakang reverse proxy (nginx),
 * request.nextUrl berisi alamat internal (localhost:3200), jadi pakai header Host/X-Forwarded-*.
 */
function publicUrl(request: NextRequest, pathname: string): URL {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? request.nextUrl.host;
  const proto = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
  return new URL(pathname, `${proto}://${host}`);
}

/** Refresh sesi + proteksi semua route /admin (kecuali halaman login). */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  if (!isSupabaseConfigured) return NextResponse.next({ request });

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  const isLogin = request.nextUrl.pathname === LOGIN_PATH;

  if (!data.user && !isLogin) {
    const redirect = NextResponse.redirect(publicUrl(request, LOGIN_PATH));
    for (const c of response.cookies.getAll()) redirect.cookies.set(c);
    return redirect;
  }

  if (data.user && isLogin) {
    return NextResponse.redirect(publicUrl(request, "/admin"));
  }

  return response;
}
