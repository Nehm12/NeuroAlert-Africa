import sys
import os

# Add the 'backend' folder to sys.path so we can import from it
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app
