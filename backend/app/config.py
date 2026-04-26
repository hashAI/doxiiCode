import os
from dotenv import load_dotenv

# Load .env from project root (one level up from backend/)
load_dotenv(dotenv_path="../.env")


class Settings:
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "doxii")
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:3010,http://69.62.77.115:3010")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    CMS_BASE_URL: str = os.getenv("CMS_BASE_URL", "http://localhost:8000")
    
    # Multi-Agent System Feature Flags
    USE_MULTI_AGENT: bool = os.getenv("USE_MULTI_AGENT", "false").lower() == "true"
    MULTI_AGENT_ROLLOUT_PERCENTAGE: int = int(os.getenv("MULTI_AGENT_ROLLOUT", "0"))


settings = Settings()
