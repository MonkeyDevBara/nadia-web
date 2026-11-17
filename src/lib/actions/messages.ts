"use server";

import { createHash } from "node:crypto";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { contactMessageSchema } from "@/lib/validations/message";
import { fail, ok, type ActionResult } from "./types";
import { requireUser } from "./auth";

export type ContactFormState = ActionResult | null;

/** Dikirim dari form kontak publik. Honeypot + Zod + rate limit 3 pesan/IP/jam (di DB). */
export async function submitContactMessage(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = contactMessageSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    body: formData.get("body"),
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    // Honeypot terisi = bot: pura-pura sukses, jangan simpan.
    if (parsed.error.issues.some((i) => i.path[0] === "website")) {
      return ok("Thanks! Your message has been sent.");
    }
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return fail("Please check the highlighted fields.", fieldErrors);
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";
  const ipHash = createHash("sha256")
    .update(`${process.env.IP_HASH_SALT ?? "portfolio"}:${ip}`)
    .digest("hex");

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("submit_message", {
    p_name: parsed.data.name,
    p_email: parsed.data.email,
    p_body: parsed.data.body,
    p_ip_hash: ipHash,
  });

  if (error) return fail("Sorry, your message could not be sent. Please try again later.");
  if (data === "rate_limited") {
    return fail("You have sent too many messages. Please try again in an hour.");
  }

  revalidatePath("/admin/pesan");
  return ok("Thanks! Your message has been sent.");
}

export async function markMessageRead(id: string, isRead: boolean): Promise<ActionResult> {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("messages").update({ is_read: isRead }).eq("id", id);
  if (error) return fail("Gagal memperbarui status pesan.");
  revalidatePath("/admin", "layout");
  return ok(isRead ? "Ditandai sudah dibaca." : "Ditandai belum dibaca.");
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) return fail("Gagal menghapus pesan.");
  revalidatePath("/admin", "layout");
  return ok("Pesan dihapus.");
}
