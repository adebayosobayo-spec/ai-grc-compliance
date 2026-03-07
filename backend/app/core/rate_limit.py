"""Rate limiting using SlowAPI with per-user / per-IP keys."""
from slowapi import Limiter
from slowapi.util import get_remote_address
from starlette.requests import Request


def _key_func(request: Request) -> str:
    """Use user ID from auth if available, otherwise fall back to IP."""
    # The auth dependency sets this on the request state
    user_id = getattr(request.state, "user_id", None)
    if user_id:
        return f"user:{user_id}"
    return get_remote_address(request)


limiter = Limiter(key_func=_key_func)
