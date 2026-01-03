"use client";

import { useCurrentUserClient } from "@/hook/use-current-user";
import { redirect } from "next/navigation";
import { EmployeeNavbar } from "@/components/EmployeeNavbar";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, status } = useCurrentUserClient();

  if (status === "loading") return null;

  if (user?.role !== "EMPLOYEE") {
    redirect("/hr/employees");
  }

  return (
    <div className="min-h-screen bg-background">
      <EmployeeNavbar />
      <main className="max-w-7xl mx-auto py-8">{children}</main>
    </div>
  );
}
