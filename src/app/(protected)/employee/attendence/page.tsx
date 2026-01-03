"use client";

import { useState, useEffect } from "react";
import {
  checkInAttendance,
  checkOutAttendance,
  getEmployeeAttendance,
  getTodayAttendanceStatus,
} from "@/actions/employee/attendance";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Loader2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  LogOut,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface AttendanceRecord {
  id: string;
  date: Date;
  checkInTime: Date | null;
  checkOutTime: Date | null;
  workHours: number | null;
  status: string;
}

export default function EmployeeAttendancePage() {
  const [todayStatus, setTodayStatus] = useState<any>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    loadAttendance();
  }, [currentMonth]);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const startDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
      );
      const endDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
      );

      const [todayData, attendanceData] = await Promise.all([
        getTodayAttendanceStatus(),
        getEmployeeAttendance(startDate, endDate),
      ]);

      setTodayStatus(todayData);
      setAttendance(attendanceData);
    } catch (error) {
      toast.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setChecking(true);
      await checkInAttendance();
      toast.success("Checked in successfully");
      loadAttendance();
    } catch (error) {
      toast.error("Failed to check in");
    } finally {
      setChecking(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setChecking(true);
      await checkOutAttendance();
      toast.success("Checked out successfully");
      loadAttendance();
    } catch (error) {
      toast.error("Failed to check out");
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return <AttendanceSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background px-2">
      <div className="max-w-7xl mx-auto">
        {/* Quick Check In/Out Section */}
        <Card className="mb-6 p-6  ">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">
            Today's Attendance
          </h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  todayStatus?.checkInTime
                    ? "bg-emerald-500/20 text-emerald-600"
                    : "bg-red-500/20 text-red-600"
                }`}
              >
                {todayStatus?.checkInTime ? (
                  <Clock className="w-8 h-8" />
                ) : (
                  <LogOut className="w-8 h-8" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <span className="text-2xl font-bold text-slate-800">
                  {todayStatus?.checkInTime ? "Checked In" : "Not Checked In"}
                </span>
                {todayStatus?.checkInTime && (
                  <p className="text-sm text-gray-600 mt-2">
                    Check In:{" "}
                    <span className="font-semibold">
                      {format(new Date(todayStatus.checkInTime), "HH:mm")}
                    </span>
                  </p>
                )}
                {todayStatus?.checkOutTime && (
                  <p className="text-sm text-gray-600">
                    Check Out:{" "}
                    <span className="font-semibold">
                      {format(new Date(todayStatus.checkOutTime), "HH:mm")}
                    </span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {!todayStatus?.checkInTime ? (
                <Button
                  onClick={handleCheckIn}
                  disabled={checking}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {checking && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Check In
                </Button>
              ) : !todayStatus?.checkOutTime ? (
                <Button
                  onClick={handleCheckOut}
                  disabled={checking}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {checking && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Check Out
                </Button>
              ) : null}
            </div>
          </div>
        </Card>

        {/* Month Navigation and Date Picker */}
        <Card className="mb-6 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-bold text-slate-800">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-fit gap-2">
                    <Calendar className="h-4 w-4" />
                    {format(selectedDate, "dd MMM yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date: Date | undefined) => {
                      if (date) {
                        setSelectedDate(date);
                        setCurrentMonth(date);
                      }
                    }}
                    disabled={(date: Date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() - 1
                    )
                  )
                }
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  setCurrentMonth(today);
                  setSelectedDate(today);
                }}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() + 1
                    )
                  )
                }
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50 border-slate-200">
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
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No attendance records found
                    </TableCell>
                  </TableRow>
                ) : (
                  attendance.map((record) => (
                    <TableRow
                      key={record.id}
                      className="border-slate-100 hover:bg-slate-50"
                    >
                      <TableCell className="font-medium text-slate-900">
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
