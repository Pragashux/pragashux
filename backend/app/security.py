from datetime import UTC, datetime, timedelta
from hashlib import pbkdf2_hmac
from hmac import compare_digest
from os import urandom
from typing import Any

from jose import JWTError, jwt

from app.config import get_settings

ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    salt = urandom(16).hex()
    digest = pbkdf2_hmac("sha256", password.encode(), salt.encode(), 120000).hex()
    return f"pbkdf2${salt}${digest}"


def verify_password(plain: str, hashed: str) -> bool:
    try:
        _, salt, digest = hashed.split("$", 2)
    except ValueError:
        return False
    check = pbkdf2_hmac("sha256", plain.encode(), salt.encode(), 120000).hex()
    return compare_digest(check, digest)


def create_token(subject: str, role: str, minutes: int | None = None, refresh: bool = False) -> str:
    settings = get_settings()
    if refresh:
        expire = datetime.now(UTC) + timedelta(days=settings.jwt_refresh_days)
        token_type = "refresh"
    else:
        expire = datetime.now(UTC) + timedelta(minutes=minutes or settings.jwt_expire_minutes)
        token_type = "access"
    payload: dict[str, Any] = {
        "sub": subject,
        "role": role,
        "type": token_type,
        "exp": expire,
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=ALGORITHM)


def decode_token(token: str) -> dict[str, Any]:
    settings = get_settings()
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[ALGORITHM])
    except JWTError as exc:
        raise ValueError("Invalid token") from exc
