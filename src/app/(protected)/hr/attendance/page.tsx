"use client";

import { useState, useEffect } from "react";
import { getHRAttendance } from "@/actions/employee/attendance";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AttendanceSkeleton } from "@/components/skeletons";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Search,
  Users,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import Image from "next/image";

interface AttendanceRecord {
  id: string;
  date: Date;
  checkInTime: Date | null;
  checkOutTime: Date | null;
  workHours: number | null;
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

export default function HRAttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    loadAttendance();
  }, [currentDate, searchTerm]);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      const data = await getHRAttendance(startDate, endDate, searchTerm);
      setAttendance(data);
    } catch (error) {
      toast.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PRESENT":
        return "bg-green-100 text-green-800";
      case "ABSENT":
        return "bg-red-100 text-red-800";
      case "ON_LEAVE":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <AttendanceSkeleton />;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 px-2">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">
              Attendance Management
            </h1>
          </div>
          <p className="text-slate-600">
            View and manage employee attendance records
          </p>
        </div>

        {/* Filter Card */}
        <Card className="mb-6 p-6 border-slate-200">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-slate-300 focus:border-blue-500"
              />
            </div>

            {/* Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2 border-slate-300">
                  <Calendar className="h-4 w-4" />
                  {format(selectedDate, "dd MMM yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date: Date | undefined) => {
                    if (date) {
                      setSelectedDate(date);
                      setCurrentDate(date);
                    }
                  }}
                  disabled={(date: Date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>

            {/* Navigation Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const prev = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() - 1
                  );
                  setCurrentDate(prev);
                  setSelectedDate(prev);
                }}
                className="border-slate-300"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  setCurrentDate(today);
                  setSelectedDate(today);
                }}
                className="border-slate-300"
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const next = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1
                  );
                  setCurrentDate(next);
                  setSelectedDate(next);
                }}
                className="border-slate-300"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="text-sm text-slate-600 mt-4">
            Showing attendance for{" "}
            <span className="font-semibold text-slate-900">
              {format(currentDate, "MMMM yyyy")}
            </span>
            {searchTerm && (
              <>
                {" "}
                • <span className="font-semibold">
                  {attendance.length}
                </span>{" "}
                matching records
              </>
            )}
          </p>
        </Card>

        {/* Attendance Table */}
        <Card className="border-slate-200 overflow-hidden shadow-sm">
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50 border-slate-200">
                  <TableHead className="font-semibold text-slate-700">
                    Employee
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Date
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Check In
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Check Out
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Work Hours
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-8 w-8 text-slate-300" />
                        <p>No attendance records found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  attendance.map((record) => (
                    <TableRow
                      key={record.id}
                      className="border-slate-100 hover:bg-slate-50"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          {record.user.image ? (
                            <Image
                              src={record.user.image}
                              alt={record.user.name}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                              {record.user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 truncate">
                              {record.user.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {record.user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-700 font-medium">
                        {format(new Date(record.date), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {record.checkInTime
                          ? format(new Date(record.checkInTime), "HH:mm")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {record.checkOutTime
                          ? format(new Date(record.checkOutTime), "HH:mm")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {record.workHours
                          ? `${record.workHours.toFixed(1)}h`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            record.status === "PRESENT"
                              ? "bg-emerald-100 text-emerald-800"
                              : record.status === "ABSENT"
                              ? "bg-red-100 text-red-800"
                              : record.status === "ON_LEAVE"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {record.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
