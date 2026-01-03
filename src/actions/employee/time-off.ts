"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { TimeOffType, TimeOffStatus } from "@prisma/client";

export async function requestTimeOff(data: {
  type: TimeOffType;
  startDate: string;
  endDate: string;
  reason: string;
  attachment?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  // Calculate number of days
  const numberOfDays =
    Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  const timeOffRequest = await db.timeOffRequest.create({
    data: {
      userId: session.user.id,
      type: data.type,
      startDate,
      endDate,
      reason: data.reason,
      numberOfDays,
      status: "PENDING",
      ...(data.attachment && { attachment: data.attachment }),
    },
  });

  return { success: true, timeOffRequest };
}

export async function getEmployeeTimeOffRequests() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const timeOffRequests = await db.timeOffRequest.findMany({
    where: { userId: session.user.id },
    include: {
      approver: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return timeOffRequests;
}

export async function getHRTimeOffRequests(searchTerm?: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "HR") {
    throw new Error("Unauthorized - HR only");
  }

  const timeOffRequests = await db.timeOffRequest.findMany({
    where: {
      user: {
        hrId: session.user.id,
        ...(searchTerm && {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { email: { contains: searchTerm, mode: "insensitive" } },
          ],
        }),
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      approver: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return timeOffRequests;
}

export async function approveTimeOffRequest(requestId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "HR") {
    throw new Error("Unauthorized - HR only");
  }

  const timeOffRequest = await db.timeOffRequest.update({
    where: { id: requestId },
    data: {
      status: "APPROVED",
      approvedBy: session.user.id,
    },
    include: {
      user: true,
    },
  });

  return { success: true, timeOffRequest };
}

export async function rejectTimeOffRequest(
  requestId: string,
  rejectionReason: string
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "HR") {
    throw new Error("Unauthorized - HR only");
  }

  const timeOffRequest = await db.timeOffRequest.update({
    where: { id: requestId },
    data: {
      status: "REJECTED",
      rejectionReason,
      approvedBy: session.user.id,
    },
    include: {
      user: true,
    },
  });

  return { success: true, timeOffRequest };
}

export async function getTimeOffAllocation() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const currentYear = new Date().getFullYear();

  const allocation = await db.timeOffAllocation.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!allocation || allocation.year !== currentYear) {
    // Create new allocation for current year if doesn't exist
    return await db.timeOffAllocation.upsert({
      where: { userId: session.user.id },
      update: { year: currentYear },
      create: {
        userId: session.user.id,
        year: currentYear,
        paidTimeOffDays: 20,
        sickLeaveDays: 10,
        unpaidLeavesDays: 0,
      },
    });
  }

  return allocation;
}
