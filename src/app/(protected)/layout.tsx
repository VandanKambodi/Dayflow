"use client";

import { useCurrentUserClient } from "@/hook/use-current-user";
import Loading from "@/components/Loading";
import { redirect } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, status } = useCurrentUserClient();

  if (status === "loading") {
    return <Loading />;
  }

  if (!user) {
    redirect("/auth/login");
  }

  return <>{children}</>;
}
