import os
import datetime
import functools

import jwt
from flask import Flask, jsonify, request
from flask_cors import CORS

from app.repositories.activities_repo import list_activities, get_activity_by_id
from app.repositories.places_repo import list_places, get_place_by_id
from app.repositories.users_repo import (
    create_user,
    get_user_by_email,
    get_user_by_id,
    verify_password,
)

# ---------------------------------------------------------------------------
# JWT helpers
# ---------------------------------------------------------------------------

JWT_SECRET = os.getenv("JWT_SECRET_KEY", "dev-secret-change-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_DAYS = 7


def _create_token(user_id: str) -> str:
    payload = {
        "sub": str(user_id),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=JWT_EXPIRY_DAYS),
        "iat": datetime.datetime.utcnow(),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def _decode_token(token: str):
    """Returns the user_id (sub) or raises jwt.PyJWTError."""
    payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    return payload["sub"]


def _get_current_user():
    """
    Pulls the Bearer token from Authorization header and returns the user dict,
    or None if missing/invalid/user not found.
    """
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    token = auth_header[len("Bearer "):]
    try:
        user_id = _decode_token(token)
        return get_user_by_id(user_id)
    except Exception:
        return None


def require_auth(f):
    """Decorator: returns 401 if the request has no valid JWT."""
    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        user = _get_current_user()
        if user is None:
            return jsonify({"error": {"code": "UNAUTHORIZED", "message": "Authentication required."}}), 401
        return f(*args, user=user, **kwargs)
    return wrapper


# ---------------------------------------------------------------------------
# App factory
# ---------------------------------------------------------------------------

def create_app():
    app = Flask(__name__)

    # Allow the Next.js dev server (and production origin) to call the API
    CORS(
        app,
        resources={r"/api/*": {"origins": [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            os.getenv("FRONTEND_ORIGIN", ""),
        ]}},
        supports_credentials=True,
    )

    # -----------------------------------------------------------------------
    # Health
    # -----------------------------------------------------------------------

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"})

    # -----------------------------------------------------------------------
    # Auth routes  /api/v1/auth/...
    # -----------------------------------------------------------------------

    @app.post("/api/v1/auth/register")
    def auth_register():
        body = request.get_json(silent=True) or {}
        name = (body.get("name") or "").strip()
        email = (body.get("email") or "").strip()
        password = body.get("password") or ""

        if not name:
            return jsonify({"error": {"code": "VALIDATION", "message": "Name is required."}}), 422
        if not email or "@" not in email:
            return jsonify({"error": {"code": "VALIDATION", "message": "A valid email is required."}}), 422
        if len(password) < 8:
            return jsonify({"error": {"code": "VALIDATION", "message": "Password must be at least 8 characters."}}), 422

        # Check if email already exists
        existing = get_user_by_email(email)
        if existing:
            return jsonify({"error": {"code": "CONFLICT", "message": "An account with this email already exists."}}), 409

        user = create_user(name, email, password)
        if user is None:
            return jsonify({"error": {"code": "SERVER_ERROR", "message": "Could not create account. Please try again."}}), 500

        token = _create_token(user["id"])
        return jsonify({
            "token": token,
            "user": {"id": str(user["id"]), "name": user["name"], "email": user["email"]},
        }), 201

    @app.post("/api/v1/auth/login")
    def auth_login():
        body = request.get_json(silent=True) or {}
        email = (body.get("email") or "").strip()
        password = body.get("password") or ""

        if not email or not password:
            return jsonify({"error": {"code": "VALIDATION", "message": "Email and password are required."}}), 422

        user = get_user_by_email(email)
        if user is None or not verify_password(user, password):
            return jsonify({"error": {"code": "INVALID_CREDENTIALS", "message": "Invalid email or password."}}), 401

        token = _create_token(user["id"])
        return jsonify({
            "token": token,
            "user": {"id": str(user["id"]), "name": user["name"], "email": user["email"]},
        })

    @app.get("/api/v1/auth/me")
    @require_auth
    def auth_me(user):
        return jsonify({
            "user": {"id": str(user["id"]), "name": user["name"], "email": user["email"]},
        })

    # -----------------------------------------------------------------------
    # Places  /api/v1/places/...
    # -----------------------------------------------------------------------

    @app.get("/api/v1/places")
    def api_list_places():
        limit = max(1, min(request.args.get("limit", default=50, type=int), 200))
        offset = max(0, request.args.get("offset", default=0, type=int))
        return jsonify(list_places(limit=limit, offset=offset))

    @app.get("/api/v1/places/<place_id>")
    def api_get_place(place_id):
        row = get_place_by_id(place_id)
        if row is None:
            return jsonify({"error": {"code": "NOT_FOUND", "message": "Place not found."}}), 404
        return jsonify(row)

    # -----------------------------------------------------------------------
    # Activities  /api/v1/activities/...
    # -----------------------------------------------------------------------

    @app.get("/api/v1/activities")
    def api_list_activities():
        limit = max(1, min(request.args.get("limit", default=50, type=int), 200))
        offset = max(0, request.args.get("offset", default=0, type=int))
        return jsonify(list_activities(limit=limit, offset=offset))

    @app.get("/api/v1/activities/<activity_id>")
    def api_get_activity(activity_id):
        row = get_activity_by_id(activity_id)
        if row is None:
            return jsonify({"error": {"code": "NOT_FOUND", "message": "Activity not found."}}), 404
        return jsonify(row)

    # -----------------------------------------------------------------------
    # Debug (remove in production)
    # -----------------------------------------------------------------------

    @app.get("/testing")
    def testing():
        return jsonify({
            "places": list_places(limit=10, offset=0),
            "activities": list_activities(limit=10, offset=0),
        })

    return app
