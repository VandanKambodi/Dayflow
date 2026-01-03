"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function getEmployees() {
  try {
    const session = await auth();

    if (!session || session.user.role !== "HR") {
      return { error: "Unauthorized" };
    }

    const hrId = session.user.id;

    const employees = await db.user.findMany({
      where: {
        hrId: hrId,
        role: "EMPLOYEE",
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        employeeId: true,
        phoneNumber: true,
        companyName: true,
        isPasswordChanged: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, employees };
  } catch (error) {
    console.error("Error fetching employees:", error);
    return { error: "Failed to fetch employees" };
  }
}
