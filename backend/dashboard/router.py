"""
NeuroAlert Africa — Dashboard Router
All protected institutional dashboard endpoints.
Requires valid JWT (Bearer token) on every request.
"""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import Optional
from datetime import date, datetime, timezone

from backend.auth.middleware import get_current_user, require_role
from backend.database import supabase_admin
from backend.dashboard.schemas import (
    AlertResponse,
    AlertAcknowledgeResponse,
    AlertResolveRequest,
    DashboardSummary,
    DashboardStats,
    TriageFeedItem,
    InstitutionUserResponse,
    CreateUserRequest,
    PaginatedAlerts,
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


# ── Helper ─────────────────────────────────────────────────────────────────

def mask_phone(phone: str) -> str:
    """Masks middle digits of phone number for privacy: +234*****1234"""
    if not phone or len(phone) < 6:
        return "****"
    return phone[:4] + "*" * (len(phone) - 8) + phone[-4:]


# ── Stats & Summary ─────────────────────────────────────────────────────────

@router.get("/stats", response_model=DashboardSummary, summary="Get today's dashboard summary")
async def get_dashboard_stats(
    current_user: dict = Depends(get_current_user)
):
    """
    Returns today's aggregated stats for the current user's institution,
    including active alerts count and pending triage sessions.
    """
    institution_id = current_user.get("institution_id")
    today = date.today().isoformat()

    # Get today's stats from daily_stats table
    stats_res = (
        supabase_admin.table("daily_stats")
        .select("*")
        .eq("date", today)
        .maybe_single()
        .execute()
    )

    stats_data = stats_res.data or {}

    # Count active alerts for this institution's zones
    institution = current_user.get("institutions", {})
    alert_zones = institution.get("alert_zones", []) if institution else []

    active_alerts_res = (
        supabase_admin.table("alerts")
        .select("id", count="exact")
        .eq("status", "active")
        .execute()
    )

    pending_sessions_res = (
        supabase_admin.table("ussd_sessions")
        .select("id", count="exact")
        .eq("status", "active")
        .execute()
    )

    today_stats = DashboardStats(
        date=today,
        total_sessions=stats_data.get("total_sessions", 0),
        total_alerts_l1=stats_data.get("total_alerts_l1", 0),
        total_alerts_l2=stats_data.get("total_alerts_l2", 0),
        avg_response_min=stats_data.get("avg_response_min"),
        false_positive_rate=stats_data.get("false_positive_rate"),
    )

    return DashboardSummary(
        today=today_stats,
        active_alerts_count=active_alerts_res.count or 0,
        pending_sessions_count=pending_sessions_res.count or 0,
    )


# ── Alerts ─────────────────────────────────────────────────────────────────

@router.get("/alerts", response_model=PaginatedAlerts, summary="List alerts for institution")
async def list_alerts(
    status_filter: Optional[str] = Query(None, alias="status", description="active|acknowledged|resolved|false_positive"),
    alert_level: Optional[int] = Query(None, description="1 or 2"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
):
    """
    Returns a paginated list of alerts. Filterable by status and alert level.
    Phone numbers are masked for privacy (viewer role only sees masked data).
    """
    query = supabase_admin.table("alerts").select("*", count="exact").order("created_at", desc=True)

    if status_filter:
        query = query.eq("status", status_filter)
    if alert_level:
        query = query.eq("alert_level", alert_level)

    # Pagination
    offset = (page - 1) * per_page
    query = query.range(offset, offset + per_page - 1)

    res = query.execute()
    total = res.count or 0

    # Mask phone for non-admin roles
    role = current_user.get("role", "viewer")
    alerts = []
    for a in (res.data or []):
        if role == "viewer":
            a["phone_caller"] = mask_phone(a.get("phone_caller", ""))
        alerts.append(AlertResponse(**a))

    return PaginatedAlerts(
        data=alerts,
        total=total,
        page=page,
        per_page=per_page,
        has_more=(offset + per_page) < total,
    )


@router.patch(
    "/alerts/{alert_id}/acknowledge",
    response_model=AlertAcknowledgeResponse,
    summary="Acknowledge an alert"
)
async def acknowledge_alert(
    alert_id: str,
    current_user: dict = Depends(require_role("admin", "operator")),
):
    """
    Marks an alert as acknowledged. Requires 'admin' or 'operator' role.
    Logs the action in audit_logs.
    """
    # Update alert status
    res = (
        supabase_admin.table("alerts")
        .update({"status": "acknowledged"})
        .eq("id", alert_id)
        .eq("status", "active")  # Only acknowledge active alerts
        .execute()
    )

    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found or already acknowledged.",
        )

    # Audit log
    supabase_admin.table("audit_logs").insert({
        "user_id": current_user.get("id"),
        "action": "alert.acknowledge",
        "target_id": alert_id,
        "metadata": {"role": current_user.get("role")},
    }).execute()

    return AlertAcknowledgeResponse(
        id=alert_id,
        status="acknowledged",
        message="Alert successfully acknowledged.",
    )


@router.patch(
    "/alerts/{alert_id}/resolve",
    response_model=AlertAcknowledgeResponse,
    summary="Resolve an alert"
)
async def resolve_alert(
    alert_id: str,
    body: AlertResolveRequest,
    current_user: dict = Depends(require_role("admin", "operator")),
):
    """
    Marks an alert as resolved with optional response time.
    Requires 'admin' or 'operator' role.
    """
    update_data = {
        "status": "resolved",
        "resolved_at": datetime.now(timezone.utc).isoformat(),
    }
    if body.response_time_min is not None:
        update_data["response_time_min"] = body.response_time_min

    res = (
        supabase_admin.table("alerts")
        .update(update_data)
        .eq("id", alert_id)
        .in_("status", ["active", "acknowledged"])
        .execute()
    )

    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found or already resolved.",
        )

    # Audit log
    supabase_admin.table("audit_logs").insert({
        "user_id": current_user.get("id"),
        "action": "alert.resolve",
        "target_id": alert_id,
        "metadata": {
            "response_time_min": body.response_time_min,
            "notes": body.notes,
        },
    }).execute()

    return AlertAcknowledgeResponse(
        id=alert_id,
        status="resolved",
        message="Alert resolved successfully.",
    )


