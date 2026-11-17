import { getAdminSettings } from "@/lib/data/admin";
import type { ActionResult } from "@/lib/actions/types";
import type { FormValues } from "./fieldTypes";
import { pickValues } from "./fieldConfigs";
import PageHeader from "./PageHeader";
import SettingsForm, { type FormSection } from "./SettingsForm";

type SettingsPageProps = {
  title: string;
  description: string;
  sections: FormSection[];
  save: (values: FormValues) => Promise<ActionResult>;
};

/** Halaman admin untuk mengedit satu kelompok kolom site_settings. */
export default async function SettingsPage({ title, description, sections, save }: SettingsPageProps) {
  const settings = await getAdminSettings();

  return (
    <>
      <PageHeader title={title} description={description} />
      {settings ? (
        <SettingsForm initial={pickValues(settings, sections)} sections={sections} save={save} />
      ) : (
        <p className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          Data pengaturan belum ada. Jalankan <code>supabase/seed.sql</code> di Supabase SQL Editor terlebih dahulu.
        </p>
      )}
    </>
  );
}
