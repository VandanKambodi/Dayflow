"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function checkInAttendance() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendance = await db.attendance.findUnique({
    where: {
      userId_date: {
        userId: session.user.id,
        date: today,
      },
    },
  });

  if (attendance && attendance.checkInTime) {
    throw new Error("Already checked in today");
  }

  const now = new Date();
  const updatedAttendance = await db.attendance.upsert({
    where: {
      userId_date: {
        userId: session.user.id,
        date: today,
      },
    },
    update: {
      checkInTime: now,
      status: "PRESENT",
    },
    create: {
      userId: session.user.id,
      date: today,
      checkInTime: now,
      status: "PRESENT",
    },
  });

  return { success: true, attendance: updatedAttendance };
}

export async function checkOutAttendance() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendance = await db.attendance.findUnique({
    where: {
      userId_date: {
        userId: session.user.id,
        date: today,
      },
    },
  });

  if (!attendance?.checkInTime) {
    throw new Error("Please check in first");
  }

  if (attendance.checkOutTime) {
    throw new Error("Already checked out today");
  }

  const now = new Date();
  const workHours =
    (now.getTime() - attendance.checkInTime.getTime()) / (1000 * 60 * 60);

  const updatedAttendance = await db.attendance.update({
    where: { id: attendance.id },
    data: {
      checkOutTime: now,
      workHours: Math.round(workHours * 100) / 100,
    },
  });

  return { success: true, attendance: updatedAttendance };
}

export async function getEmployeeAttendance(startDate: Date, endDate: Date) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const attendance = await db.attendance.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { date: "desc" },
  });

  return attendance;
}

export async function getHRAttendance(
  startDate: Date,
  endDate: Date,
  searchTerm?: string
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "HR") {
    throw new Error("Unauthorized - HR only");
  }

  const attendance = await db.attendance.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
      user: {
        ...(searchTerm && {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { email: { contains: searchTerm, mode: "insensitive" } },
          ],
        }),
        hrId: session.user.id,
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
    },
    orderBy: { date: "desc" },
  });

  return attendance;
}

export async function getTodayAttendanceStatus() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendance = await db.attendance.findUnique({
    where: {
      userId_date: {
        userId: session.user.id,
        date: today,
      },
    },
  });

  return attendance || null;
}
