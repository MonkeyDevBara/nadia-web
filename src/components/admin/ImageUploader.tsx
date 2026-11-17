"use client";

import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { uploadImage } from "@/lib/utils/uploadImage";

export type ImageSize = { width: number; height: number };

type ImageUploaderProps = {
  value: string | null;
  onChange: (url: string | null, size?: ImageSize) => void;
  /** Subfolder di bucket media, mis. "hero", "projects". */
  folder: string;
  label?: string;
  /** Rasio kotak preview, default 4/3. */
  aspect?: "square" | "video" | "portrait";
  /** Tampilkan latar kotak-kotak agar PNG/WebP transparan terlihat. */
  transparent?: boolean;
};

const aspectClass = { square: "aspect-square", video: "aspect-[4/3]", portrait: "aspect-[3/4]" };

export default function ImageUploader({
  value,
  onChange,
  folder,
  label = "gambar",
  aspect = "video",
  transparent = false,
}: ImageUploaderProps) {
  const toast = useToast();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  async function handleFile(file: File) {
    setLocalPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const uploaded = await uploadImage(file, folder);
      onChange(uploaded.url, { width: uploaded.width, height: uploaded.height });
      setLocalPreview(null);
      toast.success("Gambar berhasil diunggah. Klik Simpan untuk menerapkan.");
    } catch (e) {
      setLocalPreview(null);
      toast.error(e instanceof Error ? e.message : "Gagal mengunggah gambar.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const shown = localPreview ?? value;

  return (
    <div>
      <div
        className={`relative w-full max-w-xs overflow-hidden rounded-md border border-stone-300 ${aspectClass[aspect]} ${
          transparent
            ? "bg-[conic-gradient(#e7e5e4_25%,#fff_0_50%,#e7e5e4_0_75%,#fff_0)] bg-[length:16px_16px]"
            : "bg-stone-100"
        }`}
      >
        {shown ? (
          <Image
            src={shown}
            alt={`Preview ${label}`}
            fill
            unoptimized
            sizes="320px"
            className="object-contain"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-xs text-stone-500">
            <ImagePlus size={24} aria-hidden="true" />
            Belum ada {label}
          </div>
        )}
        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70" role="status">
            <Loader2 className="animate-spin" aria-hidden="true" />
            <span className="sr-only">Mengunggah…</span>
          </div>
        ) : null}
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
        <Button variant="secondary" loading={uploading} onClick={() => inputRef.current?.click()}>
          <ImagePlus size={16} aria-hidden="true" />
          {value ? "Ganti" : "Pilih"} {label}
        </Button>
        {value && !uploading ? (
          <Button variant="ghost" onClick={() => onChange(null)} className="text-red-600 hover:bg-red-50">
            <Trash2 size={16} aria-hidden="true" />
            Hapus
          </Button>
        ) : null}
      </div>
      <p className="mt-1 text-xs text-stone-500">JPG, PNG, atau WebP · maks 5 MB · otomatis dikompres ke WebP.</p>
    </div>
  );
}
