import { createClient } from "@/lib/supabase/client";
import { compressImage } from "./compressImage";

export type UploadedImage = { url: string; width: number; height: number };

const BUCKET = "media";

/** Kompres di browser lalu upload ke bucket "media". Mengembalikan URL publik. */
export async function uploadImage(file: File, folder: string): Promise<UploadedImage> {
  const { blob, width, height, extension } = await compressImage(file);
  const supabase = createClient();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: blob.type,
    cacheControl: "31536000",
  });
  if (error) throw new Error(`Upload gagal: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, width, height };
}
