from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "AI LearnOS"
    app_env: str = "development"
    database_url: str = "sqlite:///./learnos.db"
    jwt_secret: str = "dev-only-change-me"
    jwt_expire_minutes: int = 120
    jwt_refresh_days: int = 14
    llm_provider: str = "mock"
    llm_api_key: str = ""
    llm_base_url: str = "https://api.openai.com/v1"
    llm_model: str = "gpt-4o-mini"
    payment_provider: str = "mock"
    stripe_secret_key: str = ""
    storage_dir: str = "./storage"
    fcm_server_key: str = ""
    cors_origins: str = "*"


@lru_cache
def get_settings() -> Settings:
    return Settings()
