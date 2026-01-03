"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar, Clock, CalendarDays, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { getMyAttendance } from "@/actions/employee/get-my-attendance";
import Loading from "@/components/Loading";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// --- Types ---
type AttendanceRecord = {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  workHours: string | null;
  extraHours: string | null;
  status: string;
};

type Summary = {
  daysPresent: number;
  leavesCount: number;
  totalWorkingDays: number;
};

export default function EmployeeAttendancePage() {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<Summary>({
    daysPresent: 0,
    leavesCount: 0,
    totalWorkingDays: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadAttendance();
  }, [selectedMonth, selectedYear]);

  const loadAttendance = async () => {
    setIsLoading(true);
    const result = await getMyAttendance(selectedMonth, selectedYear);
    if (result.error) {
      toast.error(result.error);
      setIsLoading(false);
      return;
    }
    if (result.attendanceData && result.summary) {
      setAttendanceData(result.attendanceData);
      setSummary(result.summary);
    }
    setIsLoading(false);
  };

  const handleMonthChange = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  const formatMonthYear = (month: number, year: number) => {
    const date = new Date(year, month, 1);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const formatDateDisplay = (month: number, year: number) => {
    // Just for the visual header, not functional logic
    const date = new Date(year, month, 1); 
    const monthName = date.toLocaleDateString("en-US", { month: "long" });
    return `${monthName} ${year}`;
  };
  
  // Status Badge Logic (Optional, if you want to use it later)
  const getStatusColor = (status: string) => {
      // You can implement this if you decide to show the status column
      return "text-[#CFCBC8]";
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-black text-[#CFCBC8] selection:bg-[#CFCBC8] selection:text-black relative font-sans">
      
      {/* ================= BACKGROUND ================= */}
      <div className="fixed inset-0 z-0 h-full w-full bg-black bg-[linear-gradient(to_right,#cfcbc80a_1px,transparent_1px),linear-gradient(to_bottom,#cfcbc80a_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-[#CFCBC8] opacity-5 blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* --- Header --- */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#CFCBC8] to-[#999] bg-clip-text text-transparent">
            My Attendance
          </h1>
          <p className="text-[#CFCBC8]/50 text-sm">
            Track your daily check-ins, work hours, and monthly summary.
          </p>
        </div>

        {/* --- Controls & Summary --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          
          {/* Left: Summary Stats */}
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
             {/* Present Card */}
            <div className="flex-1 min-w-[140px] bg-zinc-900/30 border border-[#CFCBC8]/10 rounded-xl p-4 backdrop-blur-sm shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <CheckCircle2 className="w-8 h-8 text-[#CFCBC8]" />
              </div>
              <div className="text-xs font-medium text-[#CFCBC8]/50 uppercase tracking-wider mb-1">Days Present</div>
              <div className="text-2xl font-bold text-[#CFCBC8]">{summary.daysPresent}</div>
            </div>

            {/* Leaves Card */}
            <div className="flex-1 min-w-[140px] bg-zinc-900/30 border border-[#CFCBC8]/10 rounded-xl p-4 backdrop-blur-sm shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <XCircle className="w-8 h-8 text-[#CFCBC8]" />
              </div>
              <div className="text-xs font-medium text-[#CFCBC8]/50 uppercase tracking-wider mb-1">Leaves Taken</div>
              <div className="text-2xl font-bold text-[#CFCBC8]">{summary.leavesCount}</div>
            </div>

            {/* Total Days Card */}
            <div className="flex-1 min-w-[140px] bg-zinc-900/30 border border-[#CFCBC8]/10 rounded-xl p-4 backdrop-blur-sm shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <CalendarDays className="w-8 h-8 text-[#CFCBC8]" />
              </div>
              <div className="text-xs font-medium text-[#CFCBC8]/50 uppercase tracking-wider mb-1">Working Days</div>
              <div className="text-2xl font-bold text-[#CFCBC8]">{summary.totalWorkingDays}</div>
            </div>
          </div>

          {/* Right: Date Navigation */}
          <div className="flex items-center gap-2 bg-zinc-900/50 p-1.5 rounded-xl border border-[#CFCBC8]/10 backdrop-blur-md">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleMonthChange("prev")}
              className="text-[#CFCBC8] hover:bg-[#CFCBC8]/10 hover:text-[#CFCBC8] rounded-lg h-9 w-9"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex gap-2 px-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="bg-transparent text-[#CFCBC8] text-sm font-medium focus:outline-none cursor-pointer [&>option]:bg-zinc-900 [&>option]:text-[#CFCBC8]"
              >
                {[
                  "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"
                ].map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="bg-transparent text-[#CFCBC8] text-sm font-medium focus:outline-none cursor-pointer [&>option]:bg-zinc-900 [&>option]:text-[#CFCBC8]"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - 2 + i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleMonthChange("next")}
              className="text-[#CFCBC8] hover:bg-[#CFCBC8]/10 hover:text-[#CFCBC8] rounded-lg h-9 w-9"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* --- Date Display Header --- */}
        <div className="flex items-center gap-2 text-[#CFCBC8]/80 pb-2 border-b border-[#CFCBC8]/10">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Viewing records for:</span>
            <span className="text-sm font-bold text-[#CFCBC8]">{formatDateDisplay(selectedMonth, selectedYear)}</span>
        </div>

        {/* --- Attendance Table --- */}
        <div className="rounded-2xl border border-[#CFCBC8]/10 bg-zinc-900/30 backdrop-blur-sm overflow-hidden shadow-[0_0_15px_-5px_rgba(207,203,200,0.1)]">
          <Table>
            <TableHeader>
              <TableRow className="border-[#CFCBC8]/10 hover:bg-transparent bg-[#CFCBC8]/5">
                <TableHead className="text-[#CFCBC8] font-semibold pl-6">Date</TableHead>
                <TableHead className="text-[#CFCBC8] font-semibold">Check In</TableHead>
                <TableHead className="text-[#CFCBC8] font-semibold">Check Out</TableHead>
                <TableHead className="text-[#CFCBC8] font-semibold">Work Hours</TableHead>
                <TableHead className="text-[#CFCBC8] font-semibold">Extra Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.length === 0 ? (
                <TableRow className="border-[#CFCBC8]/10 hover:bg-transparent">
                  <TableCell colSpan={5} className="h-48 text-center text-[#CFCBC8]/40">
                    <div className="flex flex-col items-center justify-center gap-3">
                        <Clock className="w-10 h-10 opacity-20" />
                        <p>No attendance records found for this month</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                attendanceData.map((record) => (
                  <TableRow
                    key={record.id}
                    className="border-[#CFCBC8]/5 hover:bg-[#CFCBC8]/5 transition-colors group"
                  >
                    <TableCell className="text-[#CFCBC8] font-medium pl-6">
                        {record.date}
                    </TableCell>
                    <TableCell className="text-[#CFCBC8]/80">
                      {record.checkIn || <span className="text-[#CFCBC8]/20">-</span>}
                    </TableCell>
                    <TableCell className="text-[#CFCBC8]/80">
                      {record.checkOut || <span className="text-[#CFCBC8]/20">-</span>}
                    </TableCell>
                    <TableCell className="text-[#CFCBC8]/80">
                      {record.workHours || <span className="text-[#CFCBC8]/20">-</span>}
                    </TableCell>
                    <TableCell>
                       {record.extraHours ? (
                           <span className="text-green-400 font-medium bg-green-500/10 px-2 py-0.5 rounded text-xs border border-green-500/20">
                               +{record.extraHours}
                           </span>
                       ) : (
                           <span className="text-[#CFCBC8]/20">-</span>
                       )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}