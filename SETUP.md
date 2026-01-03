# HR Management System - Complete Setup Guide

## Overview

This is a comprehensive HR management system built with Next.js, Prisma, NextAuth, and shadcn UI. It includes features for employee management, attendance tracking, time-off management, and salary information.

## Database Setup

### Run Migrations

After you have set up your DATABASE_URL in `.env.local`:

```bash
npx prisma migrate dev --name init
```

This will create all necessary tables:

- **User** - User accounts (employees and HR)
- **EmployeeDetails** - Personal and professional information
- **SalaryInfo** - Salary structure and components
- **Attendance** - Daily attendance records
- **TimeOffRequest** - Time-off/leave requests
- **TimeOffAllocation** - Annual leave entitlements

## Environment Variables

Add these to your `.env.local`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/authnext

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# Email (if using email service)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Cloudinary Setup

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name from the dashboard
3. Create an unsigned upload preset in Settings > Upload
4. Add the credentials to `.env.local`

## File Structure

```
src/
├── actions/
│   ├── auth/           # Authentication actions
│   ├── employee/
│   │   ├── attendance.ts       # Check in/out and attendance queries
│   │   ├── time-off.ts         # Time-off requests management
│   │   └── update-profile.ts   # Profile updates
│   └── hr/
│       └── salary.ts           # Salary management
├── app/
│   └── (protected)/
│       ├── employee/
│       │   ├── attendence/     # Attendance page
│       │   ├── profile/        # Profile page with tabs
│       │   └── time-off/       # Time-off requests
│       └── hr/
│           ├── attendance/     # HR attendance view
│           ├── employees/      # Employee list
│           └── time-off/       # Time-off management
├── components/
│   ├── ImageUpload.tsx         # Cloudinary image upload
│   ├── EmployeeNavbar.tsx      # Employee navbar
│   ├── HrNavbar.tsx            # HR navbar
│   └── skeletons.tsx           # Loading skeletons
└── lib/
    ├── cloudinary.ts           # Cloudinary utilities
    └── db.ts                   # Database client
```

## Features Implemented

### 1. Employee Profile Management

- **Location**: `/protected/employee/profile`
- **Features**:
  - Upload/change profile picture via Cloudinary
  - Multiple tabs: Personal Info, Professional, Security, Skills
  - Store detailed employee information
  - Resume upload support

### 2. Attendance System

**Employee View** (`/protected/employee/attendence`):

- Check-in/Check-out functionality
- View monthly attendance history
- See work hours calculated automatically
- Status indicators (Present, Absent, On Leave)

**HR View** (`/protected/hr/attendance`):

- View all employees' attendance
- Filter by month and search by employee name
- See detailed attendance with work hours

### 3. Time-Off Management

**Employee View** (`/protected/employee/time-off`):

- Request time-off (Paid, Sick Leave, Unpaid)
- View leave allocation and remaining days
- Track request status (Pending, Approved, Rejected)
- Automatic calculation of days

**HR View** (`/protected/hr/time-off`):

- View all time-off requests
- Approve/Reject requests
- Filter by status and employee
- Provide rejection reasons

### 4. Navigation

**Employee Navbar**:

- Company logo display
- Navigation to Attendance and Time Off
- Profile dropdown with user image initials
- Logout

**HR Navbar**:

- Company logo display
- Navigation to Employees, Attendance, Time Off
- Profile dropdown with user image initials
- Logout

### 5. Salary Information (Admin Only)

- Basic salary setup
- Allowances configuration
- Tax deductions
- PF contributions
- Automatic calculations

## Database Schema Highlights

### EmployeeDetails

Stores comprehensive employee information:

```prisma
model EmployeeDetails {
  userId            String    @unique
  dateOfBirth       DateTime?
  mailingAddress    String?
  nationality       String?
  personalEmail     String?
  gender            String?
  maritalStatus     String?
  dateOfJoining     DateTime?
  department        String?
  designation       String?
  manager           String?
  location          String?

  // Security fields
  panNumber         String?
  aadharNumber      String?
  accountNumber     String?
  bankName          String?
  ifscCode          String?

  // Professional
  resume            String?   // Cloudinary URL
  skills            String?   // JSON array
  about             String?
  interests         String?
}
```

### Attendance

```prisma
model Attendance {
  userId            String
  date              DateTime  @db.Date
  checkInTime       DateTime?
  checkOutTime      DateTime?
  workHours         Float?
  breakHours        Float?    @default(0)
  extraHours        Float?    @default(0)
  status            AttendanceStatus @default(ABSENT)
  notes             String?

  @@unique([userId, date])
}
```

