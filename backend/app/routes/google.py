from flask import Blueprint, redirect, url_for, session, jsonify
from app.extensions import db, oauth
from app.models.user import User
import secrets
from secrets import token_urlsafe
from flask_jwt_extended import create_access_token 


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
    try:
        token = oauth.google.authorize_access_token()
        nonce = session.pop('nonce', None)   # Retrieve nonce
        user_info = oauth.google.parse_id_token(token, nonce=nonce)

        email = user_info["email"]
        username = email.split("@")[0]  # Use first part of email as username

        # Check if user exists
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(
                username=username,
                email=email,
                first_name=user_info.get("given_name", ""),
                last_name=user_info.get("family_name", ""),
                # Default notifications for new OAuth user
                general_notifications_enabled=True,
                general_notifications_frequency="immediately",
                job_alerts_enabled=True,
                job_alerts_frequency="2 minutes"
            )
        else:
            # DO NOT override if user already has settings
            if user.general_notifications_enabled is None:
                user.general_notifications_enabled = True
            if not user.general_notifications_frequency:
                user.general_notifications_frequency = "immediately"

            if user.job_alerts_enabled is None:
                user.job_alerts_enabled = True
            if not user.job_alerts_frequency:
                user.job_alerts_frequency = "2 minutes"

                    # Generates a random password for the Oauth user
            user.set_password(secrets.token_urlsafe(16))
            try:
                db.session.add(user)
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                return jsonify({"status": "error", "message": str(e)}), 500
            
        access_token = create_access_token(identity=str(user.id))
        frontend_url = f"http://localhost:5173/oauth?token={access_token}&username={user.username}"
        #frontend_url = f"http://localhost/oauth?token={access_token}&username={user.username}"
        return redirect(frontend_url)

        # session["user"] = {"username": user.username, "email": user.email}
        # return jsonify({"status": "ok", "user": session["user"]})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500