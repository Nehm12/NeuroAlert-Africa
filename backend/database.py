"""
NeuroAlert Africa — Supabase Client
Provides two client instances:
- `supabase`: Uses anon key, respects Row Level Security (RLS)
- `supabase_admin`: Uses service_role key, bypasses RLS for backend operations
"""
from supabase import create_client, Client
from backend.config import settings

# Public client (respects RLS — used for user-facing operations)
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

# Admin client (bypasses RLS — used for server-side operations only)
supabase_admin: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
