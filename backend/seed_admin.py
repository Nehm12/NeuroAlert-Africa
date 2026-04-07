import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

URL = os.getenv("SUPABASE_URL")
# Attention, on a besoin de la clé SERVICE_ROLE pour by-passer les RLS et créer des users admin
KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not URL or not KEY or "your-" in URL:
    print("❌ Veuillez d'abord remplir correctement vos clés dans backend/.env !")
    sys.exit(1)

supabase: Client = create_client(URL, KEY)

def create_user(email, password, full_name, role, institution_id=None):
    print(f"🧠 Création du compte {role} ({email})...")
    try:
        # 1. Create User Auth
        auth_res = supabase.auth.admin.create_user({
            "email": email,
            "password": password,
            "email_confirm": True
        })
        user_id = auth_res.user.id
        print(f"✅ Utilisateur Auth créé : {user_id}")

        # 2. Link User to Profile
        supabase.table("institution_users").insert({
            "user_id": user_id,
            "institution_id": institution_id,
            "full_name": full_name,
            "role": role,
            "language_pref": "fr"
        }).execute()
        print(f"✅ Profil {role} lié avec succès !")
        return user_id
    except Exception as e:
        print(f"❌ Erreur pour {email} : {e}")
        return None

def seed():
    # 1. Create Institution for the hospital user
    print("🏥 Création de l'institution de test...")
    inst_res = supabase.table("institutions").insert({
        "name": "Hôpital Central de NeuroAlert",
        "type": "hospital",
        "country_code": "NG",
        "plan": "premium",
        "alert_zones": ["Lagos", "Abuja"]
    }).execute()
    inst_id = inst_res.data[0]["id"]
    print(f"✅ Institution créée : {inst_id}")

    # 2. Create Super Admin
    create_user(
        "super@neuroalert.org", 
        "vanguard_super!", 
        "Global Supervisor", 
        "super_admin"
    )

    # 3. Create Institution Admin
    create_user(
        "hospital@neuroalert.org", 
        "vanguard_hospital!", 
        "Directeur Hôpital", 
        "institution",
        inst_id
    )

    print("\n" + "="*50)
    print("🎉 SUCCÈS ! Comptes de test créés :")
    print("-" * 50)
    print("SUPER ADMIN :")
    print("  Email : super@neuroalert.org")
    print("  Pass  : vanguard_super!")
    print("-" * 50)
    print("INSTITUTION :")
    print("  Email : hospital@neuroalert.org")
    print("  Pass  : vanguard_hospital!")
    print("="*50)

if __name__ == "__main__":
    seed()
