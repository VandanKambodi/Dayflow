export const ROLE_REDIRECTS: Record<string, string> = {
  HR: "/hr/employees",
  EMPLOYEE: "/employee/attendence",
};

export const DEFAULT_LOGIN_REDIRECT = "/employee/attendence";

export const publicRoutes = ["/", "/auth/new-verification"];

export const authRoutes = ["/auth/login", "/auth/signup", "/auth/error"];

export const apiAuthPrefix = "/api/auth";

export const apiRoutes = ["/api/data", "/api/upload"];

// 🔐 routes that REQUIRE login
export const privateRoutes = [
  "/dashboard",
  "/auth/change-password",
  "/hr",
  "/employee",
];
