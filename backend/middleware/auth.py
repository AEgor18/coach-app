from fastapi import Request
from fastapi.responses import JSONResponse
from jose import JWTError, jwt
from starlette.middleware.base import BaseHTTPMiddleware

from core.config import settings


class AuthMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next):
        if request.method == "OPTIONS":
            return await call_next(request)

        public_paths = {
            "/api/profile/login",
            "/api/profile/register",
            "/api/profile/refresh",
            "/health",
            "/",
            "/docs",
            "/redoc",
            "/openapi.json",
            "/sitemap.xml",    
            "/robots.txt",      
            "/json-ld",
            "/api/info",
        }

        if request.url.path.startswith("/docs") or request.url.path.startswith(
            "/redoc"
        ):
            return await call_next(request)

        if request.url.path in public_paths:
            return await call_next(request)

        token_header = request.headers.get("Authorization")

        if not token_header or not token_header.startswith("Bearer "):
            return JSONResponse(status_code=401, content={"detail": "Token missing"})

        token = token_header.split(" ")[1]

        try:
            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
            )
        except JWTError:
            return JSONResponse(status_code=401, content={"detail": "Invalid token"})

        request.state.user = payload.get("sub")

        return await call_next(request)
