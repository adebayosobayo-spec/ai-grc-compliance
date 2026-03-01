import os
import sys
import traceback

# Add backend to path like api/index.py does
backend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'backend')
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

def handler(event, context):
    try:
        from app.main import app
        return {
            "statusCode": 200,
            "body": "Backend imports successful. Check /api/v1/health."
        }
    except Exception as e:
        error_msg = traceback.format_exc()
        return {
            "statusCode": 500,
            "body": f"Backend Import Error:\n{error_msg}"
        }
