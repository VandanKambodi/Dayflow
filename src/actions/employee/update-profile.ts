"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function updateEmployeeProfile(data: {
  name?: string;
  phoneNumber?: string;
  companyName?: string;
  image?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const updatedUser = await db.user.update({
    where: { id: session.user.id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
      ...(data.companyName && { companyName: data.companyName }),
      ...(data.image && { image: data.image }),
    },
  });

  return { success: true, user: updatedUser };
}

export async function updateEmployeeDetails(data: {
  dateOfBirth?: string;
  mailingAddress?: string;
  nationality?: string;
  personalEmail?: string;
  gender?: string;
  maritalStatus?: string;
  dateOfJoining?: string;
  department?: string;
  designation?: string;
  manager?: string;
  location?: string;
  resume?: string;
  skills?: string[];
  about?: string;
  interests?: string;
  panNumber?: string;
  aadharNumber?: string;
  accountNumber?: string;
  bankName?: string;
  ifscCode?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const employeeDetails = await db.employeeDetails.upsert({
    where: { userId: session.user.id },
    update: {
      ...(data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth) }),
      ...(data.mailingAddress && { mailingAddress: data.mailingAddress }),
      ...(data.nationality && { nationality: data.nationality }),
      ...(data.personalEmail && { personalEmail: data.personalEmail }),
      ...(data.gender && { gender: data.gender }),
      ...(data.maritalStatus && { maritalStatus: data.maritalStatus }),
      ...(data.dateOfJoining && {
        dateOfJoining: new Date(data.dateOfJoining),
      }),
      ...(data.department && { department: data.department }),
      ...(data.designation && { designation: data.designation }),
      ...(data.manager && { manager: data.manager }),
      ...(data.location && { location: data.location }),
      ...(data.resume && { resume: data.resume }),
      ...(data.skills && { skills: JSON.stringify(data.skills) }),
      ...(data.about && { about: data.about }),
      ...(data.interests && { interests: data.interests }),
      ...(data.panNumber !== undefined && { panNumber: data.panNumber }),
      ...(data.aadharNumber !== undefined && {
        aadharNumber: data.aadharNumber,
      }),
      ...(data.accountNumber !== undefined && {
        accountNumber: data.accountNumber,
      }),
      ...(data.bankName !== undefined && { bankName: data.bankName }),
      ...(data.ifscCode !== undefined && { ifscCode: data.ifscCode }),
    },
    create: {
      userId: session.user.id,
      ...(data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth) }),
      ...(data.mailingAddress && { mailingAddress: data.mailingAddress }),
      ...(data.nationality && { nationality: data.nationality }),
      ...(data.personalEmail && { personalEmail: data.personalEmail }),
      ...(data.gender && { gender: data.gender }),
      ...(data.maritalStatus && { maritalStatus: data.maritalStatus }),
      ...(data.dateOfJoining && {
        dateOfJoining: new Date(data.dateOfJoining),
      }),
      ...(data.department && { department: data.department }),
      ...(data.designation && { designation: data.designation }),
      ...(data.manager && { manager: data.manager }),
      ...(data.location && { location: data.location }),
      ...(data.resume && { resume: data.resume }),
      ...(data.skills && { skills: JSON.stringify(data.skills) }),
      ...(data.about && { about: data.about }),
      ...(data.interests && { interests: data.interests }),
      ...(data.panNumber && { panNumber: data.panNumber }),
      ...(data.aadharNumber && { aadharNumber: data.aadharNumber }),
      ...(data.accountNumber && { accountNumber: data.accountNumber }),
      ...(data.bankName && { bankName: data.bankName }),
      ...(data.ifscCode && { ifscCode: data.ifscCode }),
    },
  });

  return { success: true, employeeDetails };
}

export async function getEmployeeProfile() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      hr: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const employeeDetails = await db.employeeDetails.findUnique({
    where: { userId: session.user.id },
  });

  return {
    user,
    employeeDetails: employeeDetails
      ? {
          ...employeeDetails,
          skills: employeeDetails.skills
            ? JSON.parse(employeeDetails.skills)
            : [],
        }
      : null,
  };
}
