"use client";

import Button from "@/components/ui/Button";
import type { ActionResult } from "@/lib/actions/types";
import { useAdminForm } from "@/lib/hooks/useAdminForm";
import FieldRenderer from "./FieldRenderer";
import type { FieldDef, FormValues } from "./fieldTypes";

export type FormSection = { title: string; description?: string; fields: FieldDef[] };

type SettingsFormProps = {
  initial: FormValues;
  sections: FormSection[];
  save: (values: FormValues) => Promise<ActionResult>;
};

/** Form satu halaman (site_settings) berbasis konfigurasi field. */
export default function SettingsForm({ initial, sections, save }: SettingsFormProps) {
  const { values, setValue, errors, saving, dirty, submit } = useAdminForm(initial, save);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
      className="pb-24"
    >
      <div className="space-y-6">
        {sections.map((section) => (
          <section key={section.title} className="rounded-lg border border-stone-200 bg-white p-5 md:p-6">
            <h2 className="text-base font-semibold">{section.title}</h2>
            {section.description ? <p className="mt-1 text-sm text-stone-500">{section.description}</p> : null}
            <div className="mt-5 space-y-5">
              {section.fields.map((field) => (
                <FieldRenderer
                  key={field.name}
                  field={field}
                  values={values}
                  error={errors[field.name]}
                  onChange={setValue}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur lg:bottom-0 lg:left-64">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <p className="text-sm text-stone-500" aria-live="polite">
            {dirty ? "Ada perubahan yang belum disimpan" : "Semua perubahan tersimpan"}
          </p>
          <Button type="submit" loading={saving} disabled={!dirty}>
            Simpan
          </Button>
        </div>
      </div>
    </form>
  );
}
