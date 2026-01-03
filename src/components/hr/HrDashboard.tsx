"use client";

import { useCurrentUserClient } from "@/hook/use-current-user";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { AddEmployeeForm } from "@/components/auth/add-employee-form";
import { useState } from "react";
import { LogOut, Plus, Users } from "lucide-react";
import Image from "next/image";

export default function HRDashboard() {
  const { user: session, status } = useCurrentUserClient();
  const router = useRouter();
  const [showAddEmployee, setShowAddEmployee] = useState(false);

  console.log(session);

  if (status === "loading") {
    return <Loading />;
  }

  if (!session || session.role !== "HR") {
    router.push("/employee/attendence");
    return null;
  }

  const onLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            {session?.image && (
              <Image
                src={session.image}
                alt={session.name || "Logo"}
                width={60}
                height={60}
                className="rounded-lg"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-white">
                {session.companyName || "Company"} HR Portal
              </h1>
              <p className="text-slate-400">Welcome, {session.name}</p>
            </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Info Card */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Company Information
              </h2>
              <div className="space-y-3 text-slate-300">
                <div>
                  <p className="text-sm text-slate-400">Company Name</p>
                  <p className="font-semibold">{session.companyName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="font-semibold">{session.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Phone</p>
                  <p className="font-semibold">{session.phoneNumber}</p>
                </div>
              </div>
            </Card>

            {/* Add Employee Section */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Manage Employees
                </h2>
                <Button
                  onClick={() => setShowAddEmployee(!showAddEmployee)}
                  className="flex gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {showAddEmployee ? "Cancel" : "Add Employee"}
                </Button>
              </div>

              {showAddEmployee ? (
                <div className="border-t border-slate-700 pt-6">
                  <AddEmployeeForm />
                </div>
              ) : (
                <div className="text-slate-400 text-center py-8">
                  <p>Click "Add Employee" to create new employee accounts</p>
                  <p className="text-sm mt-2">
                    Credentials will be auto-generated and sent via email
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/auth/change-password">
                  <Button variant="outline" className="w-full justify-start">
                    Change Password
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  disabled
                >
                  View Reports (Coming Soon)
                </Button>
              </div>
            </Card>

            {/* Account Info */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h3 className="font-semibold text-white mb-4">Account</h3>
              <div className="space-y-2 text-sm text-slate-300">
                <div>
                  <p className="text-slate-400">Role</p>
                  <p className="font-semibold text-blue-400">{session.role}</p>
                </div>
                <div>
                  <p className="text-slate-400">User ID</p>
                  <p className="font-mono text-xs break-all">{session.id}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
