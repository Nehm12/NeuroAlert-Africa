"""
NeuroAlert Africa — Auth Middleware
FastAPI dependency that validates Supabase JWT tokens
and injects the current authenticated user into route handlers.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.database import supabase_admin

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    Validates the Bearer JWT token via Supabase and returns the current user
    including their institution and role from institution_users table.
    """
    token = credentials.credentials

    try:
        # Verify the JWT via Supabase Auth
        user_response = supabase_admin.auth.get_user(token)
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user = user_response.user

        # Fetch the institution_user profile (role, institution)
        profile = (
            supabase_admin.table("institution_users")
            .select("*, institutions(*)")
            .eq("user_id", user.id)
            .maybe_single()
            .execute()
        )

        if not profile.data:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No institutional profile found for this user.",
            )

        # Standardizing user object
        user_data = {
            "id": user.id,
            "email": user.email,
            "role": profile.data.get("role"),
            "institution_id": profile.data.get("institution_id"),
            "institution": profile.data.get("institutions"),
            "full_name": profile.data.get("full_name"),
            "language_pref": profile.data.get("language_pref"),
        }
        
        return user_data

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


def require_role(*roles: str):
    """
    Role-based access control decorator factory.
    Allowed roles: "super_admin", "institution"
    """
    async def role_checker(current_user: dict = Depends(get_current_user)) -> dict:
        user_role = current_user.get("role")
        if user_role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. '{user_role}' role is insufficient. Required: {', '.join(roles)}.",
            )
        return current_user
    return role_checker
