"""
NeuroAlert Africa — Backend Configuration
Centralizes all environment variables and settings.
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App
    APP_NAME: str = "NeuroAlert Africa API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Supabase
    SUPABASE_URL: str
    SUPABASE_KEY: str           # anon/public key — for client operations
    SUPABASE_SERVICE_KEY: str   # service_role key — for admin operations (bypasses RLS)

    # CORS
    FRONTEND_URL: str = "http://localhost:3000"

    # JWT
    JWT_ALGORITHM: str = "HS256"

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
