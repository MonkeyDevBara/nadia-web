"use client";

import { useMemo, useState } from "react";
import { inputClass } from "@/components/ui/FormField";
import { renderMarkdown } from "@/lib/utils/markdown";

type MarkdownEditorProps = { id?: string; value: string; onChange: (value: string) => void };

export default function MarkdownEditor({ id, value, onChange }: MarkdownEditorProps) {
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const html = useMemo(() => renderMarkdown(value), [value]);

  const tabClass = (active: boolean) =>
    `rounded-md px-3 py-1.5 text-sm ${active ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100"}`;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div role="tablist" className="flex gap-1">
          <button type="button" role="tab" aria-selected={tab === "edit"} onClick={() => setTab("edit")} className={tabClass(tab === "edit")}>
            Tulis
          </button>
          <button type="button" role="tab" aria-selected={tab === "preview"} onClick={() => setTab("preview")} className={tabClass(tab === "preview")}>
            Preview
          </button>
        </div>
        <p className="hidden text-xs text-stone-500 sm:block">
          **tebal** · *miring* · - daftar · [teks](https://link)
        </p>
      </div>
      {tab === "edit" ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={12}
          className={`${inputClass} font-mono`}
        />
      ) : (
        <div
          className="prose-md min-h-[14rem] rounded-md border border-stone-300 bg-white p-4 text-sm"
          dangerouslySetInnerHTML={{ __html: html || "<p>Belum ada isi.</p>" }}
        />
      )}
    </div>
  );
}
