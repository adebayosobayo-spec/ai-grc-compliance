import sys
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv("DATABASE_URL")
print(f"Testing connection to: {db_url.split('@')[-1] if db_url and '@' in db_url else db_url}")

try:
    print("Initializing engine...")
    engine = create_engine(db_url)
    print("Connecting...")
    with engine.connect() as conn:
        print("Executing test query...")
        result = conn.execute(text("SELECT 1"))
        val = result.fetchone()[0]
        print(f"Query result: {val}")
        print(f"Connection successful: {val == 1}")
except Exception as e:
    import traceback
    print(f"Connection failed with error: {str(e)}")
    traceback.print_exc()
    sys.exit(1)
