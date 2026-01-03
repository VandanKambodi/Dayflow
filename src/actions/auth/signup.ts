"use server";

import { getUserByEmail } from "@/data/user";
import { HRRegisterSchema } from "@/lib";
import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/token";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/email";

export const Register = async (values: z.infer<typeof HRRegisterSchema>) => {
  const validation = HRRegisterSchema.safeParse(values);

  if (validation.error) return { error: "Error!", success: "" };

  console.log("HR Register data", validation.data);

  const { email, password, name, companyName, companyLogo, phoneNumber } =
    validation.data;

  const existinguser = await getUserByEmail(email);

  if (existinguser) return { error: "User already exist!", success: "" };

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      companyName,
      companyLogo,
      phoneNumber,
      role: "HR",
      // Auto-create related records for HR
      employeeDetails: {
        create: {
          dateOfJoining: new Date(),
        },
      },
      salaryInfo: {
        create: {
          wageType: "FIXED",
        },
      },
    },
  });

  const verificationToken = await generateVerificationToken(email);

  try {
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
      name
    );
  } catch (error) {
    console.error("Error while sending Verification Mail:", error);
  }
  return { success: "Confirmation email sent!" };
};
