"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, CalendarClock, PieChart, AlertCircle, Clock } from "lucide-react";
import { getMyTimeOffRequests } from "@/actions/employee/get-my-time-off";
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

type TimeOffRequest = {
  id: string;
  startDate: string;
  endDate: string;
  timeOffType: string;
  days: number;
  status: string;
  attachment: string | null;
  notes: string | null;
  rejectionReason: string | null;
  createdAt: Date;
};

export default function EmployeeTimeOffPage() {
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
  const [allocations, setAllocations] = useState({
    paidTimeOff: { total: 24, used: 0, available: 24 },
    sickTimeOff: { total: 7, used: 0, available: 7 },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const result = await getMyTimeOffRequests();
    if (result.error) {
      toast.error(result.error);
    } else if (result.timeOffRequests) {
      setTimeOffRequests(result.timeOffRequests);
      if (result.allocations) {
        setAllocations(result.allocations);
      }
    }
    setIsLoading(false);
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

  // Modern pill styles for status
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
      <div className="fixed inset-0 z-0 h-full w-full bg-black bg-[linear-gradient(to_right,#cfcbc80a_1px,transparent_1px),linear-gradient(to_bottom,#cfcbc80a_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-[#CFCBC8] opacity-5 blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* --- Header --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#CFCBC8] to-[#999] bg-clip-text text-transparent">
              Request Time Off
            </h1>
            <p className="text-[#CFCBC8]/50 text-sm">
              Manage your leave requests and check your available balances.
            </p>
          </div>
          
          <Button
            onClick={() => setShowModal(true)}
            className="bg-[#CFCBC8] text-black hover:bg-[#EAE8E6] font-semibold border border-[#CFCBC8] shadow-[0_0_15px_-5px_rgba(207,203,200,0.5)] transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>

        {/* --- Summary Cards (Allocations) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Paid Time Off */}
          <div className="relative overflow-hidden rounded-xl border border-[#CFCBC8]/10 bg-zinc-900/30 p-5 backdrop-blur-sm group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <PieChart className="w-12 h-12 text-[#CFCBC8]" />
            </div>
            <div className="text-xs font-medium text-[#CFCBC8]/40 uppercase tracking-wider mb-2">Paid Time Off</div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[#CFCBC8]">{allocations.paidTimeOff.available}</span>
              <span className="text-sm font-normal text-[#CFCBC8]/40">days available</span>
            </div>
            <div className="mt-4 h-1 w-full bg-[#CFCBC8]/10 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-[#CFCBC8]/50 rounded-full" 
                    style={{ width: `${(allocations.paidTimeOff.available / allocations.paidTimeOff.total) * 100}%` }}
                ></div>
            </div>
          </div>

          {/* Sick Leave */}
          <div className="relative overflow-hidden rounded-xl border border-[#CFCBC8]/10 bg-zinc-900/30 p-5 backdrop-blur-sm group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <AlertCircle className="w-12 h-12 text-[#CFCBC8]" />
            </div>
            <div className="text-xs font-medium text-[#CFCBC8]/40 uppercase tracking-wider mb-2">Sick Leave</div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[#CFCBC8]">{allocations.sickTimeOff.available}</span>
              <span className="text-sm font-normal text-[#CFCBC8]/40">days available</span>
            </div>
            <div className="mt-4 h-1 w-full bg-[#CFCBC8]/10 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-[#CFCBC8]/50 rounded-full" 
                    style={{ width: `${(allocations.sickTimeOff.available / allocations.sickTimeOff.total) * 100}%` }}
                ></div>
            </div>
          </div>
        </div>

        {/* --- Requests Table --- */}
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#CFCBC8]/80 border-b border-[#CFCBC8]/10 pb-2">
                <CalendarClock className="w-4 h-4" />
                <span className="text-sm font-medium">Request History</span>
            </div>

            <div className="rounded-2xl border border-[#CFCBC8]/10 bg-zinc-900/30 backdrop-blur-sm overflow-hidden shadow-[0_0_15px_-5px_rgba(207,203,200,0.1)]">
            <Table>
                <TableHeader>
                <TableRow className="border-[#CFCBC8]/10 hover:bg-transparent bg-[#CFCBC8]/5">
                    <TableHead className="text-[#CFCBC8] font-semibold pl-6">Request Type</TableHead>
                    <TableHead className="text-[#CFCBC8] font-semibold">Dates</TableHead>
                    <TableHead className="text-[#CFCBC8] font-semibold">Duration</TableHead>
                    <TableHead className="text-[#CFCBC8] font-semibold">Status</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {timeOffRequests.length === 0 ? (
                    <TableRow className="border-[#CFCBC8]/10 hover:bg-transparent">
                    <TableCell colSpan={5} className="h-48 text-center text-[#CFCBC8]/40">
                        <div className="flex flex-col items-center justify-center gap-3">
                            <Clock className="w-10 h-10 opacity-20" />
                            <p>No time off requests found</p>
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
                            <span className="font-medium text-[#CFCBC8]">{getTimeOffTypeLabel(request.timeOffType)}</span>
                        </TableCell>
                        <TableCell>
                            <div className="text-sm text-[#CFCBC8]/80">
                                {formatDate(request.startDate)} <span className="text-[#CFCBC8]/30 mx-1">→</span> {formatDate(request.endDate)}
                            </div>
                        </TableCell>
                        <TableCell className="text-[#CFCBC8]/80">
                            {request.days} days
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col gap-1.5 items-start">
                                <span className={getStatusBadgeStyles(request.status)}>
                                    {request.status}
                                </span>
                                {request.rejectionReason && (
                                    <div className="text-[10px] text-red-400/80 bg-red-950/20 px-2 py-0.5 rounded border border-red-900/30 max-w-[200px]">
                                        Note: {request.rejectionReason}
                                    </div>
                                )}
                            </div>
                        </TableCell>
                    </TableRow>
                    ))
                )}
                </TableBody>
            </Table>
            </div>
        </div>
      </div>

      {/* Time Off Request Modal */}
      {showModal && (
        <TimeOffRequestModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            loadData();
          }}
          employees={[]}
          isHR={false}
        />
      )}
    </div>
  );
}