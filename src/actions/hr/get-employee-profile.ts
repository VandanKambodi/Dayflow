"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function getEmployeeProfile(employeeId: string) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "HR") {
      return { error: "Unauthorized" };
    }

    // Verify the employee belongs to this HR
    const employee = await db.user.findUnique({
      where: { id: employeeId },
      include: {
        employeeDetails: true,
        salaryInfo: true,
        attendances: {
          orderBy: {
            date: "desc",
          },
          take: 10,
        },
        timeOffRequests: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
        timeOffAllocations: true,
      },
    });

    if (!employee || employee.hrId !== session.user.id) {
      return { error: "Employee not found" };
    }

    // Parse JSON fields
    const parsedEmployee = {
      ...employee,
      employeeDetails: employee.employeeDetails
        ? {
            ...employee.employeeDetails,
            skills: employee.employeeDetails.skills
              ? JSON.parse(employee.employeeDetails.skills)
              : [],
          }
        : null,
    };

    return { success: true, employee: parsedEmployee };
  } catch (error) {
    console.error("Error fetching employee profile:", error);
    return { error: "Failed to fetch employee profile" };
  }
}
