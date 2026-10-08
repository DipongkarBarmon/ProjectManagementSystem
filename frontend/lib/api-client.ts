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

async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };
  
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  const body = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !body.success) {
    throw new Error(body.message || "The request could not be completed.");
  }
  return body;
}

export const api = {
  auth: {
    login: (payload: Record<string, string>) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
    register: (payload: FormData | Record<string, string>) => request("/auth/register", { method: "POST", body: payload instanceof FormData ? payload : JSON.stringify(payload) }),
    verifyEmail: (payload: { email: string; otp: string }) => request("/auth/verify-email", { method: "POST", body: JSON.stringify(payload) }),
    google: (idToken: string) => request("/auth/google", { method: "POST", body: JSON.stringify({ idToken }) }),
    forgotPassword: (email: string) => request("/auth/forget-password", { method: "POST", body: JSON.stringify({ email }) }),
    resetPassword: (payload: { email: string; otp: string; newPassword: string }) => request("/auth/reset-password", { method: "POST", body: JSON.stringify(payload) }),
    refresh: () => request("/auth/refresh-token", { method: "POST" }),
  },
  organizations: {
    list: () => request("/organizations/get-all-organizations"),
    get: (organizationId: string) => request(`/organizations/${organizationId}`),
  },
  projects: {
    list: (organizationId: string) => request<ProjectSummary[]>(`/projects/${organizationId}/getAllprojects`),
    get: (organizationId: string, projectId: string) => request<ProjectSummary>(`/projects/${organizationId}/projects/${projectId}`),
  },
  tasks: {
    list: (organizationId: string, projectId: string) => request<TaskSummary[]>(`/tasks/organizations/${organizationId}/projects/${projectId}/get-all-tasks`),
    get: (organizationId: string, projectId: string, taskId: string) => request<TaskSummary>(`/tasks/organizations/${organizationId}/projects/${projectId}/get-task/${taskId}`),
  },
  admin: {
    plans: () => request("/billing/plans"),
    subscriptions: () => request("/billing/subscriptions"),
    payments: () => request("/billing/payments"),
    pendingPayments: () => request("/billing/payments/pending"),
  },
};