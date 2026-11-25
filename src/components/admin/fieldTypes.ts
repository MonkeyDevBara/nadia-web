import type { SocialLink } from "@/types/database";

export type GalleryItem = {
  /** undefined = gambar baru yang belum tersimpan. */
  id?: string;
  image_url: string;
  alt: string;
  width: number;
  height: number;
};

export type FieldValue = string | number | boolean | string[] | SocialLink[] | GalleryItem[] | null;
export type FormValues = Record<string, FieldValue>;

export type FieldOption = { value: string; label: string };

type Base = { name: string; label: string; hint?: string; required?: boolean };

export type FieldDef =
  | (Base & { type: "text" | "url" | "email" | "tel" | "color"; placeholder?: string })
  | (Base & { type: "textarea"; rows?: number; placeholder?: string })
  | (Base & { type: "number"; min?: number; max?: number })
  | (Base & { type: "date" })
  | (Base & { type: "toggle" })
  | (Base & { type: "select"; options: FieldOption[] })
  | (Base & { type: "image"; folder: string; aspect?: "square" | "video" | "portrait"; transparent?: boolean })
  | (Base & { type: "icon" })
  | (Base & { type: "tags"; placeholder?: string })
  | (Base & { type: "markdown" })
  | (Base & { type: "socials" });
