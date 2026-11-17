export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export type CompressedImage = { blob: Blob; width: number; height: number; extension: string };

export class ImageValidationError extends Error {}

/** Validasi file asli: hanya jpg/png/webp, maks 5 MB. */
export function validateImageFile(file: File): void {
  if (!(ACCEPTED_TYPES as readonly string[]).includes(file.type)) {
    throw new ImageValidationError("Format file harus JPG, PNG, atau WebP.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new ImageValidationError("Ukuran file maksimal 5 MB.");
  }
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Resize (maks lebar 1920px) dan kompres ke WebP kualitas 80 memakai Canvas API native.
 * Jika browser tidak bisa meng-encode WebP, pakai JPEG (foto) atau PNG (agar transparansi aman).
 */
export async function compressImage(file: File, maxWidth = 1920, quality = 0.8): Promise<CompressedImage> {
  validateImageFile(file);

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new ImageValidationError("Browser tidak mendukung pemrosesan gambar.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const webp = await toBlob(canvas, "image/webp", quality);
  if (webp && webp.type === "image/webp") return { blob: webp, width, height, extension: "webp" };

  if (file.type !== "image/png") {
    const jpeg = await toBlob(canvas, "image/jpeg", quality);
    if (jpeg) return { blob: jpeg, width, height, extension: "jpg" };
  }
  const png = await toBlob(canvas, "image/png", 1);
  if (!png) throw new ImageValidationError("Gagal memproses gambar.");
  return { blob: png, width, height, extension: "png" };
}
