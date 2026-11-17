"use server";

import { categorySchema } from "@/lib/validations/entities";
import { deleteRow, moveRow, saveRow } from "./crud";
import type { ActionResult } from "./types";

const cfg = {
  table: "categories",
  schema: categorySchema,
  tags: ["categories" as const, "projects" as const],
  noun: "kategori",
};

export async function saveCategory(id: string | null, input: unknown): Promise<ActionResult<{ id: string }>> {
  return saveRow(cfg, id, input);
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  return deleteRow(cfg.table, id, cfg.tags, cfg.noun);
}

export async function moveCategory(id: string, direction: "up" | "down"): Promise<ActionResult> {
  return moveRow(cfg.table, id, direction, cfg.tags);
}
