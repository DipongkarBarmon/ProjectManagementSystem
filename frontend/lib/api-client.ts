/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export class ApiError extends Error {
  public statusCode: number;
  public data?: any;

  constructor(message: string, statusCode: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;
  }
}

export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type PaginationParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  searchTerm?: string;
};

const buildQuery = (params?: PaginationParams) => {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
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

export type BillingPlan = {
  id: string;
  name: string;
  description?: string | null;
  priceMonthly: string | number;
  priceYearly: string | number;
  currency: string;
  maxMembers?: number | null;
  maxTeams?: number | null;
  maxProjects?: number | null;
  maxStorageBytes?: string | number | null;
  isActive: boolean;
};

export type OrganizationCreatePayload = {
  name: string;
  slug: string;
  description?: string;
  logo?: File;
};

let isRefreshing = false;
let refreshSubscribers: ((success: boolean) => void)[] = [];

function onRefreshed(success: boolean) {
  refreshSubscribers.forEach((cb) => cb(success));
  refreshSubscribers = [];
}

async function request<T = any>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };
  
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      headers,
    });
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw error;
    }
    throw new ApiError("Network error: Could not connect to the server.", 0);
  }

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
          try {
            await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" });
          } catch (e) {
            // Ignore error if logout fails
          }
          if (typeof window !== "undefined") {
            const currentPath = window.location.pathname;
            if (currentPath !== "/" && !currentPath.startsWith("/login") && !currentPath.startsWith("/register") && !currentPath.startsWith("/forgot") && !currentPath.startsWith("/reset") && !currentPath.startsWith("/unauthorized") && !currentPath.startsWith("/forbidden")) {
              window.location.href = "/login";
            }
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
      throw new ApiError("Session expired. Please log in again.", 401);
    }
  }

  let body: any;
  try {
    body = await response.json();
  } catch (err) {
    if (!response.ok) {
      throw new ApiError(`Server error: ${response.statusText}`, response.status);
    }
    throw new ApiError("Invalid JSON response from server.", 500);
  }

  if (!response.ok || body.success === false) {
    throw new ApiError(body.message || "The request could not be completed.", response.status || body.statusCode, body);
  }
  
  return body as ApiResponse<T>;
}

