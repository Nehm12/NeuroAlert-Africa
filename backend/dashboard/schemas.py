"""
NeuroAlert Africa — Dashboard Pydantic Schemas
All request/response models for the institutional dashboard API.
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ── Alert Schemas ─────────────────────────────────────────────────────────────

class AlertResponse(BaseModel):
    id: str
    alert_level: int               # 1 or 2
    phone_caller: str
    location_text: Optional[str]
    country_code: Optional[str]
    fast_score: int                # 0-5 (BEFAST)
    ai_risk_score: Optional[float] # 0.0-1.0
    ai_decision: Optional[str]     # low_risk / alert_level1 / alert_level2
    status: str                    # active / acknowledged / resolved / false_positive
    sms_sent_at: Optional[datetime]
    response_time_min: Optional[int]
    created_at: datetime


class AlertAcknowledgeResponse(BaseModel):
    id: str
    status: str
    message: str


class AlertResolveRequest(BaseModel):
    response_time_min: Optional[int] = None
    notes: Optional[str] = None


# ── Dashboard Stats Schemas ───────────────────────────────────────────────────

class DashboardStats(BaseModel):
    date: str
    total_sessions: int
    total_alerts_l1: int
    total_alerts_l2: int
    avg_response_min: Optional[float]
    false_positive_rate: Optional[float]
    # Computed fields
    alert_resolution_rate: Optional[float] = None


class DashboardSummary(BaseModel):
    today: DashboardStats
    active_alerts_count: int
    pending_sessions_count: int


# ── Triage Feed Schemas ───────────────────────────────────────────────────────

class TriageFeedItem(BaseModel):
    id: str
    session_id: str
    phone_number: str              # Masked: +234*****1234
    language_code: Optional[str]
    current_step: str
    fast_score: Optional[int]      # 0-5
    ai_risk_score: Optional[float]
    ai_decision: Optional[str]
    status: str
    started_at: datetime
    completed_at: Optional[datetime]


# ── Institution User Schemas ──────────────────────────────────────────────────

class InstitutionUserResponse(BaseModel):
    id: str
    full_name: Optional[str]
    role: str                      # super_admin / institution
    language_pref: Optional[str]
    last_login: Optional[datetime]


class CreateUserRequest(BaseModel):
    email: str
    full_name: str
    role: str = "institution"      # Default role
    language_pref: str = "fr"
    password: str                  # Admin sets the initial password


# ── Institution Schemas ──────────────────────────────────────────────────────

class InstitutionResponse(BaseModel):
    id: str
    name: str
    type: str                      # hospital / clinic / emergency_center
    country_code: str
    alert_zones: Optional[List[str]]
    is_active: bool
    created_at: datetime


# ── Audit Log Schemas ────────────────────────────────────────────────────────

class AuditLogResponse(BaseModel):
    id: str
    user_id: Optional[str]
    action: str                    # alert.acknowledge, user.create, etc.
    target_id: Optional[str]
    metadata: Optional[dict]
    created_at: datetime
    # Joined fields
    user_full_name: Optional[str] = None


# ── Pagination ────────────────────────────────────────────────────────────────

class PaginatedAlerts(BaseModel):
    data: List[AlertResponse]
    total: int
    page: int
    per_page: int
    has_more: bool
