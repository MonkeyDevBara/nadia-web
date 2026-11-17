"use server";

import type { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  contactSettingsSchema,
  profileSettingsSchema,
  sectionSettingsSchema,
  seoSettingsSchema,
} from "@/lib/validations/settings";
import { fieldErrors } from "@/lib/validations/common";
import { requireUser } from "./auth";
import { describeDbError, revalidateContent } from "./crud";
import { fail, ok, type ActionResult } from "./types";

/** Update sebagian kolom site_settings (baris id = 1) dengan validasi ulang di server. */
async function updateSettings<S extends z.ZodType>(schema: S, input: unknown): Promise<ActionResult> {
  await requireUser();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return fail("Periksa kembali isian yang ditandai.", fieldErrors(parsed.error));

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .update(parsed.data as Record<string, unknown>)
    .eq("id", 1)
    .select("id");
  if (error) return fail(describeDbError(error, "Gagal menyimpan pengaturan."));
  if (!data || data.length === 0) {
    return fail("Data pengaturan belum ada. Jalankan supabase/seed.sql terlebih dahulu.");
  }

  revalidateContent(["settings"]);
  return ok("Perubahan berhasil disimpan dan sudah tampil di website.");
}

export async function saveProfileSettings(input: unknown): Promise<ActionResult> {
  return updateSettings(profileSettingsSchema, input);
}

export async function saveSectionSettings(input: unknown): Promise<ActionResult> {
  return updateSettings(sectionSettingsSchema, input);
}

export async function saveContactSettings(input: unknown): Promise<ActionResult> {
  return updateSettings(contactSettingsSchema, input);
}

export async function saveSeoSettings(input: unknown): Promise<ActionResult> {
  return updateSettings(seoSettingsSchema, input);
}
