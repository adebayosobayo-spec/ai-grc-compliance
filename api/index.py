import os
import sys

# Add the backend directory to the Python path so it can find the app module
base_dir = os.path.dirname(os.path.dirname(__file__))
backend_path = os.path.join(base_dir, 'backend')

if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

# Import the FastAPI app instance from app.main
from app.main import app
