/**
 * NeuroAlert Africa — Typed API Client
 * All calls to the FastAPI backend are centralized here.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// ── Helper ────────────────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("na_token");
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(`${API_URL}${path}`, { ...options, headers });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ detail: res.statusText }));
        // Map status to translation keys
        if (res.status === 401) throw new Error("auth");
        if (res.status === 403) throw new Error("access");
        if (res.status === 404) throw new Error("not_found");
        if (res.status === 405) throw new Error("method");
        if (res.status === 422) throw new Error("validation");
        if (res.status === 429) throw new Error("rate_limit");
        if (res.status === 500) throw new Error("server");
        
        throw new Error(error.detail || `Error ${res.status}: ${res.statusText}`);
    }

    return res.json();
  } catch (err: any) {
    if (err.message === "Failed to fetch") {
        throw new Error("network");
    }
    throw err;
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: string; // super_admin / institution
  institution_id: string;
  institution_name: string;
}

export interface UserProfile {
  user_id: string;
  email: string;
  full_name: string | null;
  role: string;
  language_pref: string;
  institution: {
    id: string;
    name: string;
    type: string;
    country_code: string;
    plan?: string;
    latitude?: number | null;
    longitude?: number | null;
    address?: string | null;
    opening_hours?: string | null;
    description?: string | null;
  } | null;
}

export interface AlertItem {
  id: string;
  alert_level: 1 | 2;
  phone_caller: string;
  location_text: string | null;
  latitude: number | null;
  longitude: number | null;
  country_code: string | null;
  fast_score: number;
  ai_risk_score: number | null;
  ai_decision: string | null;
  status: "active" | "acknowledged" | "resolved" | "false_positive";
  symptoms: Record<string, any> | null;
  sms_sent_at: string | null;
  response_time_min: number | null;
  created_at: string;
}

export interface PaginatedAlerts {
  data: AlertItem[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

export interface DashboardStats {
  date: string;
  total_sessions: number;
  total_alerts_l1: number;
  total_alerts_l2: number;
  avg_response_min: number | null;
  false_positive_rate: number | null;
}

export interface DashboardSummary {
  today: DashboardStats;
  active_alerts_count: number;
  pending_sessions_count: number;
}

export interface TriageFeedItem {
  id: string;
  session_id: string;
  phone_number: string;
  language_code: string | null;
  current_step: string;
  fast_score: number | null;
  ai_risk_score: number | null;
  ai_decision: string | null;
  status: string;
  symptoms: Record<string, any> | null;
  started_at: string;
  completed_at: string | null;
}

export interface InstitutionUser {
  id: string;
  full_name: string | null;
  role: string;
  language_pref: string | null;
  last_login: string | null;
}

export interface Institution {
  id: string;
  name: string;
  type: string;
  country_code: string;
  alert_zones: string[] | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  opening_hours: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  target_id: string | null;
  metadata: any;
  created_at: string;
  user_full_name: string | null;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () => apiFetch<UserProfile>("/auth/me"),

  logout: () =>
    apiFetch<{ message: string }>("/auth/logout", { method: "POST" }),
};

// ── Dashboard ─────────────────────────────────────────────────────────────────

export const dashboardApi = {
  getStats: () => apiFetch<DashboardSummary>("/dashboard/stats"),

  getAlerts: (params?: {
    status?: string;
    alert_level?: number;
    page?: number;
    per_page?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.alert_level) qs.set("alert_level", String(params.alert_level));
    if (params?.page) qs.set("page", String(params.page));
    if (params?.per_page) qs.set("per_page", String(params.per_page));
    return apiFetch<PaginatedAlerts>(`/dashboard/alerts?${qs}`);
  },

  acknowledgeAlert: (id: string) =>
    apiFetch<{ id: string; status: string; message: string }>(
      `/dashboard/alerts/${id}/acknowledge`,
      { method: "PATCH" }
    ),

  resolveAlert: (id: string, response_time_min?: number) =>
    apiFetch<{ id: string; status: string; message: string }>(
      `/dashboard/alerts/${id}/resolve`,
      {
        method: "PATCH",
        body: JSON.stringify({ response_time_min }),
      }
    ),

  getTriageFeed: (limit = 20) =>
    apiFetch<TriageFeedItem[]>(`/dashboard/triage-feed?limit=${limit}`),

  getUsers: () => apiFetch<InstitutionUser[]>("/dashboard/users"),

  getInstitutions: () => apiFetch<Institution[]>("/dashboard/institutions"),

  updateInstitution: (id: string, data: Partial<Institution>) =>
    apiFetch<Institution>(`/dashboard/institutions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getAuditLogs: () => apiFetch<AuditLog[]>("/dashboard/audit-logs"),

  getHistory: (days = 7) => apiFetch<DashboardStats[]>(`/dashboard/history?days=${days}`),
};

// ── System ────────────────────────────────────────────────────────────────────

export const systemApi = {
  getHealth: () => apiFetch<{
    status: string;
    components: {
      database: string;
      ai_engine: string;
      telecom: string;
    };
    timestamp: string;
    service: string;
    version: string;
  }>("/health"),
};
