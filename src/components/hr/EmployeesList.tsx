"use client";

import { Suspense, useState, useEffect } from "react";
import { getEmployees } from "@/actions/hr/get-employees";
import { EmployeeCard } from "./EmployeeCard";
import { EmployeeListSkeleton } from "./EmployeeSkeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Users, Search, RefreshCw, Plus } from "lucide-react";
import { AddEmployeeForm } from "@/components/auth/add-employee-form";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeAddSchema } from "@/lib";
import * as z from "zod";
import { Loader2, UserPlus } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { AddEmployee } from "@/actions/auth/add-employee";

interface Employee {
  id: string;
  name: string;
  email: string;
  image: string | null;
  employeeId: string | null;
  phoneNumber: string | null;
  companyName: string | null;
  isPasswordChanged: boolean;
  attendanceStatus: "PRESENT" | "ON_LEAVE" | "ABSENT";
  createdAt: Date;
}

function EmployeeListContent() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
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
    const toastId = toast.loading("Adding employee...");

    startTransition(() => {
      AddEmployee(values)
        .then(
          (data: { success?: string; error?: string; employeeId?: string }) => {
            if (data.error) {
              toast.error(data.error, {
                closeButton: true,
                id: toastId,
              });
            } else {
              toast.success(data.success, {
                closeButton: true,
                id: toastId,
              });
              form.reset();
            }
          }
        )
        .catch((error) => {
          toast.error("Something went wrong!", {
            closeButton: true,
            id: toastId,
          });
        });
    });
  };
  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    // Filter employees based on search query
    const filtered = employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()) ??
          false)
    );
    setFilteredEmployees(filtered);
  }, [searchQuery, employees]);

  const loadEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getEmployees();
      if (result.error) {
        setError(result.error);
      } else if (result.employees) {
        setEmployees(result.employees as Employee[]);
        setFilteredEmployees(result.employees as Employee[]);
      }
    } catch (err) {
      setError("Failed to load employees");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeAdded = () => {
    setOpenAddDialog(false);
    loadEmployees(); // Refresh the list
  };

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="bg-destructive/10 border-destructive p-6 text-destructive">
          <p>{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Employees ({filteredEmployees.length})
            </h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadEmployees}
              disabled={loading}
              className="flex gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex gap-2">
                  <Plus className="w-4 h-4" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                  <DialogDescription>
                    Create a new employee account. Credentials will be
                    auto-generated and sent via email.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      disabled={isPending}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employee Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              {...field}
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      disabled={isPending}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="employee@company.com"
                              {...field}
                              disabled={isPending}
                              type="email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      disabled={isPending}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+1234567890"
                              {...field}
                              disabled={isPending}
                              type="tel"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="bg-blue-50/10 border border-blue-200/10 rounded-lg p-4">
                      <p className="text-sm text-red-300">
                        <strong>Note:</strong> Employee credentials will be
                        auto-generated and sent via email. The employee can
                        change the password after first login.
                      </p>
                    </div>

                    <Button
                      disabled={isPending}
                      type="submit"
                      className="w-full space-y-0 py-0 mt-2"
                    >
                      {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <UserPlus className="mr-2 h-4 w-4" />
                      )}
                      Add Employee
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, email, or employee ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Employees Grid */}
      {loading ? (
        <EmployeeListSkeleton />
      ) : filteredEmployees.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchQuery ? "No employees found" : "No employees yet"}
          </h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? "Try adjusting your search criteria"
              : "Create your first employee to get started"}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
      )}
    </div>
  );
}

export function EmployeesList() {
  return (
    <Suspense fallback={<EmployeeListSkeleton />}>
      <EmployeeListContent />
    </Suspense>
  );
}
