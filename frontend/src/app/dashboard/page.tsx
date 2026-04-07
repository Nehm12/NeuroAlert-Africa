"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LanguageContext";
import { dashboardApi, type AlertItem, type DashboardSummary, type TriageFeedItem } from "@/lib/api";
import { Logo } from "@/components/Navbar";
import {
  Activity, AlertTriangle, BellRing, BookOpen, CheckCircle, ChevronRight,
  Clock, Globe, HeartPulse, LayoutDashboard, LogOut, MapPin,
  RefreshCw, Shield, Users, Zap, Building2, ListTree, TrendingUp, User
} from "lucide-react";

import { type Institution, type AuditLog, type InstitutionUser, type DashboardStats } from "@/lib/api";

// ── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  return `${Math.floor(diff / 3600)}h`;
}

const LEVEL_COLORS = {
  1: "bg-[#EF9F27]/10 text-[#EF9F27] border-[#EF9F27]/30",
  2: "bg-[#E24B4A]/10 text-[#E24B4A] border-[#E24B4A]/30",
};

const STATUS_BADGE: Record<string, string> = {
  active: "bg-[#E24B4A]/20 text-[#E24B4A]",
  acknowledged: "bg-[#EF9F27]/20 text-[#EF9F27]",
  resolved: "bg-[#1D9E75]/20 text-[#1D9E75]",
  false_positive: "bg-white/10 text-white/40",
};

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string | number; sub?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6 flex items-center gap-5">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} />
      </div>
      <div>
        <div className="text-2xl font-bold text-white font-serif">{value}</div>
        <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">{label}</div>
        {sub && <div className="text-xs text-white/30 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

// ── Alert Row ─────────────────────────────────────────────────────────────────

function AlertRow({ alert, onAck, onResolve, role, t }: {
  alert: AlertItem;
  onAck: (id: string) => void;
  onResolve: (id: string) => void;
  role: string | null;
  t: any;
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl border transition-all ${
      alert.status === "active" ? "bg-[#E24B4A]/5 border-[#E24B4A]/20" : "bg-white/3 border-white/5"
    }`}>
      <div className={`px-3 py-1 rounded-full text-[10px] font-black border ${LEVEL_COLORS[alert.alert_level]}`}>
        LEVEL {alert.alert_level}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white text-sm font-bold truncate">{alert.phone_caller}</div>
        <div className="text-white/40 text-xs flex items-center gap-2 mt-0.5">
          <MapPin size={10} />
          {alert.location_text || t.dashboard.location_unknown}
          <span className="opacity-30">·</span>
          <Clock size={10} />
          {timeAgo(alert.created_at)}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-center">
          <div className="text-lg font-bold text-white">{alert.fast_score}/3</div>
          <div className="text-[9px] text-white/30 uppercase tracking-widest">FAST</div>
        </div>
        {alert.ai_risk_score != null && (
          <div className="text-center">
            <div className="text-lg font-bold text-[#EF9F27]">{Math.round(alert.ai_risk_score * 100)}%</div>
            <div className="text-[9px] text-white/30 uppercase tracking-widest">Risk IA</div>
          </div>
        )}
        <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${STATUS_BADGE[alert.status] || "bg-white/5 text-white/30"}`}>
          {alert.status}
        </div>
        {(role === "admin" || role === "operator") && alert.status === "active" && (
          <button onClick={() => onAck(alert.id)} className="text-[10px] font-black text-[#1AEEAF] border border-[#1AEEAF]/30 px-3 py-1.5 rounded-lg hover:bg-[#1AEEAF]/10 transition-all uppercase tracking-widest whitespace-nowrap">
            {t.dashboard.ack}
          </button>
        )}
        {(role === "admin" || role === "operator") && alert.status === "acknowledged" && (
          <button onClick={() => onResolve(alert.id)} className="text-[10px] font-black text-[#1D9E75] border border-[#1D9E75]/30 px-3 py-1.5 rounded-lg hover:bg-[#1D9E75]/10 transition-all uppercase tracking-widest whitespace-nowrap">
            {t.dashboard.resolve}
          </button>
        )}
      </div>
    </div>
  );
}

