"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useCurrentUserClient } from "@/hook/use-current-user";
import { signOut } from "next-auth/react";

export function HrNavbar() {
  const pathname = usePathname();
  const { user, status } = useCurrentUserClient();

  const [isCheckedIn, setIsCheckedIn] = React.useState(false);
  const [checkInTime, setCheckInTime] = React.useState<string | null>(null);

  if (status === "loading") return null;

  const handleToggleAttendance = () => {
    if (!isCheckedIn) {
      setCheckInTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } else {
      setCheckInTime(null);
    }
    setIsCheckedIn(!isCheckedIn);
  };

  const navLinks = [
    // { name: "Dashboard", href: "/hr/dashboard" },
    { name: "Employees", href: "/hr/employees" },
    { name: "Attendance", href: "/hr/attendance" },
    { name: "Time Off", href: "/hr/time-off" },
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-8">
          <Link
            href="/hr/dashboard"
            className="flex items-center gap-2 font-bold tracking-tight"
          >
            <div className="bg-foreground text-background size-6 rounded flex items-center justify-center">
              V
            </div>
            <span className="hidden sm:inline-block">v0 Corp</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-foreground",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Check in / out */}
          <div className="flex items-center gap-3 pr-4 border-r">
            <div className="flex flex-col items-end mr-1">
              {isCheckedIn && (
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                  Since {checkInTime}
                </span>
              )}
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "size-2 rounded-full",
                    isCheckedIn ? "bg-green-500 animate-pulse" : "bg-red-500"
                  )}
                />
                <span className="text-sm font-medium">
                  {isCheckedIn ? "Active" : "Offline"}
                </span>
              </div>
            </div>

            <Button
              size="sm"
              variant={isCheckedIn ? "outline" : "default"}
              className="h-8 gap-2"
              onClick={handleToggleAttendance}
            >
              {isCheckedIn ? "Check Out" : "Check In"}
              <ArrowRight className="size-3" />
            </Button>
          </div>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.image ?? ""} />
                  <AvatarFallback>
                    {user?.name?.charAt(0) ?? "H"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end">
              <div className="p-2">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-destructive"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
