"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  Briefcase,
  Plane,
  Circle,
  AlertCircle,
} from "lucide-react";

interface EmployeeCardProps {
  id: string;
  name: string;
  email: string;
  image: string | null;
  employeeId: string | null;
  phoneNumber: string | null;
  companyName: string | null;
  isPasswordChanged: boolean;
  attendanceStatus: "PRESENT" | "ON_LEAVE" | "ABSENT";
  createdAt: Date;
}

export function EmployeeCard({ employee }: { employee: EmployeeCardProps }) {
  const joinDate = new Date(employee.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PRESENT":
        return {
          icon: Circle,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
          label: "Present in office",
        };
      case "ON_LEAVE":
        return {
          icon: Plane,
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
          label: "On leave",
        };
      case "ABSENT":
        return {
          icon: AlertCircle,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/10",
          label: "Absent",
        };
      default:
        return {
          icon: AlertCircle,
          color: "text-muted-foreground",
          bgColor: "bg-muted",
          label: "Unknown",
        };
    }
  };

  const statusInfo = getStatusInfo(employee.attendanceStatus);
  const StatusIcon = statusInfo.icon;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="p-6 space-y-4">
        {/* Header with Avatar and Quick Info */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4 flex-1">
            {employee.image ? (
              <Image
                src={employee.image}
                alt={employee.name}
                width={64}
                height={64}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground text-xl font-bold">
                  {employee.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {employee.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                ID: {employee.employeeId || "N/A"}
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <div
              className={`relative group p-2 rounded-full ${statusInfo.bgColor}`}
            >
              <StatusIcon className={`w-6 h-6 ${statusInfo.color}`} />
              <div className="absolute right-0 bottom-full mb-2 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {statusInfo.label}
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 border-t border-border pt-4">
          {/* Email */}
          <div className="flex items-center gap-3 text-foreground">
            <Mail className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm truncate">{employee.email}</span>
          </div>

          {/* Phone */}
          {employee.phoneNumber && (
            <div className="flex items-center gap-3 text-foreground">
              <Phone className="w-4 h-4 text-accent flex-shrink-0" />
              <span className="text-sm">{employee.phoneNumber}</span>
            </div>
          )}

          {/* Company */}
          {employee.companyName && (
            <div className="flex items-center gap-3 text-foreground">
              <Briefcase className="w-4 h-4 text-primary/80 flex-shrink-0" />
              <span className="text-sm truncate">{employee.companyName}</span>
            </div>
          )}

          {/* Join Date */}
          <div className="flex items-center gap-3 text-muted-foreground text-xs pt-2 border-t border-border">
            <span>Joined: {joinDate}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link href={`/hr/employees/${employee.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Profile
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="text-slate-400">
            ⋮
          </Button>
        </div>
      </div>
    </Card>
  );
}
