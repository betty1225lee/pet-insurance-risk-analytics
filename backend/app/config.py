# app/config.py
import os
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    
    def __init__(self):
        if not self.DATABASE_URL:
            raise ValueError("DATABASE_URL is not set in the .env file")

settings = Settings()