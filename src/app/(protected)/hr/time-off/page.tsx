"use client";

import { useState, useEffect } from "react";
import {
  getHRTimeOffRequests,
  approveTimeOffRequest,
  rejectTimeOffRequest,
} from "@/actions/employee/time-off";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TimeOffSkeleton } from "@/components/skeletons";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface TimeOffRequest {
  id: string;
  type: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  numberOfDays: number;
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  createdAt: Date;
}

export default function HRTimeOffPage() {
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionForm, setShowRejectionForm] = useState<string | null>(
    null
  );

  useEffect(() => {
    loadRequests();
  }, [searchTerm]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await getHRTimeOffRequests(searchTerm);
      setRequests(data);
    } catch (error) {
      toast.error("Failed to load time-off requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      setProcessingId(requestId);
      await approveTimeOffRequest(requestId);
      toast.success("Request approved");
      loadRequests();
    } catch (error) {
      toast.error("Failed to approve request");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      setProcessingId(requestId);
      await rejectTimeOffRequest(requestId, rejectionReason);
      toast.success("Request rejected");
      setShowRejectionForm(null);
      setRejectionReason("");
      loadRequests();
    } catch (error) {
      toast.error("Failed to reject request");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <TimeOffSkeleton />;
  }

  const pendingRequests = requests.filter((r) => r.status === "PENDING");
  const allRequests = requests;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Time-Off Management</h1>
          <Input
            placeholder="Search by employee name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Pending Requests Section */}
        {pendingRequests.length > 0 && (
          <Card className="mb-6">
            <div className="p-6 border-b bg-yellow-50">
              <h2 className="text-xl font-bold text-yellow-900">
                Pending Requests ({pendingRequests.length})
              </h2>
            </div>
            <div className="divide-y">
              {pendingRequests.map((request) => (
                <div key={request.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {request.user.image ? (
                        <img
                          src={request.user.image}
                          alt={request.user.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                          {request.user.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{request.user.name}</p>
                        <p className="text-sm text-gray-600">
                          {request.user.email}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2">
                      {request.type.replace(/_/g, " ")}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {format(new Date(request.startDate), "dd MMM yyyy")} -{" "}
                      {format(new Date(request.endDate), "dd MMM yyyy")}
                      <span className="font-semibold text-gray-900 ml-2">
                        ({request.numberOfDays} days)
                      </span>
                    </p>
                    <p className="text-sm text-gray-700">{request.reason}</p>
                  </div>

                  {showRejectionForm === request.id ? (
                    <div className="bg-red-50 p-4 rounded-lg mb-4 space-y-2">
                      <label className="block text-sm font-medium">
                        Rejection Reason
                      </label>
                      <Textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Provide a reason for rejection..."
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleReject(request.id)}
                          disabled={processingId === request.id}
                          variant="destructive"
                          size="sm"
                        >
                          {processingId === request.id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : null}
                          Confirm Rejection
                        </Button>
                        <Button
                          onClick={() => {
                            setShowRejectionForm(null);
                            setRejectionReason("");
                          }}
                          variant="outline"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(request.id)}
                        disabled={processingId === request.id}
                      >
                        {processingId === request.id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : null}
                        Approve
                      </Button>
                      <Button
                        onClick={() => setShowRejectionForm(request.id)}
                        variant="outline"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* All Requests Section */}
        <Card>
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">All Requests</h2>
          </div>
          <div className="divide-y">
            {allRequests.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No time-off requests found
              </div>
            ) : (
              allRequests.map((request) => (
                <div key={request.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{request.user.name}</p>
                      <p className="text-sm text-gray-600">
                        {request.user.email}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-1">
                    {request.type.replace(/_/g, " ")}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    {format(new Date(request.startDate), "dd MMM yyyy")} -{" "}
                    {format(new Date(request.endDate), "dd MMM yyyy")} (
                    {request.numberOfDays} days)
                  </p>
                  <p className="text-sm text-gray-700">{request.reason}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Requested on:{" "}
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
