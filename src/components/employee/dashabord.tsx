"use client";

import { useCurrentUserClient } from "@/hook/use-current-user";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { LogOut, Lock, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function EmployeeDashboard() {
  const { user: session, status } = useCurrentUserClient();
  const router = useRouter();

  if (status === "loading") {
    return <Loading />;
  }

  if (!session || session.role !== "EMPLOYEE") {
    router.push("/hr/employees");
    return null;
  }

  const onLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Employee Portal</h1>
            <p className="text-slate-400">Welcome, {session.name}</p>
          </div>
          <Button
            variant="destructive"
            onClick={onLogout}
            className="flex gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <div className="space-y-6">
          {/* Password Change Alert */}
          {!session.isPasswordChanged && (
            <Card className="bg-amber-900/20 border-amber-700 p-6">
              <div className="flex gap-4 items-start">
                <AlertCircle className="w-6 h-6 text-amber-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-100 mb-2">
                    Action Required: Change Your Password
                  </h3>
                  <p className="text-amber-100/80 mb-4">
                    This is your first login. For security reasons, you must
                    change your password immediately.
                  </p>
                  <Link href="/change-password">
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password Now
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          )}

          {/* Employee Information */}
          <Card className="bg-slate-800 border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-400 mb-1">Full Name</p>
                <p className="text-white font-semibold">{session.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Employee ID</p>
                <p className="text-white font-semibold font-mono">
                  {session.employeeId || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Email</p>
                <p className="text-white font-semibold">{session.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Phone</p>
                <p className="text-white font-semibold">
                  {session.phoneNumber || "N/A"}
                </p>
              </div>
            </div>
          </Card>

          {/* Company Information */}
          <Card className="bg-slate-800 border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              Company Information
            </h2>
            <div className="flex gap-6 items-center">
              {session.image && (
                <Image
                  src={session.image}
                  alt={session.companyName || "Company Logo"}
                  width={100}
                  height={100}
                  className="rounded-lg object-contain"
                />
              )}
              <div className="flex-1">
                <p className="text-sm text-slate-400 mb-1">Company Name</p>
                <p className="text-white font-semibold text-lg">
                  {session.companyName}
                </p>
              </div>
            </div>
          </Card>

          {/* Account Actions */}
          <Card className="bg-slate-800 border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Account Actions
            </h2>
            <div className="space-y-3">
              <Link href="/change-password">
                <Button variant="outline" className="w-full justify-start">
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </Link>
            </div>
          </Card>

          {/* Account Details */}
          <Card className="bg-slate-800 border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Account Details
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-slate-400">Role</p>
                <p className="text-white font-semibold">{session.role}</p>
              </div>
              <div>
                <p className="text-slate-400">User ID</p>
                <p className="text-white font-mono break-all">{session.id}</p>
              </div>
              <div>
                <p className="text-slate-400">Password Status</p>
                <p
                  className={`font-semibold ${
                    session.isPasswordChanged
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {session.isPasswordChanged ? "✓ Changed" : "⚠ Needs Change"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
