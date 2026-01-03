"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function getHRProfile() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      companyName: true,
      companyLogo: true,
      phoneNumber: true,
      image: true,
      role: true,
    },
  });

  if (!user || user.role !== "HR") {
    throw new Error("User is not an HR administrator");
  }

  // Fetch HR details and salary info if they exist
  const hrDetails = await db.employeeDetails.findUnique({
    where: { userId: session.user.id },
  });

  const salaryInfo = await db.salaryInfo.findUnique({
    where: { userId: session.user.id },
  });

  return {
    user,
    hrDetails: hrDetails
      ? {
          department: hrDetails.department,
          designation: hrDetails.designation,
          manager: hrDetails.manager,
          about: hrDetails.about,
          jobFavorites: hrDetails.interests,
          interests: hrDetails.interests,
          skills: hrDetails.skills ? JSON.parse(hrDetails.skills) : [],
          certifications: hrDetails.resume ? [hrDetails.resume] : [],
        }
      : undefined,
    salaryInfo,
  };
}

export async function updateHRProfile(data: {
  name?: string;
  phoneNumber?: string;
  companyName?: string;
  image?: string;
  companyLogo?: string;
  department?: string;
  designation?: string;
  manager?: string;
  about?: string;
  jobFavorites?: string;
  interests?: string;
  skills?: string[];
  certifications?: string[];
  monthlyWage?: number;
  yearlyWage?: number;
  baseSalary?: number;
  hraAllowance?: number;
  standardAllowance?: number;
  performanceBonus?: number;
  pfContribution?: number;
  professionalTax?: number;
  workingDaysPerMonth?: number;
  breakTimePerDay?: number;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify user is HR
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || user.role !== "HR") {
    throw new Error("Only HR administrators can update this profile");
  }

  // Update user profile
  if (
    data.name ||
    data.phoneNumber ||
    data.companyName ||
    data.image ||
    data.companyLogo
  ) {
    await db.user.update({
      where: { id: session.user.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
        ...(data.companyName && { companyName: data.companyName }),
        ...(data.image && { image: data.image }),
        ...(data.companyLogo && { companyLogo: data.companyLogo }),
      },
    });
  }

  // Update HR details
  if (
    data.department ||
    data.designation ||
    data.manager ||
    data.about ||
    data.jobFavorites ||
    data.interests ||
    data.skills ||
    data.certifications
  ) {
    await db.employeeDetails.upsert({
      where: { userId: session.user.id },
      update: {
        ...(data.department && { department: data.department }),
        ...(data.designation && { designation: data.designation }),
        ...(data.manager && { manager: data.manager }),
        ...(data.about && { about: data.about }),
        ...(data.jobFavorites && { interests: data.jobFavorites }),
        ...(data.interests && { interests: data.interests }),
        ...(data.skills && { skills: JSON.stringify(data.skills) }),
        ...(data.certifications && { resume: data.certifications.join(", ") }),
      },
      create: {
        userId: session.user.id,
        ...(data.department && { department: data.department }),
        ...(data.designation && { designation: data.designation }),
        ...(data.manager && { manager: data.manager }),
        ...(data.about && { about: data.about }),
        ...(data.jobFavorites && { interests: data.jobFavorites }),
        ...(data.interests && { interests: data.interests }),
        ...(data.skills && { skills: JSON.stringify(data.skills) }),
        ...(data.certifications && { resume: data.certifications.join(", ") }),
      },
    });
  }

  // Update salary info
  if (
    data.monthlyWage !== undefined ||
    data.yearlyWage !== undefined ||
    data.baseSalary !== undefined ||
    data.hraAllowance !== undefined ||
    data.standardAllowance !== undefined ||
    data.performanceBonus !== undefined ||
    data.pfContribution !== undefined ||
    data.professionalTax !== undefined ||
    data.workingDaysPerMonth !== undefined ||
    data.breakTimePerDay !== undefined
  ) {
    await db.salaryInfo.upsert({
      where: { userId: session.user.id },
      update: {
        ...(data.monthlyWage !== undefined && {
          monthlyWage: data.monthlyWage,
        }),
        ...(data.yearlyWage !== undefined && { yearlyWage: data.yearlyWage }),
        ...(data.baseSalary !== undefined && { baseSalary: data.baseSalary }),
        ...(data.hraAllowance !== undefined && {
          hraAllowance: data.hraAllowance,
        }),
        ...(data.standardAllowance !== undefined && {
          standardAllowance: data.standardAllowance,
        }),
        ...(data.performanceBonus !== undefined && {
          performanceBonus: data.performanceBonus,
        }),
        ...(data.pfContribution !== undefined && {
          pfContribution: data.pfContribution,
        }),
        ...(data.professionalTax !== undefined && {
          professionalTax: data.professionalTax,
        }),
        ...(data.workingDaysPerMonth !== undefined && {
          workingDaysPerMonth: data.workingDaysPerMonth,
        }),
        ...(data.breakTimePerDay !== undefined && {
          breakTimePerDay: data.breakTimePerDay,
        }),
      },
      create: {
        userId: session.user.id,
        ...(data.monthlyWage && { monthlyWage: data.monthlyWage }),
        ...(data.yearlyWage && { yearlyWage: data.yearlyWage }),
        ...(data.baseSalary && { baseSalary: data.baseSalary }),
        ...(data.hraAllowance && { hraAllowance: data.hraAllowance }),
        ...(data.standardAllowance && {
          standardAllowance: data.standardAllowance,
        }),
        ...(data.performanceBonus && {
          performanceBonus: data.performanceBonus,
        }),
        ...(data.pfContribution && { pfContribution: data.pfContribution }),
        ...(data.professionalTax && { professionalTax: data.professionalTax }),
        ...(data.workingDaysPerMonth && {
          workingDaysPerMonth: data.workingDaysPerMonth,
        }),
        ...(data.breakTimePerDay && { breakTimePerDay: data.breakTimePerDay }),
      },
    });
  }

  return { success: true };
}
