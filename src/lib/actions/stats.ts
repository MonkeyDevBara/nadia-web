"use server";

import { statSchema } from "@/lib/validations/entities";
import { deleteRow, moveRow, saveRow } from "./crud";
import type { ActionResult } from "./types";

const cfg = { table: "stats", schema: statSchema, tags: ["stats" as const], noun: "statistik" };

export async function saveStat(id: string | null, input: unknown): Promise<ActionResult<{ id: string }>> {
  return saveRow(cfg, id, input);
}

export async function deleteStat(id: string): Promise<ActionResult> {
  return deleteRow(cfg.table, id, cfg.tags, cfg.noun);
}

export async function moveStat(id: string, direction: "up" | "down"): Promise<ActionResult> {
  return moveRow(cfg.table, id, direction, cfg.tags);
}
