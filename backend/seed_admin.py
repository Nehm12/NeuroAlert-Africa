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

def seed():
    print("🧠 Création du compte Admin NeuroAlert...")
    email = "admin@neuroalert.org"
    password = "vanguard_admin!"
    
    # 1. Create User Auth
    try:
        auth_res = supabase.auth.admin.create_user({
            "email": email,
            "password": password,
            "email_confirm": True
        })
        user_id = auth_res.user.id
        print(f"✅ Utilisateur Auth créé : {user_id}")
    except Exception as e:
        print(f"❌ Erreur création Auth (peut-être existe-t-il déjà ?) : {e}")
        # Si erreur on ne continue pas (pour éviter de dupliquer l'institution)
        return

    # 2. Create Institution
    inst_res = supabase.table("institutions").insert({
        "name": "Hôpital Central de NeuroAlert",
        "type": "hospital",
        "country_code": "NG",
        "plan": "premium",
        "alert_zones": ["Lagos", "Abuja"]
    }).execute()
    
    inst_id = inst_res.data[0]["id"]
    print(f"✅ Institution créée : {inst_id}")

    # 3. Link User to Institution
    supabase.table("institution_users").insert({
        "user_id": user_id,
        "institution_id": inst_id,
        "full_name": "Dr. Admin Vanguard",
        "role": "admin",
        "language_pref": "fr"
    }).execute()

    print("✅ Profil Institutionnel lié avec succès !")
    print("-------------------------------------------------")
    print("🎉 SUCCÈS ! Vous pouvez vous connecter sur l'interface avec :")
    print(f"Email : {email}")
    print(f"Mot de passe : {password}")
    print("-------------------------------------------------")

if __name__ == "__main__":
    seed()
