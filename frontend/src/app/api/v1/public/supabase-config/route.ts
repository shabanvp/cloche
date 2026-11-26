import { NextResponse } from "next/server";
import { getSupabaseConfig, getSupabaseConfigError } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Returns only the public Supabase project URL and publishable/anon key. */
export async function GET() {
  const configError = getSupabaseConfigError({ anon: true });
  if (configError) {
    return NextResponse.json(
      { success: false, error: { code: "CONFIG_ERROR", message: configError } },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  const { url, anonKey } = getSupabaseConfig();
  return NextResponse.json(
    { success: true, data: { url, anonKey } },
    { headers: { "Cache-Control": "no-store" } }
  );
}
