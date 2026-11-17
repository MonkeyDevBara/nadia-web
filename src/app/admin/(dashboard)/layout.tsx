import AdminShell from "@/components/admin/AdminShell";
import { requireUser } from "@/lib/actions/auth";
import { countRows } from "@/lib/data/admin";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const unread = await countRows("messages", { column: "is_read", value: false });

  return (
    <AdminShell email={user.email} unread={unread}>
      {children}
    </AdminShell>
  );
}
