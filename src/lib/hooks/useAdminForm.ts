"use client";

import { useCallback, useRef, useState } from "react";
import type { FieldValue, FormValues } from "@/components/admin/fieldTypes";
import { useToast } from "@/components/ui/Toast";
import type { ActionResult } from "@/lib/actions/types";
import { useUnsavedChanges } from "./useUnsavedChanges";

type Options<T> = {
  onSaved?: (data: T, values: FormValues) => void;
};

/**
 * State form admin: nilai, deteksi perubahan belum disimpan (+ peringatan keluar halaman),
 * loading, error per field dari server, dan toast sukses/gagal.
 */
export function useAdminForm<T = undefined>(
  initial: FormValues,
  save: (values: FormValues) => Promise<ActionResult<T>>,
  options: Options<T> = {},
) {
  const toast = useToast();
  const [values, setValues] = useState<FormValues>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const baseline = useRef(JSON.stringify(initial));

  const dirty = JSON.stringify(values) !== baseline.current;
  useUnsavedChanges(dirty && !saving);

  const setValue = useCallback((name: string, value: FieldValue) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!(name in prev)) return prev;
      const rest = { ...prev };
      delete rest[name];
      return rest;
    });
  }, []);

  const submit = useCallback(async () => {
    setSaving(true);
    try {
      const result = await save(values);
      if (result.ok) {
        baseline.current = JSON.stringify(values);
        setErrors({});
        toast.success(result.message);
        options.onSaved?.(result.data, values);
      } else {
        setErrors(result.fieldErrors ?? {});
        toast.error(result.message);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Terjadi kesalahan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }, [values, save, toast, options]);

  /** Tandai nilai saat ini sebagai "sudah tersimpan" (mis. setelah redirect). */
  const markSaved = useCallback(() => {
    baseline.current = JSON.stringify(values);
  }, [values]);

  return { values, setValue, errors, saving, dirty, submit, markSaved };
}
