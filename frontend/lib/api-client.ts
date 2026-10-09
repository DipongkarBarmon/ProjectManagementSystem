const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

export type ProjectSummary = {
  id: string;
  name: string;
  description?: string;
  status?: string;
  progress?: number;
};

export type TaskSummary = {
  id: string;
  title: string;
  status: string;
  priority?: string;
  dueDate?: string;
};

let isRefreshing = false;
let refreshSubscribers: ((success: boolean) => void)[] = [];

function onRefreshed(success: boolean) {
  refreshSubscribers.forEach((cb) => cb(success));
  refreshSubscribers = [];
}

async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };
  
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  let response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  if (response.status === 401 && path !== "/auth/refresh-token" && path !== "/auth/login") {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshResponse = await fetch(`${API_URL}/auth/refresh-token`, {
          method: 'POST',
          credentials: 'include'
        });
        
        if (refreshResponse.ok) {
          isRefreshing = false;
          onRefreshed(true);
        } else {
          isRefreshing = false;
          onRefreshed(false);
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      } catch (err) {
        isRefreshing = false;
        onRefreshed(false);
      }
    }

    const retryPromise = new Promise<boolean>((resolve) => {
      refreshSubscribers.push((success: boolean) => {
        resolve(success);
      });
    });

    const success = await retryPromise;
    if (success) {
      response = await fetch(`${API_URL}${path}`, {
        ...options,
        credentials: "include",
        headers,
      });
    } else {
      throw new Error("Session expired. Please log in again.");
    }
  }

  const body = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !body.success) {
    throw new Error(body.message || "The request could not be completed.");
  }
  return body;
}

export const api = {
  auth: {
    login: (payload: Record<string, string>) => request<any>("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
    register: (payload: FormData | Record<string, string>) => request("/auth/register", { method: "POST", body: payload instanceof FormData ? payload : JSON.stringify(payload) }),
    verifyEmail: (payload: { email: string; otp: string }) => request("/auth/verify-email", { method: "POST", body: JSON.stringify(payload) }),
    google: (idToken: string) => request("/auth/google", { method: "POST", body: JSON.stringify({ idToken }) }),
    forgotPassword: (email: string) => request("/auth/forget-password", { method: "POST", body: JSON.stringify({ email }) }),
    resetPassword: (payload: { email: string; otp: string; newPassword: string }) => request("/auth/reset-password", { method: "POST", body: JSON.stringify(payload) }),
    refresh: () => request("/auth/refresh-token", { method: "POST" }),
    me: () => request<any>("/users/me", { method: "GET" }), // was /auth/me, fixed
    logout: () => request("/auth/logout", { method: "POST" }),
  },
  organizations: {
    list: () => request<any>("/organizations/get-all-organizations"),
    get: (orgId: string) => request<any>(`/organizations/${orgId}`),
    create: (payload: Record<string, any>) => request<any>("/organizations/create-organization", { method: "POST", body: JSON.stringify(payload) }),
    update: (orgId: string, payload: Record<string, any>) => request<any>(`/organizations/${orgId}`, { method: "PATCH", body: JSON.stringify(payload) }),
    delete: (orgId: string) => request<any>(`/organizations/${orgId}`, { method: "DELETE" }),
  },
  members: {
    list: (orgId: string) => request<any>(`/organizations/${orgId}/members`),
    invite: (orgId: string, payload: Record<string, any>) => request<any>(`/invitations`, { method: "POST", body: JSON.stringify({ ...payload, organizationId: orgId }) }),
    updateRole: (orgId: string, memberId: string, payload: Record<string, any>) => request<any>(`/organizations/${orgId}/members/${memberId}/role`, { method: "PATCH", body: JSON.stringify(payload) }),
    remove: (orgId: string, memberId: string) => request<any>(`/organizations/${orgId}/members/${memberId}`, { method: "DELETE" }),
  },
  teams: {
    list: (orgId: string) => request<any>(`/teams/${orgId}`),
    create: (orgId: string, payload: Record<string, any>) => request<any>(`/teams/${orgId}`, { method: "POST", body: JSON.stringify(payload) }),
    update: (orgId: string, teamId: string, payload: Record<string, any>) => request<any>(`/teams/${orgId}/${teamId}`, { method: "PATCH", body: JSON.stringify(payload) }),
    delete: (orgId: string, teamId: string) => request<any>(`/teams/${orgId}/${teamId}`, { method: "DELETE" }),
  },
  projects: {
    list: (orgId: string) => request<any>(`/projects/${orgId}/getAllprojects`),
    get: (orgId: string, projectId: string) => request<any>(`/projects/${orgId}/projects/${projectId}`),
    create: (orgId: string, payload: Record<string, any>) => request<any>(`/projects/${orgId}/create-project`, { method: "POST", body: JSON.stringify(payload) }),
    update: (orgId: string, projectId: string, payload: Record<string, any>) => request<any>(`/projects/${orgId}/projects/${projectId}`, { method: "PATCH", body: JSON.stringify(payload) }),
    delete: (orgId: string, projectId: string) => request<any>(`/projects/${orgId}/projects/${projectId}`, { method: "DELETE" }),
  },
  sprints: {
    list: (orgId: string, projectId: string) => request<any>(`/sprints/${orgId}/${projectId}/get-all-sprints`),
    create: (orgId: string, projectId: string, payload: Record<string, any>) => request<any>(`/sprints/${orgId}/${projectId}/create-sprint`, { method: "POST", body: JSON.stringify(payload) }),
    update: (orgId: string, projectId: string, sprintId: string, payload: Record<string, any>) => request<any>(`/sprints/${orgId}/${projectId}/update-sprint/${sprintId}`, { method: "PATCH", body: JSON.stringify(payload) }),
    delete: (orgId: string, projectId: string, sprintId: string) => request<any>(`/sprints/${orgId}/${projectId}/delete-sprint/${sprintId}`, { method: "DELETE" }),
  },
  tasks: {
    list: (orgId: string, projectId: string) => request<any>(`/tasks/organizations/${orgId}/projects/${projectId}/get-all-tasks`),
    get: (orgId: string, projectId: string, taskId: string) => request<any>(`/tasks/organizations/${orgId}/projects/${projectId}/get-task/${taskId}`),
    getById: (orgId: string, taskId: string) => request<any>(`/tasks/organizations/${orgId}/get-task/${taskId}`),
    create: (orgId: string, projectId: string, payload: Record<string, any>) => request<any>(`/tasks/organizations/${orgId}/projects/${projectId}/create-task`, { method: "POST", body: JSON.stringify(payload) }),
    update: (orgId: string, projectId: string, taskId: string, payload: Record<string, any>) => request<any>(`/tasks/organizations/${orgId}/projects/${projectId}/update-task/${taskId}`, { method: "PATCH", body: JSON.stringify(payload) }),
    delete: (orgId: string, projectId: string, taskId: string) => request<any>(`/tasks/organizations/${orgId}/projects/${projectId}/delete-task/${taskId}`, { method: "DELETE" }),
    listAll: (orgId: string) => request<any>(`/tasks/organizations/${orgId}/get-all-tasks`),
  },
  activity: {
    list: (orgId: string) => request<any>(`/activities/${orgId}`),
  },
  dashboard: {
    getStats: (orgId: string) => request<any>(`/dashboard/${orgId}/stats`),
  },
  admin: {
    plans: () => request("/billing/plans"),
    subscriptions: () => request("/billing/subscriptions"),
    payments: () => request("/billing/payments"),
    pendingPayments: () => request("/billing/payments/pending"),
  },
};