function VisualAnalytics({ data }: { data: DashboardStats[] }) {
  if (data.length < 2) return null;
  
  const maxSessions = Math.max(...data.map(d => d.total_sessions), 10);
  const width = 800;
  const height = 200;
  const padding = 20;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - ((d.total_sessions / maxSessions) * (height - padding * 2) + padding);
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = `${points} ${width - padding},${height} ${padding},${height}`;

  return (
    <div className="w-full bg-white/3 border border-white/5 rounded-2xl p-6 mt-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-[10px] text-[#1AEEAF] font-black uppercase tracking-[0.3em] mb-1">Analyse Temporelle</div>
          <div className="text-white text-lg font-bold">Sessions USSD (7 derniers jours)</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#1D9E75]" />
            <span className="text-[10px] text-white/40 uppercase tracking-widest">Activité GSM</span>
          </div>
        </div>
      </div>
      
      <div className="relative h-[200px] w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1D9E75" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1D9E75" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(v => (
            <line key={v} x1={padding} y1={padding + (height - padding * 2) * v} x2={width - padding} y2={padding + (height - padding * 2) * v} stroke="white" strokeOpacity="0.05" strokeDasharray="4 4" />
          ))}

          {/* Area */}
          <polyline points={areaPoints} fill="url(#gradient)" />
          
          {/* Path */}
          <polyline points={points} fill="none" stroke="#1D9E75" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Data Points */}
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
            const y = height - ((d.total_sessions / maxSessions) * (height - padding * 2) + padding);
            return (
              <g key={i} className="group cursor-pointer">
                <circle cx={x} cy={y} r="4" fill="#1D9E75" className="drop-shadow-[0_0_8px_rgba(29,158,117,0.5)]" />
                <circle cx={x} cy={y} r="12" fill="white" fillOpacity="0" />
                <text x={x} y={y - 15} textAnchor="middle" className="text-[9px] fill-white/40 font-mono opacity-0 group-hover:opacity-100 transition-opacity">{d.total_sessions}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex justify-between mt-4 px-2">
        {data.map((d, i) => (
          <div key={i} className="text-[10px] text-white/20 font-mono">
            {new Date(d.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

type Tab = "overview" | "alerts" | "feed" | "users" | "institutions" | "logs" | "profile";

export default function DashboardPage() {
  const { user, role, institutionName, isAuthenticated, isLoading, logout } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("overview");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [alertsTotal, setAlertsTotal] = useState(0);
  const [feed, setFeed] = useState<TriageFeedItem[]>([]);
  const [users, setUsers] = useState<InstitutionUser[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [history, setHistory] = useState<DashboardStats[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [alertFilter, setAlertFilter] = useState<string>("active");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
  }, [isLoading, isAuthenticated, router]);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;
    setRefreshing(true);
    try {
      const [statsRes, alertsRes, feedRes, historyRes] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getAlerts({ status: alertFilter, per_page: 20 }),
        dashboardApi.getTriageFeed(15),
        dashboardApi.getHistory(7),
      ]);
      setSummary(statsRes);
      setAlerts(alertsRes.data);
      setAlertsTotal(alertsRes.total);
      setFeed(feedRes);
      setHistory(historyRes);

      if (role === "super_admin" || role === "institution") {
        const usersRes = await dashboardApi.getUsers();
        setUsers(usersRes);
      }

      if (role === "super_admin") {
        const [instRes, logsRes] = await Promise.all([
          dashboardApi.getInstitutions(),
          dashboardApi.getAuditLogs(),
        ]);
        setInstitutions(instRes);
        setLogs(logsRes);
      }
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setLoadingData(false);
      setRefreshing(false);
    }
  }, [isAuthenticated, alertFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Auto-refresh feed every 30s
  useEffect(() => {
    const id = setInterval(() => {
      if (isAuthenticated) {
        dashboardApi.getTriageFeed(15).then(setFeed).catch(() => {});
      }
    }, 30000);
    return () => clearInterval(id);
  }, [isAuthenticated]);

  async function handleAck(id: string) {
    try {
      await dashboardApi.acknowledgeAlert(id);
      setAlerts(a => a.map(x => x.id === id ? { ...x, status: "acknowledged" } : x));
    } catch (e) { console.error(e); }
  }

  async function handleResolve(id: string) {
    try {
      await dashboardApi.resolveAlert(id);
      setAlerts(a => a.map(x => x.id === id ? { ...x, status: "resolved" } : x));
    } catch (e) { console.error(e); }
  }

  if (isLoading || (!isAuthenticated && !isLoading)) {
    return (
      <div className="min-h-screen bg-[#04342C] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/20 border-t-[#1AEEAF] rounded-full animate-spin" />
      </div>
    );
  }

  const navItems: { id: Tab; icon: React.ComponentType<{size?: number}>; label: string }[] = [
    { id: "overview", icon: LayoutDashboard, label: t.dashboard.nav_overview },
    { id: "feed", icon: Activity, label: t.dashboard.nav_feed },
    { id: "alerts", icon: BellRing, label: t.dashboard.nav_alerts },
    ...(role === "super_admin" || role === "institution" ? [{ id: "users" as Tab, icon: Users, label: t.dashboard.nav_users }] : []),
    ...(role === "super_admin" ? [
      { id: "institutions" as Tab, icon: Building2, label: t.dashboard.nav_institutions },
      { id: "logs" as Tab, icon: ListTree, label: t.dashboard.nav_logs }
    ] : []),
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex overflow-hidden">
      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#04342C]/80 backdrop-blur-xl border-r border-white/5 p-6 h-screen sticky top-0 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 mb-10">
          <Logo className="w-8 h-8 text-[#04342C]" />
          <span className="text-white font-bold text-base tracking-tighter">
            NeuroAlert<span className="font-light opacity-50"> Africa</span>
          </span>
        </Link>

        <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-2xl">
          <div className="text-[9px] font-black text-[#1AEEAF] tracking-[0.4em] uppercase mb-1">
            {role === "super_admin" ? "Administration" : t.dashboard.institution_label}
          </div>
          <div className="text-white text-sm font-bold truncate">
            {role === "super_admin" ? "NeuroAlert Global" : (institutionName || "—")}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`w-1.5 h-1.5 rounded-full ${role === "super_admin" ? "bg-[#EF9F27]" : "bg-[#1D9E75]"}`} />
            <span className="text-[10px] text-white/40 uppercase tracking-widest">{role}</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map(item => {
            let badge = null;
            if (item.id === "alerts" && summary?.active_alerts_count) badge = summary.active_alerts_count;
            if (item.id === "feed" && summary?.pending_sessions_count) badge = summary.pending_sessions_count;
            if (item.id === "institutions" && institutions.length > 0) badge = institutions.length;
            if (item.id === "users" && users.length > 0) badge = users.length;
            if (item.id === "logs" && logs.length > 0) badge = logs.length;

            return (
              <button key={item.id} onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  tab === item.id
                    ? "bg-[#1D9E75] text-white font-bold"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon size={16} />
                {item.label}
                {badge !== null && (
                  <span className={`ml-auto ${item.id === "alerts" ? "bg-[#E24B4A]" : "bg-white/10"} text-white text-[9px] font-black px-2 py-0.5 rounded-full`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-white/10">
          <div className="text-xs text-white/30 mb-1">{user?.email}</div>
          <button onClick={logout}
            className="flex items-center gap-2 text-white/40 hover:text-[#E24B4A] text-sm transition-colors w-full mt-2"
          >
            <LogOut size={14} /> {t.dashboard.logout}
          </button>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top bar */}
        <header className="bg-[#0a0a0b]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
          <div>
            <h1 className="text-white font-bold text-lg">
              {tab === "profile" ? "Mon Profil" : (navItems.find(n => n.id === tab)?.label || "Dashboard")}
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1AEEAF] animate-pulse" />
              <span className="text-[10px] text-white/30 uppercase tracking-widest">{t.dashboard.operational}</span>
            </div>
          </div>

          <div className="relative">
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="group flex items-center gap-3 p-1 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1D9E75] to-[#1AEEAF] flex items-center justify-center text-white text-xs font-black shadow-lg">
                {user?.full_name?.substring(0, 2).toUpperCase() || "NA"}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-[10px] text-white font-bold leading-tight truncate max-w-[100px]">{user?.full_name || "Utilisateur"}</div>
                <div className="text-[8px] text-white/30 uppercase tracking-tighter leading-tight">{role}</div>
              </div>
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-[#0a0a0b] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-white/5 bg-white/5">
                    <p className="text-[10px] text-white/20 uppercase tracking-widest font-black mb-1">Connecté en tant que</p>
                    <p className="text-white font-bold truncate">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => { setTab("profile"); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <User size={16} /> Mon Profil
                    </button>
                    <button 
                      onClick={() => { fetchData(); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Actualiser
                    </button>
                  </div>
                  <div className="p-2 border-t border-white/5">
                    <button 
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#E24B4A] hover:bg-[#E24B4A]/10 transition-all font-bold"
                    >
                      <LogOut size={16} /> {t.dashboard.logout}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 space-y-6">

          {/* ── Overview ────────────────────────────────────────────────────── */}
          {tab === "overview" && (
            <>
              {/* Stats grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Activity} label={t.dashboard.sessions_today} value={summary?.today.total_sessions ?? "—"} color="bg-[#1D9E75]/20 text-[#1AEEAF]" />
                <StatCard icon={AlertTriangle} label={t.dashboard.active_alerts} value={summary?.active_alerts_count ?? "—"} color="bg-[#E24B4A]/20 text-[#E24B4A]" />
                <StatCard icon={BellRing} label={t.dashboard.alerts_l1} value={summary?.today.total_alerts_l1 ?? "—"} sub={t.dashboard.alerts_l1_sub} color="bg-[#EF9F27]/20 text-[#EF9F27]" />
                <StatCard icon={Zap} label={t.dashboard.alerts_l2} value={summary?.today.total_alerts_l2 ?? "—"} sub={t.dashboard.alerts_l2_sub} color="bg-[#E24B4A]/20 text-[#E24B4A]" />
              </div>

              {/* ── Dynamic Analytics Chart ── */}
              <VisualAnalytics data={history} />

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent alerts */}
                <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-white font-bold">{t.dashboard.recent_alerts}</h2>
                    <button onClick={() => setTab("alerts")} className="text-[#1AEEAF] text-xs flex items-center gap-1 hover:underline">
                      {t.dashboard.see_all} <ChevronRight size={12} />
                    </button>
                  </div>
                  {alerts.slice(0, 5).map(a => (
                    <AlertRow key={a.id} alert={a} onAck={handleAck} onResolve={handleResolve} role={role} t={t} />
                  ))}
                  {alerts.length === 0 && !loadingData && (
                    <div className="text-center py-10 text-white/20">
                      <CheckCircle size={32} className="mx-auto mb-2 text-[#1D9E75]" />
                      <p className="text-sm">{t.dashboard.no_alerts}</p>
                    </div>
                  )}
                </div>

                {/* Live triage feed */}
                <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-white font-bold">{t.dashboard.live_feed}</h2>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1AEEAF] animate-pulse" />
                      <span className="text-[9px] text-white/30 uppercase tracking-widest">{t.dashboard.ussd_live}</span>
                    </div>
                  </div>
                  <div className="space-y-3 max-h-80 overflow-auto">
                    {feed.map(s => (
                      <div key={s.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/3 border border-white/5">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${
                          s.ai_decision === "alert_level2" ? "bg-[#E24B4A] animate-pulse" :
                          s.ai_decision === "alert_level1" ? "bg-[#EF9F27]" : "bg-[#1D9E75]"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white font-medium truncate">{s.phone_number}</div>
                          <div className="text-[10px] text-white/30">{s.current_step} · {timeAgo(s.started_at)}</div>
                        </div>
                        {s.fast_score != null && (
                          <div className="text-sm font-bold text-white shrink-0">{s.fast_score}/3</div>
                        )}
                      </div>
                    ))}
                    {feed.length === 0 && !loadingData && (
                      <div className="text-center py-8 text-white/20 text-sm">{t.dashboard.no_sessions}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* KPI bottom row */}
              {summary && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={Clock} label={t.dashboard.avg_response} value={summary.today.avg_response_min ? `${summary.today.avg_response_min.toFixed(0)} min` : "N/A"} color="bg-white/10 text-white/60" />
                  <StatCard icon={HeartPulse} label={t.dashboard.pending_sessions} value={summary.pending_sessions_count} color="bg-[#1D9E75]/20 text-[#1AEEAF]" />
                  <StatCard icon={Shield} label={t.dashboard.false_positive} value={summary.today.false_positive_rate ? `${(summary.today.false_positive_rate * 100).toFixed(1)}%` : "N/A"} color="bg-white/10 text-white/60" />
                  <StatCard icon={Globe} label={t.dashboard.gsm_uptime} value="99.9%" sub="Uptime" color="bg-[#1D9E75]/20 text-[#1AEEAF]" />
                </div>
              )}
            </>
          )}

          {/* ── Alerts Tab ──────────────────────────────────────────────────── */}
          {tab === "alerts" && (
            <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-white font-bold text-lg">{t.dashboard.nav_alerts} ({alertsTotal})</h2>
                </div>
                <div className="flex gap-2">
                  {["active", "acknowledged", "resolved"].map(s => (
                    <button key={s} onClick={() => setAlertFilter(s)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        alertFilter === s ? "bg-[#1D9E75] text-white" : "border border-white/10 text-white/40 hover:text-white"
                      }`}
                    >
                      {s === "active" ? t.dashboard.filter_active : s === "acknowledged" ? t.dashboard.filter_ack : t.dashboard.filter_resolved}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                {alerts.map(a => (
                  <AlertRow key={a.id} alert={a} onAck={handleAck} onResolve={handleResolve} role={role} t={t} />
                ))}
                {alerts.length === 0 && !loadingData && (
                  <div className="text-center py-16 text-white/20">
                    <CheckCircle size={40} className="mx-auto mb-3 text-[#1D9E75]" />
                    <p>{t.dashboard.no_alerts}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Live Feed Tab ────────────────────────────────────────────────── */}
          {tab === "feed" && (
            <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-bold text-lg">{t.dashboard.live_feed}</h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1AEEAF] animate-pulse" />
                  <span className="text-[10px] text-white/30 uppercase tracking-widest">{t.dashboard.auto_refresh}</span>
                </div>
              </div>
              <div className="space-y-3">
                {feed.map(s => (
                  <div key={s.id} className="flex items-center gap-5 p-4 rounded-2xl bg-white/3 border border-white/5 hover:border-white/10 transition-all">
                    <div className={`w-3 h-3 rounded-full shrink-0 ${
                      s.ai_decision === "alert_level2" ? "bg-[#E24B4A] animate-pulse" :
                      s.ai_decision === "alert_level1" ? "bg-[#EF9F27]" : "bg-[#1D9E75]"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-bold">{s.phone_number}</div>
                      <div className="text-white/40 text-xs">
                        Étape: <span className="text-white/60">{s.current_step}</span>
                        {s.language_code && <> · Lang: <span className="text-white/60">{s.language_code}</span></>}
                        {" "}· {timeAgo(s.started_at)}
                      </div>
                    </div>
                    {s.fast_score != null && (
                      <div className="text-center shrink-0">
                        <div className="text-xl font-bold text-white">{s.fast_score}<span className="text-white/30 text-sm">/3</span></div>
                        <div className="text-[9px] text-white/30 uppercase tracking-widest">FAST</div>
                      </div>
                    )}
                    {s.ai_risk_score != null && (
                      <div className="text-center shrink-0">
                        <div className="text-xl font-bold text-[#EF9F27]">{Math.round(s.ai_risk_score * 100)}<span className="text-xs">%</span></div>
                        <div className="text-[9px] text-white/30 uppercase tracking-widest">Risk</div>
                      </div>
                    )}
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase shrink-0 ${
                      s.status === "active" ? "bg-[#1D9E75]/20 text-[#1AEEAF]" : "bg-white/10 text-white/30"
                    }`}>{s.status}</div>
                  </div>
                ))}
                {feed.length === 0 && (
                  <div className="text-center py-16 text-white/20">
                    <Activity size={40} className="mx-auto mb-3 text-white/20" />
                    <p>{t.dashboard.no_sessions}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Users Tab ───────────────────────────────────────────────────────── */}
          {tab === "users" && (role === "super_admin" || role === "institution") && (
            <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6">
              <h2 className="text-white font-bold text-lg mb-6">{t.dashboard.user_mgmt}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-white/60">
                  <thead className="text-[10px] uppercase tracking-widest text-white/20 border-b border-white/5">
                    <tr>
                      <th className="pb-4 font-black">Nom Full Name</th>
                      <th className="pb-4 font-black">Rôle</th>
                      <th className="pb-4 font-black text-right">Dernier Login</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map(u => (
                      <tr key={u.id} className="group hover:bg-white/3 transition-colors">
                        <td className="py-4 text-white font-medium">{u.full_name || "—"}</td>
                        <td className="py-4 font-mono text-[10px]">{u.role}</td>
                        <td className="py-4 text-right opacity-40">{u.last_login ? timeAgo(u.last_login) : "Jamais"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Institutions Tab (Super Admin only) ─────────────────────────── */}
          {tab === "institutions" && role === "super_admin" && (
            <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6">
              <h2 className="text-white font-bold text-lg mb-6">Gestion des Institutions</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {institutions.map(inst => (
                  <div key={inst.id} className="p-5 rounded-2xl bg-white/3 border border-white/5 hover:border-[#1D9E75]/30 transition-all flex justify-between items-start">
                    <div>
                      <div className="text-white font-bold mb-1">{inst.name}</div>
                      <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">{inst.type} · {inst.country_code}</div>
                      <div className="mt-4 flex gap-2">
                        {inst.alert_zones?.map(z => (
                          <span key={z} className="px-2 py-1 rounded-md bg-white/5 text-[9px] text-[#1AEEAF] uppercase tracking-widest">{z}</span>
                        ))}
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${inst.is_active ? 'bg-[#1D9E75]/20 text-[#1AEEAF]' : 'bg-red-500/20 text-red-400'}`}>
                      {inst.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Profile Tab ───────────────────────────────────────────────────────── */}
          {tab === "profile" && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-8">
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#1D9E75] to-[#1AEEAF] flex items-center justify-center text-white text-3xl font-black shadow-2xl">
                    {user?.full_name?.substring(0, 2).toUpperCase() || "NA"}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{user?.full_name || "Chargement..."}</h2>
                    <p className="text-white/40 font-mono text-sm underline decoration-[#1AEEAF]/30">{user?.email}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 pb-10 border-b border-white/5">
                  <div>
                    <div className="text-[10px] text-white/20 uppercase tracking-widest font-black mb-2">Rôle Système</div>
                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-white/60 font-mono text-xs">
                      {role}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/20 uppercase tracking-widest font-black mb-2">Institution</div>
                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-white/60 font-medium text-xs">
                      {role === "super_admin" ? "NeuroAlert Global" : (institutionName || "—")}
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <h3 className="text-white font-bold mb-6">Préférences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/5">
                      <span className="text-white font-medium text-sm">Langue de l'interface</span>
                      <span className="text-[#1AEEAF] text-xs font-black uppercase tracking-widest">Français</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/5">
                      <span className="text-white font-medium text-sm">Notifications SMS</span>
                      <span className="text-white/20 text-[9px] font-black uppercase tracking-widest italic font-mono decoration-red-500 line-through">Inactif (Plan Pro requis)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#E24B4A]/5 border border-[#E24B4A]/10 text-center">
                <p className="text-[10px] text-[#E24B4A] uppercase tracking-widest font-black">Besoin de modifier vos identifiants ?</p>
                <p className="text-xs text-white/40 mt-1">Contactez votre administrateur réseau ou le support technique NeuroAlert.</p>
              </div>
            </div>
          )}
          {/* ── Audit Logs Tab (Super Admin only) ─────────────────────────── */}
          {tab === "logs" && role === "super_admin" && (
            <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6">
              <h2 className="text-white font-bold text-lg mb-6">Logs d'Audit Système</h2>
              <div className="space-y-4">
                {logs.map(log => (
                  <div key={log.id} className="p-4 rounded-xl bg-white/2 border border-white/5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <BookOpen size={14} className="text-white/40" />
                      </div>
                      <div>
                        <div className="text-xs text-white font-mono">{log.action}</div>
                        <div className="text-[10px] text-white/30">{log.user_full_name || "System"} · {new Date(log.created_at).toLocaleString()}</div>
                      </div>
                    </div>
                    {log.metadata && (
                      <div className="text-[10px] text-white/20 bg-black/20 p-2 rounded max-w-xs truncate">
                        {JSON.stringify(log.metadata)}
                      </div>
                    )}
                  </div>
                ))}
                {logs.length === 0 && !loadingData && (
                  <div className="text-center py-10 text-white/20">Aucun log récent.</div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
