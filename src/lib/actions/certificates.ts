"use server";

import { certificateSchema } from "@/lib/validations/entities";
import { deleteRow, moveRow, saveRow } from "./crud";
import type { ActionResult } from "./types";

const cfg = { table: "certificates", schema: certificateSchema, tags: ["certificates" as const], noun: "sertifikat" };

export async function saveCertificate(id: string | null, input: unknown): Promise<ActionResult<{ id: string }>> {
  return saveRow(cfg, id, input);
}

export async function deleteCertificate(id: string): Promise<ActionResult> {
  return deleteRow(cfg.table, id, cfg.tags, cfg.noun);
}

export async function moveCertificate(id: string, direction: "up" | "down"): Promise<ActionResult> {
  return moveRow(cfg.table, id, direction, cfg.tags);
}
