"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getEmployeeProfile } from "@/actions/hr/get-employee-profile";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  CreditCard,
  Clock,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface EmployeeData {
  id: string;
  name: string;
  email: string;
  image: string | null;
  phoneNumber: string | null;
  companyName: string | null;
  createdAt: Date;
  role: string;
  employeeDetails: {
    dateOfBirth: Date | null;
    nationality: string | null;
    gender: string | null;
    maritalStatus: string | null;
    mailingAddress: string | null;
    personalEmail: string | null;
    dateOfJoining: Date | null;
    department: string | null;
    designation: string | null;
    manager: string | null;
    location: string | null;
    panNumber: string | null;
    aadharNumber: string | null;
    accountNumber: string | null;
    bankName: string | null;
    ifscCode: string | null;
    resume: string | null;
    skills: string[];
    about: string | null;
    interests: string | null;
  } | null;
  salaryInfo: {
    id: string;
    monthlyWage: number | null;
    yearlyWage: number | null;
    baseSalary: number | null;
    hraAllowance: number | null;
    standardAllowance: number | null;
    performanceBonus: number | null;
    pfContribution: number | null;
    professionalTax: number | null;
  } | null;
  attendances: Array<{
    id: string;
    date: Date;
    checkInTime: Date | null;
    checkOutTime: Date | null;
    workHours: number | null;
    status: string;
  }>;
  timeOffRequests: Array<{
    id: string;
    type: string;
    startDate: Date;
    endDate: Date;
    status: string;
    reason: string | null;
  }>;
}

