"use client";

import { ArrowDown, ArrowUp, ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { inputClass } from "@/components/ui/FormField";
import { useToast } from "@/components/ui/Toast";
import { uploadImage } from "@/lib/utils/uploadImage";
import type { GalleryItem } from "./fieldTypes";

type MultiImageUploaderProps = {
  value: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
  folder: string;
};

export default function MultiImageUploader({ value, onChange, folder }: MultiImageUploaderProps) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  async function handleFiles(files: File[]) {
    let current = value;
    setProgress({ done: 0, total: files.length });
    for (const [i, file] of files.entries()) {
      try {
        const up = await uploadImage(file, folder);
        current = [...current, { image_url: up.url, alt: "", width: up.width, height: up.height }];
        onChange(current);
      } catch (e) {
        toast.error(`${file.name}: ${e instanceof Error ? e.message : "gagal diunggah"}`);
      }
      setProgress({ done: i + 1, total: files.length });
    }
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div>
      {value.length > 0 ? (
        <ul className="mb-3 space-y-3">
          {value.map((item, i) => (
            <li key={item.id ?? item.image_url} className="flex gap-3 rounded-md border border-stone-200 bg-white p-2">
              <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded bg-stone-100">
                <Image src={item.image_url} alt="" fill unoptimized sizes="96px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <input
                  aria-label={`Teks alternatif gambar ${i + 1}`}
                  value={item.alt}
                  onChange={(e) => onChange(value.map((it, idx) => (idx === i ? { ...it, alt: e.target.value } : it)))}
                  placeholder="Deskripsi gambar (alt text)"
                  className={inputClass}
                />
                <div className="mt-2 flex gap-1">
                  <Button variant="secondary" aria-label="Pindah ke atas" disabled={i === 0} onClick={() => move(i, -1)} className="h-8 px-2">
                    <ArrowUp size={14} aria-hidden="true" />
                  </Button>
                  <Button variant="secondary" aria-label="Pindah ke bawah" disabled={i === value.length - 1} onClick={() => move(i, 1)} className="h-8 px-2">
                    <ArrowDown size={14} aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    aria-label="Hapus gambar"
                    onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                    className="h-8 px-2 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length > 0) void handleFiles(files);
        }}
      />
      <Button variant="secondary" loading={progress !== null} onClick={() => inputRef.current?.click()}>
        <ImagePlus size={16} aria-hidden="true" />
        {progress ? `Mengunggah ${progress.done}/${progress.total}…` : "Tambah gambar"}
      </Button>
      <p className="mt-1 text-xs text-stone-500">Bisa pilih banyak file sekaligus. Urutan di sini = urutan tampil.</p>
    </div>
  );
}
