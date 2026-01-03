import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  role: "HR" | "EMPLOYEE";
  employeeId?: string;
  companyName?: string;
  phoneNumber?: string;
  isPasswordChanged: boolean;
  isCheckedIn?: boolean;
  lastCheckIn?: Date;
  lastCheckOut?: Date;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }

  interface User {
    id: string;
    role: "HR" | "EMPLOYEE";
    employeeId?: string;
    companyName?: string;
    phoneNumber?: string;
    isPasswordChanged: boolean;
    isCheckedIn?: boolean;
    lastCheckIn?: Date;
    lastCheckOut?: Date;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "HR" | "EMPLOYEE";
    employeeId?: string;
    companyName?: string;
    phoneNumber?: string;
    isPasswordChanged: boolean;
    isCheckedIn?: boolean;
    lastCheckIn?: Date;
    lastCheckOut?: Date;
  }
}
