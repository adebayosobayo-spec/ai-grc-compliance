"""Application configuration via environment variables."""

from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field, model_validator


class Settings(BaseSettings):

    @model_validator(mode="after")
    def _strip_strings(self):
        """Strip whitespace/newlines from all str fields — Vercel env vars often have trailing \\n."""
        for name, field_info in self.model_fields.items():
            val = getattr(self, name, None)
            if isinstance(val, str):
                object.__setattr__(self, name, val.strip())
        return self

    # Application
    app_name: str = Field(default="Complai - Compliance Intelligence Platform")
    app_version: str = Field(default="2.0.0")
    environment: str = Field(default="development")
    debug: bool = Field(default=True)

    # API
    api_host: str = Field(default="0.0.0.0")
    api_port: int = Field(default=8000)
    api_prefix: str = Field(default="/api/v1")

    # Anthropic Claude
    anthropic_api_key: str = Field(default="")
    claude_model: str = Field(default="claude-sonnet-4-20250514")
    claude_max_tokens: int = Field(default=4096)

    # Database (Supabase PostgreSQL)
    database_url: str = Field(
        default="postgresql://postgres:postgres@localhost:5432/postgres",
        validation_alias="DATABASE_URL"
    )
    database_echo: bool = Field(default=False)

    # Security
    secret_key: str = Field(default="change-this-in-production")

    # Supabase Auth & Storage (stripped to avoid \n from env vars)
    supabase_url: str = Field(default="", validation_alias="SUPABASE_URL")
    supabase_anon_key: str = Field(default="", validation_alias="SUPABASE_ANON_KEY")
    supabase_jwt_secret: str = Field(default="", validation_alias="SUPABASE_JWT_SECRET")
    supabase_service_role_key: str = Field(default="", validation_alias="SUPABASE_SERVICE_ROLE_KEY")

    @property
    def supabase_url_clean(self) -> str:
        return self.supabase_url.rstrip("/")

    @property
    def supabase_anon_key_clean(self) -> str:
        return self.supabase_anon_key

    @property
    def supabase_service_role_key_clean(self) -> str:
        return self.supabase_service_role_key

    # CORS
    allowed_origins: str = Field(
        default="http://localhost:3000,http://localhost:5173,https://complai-seven.vercel.app,https://complai.pages.dev"
    )

    @property
    def cors_origins(self) -> List[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

    # Logging
    log_level: str = Field(default="INFO")

    model_config = {"env_file": ".env", "case_sensitive": False, "extra": "ignore"}


settings = Settings()
