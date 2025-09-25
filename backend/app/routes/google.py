from flask import Blueprint, redirect, url_for, session, jsonify
from app.extensions import db, oauth
from app.models.user import User
import secrets
from secrets import token_urlsafe


google_bp = Blueprint("google", __name__)

def init_oauth(app):
    oauth.init_app(app)
    app.config['GOOGLE_CLIENT_ID'] = app.config.get("GOOGLE_CLIENT_ID")
    app.config['GOOGLE_CLIENT_SECRET'] = app.config.get("GOOGLE_CLIENT_SECRET")

    oauth.register(
        name="google",
        client_id=app.config['GOOGLE_CLIENT_ID'],
        client_secret=app.config['GOOGLE_CLIENT_SECRET'],
        server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
        client_kwargs={"scope": "openid email profile"},
    )


@google_bp.route("/api/login/google")
def login_google():
    redirect_uri = url_for("google.authorize_google", _external=True)
    nonce = token_urlsafe(16)            # Generate a random nonce
    session['nonce'] = nonce             # Store random nonce
    return oauth.google.authorize_redirect(redirect_uri, nonce=nonce)

@google_bp.route("/api/login/google/callback")
def authorize_google():
    token = oauth.google.authorize_access_token()
    nonce = session.pop('nonce', None)   # Retrieve nonce
    user_info = oauth.google.parse_id_token(token, nonce=nonce)

    email = user_info["email"]
    username = email.split("@")[0]  # Use first part of email as username

    # Check if user exists
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(
            username=username,  #uses email prefix
            email=email,
            first_name=user_info.get("given_name", ""),
            last_name=user_info.get("family_name", ""),
        )
        # Generates a random password for the Oauth user
        user.set_password(secrets.token_urlsafe(16))
        try:
            db.session.add(user)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return jsonify({"status": "error", "message": str(e)}), 500

    session["user"] = {"username": user.username, "email": user.email}
    return jsonify({"status": "ok", "user": session["user"]})
