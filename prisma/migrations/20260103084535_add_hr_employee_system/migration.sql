-- CreateEnum
CREATE TYPE "WageType" AS ENUM ('FIXED', 'VARIABLE');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'ON_LEAVE', 'HALF_DAY');

-- CreateEnum
CREATE TYPE "TimeOffType" AS ENUM ('PAID_TIME_OFF', 'SICK_LEAVE', 'UNPAID_LEAVES');

-- CreateEnum
CREATE TYPE "TimeOffStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "EmployeeDetails" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "mailingAddress" TEXT,
    "nationality" TEXT,
    "personalEmail" TEXT,
    "gender" TEXT,
    "maritalStatus" TEXT,
    "dateOfJoining" TIMESTAMP(3),
    "department" TEXT,
    "designation" TEXT,
    "manager" TEXT,
    "location" TEXT,
    "panNumber" TEXT,
    "aadharNumber" TEXT,
    "accountNumber" TEXT,
    "bankName" TEXT,
    "ifscCode" TEXT,
    "resume" TEXT,
    "skills" TEXT,
    "about" TEXT,
    "interests" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalaryInfo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wageType" "WageType" NOT NULL DEFAULT 'FIXED',
    "monthlyWage" DOUBLE PRECISION,
    "yearlyWage" DOUBLE PRECISION,
    "baseSalary" DOUBLE PRECISION,
    "baseSalaryPercentage" DOUBLE PRECISION,
    "hraAllowance" DOUBLE PRECISION,
    "hraAllowancePercentage" DOUBLE PRECISION,
    "standardAllowance" DOUBLE PRECISION,
    "standardAllowancePercentage" DOUBLE PRECISION,
    "performanceBonus" DOUBLE PRECISION,
    "performanceBonusPercentage" DOUBLE PRECISION,
    "leaveTravelAllowance" DOUBLE PRECISION,
    "leaveTravelAllowancePercentage" DOUBLE PRECISION,
    "fixedAllowance" DOUBLE PRECISION,
    "fixedAllowancePercentage" DOUBLE PRECISION,
    "professionalTax" DOUBLE PRECISION,
    "professionalTaxDeduction" DOUBLE PRECISION,
    "incomeTaxDeduction" DOUBLE PRECISION,
    "pfRate" DOUBLE PRECISION,
    "pfContribution" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalaryInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "checkInTime" TIMESTAMP(3),
    "checkOutTime" TIMESTAMP(3),
    "workHours" DOUBLE PRECISION,
    "breakHours" DOUBLE PRECISION DEFAULT 0,
    "extraHours" DOUBLE PRECISION DEFAULT 0,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'ABSENT',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeOffRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TimeOffType" NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "reason" TEXT,
    "numberOfDays" INTEGER NOT NULL,
    "status" "TimeOffStatus" NOT NULL DEFAULT 'PENDING',
    "approvedBy" TEXT,
    "rejectionReason" TEXT,
    "attachment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeOffRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeOffAllocation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "paidTimeOffDays" INTEGER NOT NULL DEFAULT 0,
    "paidTimeOffUsed" INTEGER NOT NULL DEFAULT 0,
    "sickLeaveDays" INTEGER NOT NULL DEFAULT 0,
    "sickLeaveUsed" INTEGER NOT NULL DEFAULT 0,
    "unpaidLeavesDays" INTEGER NOT NULL DEFAULT 0,
    "unpaidLeavesUsed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeOffAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeDetails_userId_key" ON "EmployeeDetails"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SalaryInfo_userId_key" ON "SalaryInfo"("userId");

-- CreateIndex
CREATE INDEX "Attendance_userId_date_idx" ON "Attendance"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_userId_date_key" ON "Attendance"("userId", "date");

-- CreateIndex
CREATE INDEX "TimeOffRequest_userId_status_idx" ON "TimeOffRequest"("userId", "status");

-- CreateIndex
CREATE INDEX "TimeOffRequest_approvedBy_idx" ON "TimeOffRequest"("approvedBy");

-- CreateIndex
CREATE UNIQUE INDEX "TimeOffAllocation_userId_key" ON "TimeOffAllocation"("userId");

-- AddForeignKey
ALTER TABLE "EmployeeDetails" ADD CONSTRAINT "EmployeeDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryInfo" ADD CONSTRAINT "SalaryInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeOffRequest" ADD CONSTRAINT "TimeOffRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeOffRequest" ADD CONSTRAINT "TimeOffRequest_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeOffAllocation" ADD CONSTRAINT "TimeOffAllocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