# ── Triage Feed ─────────────────────────────────────────────────────────────

@router.get("/triage-feed", response_model=list[TriageFeedItem], summary="Live USSD triage feed")
async def get_triage_feed(
    limit: int = Query(20, ge=1, le=50),
    current_user: dict = Depends(get_current_user),
):
    """
    Returns the most recent USSD triage sessions (live feed).
    Phone numbers are always masked for privacy.
    """
    res = (
        supabase_admin.table("ussd_sessions")
        .select("*")
        .order("started_at", desc=True)
        .limit(limit)
        .execute()
    )

    items = []
    for s in (res.data or []):
        s["phone_number"] = mask_phone(s.get("phone_number", ""))
        items.append(TriageFeedItem(**s))

    return items


# ── User Management (Admin only) ─────────────────────────────────────────────

@router.get("/users", response_model=list[InstitutionUserResponse], summary="List institution users")
async def list_institution_users(
    current_user: dict = Depends(require_role("admin")),
):
    """
    Returns the list of all users for the current institution.
    Admin only.
    """
    institution_id = current_user.get("institution_id")

    res = (
        supabase_admin.table("institution_users")
        .select("*")
        .eq("institution_id", institution_id)
        .execute()
    )

    return [InstitutionUserResponse(**u) for u in (res.data or [])]


@router.post("/users", response_model=InstitutionUserResponse, status_code=201, summary="Create institution user")
async def create_institution_user(
    body: CreateUserRequest,
    current_user: dict = Depends(require_role("admin")),
):
    """
    Creates a new user for the current institution via Supabase Auth.
    Admin only.
    """
    institution_id = current_user.get("institution_id")

    try:
        # Create auth user
        auth_res = supabase_admin.auth.admin.create_user({
            "email": body.email,
            "password": body.password,
            "email_confirm": True,
        })

        if not auth_res.user:
            raise HTTPException(status_code=400, detail="Failed to create auth user.")

        # Create institution_user profile
        profile_res = supabase_admin.table("institution_users").insert({
            "user_id": str(auth_res.user.id),
            "institution_id": institution_id,
            "full_name": body.full_name,
            "role": body.role,
            "language_pref": body.language_pref,
        }).execute()

        return InstitutionUserResponse(**profile_res.data[0])

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"User creation error: {str(e)}",
        )
