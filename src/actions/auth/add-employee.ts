"use server";

import { getUserByEmail } from "@/data/user";
import { EmployeeAddSchema } from "@/lib";
import { db } from "@/lib/db";
import { generateEmployeeId } from "@/lib/server-utils";
import { generateAutoPassword } from "@/lib/utils";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { sendEmployeeCredentialsEmail } from "@/lib/email";
import { auth } from "@/auth";

export const AddEmployee = async (
  values: z.infer<typeof EmployeeAddSchema>
) => {
  // Get current HR user
  const session = await auth();

  if (!session?.user?.email) {
    return { error: "Unauthorized! Please login first.", success: "" };
  }

  // Verify user is HR
  const hrUser = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!hrUser || hrUser.role !== "HR") {
    return { error: "Only HR can add employees!", success: "" };
  }

  const validation = EmployeeAddSchema.safeParse(values);

  if (validation.error) {
    return {
      error: validation.error.errors[0]?.message || "Validation error!",
      success: "",
    };
  }

  const { email, name, phoneNumber } = validation.data;

  // Check if employee already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Employee with this email already exists!", success: "" };
  }

  try {
    // Generate employee ID
    const employeeId = await generateEmployeeId(
      name,
      hrUser.companyName || "OI"
    );

    // Generate auto password
    const autoPassword = generateAutoPassword();
    const hashedPassword = await bcrypt.hash(autoPassword, 10);

    // Create employee user with related records
    const employee = await db.user.create({
      data: {
        name,
        email,
        phoneNumber,
        password: hashedPassword,
        emailVerified: new Date(),
        employeeId,
        role: "EMPLOYEE",
        companyName: hrUser.companyName,
        companyLogo: hrUser.companyLogo,
        hrId: hrUser.id,
        isPasswordChanged: false,
        // Auto-create employee details
        employeeDetails: {
          create: {
            dateOfJoining: new Date(),
          },
        },
        // Auto-create salary info
        salaryInfo: {
          create: {
            wageType: "FIXED",
          },
        },
        // Auto-create time-off allocation for current year
        timeOffAllocations: {
          create: {
            year: new Date().getFullYear(),
            paidTimeOffDays: 20,
            sickLeaveDays: 10,
            unpaidLeavesDays: 0,
          },
        },
      },
    });

    // Send credentials email to employee
    try {
      await sendEmployeeCredentialsEmail(
        email,
        name,
        employeeId,
        autoPassword,
        hrUser.companyName || "Company"
      );
    } catch (error) {
      console.error("Error sending credentials email:", error);
    }

    return {
      success: `Employee added successfully! Credentials sent to ${email}`,
      employeeId,
    };
  } catch (error) {
    console.error("Error adding employee:", error);
    return { error: "Error adding employee. Please try again.", success: "" };
  }
};
