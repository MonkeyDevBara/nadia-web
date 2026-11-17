"use client";

import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import type { ActionResult } from "@/lib/actions/types";
import { useAdminForm } from "@/lib/hooks/useAdminForm";
import FieldRenderer from "./FieldRenderer";
import type { FieldDef, FormValues } from "./fieldTypes";

export type ListItem = FormValues & { id: string };

type ListEditorProps = {
  items: ListItem[];
  fields: FieldDef[];
  /** Nilai awal untuk item baru. */
  defaults: FormValues;
  /** Kata benda untuk teks UI, mis. "keahlian". */
  noun: string;
  titleKey: string;
  subtitleKey?: string;
  /** Batas jumlah item (mis. process maks 6). */
  max?: number;
  save: (id: string | null, values: FormValues) => Promise<ActionResult<{ id: string }>>;
  remove: (id: string) => Promise<ActionResult>;
  move: (id: string, direction: "up" | "down") => Promise<ActionResult>;
};

function str(v: FormValues[string] | undefined): string {
  return typeof v === "string" ? v : "";
}

type ItemFormProps = {
  id: string | null;
  initial: FormValues;
  fields: FieldDef[];
  noun: string;
  save: ListEditorProps["save"];
  onDone: () => void;
};

function ItemForm({ id, initial, fields, noun, save, onDone }: ItemFormProps) {
  const router = useRouter();
  const { values, setValue, errors, saving, dirty, submit } = useAdminForm(
    initial,
    (v) => save(id, v),
    {
      onSaved: () => {
        router.refresh();
        onDone();
      },
    },
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
      className="space-y-5 border-t border-stone-200 bg-stone-50 p-4 md:p-5"
    >
      {fields.map((field) => (
        <FieldRenderer key={field.name} field={field} values={values} error={errors[field.name]} onChange={setValue} />
      ))}
      <div className="flex gap-2">
        <Button type="submit" loading={saving} disabled={!dirty && id !== null}>
          {id ? "Simpan perubahan" : `Tambah ${noun}`}
        </Button>
        <Button variant="secondary" onClick={onDone} disabled={saving}>
          Batal
        </Button>
      </div>
    </form>
  );
}

export default function ListEditor({
  items,
  fields,
  defaults,
  noun,
  titleKey,
  subtitleKey,
  max,
  save,
  remove,
  move,
}: ListEditorProps) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [openId, setOpenId] = useState<string | "new" | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const atMax = max !== undefined && items.length >= max;

  async function run(id: string, action: () => Promise<ActionResult>) {
    setBusyId(id);
    try {
      const result = await action();
      if (result.ok) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Terjadi kesalahan. Coba lagi.");
    } finally {
      setBusyId(null);
    }
  }

  async function onDelete(item: ListItem) {
    const ok = await confirm({
      title: `Hapus ${noun} ini?`,
      description: `"${str(item[titleKey])}" akan dihapus permanen dari website.`,
      confirmLabel: "Ya, hapus",
      danger: true,
    });
    if (ok) await run(item.id, () => remove(item.id));
  }

  return (
    <div>
      <ul className="overflow-hidden rounded-lg border border-stone-200 bg-white">
        {items.length === 0 && openId !== "new" ? (
          <li className="p-6 text-center text-sm text-stone-500">Belum ada {noun}.</li>
        ) : null}
        {items.map((item, i) => (
          <li key={item.id} className="border-b border-stone-200 last:border-b-0">
            <div className="flex items-center gap-2 p-3 md:px-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{str(item[titleKey]) || "(tanpa judul)"}</p>
                {subtitleKey ? <p className="truncate text-xs text-stone-500">{str(item[subtitleKey])}</p> : null}
              </div>
              <Button
                variant="ghost"
                aria-label="Naikkan urutan"
                disabled={i === 0 || busyId !== null}
                onClick={() => run(item.id, () => move(item.id, "up"))}
                className="h-9 px-2"
              >
                <ArrowUp size={16} aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                aria-label="Turunkan urutan"
                disabled={i === items.length - 1 || busyId !== null}
                onClick={() => run(item.id, () => move(item.id, "down"))}
                className="h-9 px-2"
              >
                <ArrowDown size={16} aria-hidden="true" />
              </Button>
              <Button
                variant="secondary"
                aria-label={`Edit ${str(item[titleKey])}`}
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="h-9 px-3"
              >
                <Pencil size={14} aria-hidden="true" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
              <Button
                variant="ghost"
                aria-label={`Hapus ${str(item[titleKey])}`}
                loading={busyId === item.id}
                disabled={busyId !== null && busyId !== item.id}
                onClick={() => onDelete(item)}
                className="h-9 px-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} aria-hidden="true" />
              </Button>
            </div>
            {openId === item.id ? (
              <ItemForm
                id={item.id}
                initial={item}
                fields={fields}
                noun={noun}
                save={save}
                onDone={() => setOpenId(null)}
              />
            ) : null}
          </li>
        ))}
        {openId === "new" ? (
          <li>
            <ItemForm id={null} initial={defaults} fields={fields} noun={noun} save={save} onDone={() => setOpenId(null)} />
          </li>
        ) : null}
      </ul>

      <div className="mt-4 flex items-center gap-3">
        <Button onClick={() => setOpenId("new")} disabled={atMax || openId === "new"}>
          <Plus size={16} aria-hidden="true" />
          Tambah {noun}
        </Button>
        {atMax ? <p className="text-sm text-stone-500">Maksimal {max} {noun}.</p> : null}
      </div>
    </div>
  );
}
