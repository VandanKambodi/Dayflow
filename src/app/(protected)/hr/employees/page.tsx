"use client";

import { useCurrentUserClient } from "@/hook/use-current-user";
import { redirect } from "next/navigation";
import { EmployeesList } from "@/components/hr/EmployeesList";
import Loading from "@/app/loading";

export default function EmployeesPage() {
  const { user, status } = useCurrentUserClient();

  if (status === "loading") return <Loading />;

  if (user?.role !== "HR") {
    redirect("/employee/attendence");
  }

  return (
    <div className="min-h-screen  px-2">
      <div className="max-w-7xl mx-auto">
        <EmployeesList />
      </div>
    </div>
  );
}
