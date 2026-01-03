"use client";

import { useState, useEffect } from "react";
import {
  requestTimeOff,
  getEmployeeTimeOffRequests,
  getTimeOffAllocation,
} from "@/actions/employee/time-off";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TimeOffSkeleton } from "@/components/skeletons";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface TimeOffAllocationData {
  paidTimeOffDays: number;
  paidTimeOffUsed: number;
  sickLeaveDays: number;
  sickLeaveUsed: number;
  unpaidLeavesDays: number;
  unpaidLeavesUsed: number;
}

interface TimeOffRequest {
  id: string;
  type: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  numberOfDays: number;
  status: string;
  createdAt: Date;
}

export default function EmployeeTimeOffPage() {
  const [allocation, setAllocation] = useState<TimeOffAllocationData | null>(
    null
  );
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "PAID_TIME_OFF",
    startDate: "",
    endDate: "",
    reason: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allocationData, requestsData] = await Promise.all([
        getTimeOffAllocation(),
        getEmployeeTimeOffRequests(),
      ]);

      setAllocation(allocationData);
      setRequests(requestsData);
    } catch (error) {
      toast.error("Failed to load time-off data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await requestTimeOff({
        type: formData.type as any,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
      });
      toast.success("Time-off request submitted");
      setFormData({
        type: "PAID_TIME_OFF",
        startDate: "",
        endDate: "",
        reason: "",
      });
      setShowForm(false);
      loadData();
    } catch (error) {
      toast.error("Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <TimeOffSkeleton />;
  }

  const allocationStatus = [
    {
      type: "Paid Time Off",
      total: allocation?.paidTimeOffDays || 0,
      used: allocation?.paidTimeOffUsed || 0,
    },
    {
      type: "Sick Leave",
      total: allocation?.sickLeaveDays || 0,
      used: allocation?.sickLeaveUsed || 0,
    },
    {
      type: "Unpaid Leaves",
      total: allocation?.unpaidLeavesDays || 0,
      used: allocation?.unpaidLeavesUsed || 0,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Allocation Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {allocationStatus.map((item) => (
            <Card key={item.type} className="p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                {item.type}
              </h3>
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">
                    {item.used} / {item.total} days used
                  </span>
                  <span className="text-sm font-semibold">
                    {item.total - item.used} left
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        item.total > 0 ? (item.used / item.total) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Request Form */}
        {!showForm ? (
          <Button onClick={() => setShowForm(true)} className="mb-6">
            + New Request
          </Button>
        ) : (
          <Card className="mb-6 p-6">
            <h2 className="text-xl font-bold mb-4">New Time-Off Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="PAID_TIME_OFF">Paid Time Off</option>
                    <option value="SICK_LEAVE">Sick Leave</option>
                    <option value="UNPAID_LEAVES">Unpaid Leaves</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <Textarea
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Submit Request
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Requests List */}
        <Card>
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">My Time-Off Requests</h2>
          </div>
          <div className="divide-y">
            {requests.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No time-off requests yet
              </div>
            ) : (
              requests.map((request) => (
                <div key={request.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">
                      {request.type.replace(/_/g, " ")}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        request.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : request.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {format(new Date(request.startDate), "dd MMM yyyy")} -{" "}
                    {format(new Date(request.endDate), "dd MMM yyyy")} (
                    {request.numberOfDays} days)
                  </p>
                  <p className="text-sm text-gray-700">{request.reason}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Submitted:{" "}
                    {format(new Date(request.createdAt), "dd MMM yyyy HH:mm")}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
