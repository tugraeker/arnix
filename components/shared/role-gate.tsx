"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ROLE_PERMISSIONS, type AppRole } from "@/lib/constants";

interface RoleGateProps {
  allowedRoles?: AppRole[];
  permission?: string;
  userRole?: AppRole | null;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

function hasPermission(userRole: AppRole | null, permission: string): boolean {
  if (!userRole) return false;
  const perms = ROLE_PERMISSIONS[userRole];
  if (!perms) return false;
  if (perms.includes("*")) return true;
  return perms.includes(permission);
}

export function RoleGate({
  allowedRoles,
  permission,
  userRole,
  children,
  fallback = null,
}: RoleGateProps) {
  const [currentRole, setCurrentRole] = React.useState<AppRole | null>(null);

  React.useEffect(() => {
    if (userRole) {
      setCurrentRole(userRole);
      return;
    }
    const stored = typeof window !== "undefined"
      ? window.localStorage.getItem("arnix_user_role")
      : null;
    if (stored) setCurrentRole(stored as AppRole);
  }, [userRole]);

  const role = userRole ?? currentRole;

  if (allowedRoles && role) {
    if (!allowedRoles.includes(role)) return <>{fallback}</>;
  }

  if (permission && role) {
    if (!hasPermission(role, permission)) return <>{fallback}</>;
  }

  return <>{children}</>;
}

export function useUserRole(): AppRole | null {
  const [role, setRole] = React.useState<AppRole | null>(null);
  React.useEffect(() => {
    const stored = window.localStorage.getItem("arnix_user_role");
    if (stored) setRole(stored as AppRole);
  }, []);
  return role;
}

export function setStoredRole(role: AppRole) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("arnix_user_role", role);
  }
}
