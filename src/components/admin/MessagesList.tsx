"use client";

import { Mail, MailOpen, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { deleteMessage, markMessageRead } from "@/lib/actions/messages";
import type { ActionResult } from "@/lib/actions/types";
import type { Message } from "@/types/database";

const dateFormat = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" });

export default function MessagesList({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  async function run(id: string, action: () => Promise<ActionResult>) {
    setBusyId(id);
    try {
      const result = await action();
      if (result.ok) {
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

  async function toggleOpen(m: Message) {
    const opening = openId !== m.id;
    setOpenId(opening ? m.id : null);
    if (opening && !m.is_read) await run(m.id, () => markMessageRead(m.id, true));
  }

  async function onDelete(m: Message) {
    const ok = await confirm({
      title: "Hapus pesan ini?",
      description: `Pesan dari ${m.name} akan dihapus permanen.`,
      confirmLabel: "Ya, hapus",
      danger: true,
    });
    if (!ok) return;
    await run(m.id, () => deleteMessage(m.id));
    toast.success("Pesan dihapus.");
  }

  if (messages.length === 0) {
    return (
      <p className="rounded-lg border border-stone-200 bg-white p-6 text-center text-sm text-stone-500">
        Belum ada pesan masuk dari form kontak website.
      </p>
    );
  }

  return (
    <ul className="overflow-hidden rounded-lg border border-stone-200 bg-white">
      {messages.map((m) => {
        const open = openId === m.id;
        return (
          <li key={m.id} className="border-b border-stone-200 last:border-b-0">
            <div className="flex items-center gap-2 p-3 md:px-4">
              <button
                type="button"
                onClick={() => toggleOpen(m)}
                aria-expanded={open}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${m.is_read ? "bg-transparent" : "bg-red-600"}`}
                  aria-label={m.is_read ? "Sudah dibaca" : "Belum dibaca"}
                />
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-sm ${m.is_read ? "" : "font-semibold"}`}>{m.name}</span>
                  <span className="block truncate text-xs text-stone-500">{m.body}</span>
                </span>
                <span className="hidden shrink-0 text-xs text-stone-500 sm:block">
                  {dateFormat.format(new Date(m.created_at))}
                </span>
              </button>
              <Button
                variant="ghost"
                aria-label={m.is_read ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
                loading={busyId === m.id}
                onClick={() => run(m.id, () => markMessageRead(m.id, !m.is_read))}
                className="h-9 px-2"
              >
                {m.is_read ? <Mail size={16} aria-hidden="true" /> : <MailOpen size={16} aria-hidden="true" />}
              </Button>
              <Button
                variant="ghost"
                aria-label={`Hapus pesan dari ${m.name}`}
                disabled={busyId !== null}
                onClick={() => onDelete(m)}
                className="h-9 px-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} aria-hidden="true" />
              </Button>
            </div>
            {open ? (
              <div className="space-y-2 border-t border-stone-200 bg-stone-50 p-4 text-sm">
                <p className="text-xs text-stone-500">
                  <a href={`mailto:${m.email}`} className="underline">
                    {m.email}
                  </a>{" "}
                  · {dateFormat.format(new Date(m.created_at))}
                </p>
                <p className="whitespace-pre-wrap">{m.body}</p>
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
