/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { api } from "@/lib/api-client";
import { Loader2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const { activeOrganizationId, organizations, setOrganizations, setActiveOrganizationId } = useWorkspaceStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    async function loadWorkspaces() {
      if (!isAuthenticated || !user) return;
      if (user.platformRole === "SUPER_ADMIN") return;

      try {
        const res = await api.organizations.list();
        if (!mounted) return;
        
        if (res.success && res.data) {
          // The API returns an array of orgs. We need to map them.
          // Assuming res.data is an array of organizations or organization memberships
          const orgs = Array.isArray(res.data) ? res.data : (res.data as any).data || [];
          
          const mappedOrgs = orgs.map((org: any) => ({
            id: org.organization?.id || org.id,
            name: org.organization?.name || org.name,
            logo: org.organization?.logo || org.logo,
            myRole: org.role || "MEMBER" // depends on how backend returns memberships
          }));

          setOrganizations(mappedOrgs);

          if (mappedOrgs.length > 0) {
            // If no active org or active org is not in the list, set to the first one
            const isActiveValid = mappedOrgs.some((o: any) => o.id === activeOrganizationId);
            if (!activeOrganizationId || !isActiveValid) {
              setActiveOrganizationId(mappedOrgs[0].id);
            }
          } else {
            // User has no organizations. Redirect to onboarding if not already there.
            if (!pathname.startsWith("/onboarding")) {
              router.push("/onboarding");
            }
          }
        }
      } catch (err) {
        console.error("Failed to load organizations", err);
      }
    }

    loadWorkspaces();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, user, pathname, router, activeOrganizationId, setActiveOrganizationId, setOrganizations]);

  // Prevent rendering workspace shell if no active org is set and user is not super admin
  // (unless they are on onboarding page)
  if (isAuthenticated && user?.platformRole !== "SUPER_ADMIN" && !activeOrganizationId && !pathname.startsWith("/onboarding")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
