import sys
import os

# Ensure backend directory is in the PYTHONPATH
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from backend.app.database import init_db

print("Running metadata.create_all() to ensure all tables exist in Supabase...")
init_db()
print("Tables successfully initialized.")