### TimeOffRequest

```prisma
model TimeOffRequest {
  userId            String
  type              TimeOffType       // PAID_TIME_OFF, SICK_LEAVE, UNPAID_LEAVES
  startDate         DateTime  @db.Date
  endDate           DateTime  @db.Date
  reason            String?
  numberOfDays      Int
  status            TimeOffStatus @default(PENDING)
  approvedBy        String?
  rejectionReason   String?
  attachment        String?   // Certificate for sick leave
}
```

## API Endpoints (Server Actions)

### Employee Actions

```typescript
// Profile
getEmployeeProfile();
updateEmployeeProfile(data);
updateEmployeeDetails(data);

// Attendance
checkInAttendance();
checkOutAttendance();
getEmployeeAttendance(startDate, endDate);
getTodayAttendanceStatus();

// Time-off
requestTimeOff(data);
getEmployeeTimeOffRequests();
getTimeOffAllocation();
```

### HR Actions

```typescript
// Attendance
getHRAttendance(startDate, endDate, searchTerm?)

// Time-off
getHRTimeOffRequests(searchTerm?)
approveTimeOffRequest(requestId)
rejectTimeOffRequest(requestId, reason)

// Salary
getSalaryInfo(userId)
getEmployeeSalaryInfo(employeeId)
```

## UI Components (shadcn)

All pages use shadcn UI components:

- **Card** - Container components
- **Button** - Action buttons
- **Input** - Text inputs
- **Textarea** - Multi-line text
- **Avatar** - Profile pictures with initials fallback
- **DropdownMenu** - User menu
- **Tabs** - Profile tab navigation
- **Skeleton** - Loading states

## Loading States

All pages implement skeleton loaders for better UX:

- `NavbarSkeleton` - Navbar loading state
- `ProfilePageSkeleton` - Profile page loading
- `EmployeeCardSkeleton` - Employee card loading
- `AttendanceSkeleton` - Attendance list loading
- `TimeOffSkeleton` - Time-off list loading

## Image Handling

### Profile Pictures

- Uploaded to Cloudinary
- Fallback to user initials in colored avatars
- Responsive image handling

### Cloudinary Integration

```typescript
// lib/cloudinary.ts
uploadToCloudinary(file: File): Promise<string>
getImageInitials(name: string): string
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
npm install -D prisma
npm install date-fns
npm install sonner  # Toast notifications
```

### 2. Setup Environment

Create `.env.local` and add all variables from Environment Variables section above

### 3. Run Migrations

```bash
npx prisma migrate dev --name init
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Access the Application

- Employee: http://localhost:3000/protected/employee
- HR: http://localhost:3000/protected/hr

## Key Features

### ✅ Complete

- ✅ Database schema with all tables
- ✅ Server actions for all operations
- ✅ Employee profile page with tabs
- ✅ Attendance tracking with check-in/out
- ✅ Time-off request management
- ✅ HR management views
- ✅ Cloudinary image uploads
- ✅ Navigation with company logo
- ✅ User profile dropdown
- ✅ Skeleton loading states
- ✅ Responsive design

### 🔄 To Customize

1. **Colors** - Update Tailwind classes in components
2. **Salary Components** - Modify `SalaryInfo` schema
3. **Employee Fields** - Extend `EmployeeDetails` model
4. **Validations** - Add Zod schemas in actions
5. **Notifications** - Use `toast` from sonner

## Troubleshooting

### Image upload not working

- Check Cloudinary credentials in `.env.local`
- Ensure upload preset is set to "Unsigned"
- Check browser console for CORS errors

### Database connection error

- Verify DATABASE_URL format
- Check PostgreSQL is running
- Run `npx prisma db push` to sync schema

### Authentication issues

- Clear browser cookies
- Check NEXTAUTH_URL matches your domain
- Verify NEXTAUTH_SECRET is set

## Next Steps

1. **Add Validation** - Use Zod for server action inputs
2. **Email Notifications** - Send emails on approval/rejection
3. **Reports** - Add attendance and payroll reports
4. **Export** - Export attendance and time-off as CSV/PDF
5. **Notifications** - Real-time notifications for approvals
6. **Mobile App** - React Native version

## Support

For issues or questions, refer to:

- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org)
- [shadcn/ui](https://ui.shadcn.com)
- [Cloudinary Docs](https://cloudinary.com/documentation)
