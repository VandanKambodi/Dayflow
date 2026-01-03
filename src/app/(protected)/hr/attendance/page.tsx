"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { getAttendanceByDate } from "@/actions/hr/get-attendance";
import Loading from "@/components/Loading";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// --- Utility Hooks & Helpers ---

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Updated Status Styles to match Dark Mode (Lighter text, subtle background)
const getStatusStyles = (status: string) => {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border";
  
  switch (status?.toLowerCase()) {
    case "present":
      return `${base} border-green-500/20 bg-green-500/10 text-green-400`;
    case "late":
      return `${base} border-yellow-500/20 bg-yellow-500/10 text-yellow-400`;
    case "absent":
      return `${base} border-red-500/20 bg-red-500/10 text-red-400`;
    default:
      return `${base} border-[#CFCBC8]/20 bg-[#CFCBC8]/5 text-[#CFCBC8]`;
  }
};

type AttendanceData = {
  id: string;
  name: string;
  email: string;
  employeeId: string | null;
  image: string | null;
  checkIn: string | null;
  checkOut: string | null;
  workHours: string | null;
  extraHours: string | null;
  status: string;
};

export default function HrAttendancePage() {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const debouncedSearch = useDebounce(searchQuery, 500);

  const loadAttendance = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getAttendanceByDate(selectedDate, debouncedSearch);
      if (result.error) {
        toast.error(result.error);
        setAttendanceData([]);
      } else if (result.attendanceData) {
        setAttendanceData(result.attendanceData);
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, debouncedSearch]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatInputDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-black text-[#CFCBC8] selection:bg-[#CFCBC8] selection:text-black relative font-sans">
      
      {/* ================= BACKGROUND ================= */}
      <div className="fixed inset-0 z-0 h-full w-full bg-black bg-[linear-gradient(to_right,#cfcbc80a_1px,transparent_1px),linear-gradient(to_bottom,#cfcbc80a_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-[#CFCBC8] opacity-5 blur-[120px]"></div>
      </div>

      <div className="relative z-10 p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* --- Page Header & Controls --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#CFCBC8] to-[#999] bg-clip-text text-transparent">
              Daily Attendance
            </h1>
            <p className="text-[#CFCBC8]/50 text-sm mt-1">
              Manage daily employee check-ins, working hours, and status.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-[280px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#CFCBC8]/40" />
              <Input
                type="text"
                placeholder="Search employee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-zinc-900/50 border-[#CFCBC8]/10 text-[#CFCBC8] placeholder:text-[#CFCBC8]/30 focus:border-[#CFCBC8]/40 focus:ring-0 rounded-xl"
              />
            </div>

            {/* Date Navigator */}
            <div className="flex items-center gap-1 bg-zinc-900/50 border border-[#CFCBC8]/10 rounded-xl p-1 shadow-sm backdrop-blur-sm">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDateChange(-1)}
                className="h-9 w-9 text-[#CFCBC8] hover:bg-[#CFCBC8]/10 hover:text-[#CFCBC8]"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="relative">
                {/* Visual Label */}
                <div className="flex items-center justify-center w-[150px] text-sm font-medium px-2 py-1 cursor-pointer hover:bg-[#CFCBC8]/5 rounded-md transition-colors text-[#CFCBC8]">
                  <CalendarIcon className="w-3.5 h-3.5 mr-2 text-[#CFCBC8]/50" />
                  {formatDisplayDate(selectedDate)}
                </div>
                
                {/* Hidden Actual Input */}
                <input
                  type="date"
                  value={formatInputDate(selectedDate)}
                  onChange={(e) => {
                     const d = new Date(e.target.value);
                     if(!isNaN(d.getTime())) setSelectedDate(d);
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDateChange(1)}
                className="h-9 w-9 text-[#CFCBC8] hover:bg-[#CFCBC8]/10 hover:text-[#CFCBC8]"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <Button 
              variant="outline" 
              onClick={() => setSelectedDate(new Date())}
              className="hidden sm:flex border-[#CFCBC8]/20 bg-transparent text-[#CFCBC8] hover:bg-[#CFCBC8] hover:text-black rounded-xl"
            >
              Today
            </Button>
          </div>
        </div>

        {/* --- Data Table --- */}
        <div className="rounded-2xl border border-[#CFCBC8]/10 bg-zinc-900/30 backdrop-blur-sm overflow-hidden shadow-[0_0_15px_-5px_rgba(207,203,200,0.1)]">
          <Table>
            <TableHeader>
              <TableRow className="border-[#CFCBC8]/10 hover:bg-transparent">
                <TableHead className="w-[300px] text-[#CFCBC8]/70 font-medium">Employee</TableHead>
                <TableHead className="text-[#CFCBC8]/70 font-medium">Status</TableHead>
                <TableHead className="text-[#CFCBC8]/70 font-medium">Check In</TableHead>
                <TableHead className="text-[#CFCBC8]/70 font-medium">Check Out</TableHead>
                <TableHead className="text-[#CFCBC8]/70 font-medium">Work Hours</TableHead>
                <TableHead className="text-right text-[#CFCBC8]/70 font-medium">Extra Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.length === 0 ? (
                <TableRow className="border-[#CFCBC8]/10 hover:bg-transparent">
                  <TableCell colSpan={6} className="h-48 text-center text-[#CFCBC8]/40">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <CalendarIcon className="h-10 w-10 text-[#CFCBC8]/10" />
                      <p>No attendance records found for this date.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                attendanceData.map((record) => (
                  <TableRow key={record.id} className="group border-[#CFCBC8]/5 hover:bg-[#CFCBC8]/5 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-[#CFCBC8]/20 ring-2 ring-transparent group-hover:ring-[#CFCBC8]/10 transition-all">
                          <AvatarImage src={record.image ?? ""} />
                          <AvatarFallback className="bg-[#CFCBC8]/10 text-[#CFCBC8] text-xs">
                            {record.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-[#CFCBC8]">
                            {record.name}
                          </span>
                          {record.employeeId && (
                            <span className="text-[10px] text-[#CFCBC8]/40 uppercase tracking-wider">
                              {record.employeeId}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <span className={getStatusStyles(record.status)}>
                        {record.status}
                      </span>
                    </TableCell>
                    
                    <TableCell className="text-sm font-medium text-[#CFCBC8]/80">
                      {record.checkIn || <span className="text-[#CFCBC8]/20">-</span>}
                    </TableCell>
                    
                    <TableCell className="text-sm font-medium text-[#CFCBC8]/80">
                      {record.checkOut || <span className="text-[#CFCBC8]/20">-</span>}
                    </TableCell>
                    
                    <TableCell className="text-sm text-[#CFCBC8]/80">
                      {record.workHours || <span className="text-[#CFCBC8]/20">-</span>}
                    </TableCell>
                    
                    <TableCell className="text-right text-sm">
                      {record.extraHours ? (
                        <span className="text-green-400 font-medium bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
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