"use client";

import { Plus, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { inputClass } from "@/components/ui/FormField";
import type { SocialLink } from "@/types/database";

type SocialsEditorProps = { value: SocialLink[]; onChange: (links: SocialLink[]) => void };

export default function SocialsEditor({ value, onChange }: SocialsEditorProps) {
  function update(index: number, patch: Partial<SocialLink>) {
    onChange(value.map((l, i) => (i === index ? { ...l, ...patch } : l)));
  }

  return (
    <div className="space-y-3">
      {value.map((link, i) => (
        <div key={i} className="grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[10rem_1fr_auto]">
          <input
            aria-label={`Nama sosial media ${i + 1}`}
            value={link.label}
            onChange={(e) => update(i, { label: e.target.value })}
            placeholder="Instagram"
            className={`${inputClass} col-span-2 sm:col-span-1`}
          />
          <input
            aria-label={`URL sosial media ${i + 1}`}
            value={link.url}
            onChange={(e) => update(i, { url: e.target.value })}
            placeholder="https://instagram.com/username"
            className={inputClass}
          />
          <Button
            variant="ghost"
            aria-label={`Hapus sosial media ${i + 1}`}
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            className="px-3 text-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} aria-hidden="true" />
          </Button>
        </div>
      ))}
      <Button variant="secondary" onClick={() => onChange([...value, { label: "", url: "" }])}>
        <Plus size={16} aria-hidden="true" />
        Tambah sosial media
      </Button>
    </div>
  );
}
