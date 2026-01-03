"use client";

import { useCurrentUserClient } from "@/hook/use-current-user";
import { redirect } from "next/navigation";
import { HrNavbar } from "@/components/HrNavbar";

export default function HrLayout({ children }: { children: React.ReactNode }) {
  const { user, status } = useCurrentUserClient();

  if (status === "loading") return null;

  if (user?.role !== "HR") {
    redirect("/employee/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <HrNavbar />
      <main className="max-w-7xl mx-auto py-8">{children}</main>
    </div>
  );
}
