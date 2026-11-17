"use server";

import { testimonialSchema } from "@/lib/validations/entities";
import { deleteRow, moveRow, saveRow } from "./crud";
import type { ActionResult } from "./types";

const cfg = { table: "testimonials", schema: testimonialSchema, tags: ["testimonials" as const], noun: "testimoni" };

export async function saveTestimonial(id: string | null, input: unknown): Promise<ActionResult<{ id: string }>> {
  return saveRow(cfg, id, input);
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  return deleteRow(cfg.table, id, cfg.tags, cfg.noun);
}

export async function moveTestimonial(id: string, direction: "up" | "down"): Promise<ActionResult> {
  return moveRow(cfg.table, id, direction, cfg.tags);
}
