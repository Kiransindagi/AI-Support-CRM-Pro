import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "AI Support CRM"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./support_crm.db")
    API_VERSION: str = "v1"
    DEBUG: bool = True
    FRONTEND_URL: str = "http://localhost:5173"
    OPENAI_API_KEY: str | None = None
    
    class Config:
        env_file = ".env"

settings = Settings()
