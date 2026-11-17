import type { Metadata } from "next";
import { statFields } from "@/components/admin/fieldConfigs";
import ListPage from "@/components/admin/ListPage";
import { deleteStat, moveStat, saveStat } from "@/lib/actions/stats";

export const metadata: Metadata = { title: "Statistik" };

export default function StatistikPage() {
  return (
    <ListPage
      title="Statistik"
      description="Angka highlight di bawah hero (disarankan 4 angka agar rapi)."
      table="stats"
      noun="statistik"
      titleKey="value"
      subtitleKey="label"
      fields={statFields}
      defaults={{ value: "", label: "" }}
      save={saveStat}
      remove={deleteStat}
      move={moveStat}
    />
  );
}
