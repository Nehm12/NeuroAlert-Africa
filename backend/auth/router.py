"""
NeuroAlert Africa — Auth Router
Handles login, logout, and current user profile endpoints.
"""
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from backend.database import supabase, supabase_admin
from backend.auth.middleware import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ── Schemas ─────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    full_name: str | None = None
    role: str
    institution_id: str
    institution_name: str


# ── Endpoints ────────────────────────────────────────────────────────────────

@router.post("/login", response_model=LoginResponse, summary="Login with email & password")
async def login(credentials: LoginRequest):
    """
    Authenticates an institutional user via Supabase Auth.
    Returns a JWT access_token along with the user's role and institution.
    """
    try:
        # Sign in via Supabase Auth
        auth_response = supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password,
        })

        if not auth_response.user or not auth_response.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        user = auth_response.user
        access_token = auth_response.session.access_token

        # Get institution profile
        profile = (
            supabase_admin.table("institution_users")
            .select("*, institutions(id, name)")
            .eq("user_id", user.id)
            .maybe_single()
            .execute()
        )

        if not profile.data:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No institutional access configured for this account. Contact your administrator.",
            )

        p = profile.data
        institution = p.get("institutions", {})

        return LoginResponse(
            access_token=access_token,
            user_id=str(user.id),
            email=user.email,
            full_name=p.get("full_name"),
            role=p.get("role", "viewer"),
            institution_id=str(institution.get("id", "")),
            institution_name=institution.get("name", ""),
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication service error: {str(e)}",
        )


@router.post("/logout", summary="Logout current session")
async def logout(current_user: dict = Depends(get_current_user)):
    """
    Signs out the current user by invalidating the session on Supabase.
    """
    try:
        supabase.auth.sign_out()
        return {"message": "Successfully logged out."}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Logout error: {str(e)}",
        )


@router.get("/me", summary="Get current user profile")
async def get_me(current_user: dict = Depends(get_current_user)):
    """
    Returns the profile of the currently authenticated institutional user.
    """
    # Update last_login timestamp
    supabase_admin.table("institution_users").update(
        {"last_login": "now()"}
    ).eq("user_id", current_user["user_id"]).execute()

    return {
        "user_id": current_user["user_id"],
        "email": current_user["email"],
        "full_name": current_user.get("full_name"),
        "role": current_user.get("role"),
        "language_pref": current_user.get("language_pref", "fr"),
        "institution": current_user.get("institutions"),
    }
