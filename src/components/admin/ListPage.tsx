import { listRows } from "@/lib/data/admin";
import type { FieldDef, FormValues } from "./fieldTypes";
import ListEditor, { type ListItem } from "./ListEditor";
import PageHeader from "./PageHeader";

type ListPageProps = Omit<React.ComponentProps<typeof ListEditor>, "items"> & {
  title: string;
  description: string;
  table: string;
  fields: FieldDef[];
  defaults: FormValues;
};

/** Halaman admin daftar berurutan (expertise, process, testimonial, dst.) berbasis ListEditor. */
export default async function ListPage({ title, description, table, ...editor }: ListPageProps) {
  const items = await listRows<ListItem>(table);
  return (
    <>
      <PageHeader title={title} description={description} />
      <ListEditor items={items} {...editor} />
    </>
  );
}
