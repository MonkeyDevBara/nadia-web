"use server";

import { processStepSchema } from "@/lib/validations/entities";
import { deleteRow, moveRow, saveRow } from "./crud";
import type { ActionResult } from "./types";

const cfg = {
  table: "process_steps",
  schema: processStepSchema,
  tags: ["process" as const],
  noun: "langkah",
  max: 6,
};

export async function saveProcessStep(id: string | null, input: unknown): Promise<ActionResult<{ id: string }>> {
  return saveRow(cfg, id, input);
}

export async function deleteProcessStep(id: string): Promise<ActionResult> {
  return deleteRow(cfg.table, id, cfg.tags, cfg.noun);
}

export async function moveProcessStep(id: string, direction: "up" | "down"): Promise<ActionResult> {
  return moveRow(cfg.table, id, direction, cfg.tags);
}