export const api = {
  auth: {
    login: (payload: Record<string, string>, options?: RequestInit) => request<any>("/auth/login", { ...options, method: "POST", body: JSON.stringify(payload) }),
    register: (payload: FormData | Record<string, string>, options?: RequestInit) => request("/auth/register", { ...options, method: "POST", body: payload instanceof FormData ? payload : JSON.stringify(payload) }),
    verifyEmail: (payload: { email: string; otp: string }, options?: RequestInit) => request("/auth/verify-email", { ...options, method: "POST", body: JSON.stringify(payload) }),
    google: (idToken: string, options?: RequestInit) => request("/auth/google", { ...options, method: "POST", body: JSON.stringify({ idToken }) }),
    forgotPassword: (email: string, options?: RequestInit) => request("/auth/forget-password", { ...options, method: "POST", body: JSON.stringify({ email }) }),
    resetPassword: (payload: { email: string; otp: string; newPassword: string }, options?: RequestInit) => request("/auth/reset-password", { ...options, method: "POST", body: JSON.stringify(payload) }),
    refresh: (options?: RequestInit) => request("/auth/refresh-token", { ...options, method: "POST" }),
    me: (options?: RequestInit) => request<any>("/auth/me", { ...options, method: "GET" }), // Fixed from /users/me
    updateProfile: (payload: { name?: string }, options?: RequestInit) => request<any>("/auth/me", { ...options, method: "PATCH", body: JSON.stringify(payload) }),
    logout: (options?: RequestInit) => request("/auth/logout", { ...options, method: "POST" }),
  },
  organizations: {
    list: (params?: PaginationParams, options?: RequestInit) => request<any>(`/organizations/get-all-organizations${buildQuery(params)}`, options),
    get: (orgId: string, options?: RequestInit) => request<any>(`/organizations/${orgId}`, options),
    create: (payload: OrganizationCreatePayload | FormData, options?: RequestInit) => {
      const body = payload instanceof FormData
        ? payload
        : (() => {
            const formData = new FormData();
            formData.append("name", payload.name);
            formData.append("slug", payload.slug);
            if (payload.description) formData.append("description", payload.description);
            if (payload.logo) formData.append("logo", payload.logo);
            return formData;
          })();
      return request<any>("/organizations/create-organization", { ...options, method: "POST", body });
    },
    updateInfo: (orgId: string, payload: Record<string, any>, options?: RequestInit) => request<any>(`/organizations/${orgId}/update-OrganizationInfo`, { ...options, method: "POST", body: JSON.stringify(payload) }),
    updateLogo: (orgId: string, payload: FormData, options?: RequestInit) => request<any>(`/organizations/${orgId}/update-logo`, { ...options, method: "POST", body: payload }),
    delete: (orgId: string, options?: RequestInit) => request<any>(`/organizations/${orgId}`, { ...options, method: "DELETE" }),
  },
  members: {
    list: (orgId: string, params?: PaginationParams, options?: RequestInit) => request<any>(`/organizations/${orgId}/members${buildQuery(params)}`, options),
    invite: (orgId: string, payload: Record<string, any>, options?: RequestInit) => request<any>(`/invitations/${orgId}/sent-invitation`, { ...options, method: "POST", body: JSON.stringify(payload) }),
    updateRole: (orgId: string, memberId: string, payload: Record<string, any>, options?: RequestInit) => request<any>(`/organizations/${orgId}/members/${memberId}/role`, { ...options, method: "PATCH", body: JSON.stringify(payload) }),
    remove: (orgId: string, memberId: string, options?: RequestInit) => request<any>(`/organizations/${orgId}/members/${memberId}`, { ...options, method: "DELETE" }),
  },
  invitations: {
    list: (orgId: string, params?: PaginationParams, options?: RequestInit) => request<any>(`/invitations/${orgId}/invitations${buildQuery(params)}`, options),
    get: (orgId: string, invitationId: string, options?: RequestInit) => request<any>(`/invitations/${orgId}/invitations/${invitationId}`, options),
    getByToken: (token: string, options?: RequestInit) => request<any>(`/invitations/${token}`, options),
    send: (orgId: string, payload: { email: string; organizationRole: string }, options?: RequestInit) =>
      request<any>(`/invitations/${orgId}/sent-invitation`, { ...options, method: "POST", body: JSON.stringify(payload) }),
    cancel: (orgId: string, invitationId: string, options?: RequestInit) =>
      request<any>(`/invitations/${orgId}/invitations/${invitationId}/cancel`, { ...options, method: "PATCH" }),
    delete: (orgId: string, invitationId: string, options?: RequestInit) =>
      request<any>(`/invitations/${orgId}/invitations/${invitationId}`, { ...options, method: "DELETE" }),
    accept: (token: string, options?: RequestInit) =>
      request<any>(`/invitations/${token}/accept`, { ...options, method: "POST" }),
  },
  teams: {
    list: (orgId: string, params?: PaginationParams, options?: RequestInit) => request<any>(`/teams/${orgId}/get-all-teams${buildQuery(params)}`, options),
    get: (orgId: string, teamId: string, options?: RequestInit) => request<any>(`/teams/${orgId}/get-team/${teamId}`, options),
    create: (orgId: string, payload: Record<string, any>, options?: RequestInit) => request<any>(`/teams/${orgId}/create-teams`, { ...options, method: "POST", body: JSON.stringify(payload) }),
    update: (orgId: string, teamId: string, payload: Record<string, any>, options?: RequestInit) => request<any>(`/teams/${orgId}/update-team/${teamId}`, { ...options, method: "PATCH", body: JSON.stringify(payload) }),
    delete: (orgId: string, teamId: string, options?: RequestInit) => request<any>(`/teams/${orgId}/delete-team/${teamId}`, { ...options, method: "DELETE" }),
    addLeader: (orgId: string, teamId: string, userId: string, options?: RequestInit) => request<any>(`/teams/${orgId}/add-team-leader/${teamId}`, { ...options, method: "POST", body: JSON.stringify({ userId }) }),
    addMember: (orgId: string, teamId: string, userId: string, options?: RequestInit) => request<any>(`/teams/${orgId}/add-team-member/${teamId}`, { ...options, method: "POST", body: JSON.stringify({ userId }) }),
    removeMember: (orgId: string, teamId: string, userId: string, options?: RequestInit) => request<any>(`/teams/${orgId}/${teamId}/delete-member/${userId}`, { ...options, method: "DELETE" }),
    members: (orgId: string, teamId: string, options?: RequestInit) => request<any>(`/teams/${orgId}/${teamId}/view-members`, options),
  },
  projects: {
    list: (orgId: string, params?: PaginationParams & { status?: string }, options?: RequestInit) => request<any>(`/projects/${orgId}/getAllprojects${buildQuery(params)}`, options),
    get: (orgId: string, projectId: string, options?: RequestInit) => request<any>(`/projects/${orgId}/projects/${projectId}`, options),
    create: (orgId: string, payload: Record<string, any>, options?: RequestInit) => request<any>(`/projects/${orgId}/create-project`, { ...options, method: "POST", body: JSON.stringify(payload) }),
    update: (orgId: string, projectId: string, payload: Record<string, any>, options?: RequestInit) => request<any>(`/projects/${orgId}/projects/${projectId}`, { ...options, method: "PATCH", body: JSON.stringify(payload) }),
    delete: (orgId: string, projectId: string, options?: RequestInit) => request<any>(`/projects/${orgId}/projects/${projectId}`, { ...options, method: "DELETE" }),
    assignManager: (orgId: string, projectId: string, memberId: string, options?: RequestInit) => request<any>(`/projects/${orgId}/projects/${projectId}/manager`, { ...options, method: "PATCH", body: JSON.stringify({ memberId }) }),
    addMember: (orgId: string, projectId: string, memberId: string, options?: RequestInit) => request<any>(`/projects/${orgId}/projects/${projectId}/members`, { ...options, method: "PATCH", body: JSON.stringify({ memberId }) }),
    removeMember: (orgId: string, projectId: string, userId: string, options?: RequestInit) => request<any>(`/projects/${orgId}/projects/${projectId}/members/${userId}`, { ...options, method: "DELETE" }),
  },
  sprints: {
    list: (orgId: string, projectId: string, params?: PaginationParams, options?: RequestInit) => request<any>(`/sprints/organizations/${orgId}/projects/${projectId}/get-all-sprints${buildQuery(params)}`, options),
    get: (orgId: string, projectId: string, sprintId: string, options?: RequestInit) => request<any>(`/sprints/organizations/${orgId}/projects/${projectId}/get-sprint/${sprintId}`, options),
    create: (orgId: string, projectId: string, payload: Record<string, any>, options?: RequestInit) => request<any>(`/sprints/organizations/${orgId}/projects/${projectId}/create-sprint`, { ...options, method: "POST", body: JSON.stringify(payload) }),
    update: (orgId: string, projectId: string, sprintId: string, payload: Record<string, any>, options?: RequestInit) => request<any>(`/sprints/organizations/${orgId}/projects/${projectId}/update-sprint/${sprintId}`, { ...options, method: "PATCH", body: JSON.stringify(payload) }),
    delete: (orgId: string, projectId: string, sprintId: string, options?: RequestInit) => request<any>(`/sprints/organizations/${orgId}/projects/${projectId}/delete-sprint/${sprintId}`, { ...options, method: "DELETE" }),
    complete: (orgId: string, projectId: string, sprintId: string, options?: RequestInit) => request<any>(`/sprints/organizations/${orgId}/projects/${projectId}/complete-sprint/${sprintId}`, { ...options, method: "POST" }),
  },
  tasks: {
    list: (orgId: string, projectId: string, params?: PaginationParams, options?: RequestInit) => request<any>(`/tasks/organizations/${orgId}/projects/${projectId}/get-all-tasks${buildQuery(params)}`, options),
    get: (orgId: string, projectId: string, taskId: string, options?: RequestInit) => request<any>(`/tasks/organizations/${orgId}/projects/${projectId}/get-task/${taskId}`, options),
    getById: (orgId: string, taskId: string, options?: RequestInit) => request<any>(`/tasks/organizations/${orgId}/get-task/${taskId}`, options),
    create: (orgId: string, projectId: string, payload: Record<string, any>, options?: RequestInit) => request<any>(`/tasks/organizations/${orgId}/projects/${projectId}/create-tasks`, { ...options, method: "POST", body: JSON.stringify(payload) }),
    update: (orgId: string, projectId: string, taskId: string, payload: Record<string, any>, options?: RequestInit) => request<any>(`/tasks/organizations/${orgId}/projects/${projectId}/update-task/${taskId}`, { ...options, method: "PATCH", body: JSON.stringify(payload) }),
    delete: (orgId: string, projectId: string, taskId: string, options?: RequestInit) => request<any>(`/tasks/organizations/${orgId}/projects/${projectId}/delete-task/${taskId}`, { ...options, method: "DELETE" }),
    listAll: (orgId: string, params?: PaginationParams, options?: RequestInit) => request<any>(`/tasks/organizations/${orgId}/get-all-tasks${buildQuery(params)}`, options),
  },
  comments: {
    listGlobal: (orgId: string, options?: RequestInit) => request<any>(`/comments/organizations/${orgId}/comments`, options),
    list: (orgId: string, projectId: string, taskId: string, options?: RequestInit) => request<any>(`/comments/organizations/${orgId}/projects/${projectId}/tasks/${taskId}/get-comments`, options),
    create: (orgId: string, projectId: string, taskId: string, content: string, options?: RequestInit) => request<any>(`/comments/organizations/${orgId}/projects/${projectId}/tasks/${taskId}/create-comments`, { ...options, method: "POST", body: JSON.stringify({ content }) }),
    update: (orgId: string, projectId: string, commentId: string, content: string, options?: RequestInit) => request<any>(`/comments/organizations/${orgId}/projects/${projectId}/update-comments/${commentId}`, { ...options, method: "PATCH", body: JSON.stringify({ content }) }),
    delete: (orgId: string, projectId: string, commentId: string, options?: RequestInit) => request<any>(`/comments/organizations/${orgId}/projects/${projectId}/delete-comments/${commentId}`, { ...options, method: "DELETE" }),
  },
  labels: {
    list: (orgId: string, options?: RequestInit) => request<any>(`/labels/organizations/${orgId}/get-all-labels`, options),
    create: (orgId: string, payload: { name: string; color?: string }, options?: RequestInit) => request<any>(`/labels/organizations/${orgId}/create-labels`, { ...options, method: "POST", body: JSON.stringify(payload) }),
    update: (orgId: string, labelId: string, payload: { name?: string; color?: string }, options?: RequestInit) => request<any>(`/labels/organizations/${orgId}/update-label/${labelId}`, { ...options, method: "PATCH", body: JSON.stringify(payload) }),
    delete: (orgId: string, labelId: string, options?: RequestInit) => request<any>(`/labels/organizations/${orgId}/labels/${labelId}`, { ...options, method: "DELETE" }),
    assign: (orgId: string, labelId: string, taskId: string, options?: RequestInit) => request<any>(`/labels/organizations/${orgId}/labels/${labelId}/assign`, { ...options, method: "POST", body: JSON.stringify({ taskId }) }),
    remove: (orgId: string, labelId: string, taskId: string, options?: RequestInit) => request<any>(`/labels/organizations/${orgId}/labels/${labelId}/tasks/${taskId}/remove`, { ...options, method: "DELETE" }),
  },
  notifications: {
    list: (orgId: string, options?: RequestInit) => request<any>(`/organizations/${orgId}/notifications`, options),
    markRead: (orgId: string, notificationIds: string[], options?: RequestInit) => request<any>(`/organizations/${orgId}/notifications/read`, { ...options, method: "PATCH", body: JSON.stringify({ notificationIds }) }),
    markAllRead: (orgId: string, options?: RequestInit) => request<any>(`/organizations/${orgId}/notifications/read-all`, { ...options, method: "PATCH" }),
  },
  attachments: {
    list: (orgId: string, projectId: string, taskId: string, options?: RequestInit) => request<any>(`/attachments/organizations/${orgId}/projects/${projectId}/tasks/${taskId}/attachments`, options),
    upload: (orgId: string, projectId: string, taskId: string, files: FileList | File[], options?: RequestInit) => {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("files", file));
      return request<any>(`/attachments/organizations/${orgId}/projects/${projectId}/tasks/${taskId}/attachments`, { ...options, method: "POST", body: formData });
    },
    delete: (orgId: string, projectId: string, attachmentId: string, options?: RequestInit) => request<any>(`/attachments/organizations/${orgId}/projects/${projectId}/tasks/attachments/${attachmentId}`, { ...options, method: "DELETE" }),
  },
  activity: {
    list: (orgId: string, params?: PaginationParams, options?: RequestInit) => request<any>(`/activities/organizations/${orgId}/get-activities${buildQuery(params)}`, options),
    listForEntity: (orgId: string, entityType: string, entityId: string, params?: PaginationParams, options?: RequestInit) => request<any>(`/activities/organizations/${orgId}/activities/${entityType}/${entityId}${buildQuery(params)}`, options),
  },
  billing: {
    availablePlans: (options?: RequestInit) => request<BillingPlan[]>("/billing/available-plans", options),
    overview: (orgId: string, options?: RequestInit) => request<any>(`/billing/organizations/${orgId}/get-billing`, options),
    upgrade: (orgId: string, payload: { planId: string; interval: "MONTHLY" | "YEARLY" }, options?: RequestInit) =>
      request<{ bkashURL: string; invoice: unknown }>(`/billing/organizations/${orgId}/upgrade-billing`, {
        ...options,
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },
  admin: {
    plans: {
      list: (params?: PaginationParams, options?: RequestInit) => request<any>(`/billing/plans${buildQuery(params)}`, options),
      create: (payload: Record<string, any>, options?: RequestInit) => request<any>("/billing/plans", { ...options, method: "POST", body: JSON.stringify(payload) }),
      update: (planId: string, payload: Record<string, any>, options?: RequestInit) => request<any>(`/billing/plans/${planId}`, { ...options, method: "PATCH", body: JSON.stringify(payload) }),
    },
    users: {
      list: (params?: PaginationParams, options?: RequestInit) => request<any>(`/users/admin/all${buildQuery(params)}`, options),
      block: (userId: string, options?: RequestInit) => request<any>(`/users/admin/${userId}/block`, { ...options, method: "PATCH", body: JSON.stringify({ isBlocked: true }) }),
      unblock: (userId: string, options?: RequestInit) => request<any>(`/users/admin/${userId}/block`, { ...options, method: "PATCH", body: JSON.stringify({ isBlocked: false }) }),
      delete: (userId: string, options?: RequestInit) => request<any>(`/users/admin/${userId}`, { ...options, method: "DELETE" }),
    },
    organizations: {
      list: (params?: PaginationParams, options?: RequestInit) => request<any>(`/organizations/admin/all${buildQuery(params)}`, options),
    },
    activity: {
      list: (params?: PaginationParams, options?: RequestInit) => request<any>(`/activities/admin/global${buildQuery(params)}`, options),
    },
    subscriptions: (params?: PaginationParams, options?: RequestInit) => request<any>(`/billing/subscriptions${buildQuery(params)}`, options),
    payments: (params?: PaginationParams, options?: RequestInit) => request<any>(`/billing/payments${buildQuery(params)}`, options),
    pendingPayments: (params?: PaginationParams, options?: RequestInit) => request<any>(`/billing/payments/pending${buildQuery(params)}`, options),
  },
};