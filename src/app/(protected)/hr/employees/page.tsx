"use client";

import { useState, useEffect, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Circle, Plane, Loader2, UserPlus, Users, Briefcase, Hash } from "lucide-react";
import { getEmployees } from "@/actions/hr/get-employees";
import Loading from "@/components/Loading";
import { toast } from "sonner";
import { AddEmployee } from "@/actions/auth/add-employee";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeAddSchema } from "@/lib";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

type Employee = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  employeeId: string | null;
  jobPosition: string | null;
  department: string | null;
  phoneNumber: string | null;
  createdAt: Date;
};

type EmployeeStatus = "present" | "leave" | "absent";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = employees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query) ||
          emp.employeeId?.toLowerCase().includes(query) ||
          emp.jobPosition?.toLowerCase().includes(query) ||
          emp.department?.toLowerCase().includes(query)
      );
      setFilteredEmployees(filtered);
    }
  }, [searchQuery, employees]);

  const loadEmployees = async () => {
    setIsLoading(true);
    const result = await getEmployees();
    if (result.error) {
      toast.error(result.error);
      setIsLoading(false);
      return;
    }
    if (result.employees) {
      setEmployees(result.employees);
      setFilteredEmployees(result.employees);
    }
    setIsLoading(false);
  };

  const handleEmployeeAdded = () => {
    setShowAddEmployee(false);
    loadEmployees();
  };

  const getEmployeeStatus = (employee: Employee): EmployeeStatus => {
    const random = Math.random();
    if (random < 0.6) return "present";
    if (random < 0.8) return "leave";
    return "absent";
  };

  const renderStatusIcon = (status: EmployeeStatus) => {
    switch (status) {
      case "present":
        return (
          <div className="absolute top-4 right-4" title="Present">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]"></span>
            </span>
          </div>
        );
      case "leave":
        return (
          <div className="absolute top-4 right-4" title="On Leave">
            <div className="bg-blue-500/10 p-1.5 rounded-full border border-blue-500/20">
                <Plane className="w-3.5 h-3.5 text-blue-400" />
            </div>
          </div>
        );
      case "absent":
        return (
          <div className="absolute top-4 right-4" title="Absent">
            <span className="relative flex h-3 w-3">
               <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]"></span>
            </span>
          </div>
        );
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  // --- UI Constants ---
  const cardStyles = "relative bg-zinc-900/30 border border-[#CFCBC8]/10 rounded-xl p-6 hover:border-[#CFCBC8]/30 hover:bg-zinc-900/50 transition-all cursor-pointer group backdrop-blur-sm overflow-hidden";
  const inputStyles = "bg-black/40 border-[#CFCBC8]/20 text-[#CFCBC8] placeholder:text-[#CFCBC8]/30 focus:border-[#CFCBC8] focus:ring-[#CFCBC8]/20 h-10";

  return (
    <div className="min-h-screen bg-black text-[#CFCBC8] selection:bg-[#CFCBC8] selection:text-black">
      
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 h-full w-full bg-black bg-[linear-gradient(to_right,#cfcbc80a_1px,transparent_1px),linear-gradient(to_bottom,#cfcbc80a_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-[#CFCBC8] opacity-5 blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#CFCBC8]/10 pb-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#CFCBC8] to-[#999] bg-clip-text text-transparent mb-2">
                    Team Directory
                </h1>
                <p className="text-[#CFCBC8]/60 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Total Employees: <span className="text-[#CFCBC8] font-bold">{employees.length}</span>
                </p>
            </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900/20 p-4 rounded-xl border border-[#CFCBC8]/5 backdrop-blur-sm">
          <Button
            onClick={() => setShowAddEmployee(!showAddEmployee)}
            className={`transition-all duration-300 font-semibold ${
              showAddEmployee
                ? "bg-transparent border border-red-500/50 text-red-400 hover:bg-red-950/30 hover:border-red-500"
                : "bg-[#CFCBC8] text-black border border-[#CFCBC8] hover:bg-[#EAE8E6] shadow-[0_0_15px_-3px_rgba(207,203,200,0.3)]"
            }`}
          >
            <Plus className={`w-4 h-4 mr-2 transition-transform duration-300 ${showAddEmployee ? "rotate-45" : ""}`} />
            {showAddEmployee ? "Cancel" : "Add Employee"}
          </Button>

          <div className="relative w-full sm:w-auto sm:min-w-[320px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#CFCBC8]/50" />
            <Input
              type="text"
              placeholder="Search by name, ID, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(inputStyles, "pl-10")}
            />
          </div>
        </div>

        {/* Add Employee Form */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showAddEmployee ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
             <div className="bg-zinc-900/40 rounded-xl border border-[#CFCBC8]/20 p-6 md:p-8 backdrop-blur-md shadow-2xl relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#CFCBC8]" />
                <AddEmployeeFormWrapper onSuccess={handleEmployeeAdded} />
            </div>
        </div>

        {/* Employee Cards Grid */}
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[#CFCBC8]/20 rounded-xl bg-[#CFCBC8]/5 flex flex-col items-center">
            <div className="h-16 w-16 bg-[#CFCBC8]/10 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-[#CFCBC8]/40" />
            </div>
            <p className="text-[#CFCBC8] font-semibold text-lg">
              {searchQuery ? "No matches found" : "Your team is empty"}
            </p>
            <p className="text-sm text-[#CFCBC8]/50 mt-1 max-w-sm">
              {searchQuery
                ? `We couldn't find any employees matching "${searchQuery}".`
                : "Get started by clicking the 'Add Employee' button above."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => {
              const status = getEmployeeStatus(employee);
              return (
                <div
                  key={employee.id}
                  className={cardStyles}
                  onClick={() => {
                    // Navigate to employee details page if needed
                    // router.push(`/hr/employees/${employee.id}`);
                  }}
                >
                  {/* Status Indicator */}
                  {renderStatusIcon(status)}

                  {/* Decorative Gradient Blob */}
                  <div className="absolute -top-10 -left-10 w-24 h-24 bg-[#CFCBC8] opacity-5 blur-[40px] group-hover:opacity-10 transition-opacity" />

                  {/* Content */}
                  <div className="flex flex-col items-center text-center space-y-5 relative z-10">
                    <div className="relative">
                        <div className="h-24 w-24 rounded-full p-1 bg-gradient-to-br from-[#CFCBC8]/30 to-transparent border border-[#CFCBC8]/20 group-hover:border-[#CFCBC8]/50 transition-colors">
                             <Avatar className="h-full w-full">
                                <AvatarImage src={employee.image ?? ""} className="object-cover" />
                                <AvatarFallback className="bg-zinc-900 text-[#CFCBC8] text-2xl font-bold">
                                    {employee.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                             </Avatar>
                        </div>
                    </div>

                    <div className="space-y-1 w-full">
                      <h3 className="text-xl font-bold text-[#CFCBC8] group-hover:text-white transition-colors truncate px-2">
                        {employee.name}
                      </h3>
                      
                      {employee.jobPosition ? (
                         <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CFCBC8]/5 border border-[#CFCBC8]/10 text-xs font-medium text-[#CFCBC8]/80">
                            <Briefcase className="w-3 h-3" />
                            {employee.jobPosition}
                         </div>
                      ) : (
                        <p className="text-xs text-[#CFCBC8]/30 italic">No Position Set</p>
                      )}

                      <div className="pt-4 mt-2 border-t border-[#CFCBC8]/10 w-full flex justify-center gap-4 text-xs text-[#CFCBC8]/50">
                         {employee.department && (
                            <span className="truncate max-w-[100px]">{employee.department}</span>
                         )}
                         {employee.department && employee.employeeId && <span className="text-[#CFCBC8]/20">•</span>}
                         {employee.employeeId && (
                            <span className="font-mono flex items-center gap-1">
                                <Hash className="w-3 h-3" /> {employee.employeeId}
                            </span>
                         )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Wrapper component
function AddEmployeeFormWrapper({ onSuccess }: { onSuccess: () => void }) {
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(EmployeeAddSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
    },
  });

  const onSubmit = (values: z.infer<typeof EmployeeAddSchema>) => {
    const toastId = toast.loading("Creating employee account...");

    startTransition(() => {
      AddEmployee(values)
        .then(
          (data: { success?: string; error?: string; employeeId?: string }) => {
            if (data.error) {
              toast.error(data.error, { id: toastId });
            } else {
              toast.success(data.success, { id: toastId });
              form.reset();
              onSuccess();
            }
          }
        )
        .catch(() => {
          toast.error("Something went wrong!", { id: toastId });
        });
    });
  };

  const inputStyles = "bg-black/50 border-[#CFCBC8]/20 text-[#CFCBC8] placeholder:text-[#CFCBC8]/30 focus:border-[#CFCBC8] focus:ring-[#CFCBC8]/20 h-11";
  const labelStyles = "text-xs font-semibold text-[#CFCBC8]/60 uppercase tracking-wider mb-2";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 border-b border-[#CFCBC8]/10 pb-4">
        <h3 className="text-2xl font-bold text-[#CFCBC8] mb-2 flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-[#CFCBC8]/70" />
          Onboard New Talent
        </h3>
        <p className="text-sm text-[#CFCBC8]/60">
          Enter the basic details below. Login credentials will be generated automatically and sent to the email provided.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelStyles}>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Sarah Connor"
                        {...field}
                        disabled={isPending}
                        className={inputStyles}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelStyles}>Mobile Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+1 (555) 000-0000"
                        {...field}
                        disabled={isPending}
                        type="tel"
                        className={inputStyles}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
          </div>

          <FormField
            control={form.control}
            name="email"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelStyles}>Work Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="employee@organization.com"
                    {...field}
                    disabled={isPending}
                    type="email"
                    className={inputStyles}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <div className="pt-4 flex justify-end">
             <Button
                disabled={isPending}
                type="submit"
                size="lg"
                className="bg-[#CFCBC8] text-black hover:bg-[#fff] font-bold shadow-[0_0_20px_-5px_rgba(207,203,200,0.4)] transition-all min-w-[150px]"
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="mr-2 h-4 w-4" />
                )}
                Create Profile
              </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}