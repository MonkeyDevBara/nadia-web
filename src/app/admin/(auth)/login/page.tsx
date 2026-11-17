import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Masuk" };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-stone-200 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-xl font-semibold">Masuk ke Admin</h1>
        <p className="mt-1 text-sm text-stone-600">Gunakan email dan password akun owner.</p>
        <LoginForm />
      </div>
    </main>
  );
}
