/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, initialize, isInitialized, isLoading } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    // Only initialize if not already initialized
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);

  const publicRoutes = ["/login", "/register", "/verify-email", "/forgot-password", "/reset-password", "/invitation/accept", "/unauthorized", "/forbidden"];
  const isPublicRoute = pathname === "/" || publicRoutes.some((route) => pathname.startsWith(route));
  const isInvitationAcceptanceRoute = pathname.startsWith("/invitation/accept");

  // If we are still initializing and this isn't a public route where we just show the form immediately,
  // we might want to show a loading screen to prevent flash of content.
  // Actually, for public routes, it's safe to render immediately. For protected, let's wait.
  if (!isInitialized && !isPublicRoute) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Role based protection
  if (isInitialized && user) {
    if (pathname.startsWith("/admin") && user.platformRole !== "SUPER_ADMIN") {
      if (typeof window !== "undefined") {
        window.location.assign("/forbidden");
      }
      return null;
    }

    const isPublicRoute = pathname === "/" || publicRoutes.some((route) => pathname.startsWith(route));
    if (isPublicRoute && !isInvitationAcceptanceRoute) {
      if (typeof window !== "undefined") {
        window.location.assign(user.platformRole === "SUPER_ADMIN" ? "/admin" : "/dashboard");
      }
      return null;
    }

    const workspaceRoutes = ["/dashboard", "/projects", "/tasks", "/teams", "/sprints", "/activity", "/members", "/settings"];
    const isWorkspaceRoute = workspaceRoutes.some(route => pathname.startsWith(route) || pathname === "/");
    if (isWorkspaceRoute && user.platformRole === "SUPER_ADMIN") {
      if (typeof window !== "undefined") {
        window.location.assign("/admin");
      }
      return null;
    }
  }

  return <>{children}</>;
}