export default function EmployeeProfilePage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;

  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEmployeeProfile();
  }, [employeeId]);

  const loadEmployeeProfile = async () => {
    try {
      setLoading(true);
      const result = await getEmployeeProfile(employeeId);
      if (result.error) {
        setError(result.error);
      } else if (result.employee) {
        setEmployee(result.employee);
      }
    } catch (err) {
      setError("Failed to load employee profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background px-2 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="min-h-screen bg-background px-2">
        <div className="max-w-7xl mx-auto">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Card className="p-6 bg-destructive/10 border-destructive text-destructive">
            <p>{error || "Employee profile not found"}</p>
          </Card>
        </div>
      </div>
    );
  }

  const details = employee.employeeDetails;
  const salary = employee.salaryInfo;

  return (
    <div className="min-h-screen bg-background px-2">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button onClick={() => router.back()} variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Employees
        </Button>

        {/* Profile Header */}
        <Card className="mb-6 p-6">
          <div className="flex items-start gap-6">
            {employee.image ? (
              <Image
                src={employee.image}
                alt={employee.name}
                width={120}
                height={120}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="w-30 h-30 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground text-4xl font-bold">
                  {employee.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{employee.name}</h1>
              <div className="space-y-2 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{employee.email}</span>
                </div>
                {employee.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{employee.phoneNumber}</span>
                  </div>
                )}
                {details?.dateOfJoining && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Joined{" "}
                      {new Date(details.dateOfJoining).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </span>
                  </div>
                )}
                {details?.department && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>{details.department}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Card>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0">
              <TabsTrigger
                value="personal"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
              >
                Personal Info
              </TabsTrigger>
              <TabsTrigger
                value="professional"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
              >
                Professional
              </TabsTrigger>
              {salary && (
                <TabsTrigger
                  value="salary"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
                >
                  Salary Info
                </TabsTrigger>
              )}
              <TabsTrigger
                value="attendance"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
              >
                Attendance
              </TabsTrigger>
              <TabsTrigger
                value="timeoff"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
              >
                Time Off
              </TabsTrigger>
            </TabsList>

            {/* Personal Info Tab */}
            <TabsContent value="personal" className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {details?.dateOfBirth && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Date of Birth
                    </label>
                    <p className="text-lg mt-1">
                      {new Date(details.dateOfBirth).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </p>
                  </div>
                )}
                {details?.gender && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Gender
                    </label>
                    <p className="text-lg mt-1 capitalize">{details.gender}</p>
                  </div>
                )}
                {details?.nationality && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Nationality
                    </label>
                    <p className="text-lg mt-1">{details.nationality}</p>
                  </div>
                )}
                {details?.maritalStatus && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Marital Status
                    </label>
                    <p className="text-lg mt-1 capitalize">
                      {details.maritalStatus}
                    </p>
                  </div>
                )}
              </div>

              {details?.mailingAddress && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Mailing Address
                  </label>
                  <p className="text-lg mt-1">{details.mailingAddress}</p>
                </div>
              )}

              {details?.about && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    About
                  </label>
                  <p className="text-lg mt-1">{details.about}</p>
                </div>
              )}

              {details?.interests && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Interests & Hobbies
                  </label>
                  <p className="text-lg mt-1">{details.interests}</p>
                </div>
              )}
            </TabsContent>

            {/* Professional Tab */}
            <TabsContent value="professional" className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {details?.department && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Department
                    </label>
                    <p className="text-lg mt-1">{details.department}</p>
                  </div>
                )}
                {details?.designation && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Designation
                    </label>
                    <p className="text-lg mt-1">{details.designation}</p>
                  </div>
                )}
                {details?.manager && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Manager
                    </label>
                    <p className="text-lg mt-1">{details.manager}</p>
                  </div>
                )}
                {details?.location && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Location
                    </label>
                    <p className="text-lg mt-1">{details.location}</p>
                  </div>
                )}
              </div>

              {/* Skills */}
              {details?.skills && details.skills.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-3">
                    Skills
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {details.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ID and Security Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  ID & Security Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {details?.panNumber && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        PAN Number
                      </label>
                      <p className="text-lg mt-1 font-mono">
                        {details.panNumber}
                      </p>
                    </div>
                  )}
                  {details?.aadharNumber && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Aadhar Number
                      </label>
                      <p className="text-lg mt-1 font-mono">
                        {details.aadharNumber}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bank Details */}
              {(details?.bankName ||
                details?.accountNumber ||
                details?.ifscCode) && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Bank Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {details?.bankName && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Bank Name
                        </label>
                        <p className="text-lg mt-1">{details.bankName}</p>
                      </div>
                    )}
                    {details?.accountNumber && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Account Number
                        </label>
                        <p className="text-lg mt-1 font-mono">
                          {details.accountNumber}
                        </p>
                      </div>
                    )}
                    {details?.ifscCode && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          IFSC Code
                        </label>
                        <p className="text-lg mt-1 font-mono">
                          {details.ifscCode}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Salary Info Tab */}
            {salary && (
              <TabsContent value="salary" className="p-6 space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-600">
                    Salary information is confidential and only visible to HR
                    administrators.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {salary.monthlyWage && (
                    <div className="bg-white border rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-600">
                        Monthly Wage
                      </label>
                      <p className="text-2xl font-bold mt-2">
                        ₹{salary.monthlyWage.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {salary.yearlyWage && (
                    <div className="bg-white border rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-600">
                        Yearly Wage
                      </label>
                      <p className="text-2xl font-bold mt-2">
                        ₹{salary.yearlyWage.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Salary Components
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {salary.baseSalary && (
                      <div className="border rounded-lg p-3">
                        <span className="text-sm text-gray-600">
                          Base Salary
                        </span>
                        <p className="text-lg font-semibold">
                          ₹{salary.baseSalary.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {salary.hraAllowance && (
                      <div className="border rounded-lg p-3">
                        <span className="text-sm text-gray-600">
                          HRA Allowance
                        </span>
                        <p className="text-lg font-semibold">
                          ₹{salary.hraAllowance.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {salary.standardAllowance && (
                      <div className="border rounded-lg p-3">
                        <span className="text-sm text-gray-600">
                          Standard Allowance
                        </span>
                        <p className="text-lg font-semibold">
                          ₹{salary.standardAllowance.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {salary.performanceBonus && (
                      <div className="border rounded-lg p-3">
                        <span className="text-sm text-gray-600">
                          Performance Bonus
                        </span>
                        <p className="text-lg font-semibold">
                          ₹{salary.performanceBonus.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Deductions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {salary.pfContribution && (
                      <div className="border rounded-lg p-3">
                        <span className="text-sm text-gray-600">
                          PF Contribution
                        </span>
                        <p className="text-lg font-semibold">
                          ₹{salary.pfContribution.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {salary.professionalTax && (
                      <div className="border rounded-lg p-3">
                        <span className="text-sm text-gray-600">
                          Professional Tax
                        </span>
                        <p className="text-lg font-semibold">
                          ₹{salary.professionalTax.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            )}

            {/* Attendance Tab */}
            <TabsContent value="attendance" className="p-6 space-y-4">
              <h3 className="text-lg font-semibold mb-4">Recent Attendance</h3>
              {employee.attendances && employee.attendances.length > 0 ? (
                <div className="space-y-2">
                  {employee.attendances.map((attendance) => (
                    <div
                      key={attendance.id}
                      className="border rounded-lg p-4 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-4">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-semibold">
                            {new Date(attendance.date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                          {attendance.checkInTime &&
                            attendance.checkOutTime && (
                              <p className="text-sm text-gray-600">
                                {new Date(
                                  attendance.checkInTime
                                ).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}{" "}
                                -{" "}
                                {new Date(
                                  attendance.checkOutTime
                                ).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            attendance.status === "PRESENT"
                              ? "bg-green-100 text-green-800"
                              : attendance.status === "ABSENT"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {attendance.status}
                        </span>
                        {attendance.workHours && (
                          <p className="text-sm text-gray-600 mt-1">
                            {attendance.workHours.toFixed(1)}h
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No attendance records found.</p>
              )}
            </TabsContent>

            {/* Time Off Tab */}
            <TabsContent value="timeoff" className="p-6 space-y-4">
              <h3 className="text-lg font-semibold mb-4">Time Off Requests</h3>
              {employee.timeOffRequests &&
              employee.timeOffRequests.length > 0 ? (
                <div className="space-y-2">
                  {employee.timeOffRequests.map((request) => (
                    <div
                      key={request.id}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold capitalize">
                            {request.type.replace(/_/g, " ")}
                          </p>
                          {request.reason && (
                            <p className="text-sm text-gray-600">
                              {request.reason}
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            request.status === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : request.status === "REJECTED"
                              ? "bg-red-100 text-red-800"
                              : request.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(request.startDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}{" "}
                        -{" "}
                        {new Date(request.endDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No time off requests found.</p>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
