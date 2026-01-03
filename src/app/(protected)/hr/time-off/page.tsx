"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Check, X, CalendarClock, PieChart, ChevronRight } from "lucide-react";
import { getTimeOffRequests } from "@/actions/hr/get-time-off";
import { approveTimeOffRequest, rejectTimeOffRequest } from "@/actions/time-off/approve-reject";
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
import { TimeOffRequestModal } from "@/components/time-off/TimeOffRequestModal";
import { getEmployees } from "@/actions/hr/get-employees";

// --- Types ---
type TimeOffRequest = {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  employeeIdCode?: string | null;
  startDate: string;
  endDate: string;
  timeOffType: string;
  days: number;
  status: string;
  attachment: string | null;
  notes: string | null;
  createdAt: Date;
};

export default function HrTimeOffPage() {
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
  const [allocations, setAllocations] = useState({
    paidTimeOff: { total: 24, used: 0, available: 24 },
    sickTimeOff: { total: 7, used: 0, available: 7 },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"timeoff" | "allocation">("timeoff");

  useEffect(() => {
    loadData();
  }, [searchQuery]);

  const loadData = async () => {
    setIsLoading(true);
    const [timeOffResult, employeesResult] = await Promise.all([
      getTimeOffRequests(searchQuery),
      getEmployees(),
    ]);

    if (timeOffResult.error) {
      toast.error(timeOffResult.error);
    } else if (timeOffResult.timeOffRequests) {
      setTimeOffRequests(timeOffResult.timeOffRequests);
      if (timeOffResult.allocations) {
        setAllocations(timeOffResult.allocations);
      }
    }

    if (employeesResult.employees) {
      setEmployees(employeesResult.employees);
    }

    setIsLoading(false);
  };

  const handleApprove = async (id: string) => {
    const result = await approveTimeOffRequest(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.success);
      loadData();
    }
  };

  const handleReject = async (id: string) => {
    const result = await rejectTimeOffRequest(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.success);
      loadData();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getTimeOffTypeLabel = (type: string) => {
    switch (type) {
      case "PAID_TIME_OFF": return "Paid Time Off";
      case "SICK_LEAVE": return "Sick Leave";
      case "UNPAID_LEAVE": return "Unpaid Leave";
      default: return type;
    }
  };

  // --- UI Helpers ---
  const getStatusBadgeStyles = (status: string) => {
    const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border";
    switch (status) {
      case "APPROVED":
        return `${base} bg-green-500/10 text-green-400 border-green-500/20`;
      case "REJECTED":
        return `${base} bg-red-500/10 text-red-400 border-red-500/20`;
      case "PENDING":
        return `${base} bg-yellow-500/10 text-yellow-400 border-yellow-500/20`;
      default:
        return `${base} bg-[#CFCBC8]/10 text-[#CFCBC8] border-[#CFCBC8]/20`;
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-black text-[#CFCBC8] selection:bg-[#CFCBC8] selection:text-black relative font-sans">
      
      {/* ================= BACKGROUND ================= */}
      {/* This creates the grid pattern and dark background without needing a layout file */}
      <div className="fixed inset-0 z-0 h-full w-full bg-black bg-[linear-gradient(to_right,#cfcbc80a_1px,transparent_1px),linear-gradient(to_bottom,#cfcbc80a_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-[#CFCBC8] opacity-5 blur-[120px]"></div>
      </div>

      <div className="relative z-10 p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">

        {/* --- Header Section --- */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#CFCBC8] to-[#999] bg-clip-text text-transparent">
              Time Off Management
            </h1>
            <p className="text-[#CFCBC8]/50 text-sm">
              Review leave requests and manage team allocations.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-6 border-b border-[#CFCBC8]/10 pt-2">
            <button
              onClick={() => setActiveTab("timeoff")}
              className={`flex items-center gap-2 pb-3 text-sm font-medium transition-all relative ${
                activeTab === "timeoff"
                  ? "text-[#CFCBC8]"
                  : "text-[#CFCBC8]/40 hover:text-[#CFCBC8]/70"
              }`}
            >
              <CalendarClock className="w-4 h-4" />
              Requests
              {activeTab === "timeoff" && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#CFCBC8] rounded-t-full shadow-[0_0_10px_#CFCBC8]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("allocation")}
              className={`flex items-center gap-2 pb-3 text-sm font-medium transition-all relative ${
                activeTab === "allocation"
                  ? "text-[#CFCBC8]"
                  : "text-[#CFCBC8]/40 hover:text-[#CFCBC8]/70"
              }`}
            >
              <PieChart className="w-4 h-4" />
              Allocations
              {activeTab === "allocation" && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#CFCBC8] rounded-t-full shadow-[0_0_10px_#CFCBC8]" />
              )}
            </button>
          </div>
        </div>

        {activeTab === "timeoff" && (
          <div className="space-y-6">
            
            {/* --- Summary Cards --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative overflow-hidden rounded-xl border border-[#CFCBC8]/10 bg-zinc-900/30 p-5 backdrop-blur-sm">
                <div className="text-xs font-medium text-[#CFCBC8]/40 uppercase tracking-wider mb-2">Paid Time Off</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#CFCBC8]">{allocations.paidTimeOff.available}</span>
                  <span className="text-sm font-normal text-[#CFCBC8]/40">days left</span>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-[#CFCBC8]/10 bg-zinc-900/30 p-5 backdrop-blur-sm">
                <div className="text-xs font-medium text-[#CFCBC8]/40 uppercase tracking-wider mb-2">Sick Leave</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#CFCBC8]">{allocations.sickTimeOff.available}</span>
                  <span className="text-sm font-normal text-[#CFCBC8]/40">days left</span>
                </div>
              </div>
            </div>

            {/* --- Action Bar --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
              <Button
                onClick={() => setShowModal(true)}
                className="bg-[#CFCBC8] text-black hover:bg-[#EAE8E6] font-semibold border border-[#CFCBC8] shadow-[0_0_15px_-5px_rgba(207,203,200,0.5)] transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>

              <div className="relative w-full sm:w-auto sm:min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#CFCBC8]/40" />
                <Input
                  type="text"
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") loadData();
                  }}
                  className="pl-10 bg-zinc-900/50 border-[#CFCBC8]/10 text-[#CFCBC8] placeholder:text-[#CFCBC8]/30 focus:border-[#CFCBC8]/40 focus:ring-0 rounded-xl"
                />
              </div>
            </div>

            {/* --- Data Table --- */}
            <div className="rounded-2xl border border-[#CFCBC8]/10 bg-zinc-900/30 backdrop-blur-sm overflow-hidden shadow-[0_0_15px_-5px_rgba(207,203,200,0.1)]">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#CFCBC8]/10 hover:bg-transparent">
                    <TableHead className="text-[#CFCBC8]/70 font-medium pl-6">Employee</TableHead>
                    <TableHead className="text-[#CFCBC8]/70 font-medium">Dates</TableHead>
                    <TableHead className="text-[#CFCBC8]/70 font-medium">Type</TableHead>
                    <TableHead className="text-[#CFCBC8]/70 font-medium">Status</TableHead>
                    <TableHead className="text-[#CFCBC8]/70 font-medium text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeOffRequests.length === 0 ? (
                    <TableRow className="border-[#CFCBC8]/10 hover:bg-transparent">
                      <TableCell colSpan={5} className="h-48 text-center text-[#CFCBC8]/40">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <CalendarClock className="h-10 w-10 text-[#CFCBC8]/10" />
                          <p>No time off requests found.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    timeOffRequests.map((request) => (
                      <TableRow
                        key={request.id}
                        className="border-[#CFCBC8]/5 hover:bg-[#CFCBC8]/5 transition-colors group"
                      >
                        <TableCell className="pl-6">
                          <div>
                            <div className="font-medium text-[#CFCBC8]">{request.employeeName}</div>
                            {request.employeeIdCode && (
                              <div className="text-[10px] text-[#CFCBC8]/40 uppercase tracking-wide">{request.employeeIdCode}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-[#CFCBC8]/80">
                            {formatDate(request.startDate)} <span className="text-[#CFCBC8]/30 mx-1">→</span> {formatDate(request.endDate)}
                          </div>
                          <div className="text-xs text-[#CFCBC8]/40 mt-0.5">{request.days} days</div>
                        </TableCell>
                        <TableCell>
                           <span className="text-sm text-[#CFCBC8]/80">{getTimeOffTypeLabel(request.timeOffType)}</span>
                        </TableCell>
                        <TableCell>
                          <span className={getStatusBadgeStyles(request.status)}>
                            {request.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          {request.status === "PENDING" ? (
                            <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApprove(request.id)}
                                className="h-8 w-8 p-0 rounded-full border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-300 hover:border-green-500/50 transition-colors"
                                title="Approve"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(request.id)}
                                className="h-8 w-8 p-0 rounded-full border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50 transition-colors"
                                title="Reject"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                             <span className="text-xs text-[#CFCBC8]/30 italic">Processed</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {activeTab === "allocation" && (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[#CFCBC8]/10 rounded-2xl bg-[#CFCBC8]/5 animate-in fade-in slide-in-from-bottom-2">
            <PieChart className="w-12 h-12 text-[#CFCBC8]/20 mb-4" />
            <h3 className="text-lg font-medium text-[#CFCBC8]">Allocation Management</h3>
            <p className="text-sm text-[#CFCBC8]/40 mt-1 max-w-sm text-center">
              Detailed breakdown of employee leave balances and global allocation settings will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Time Off Request Modal */}
      {showModal && (
        <TimeOffRequestModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            loadData();
          }}
          employees={employees}
          isHR={true}
        />
      )}
    </div>
  );
}