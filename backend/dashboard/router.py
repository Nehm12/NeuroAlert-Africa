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
    InstitutionResponse,
    InstitutionUpdateRequest,
    AuditLogResponse,
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
    Returns today's aggregated stats.
    - super_admin: Global stats across all institutions.
    - institution: Stats filtered for the user's institution.
    """
    role = current_user.get("role")
    institution_id = current_user.get("institution_id")
    today = date.today().isoformat()

    # Get today's stats from daily_stats table
    query = supabase_admin.table("daily_stats").select("*").eq("date", today)
    
    if role != "super_admin" and institution_id:
        # In a real multi-tenant app, daily_stats would have institution_id.
        # For now, we assume daily_stats is global or we filter alerts specifically.
        pass

    stats_res = query.maybe_single().execute()
    stats_data = getattr(stats_res, "data", {}) or {}

    # Filtering Alerts and Sessions
    alerts_query = supabase_admin.table("alerts").select("id", count="exact").eq("status", "active")
    sessions_query = supabase_admin.table("ussd_sessions").select("id", count="exact").eq("status", "active")

    if role != "super_admin" and institution_id:
        # Filter by country_code for the 'institution' role as 'zone' column doesn't exist yet
        institution_data = current_user.get("institution", {})
        c_code = institution_data.get("country_code")
        if c_code:
            alerts_query = alerts_query.eq("country_code", c_code)
            # ussd_sessions table doesn't have country_code yet, so we don't filter it to avoid crashes
            pass

    active_alerts_res = alerts_query.execute()
    pending_sessions_res = sessions_query.execute()

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


@router.get("/history", response_model=list[DashboardStats], summary="Get historical stats (last 7 days)")
async def get_dashboard_history(
    days: int = Query(7, ge=1, le=30),
    current_user: dict = Depends(get_current_user),
):
    """
    Returns a list of daily stats for the last N days.
    Used for line charts.
    """
    role = current_user.get("role")
    
    query = supabase_admin.table("daily_stats").select("*").order("date", desc=True).limit(days)
    
    if role != "super_admin":
        institution_data = current_user.get("institution", {})
        c_code = institution_data.get("country_code")
        if c_code:
            query = query.eq("country_code", c_code)

    res = query.execute()
    # Return in chronological order for the chart
    data = res.data or []
    data.reverse()
    return [DashboardStats(**d) for d in data]


# ── Alerts ─────────────────────────────────────────────────────────────────

@router.get("/alerts", response_model=PaginatedAlerts, summary="List alerts for institution")
async def list_alerts(
    status_filter: Optional[str] = Query(None, alias="status", description="active|acknowledged|resolved|false_positive"),
    alert_level: Optional[int] = Query(None, description="1 or 2"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
):
    query = supabase_admin.table("alerts").select("*", count="exact").order("created_at", desc=True)

    # Role-based filtering
    role = current_user.get("role")
    if role != "super_admin":
        institution_data = current_user.get("institution", {})
        inst_lat = institution_data.get("latitude")
        inst_lon = institution_data.get("longitude")
        
        # If institution has coordinates, strict geofence of 1km using RPC
        if inst_lat is not None and inst_lon is not None:
            query = supabase_admin.rpc("get_nearby_alerts", {
                "inst_lat": inst_lat,
                "inst_lon": inst_lon,
                "radius_km": 1.0
            }).select("*", count="exact")
        else:
            # Fallback legacy filtration pour éviter les plantages si non géolocalisé
            c_code = institution_data.get("country_code")
            if c_code:
                query = query.eq("country_code", c_code)

    if status_filter:
        query = query.eq("status", status_filter)
    if alert_level:
        query = query.eq("alert_level", alert_level)

    # Pagination
    offset = (page - 1) * per_page
    query = query.range(offset, offset + per_page - 1)

    res = query.execute()
    total = res.count or 0

    alerts = [AlertResponse(**a) for a in (res.data or [])]

    return PaginatedAlerts(
        data=alerts,
        total=total,
        page=page,
        per_page=per_page,
        has_more=(offset + per_page) < total,
    )


@router.patch("/institutions/{inst_id}", response_model=InstitutionResponse, summary="Modifier la vitrine")
async def update_institution(
    inst_id: str,
    body: InstitutionUpdateRequest,
    current_user: dict = Depends(require_role("super_admin", "institution")),
):
    """
    Super Admin édite les coordonnées, adresses de vitrine et infos des institutions.
    L'Institution elle-même peut éditer uniquement les siennes.
    """
    role = current_user.get("role")
    user_inst_id = current_user.get("institution_id")
    
    if role == "institution" and str(user_inst_id) != str(inst_id):
        raise HTTPException(status_code=403, detail="Vous ne pouvez modifier que votre propre vitrine institutionnelle.")

    update_data = {k: v for k, v in body.dict().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    res = supabase_admin.table("institutions").update(update_data).eq("id", inst_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Institution non trouvée.")
        
    return InstitutionResponse(**res.data[0])


@router.patch(
    "/alerts/{alert_id}/acknowledge",
    response_model=AlertAcknowledgeResponse,
    summary="Acknowledge an alert"
)
async def acknowledge_alert(
    alert_id: str,
    current_user: dict = Depends(require_role("super_admin", "institution")),
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
    current_user: dict = Depends(require_role("super_admin", "institution")),
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
    )

    role = current_user.get("role")
    if role != "super_admin":
        # ussd_sessions does not have zone or country_code yet
        pass

    res = res.limit(limit).execute()

    items = []
    for s in (res.data or []):
        s["phone_number"] = mask_phone(s.get("phone_number", ""))
        items.append(TriageFeedItem(**s))

    return items


# ── User Management (Admin only) ─────────────────────────────────────────────

@router.get("/users", response_model=list[InstitutionUserResponse], summary="List institution users")
async def list_institution_users(
    current_user: dict = Depends(require_role("super_admin", "institution")),
):
    """
    Returns the list of users. 
    Super Admin sees all, Institution Admin sees only theirs.
    """
    role = current_user.get("role")
    institution_id = current_user.get("institution_id")

    query = supabase_admin.table("institution_users").select("*")
    
    if role != "super_admin":
        if not institution_id:
            return []
        query = query.eq("institution_id", institution_id)

    res = query.execute()
    return [InstitutionUserResponse(**u) for u in (res.data or [])]


@router.get("/institutions", response_model=list[InstitutionResponse], summary="List all institutions")
async def list_institutions(
    current_user: dict = Depends(require_role("super_admin")),
):
    """
    Returns the list of all registered institutions.
    Super Admin only.
    """
    res = supabase_admin.table("institutions").select("*").execute()
    return [InstitutionResponse(**i) for i in (res.data or [])]


@router.get("/audit-logs", response_model=list[AuditLogResponse], summary="List system audit logs")
async def list_audit_logs(
    current_user: dict = Depends(require_role("super_admin")),
):
    """
    Returns the most recent system audit logs.
    Super Admin only for now.
    """
    res = (
        supabase_admin.table("audit_logs")
        .select("*, institution_users(full_name)")
        .order("created_at", desc=True)
        .limit(100)
        .execute()
    )
    
    logs = []
    for log in (res.data or []):
        log["user_full_name"] = log.get("institution_users", {}).get("full_name")
        logs.append(AuditLogResponse(**log))
        
    return logs


@router.post("/users", response_model=InstitutionUserResponse, status_code=201, summary="Create institution user")
async def create_institution_user(
    body: CreateUserRequest,
    current_user: dict = Depends(require_role("super_admin", "institution")),
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
