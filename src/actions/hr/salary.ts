"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function updateSalaryInfo(data: {
  wageType?: string;
  monthlyWage?: number;
  yearlyWage?: number;
  baseSalary?: number;
  baseSalaryPercentage?: number;
  hraAllowance?: number;
  hraAllowancePercentage?: number;
  standardAllowance?: number;
  standardAllowancePercentage?: number;
  performanceBonus?: number;
  performanceBonusPercentage?: number;
  leaveTravelAllowance?: number;
  leaveTravelAllowancePercentage?: number;
  fixedAllowance?: number;
  fixedAllowancePercentage?: number;
  professionalTax?: number;
  professionalTaxDeduction?: number;
  incomeTaxDeduction?: number;
  pfRate?: number;
  pfContribution?: number;
}) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "HR") {
    throw new Error("Unauthorized - HR only");
  }

  // You need to pass userId in the request or get it from context
  // For now, this assumes the HR is updating their own info or another employee's
  // This should be modified based on your business logic

  return { success: true };
}

export async function getSalaryInfo(userId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Only HR can view others' salary, employees can view their own
  if (session.user.id !== userId && session.user.role !== "HR") {
    throw new Error("Unauthorized - Cannot view other employee's salary");
  }

  const salaryInfo = await db.salaryInfo.findUnique({
    where: { userId },
  });

  return salaryInfo;
}

export async function getEmployeeSalaryInfo(employeeId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "HR") {
    throw new Error("Unauthorized - HR only");
  }

  // Verify the employee belongs to this HR
  const employee = await db.user.findUnique({
    where: { id: employeeId },
  });

  if (employee?.hrId !== session.user.id) {
    throw new Error("Unauthorized - Employee not under your management");
  }

  const salaryInfo = await db.salaryInfo.findUnique({
    where: { userId: employeeId },
  });

  return salaryInfo;
}
