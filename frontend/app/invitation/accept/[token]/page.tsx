"use client";

import { CheckCircle2, Loader2, Mail, XCircle, Zap } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/lib/store/auth-store";
import { useWorkspaceStore } from "@/lib/store/workspace-store";

type Invitation = {
  email: string;
  organizationRole: string;
  organization?: { name?: string; logo?: string | null };
  invitedBy?: { name?: string };
};

export default function AcceptInvitationPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const { user, isAuthenticated, isInitialized } = useAuthStore();
  const { organizations, setActiveOrganizationId, setOrganizations } = useWorkspaceStore();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.token) return;
    api.invitations.getByToken(params.token)
      .then((response) => setInvitation(response.data as Invitation))
      .catch((reason) => setError(reason instanceof Error ? reason.message : "This invitation is invalid or expired."))
      .finally(() => setLoading(false));
  }, [params.token]);

  async function acceptInvitation() {
    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/invitation/accept/${params.token}`)}`);
      return;
    }
    setAccepting(true);
    try {
      const response = await api.invitations.accept(params.token);
      const result = response.data as {
        organization?: { id: string; name: string; logo?: string | null };
        membership?: { organizationId: string; organizationRole: string };
      };
      const organizationId = result.membership?.organizationId ?? result.organization?.id;
      if (organizationId) {
        const acceptedOrganization = {
          id: organizationId,
          name: result.organization?.name ?? "Organization",
          logo: result.organization?.logo ?? undefined,
          myRole: result.membership?.organizationRole ?? "MEMBER",
        };
        setOrganizations([
          ...organizations.filter((organization) => organization.id !== organizationId),
          acceptedOrganization,
        ]);
        setActiveOrganizationId(organizationId);
      }
      toast.success("You joined the organization.");
      router.push("/dashboard");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not accept this invitation.");
      setAccepting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
        <Link href="/" className="mx-auto flex w-fit items-center gap-2 text-lg font-bold"><span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Zap size={17} fill="currentColor" /></span>TaskFlow</Link>
        {loading || !isInitialized ? (
          <Loader2 className="mx-auto mt-10 animate-spin text-primary" size={30} />
        ) : error ? (
          <>
            <XCircle className="mx-auto mt-10 text-red-500" size={42} />
            <h1 className="mt-5 text-xl font-semibold">Invitation unavailable</h1>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <Link href={user ? "/dashboard" : "/login"} className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">{user ? "Go to dashboard" : "Log in"}</Link>
          </>
        ) : invitation ? (
          <>
            <Mail className="mx-auto mt-10 text-primary" size={42} />
            <h1 className="mt-5 text-xl font-semibold">Join {invitation.organization?.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{invitation.invitedBy?.name || "A teammate"} invited you to join <strong>{invitation.organization?.name}</strong> as a <strong>{invitation.organizationRole.replace("_", " ")}</strong>.</p>
            <p className="mt-3 rounded-lg bg-primary/10 px-3 py-2 text-xs text-primary">Organization: <strong>{invitation.organization?.name}</strong></p>
            {user && user.email.toLowerCase() !== invitation.email.toLowerCase() && <p className="mt-4 rounded-lg bg-amber-50 p-3 text-left text-xs text-amber-800">This invitation is for {invitation.email}. Log in with that email address to accept it.</p>}
            <button onClick={acceptInvitation} disabled={accepting || Boolean(user && user.email.toLowerCase() !== invitation.email.toLowerCase())} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
              {accepting ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />} {user ? "Accept invitation" : "Log in to accept"}
            </button>
          </>
        ) : null}
      </div>
    </main>
  );
}
