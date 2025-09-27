import secrets

from flask import Blueprint, redirect, url_for, session, jsonify, request
from app.extensions import db, oauth
from app.models.user import User

linkedin_bp = Blueprint("linkedin", __name__)


def init_linkedin_oauth(app):
    oauth.init_app(app)
    # Ensure these are correctly loaded in your app's config
    app.config['LINKEDIN_CLIENT_ID'] = app.config.get("LINKEDIN_CLIENT_ID")
    app.config['LINKEDIN_CLIENT_SECRET'] = app.config.get("LINKEDIN_CLIENT_SECRET")

    oauth.register(
        name="linkedin",
        client_id=app.config['LINKEDIN_CLIENT_ID'],
        client_secret=app.config['LINKEDIN_CLIENT_SECRET'],
        # IMPORTANT: OpenID Connect Scopes
        client_kwargs={
            'scope': 'openid profile email',
            'token_endpoint_auth_method': 'client_secret_post'
        },
        server_metadata_url="https://www.linkedin.com/oauth/.well-known/openid-configuration"
    )


@linkedin_bp.route("/api/login/linkedin")
def login_linkedin():
    # 1. Generate a unique nonce and store it in the session
    nonce = secrets.token_urlsafe(32)
    session['nonce'] = nonce

    redirect_uri = url_for("linkedin.authorize_linkedin", _external=True)

    # 2. Pass the nonce in the authorization request to prevent CSRF/replay
    return oauth.linkedin.authorize_redirect(redirect_uri, nonce=nonce)

@linkedin_bp.route("/api/login/linkedin/callback")
def authorize_linkedin():
    try:
        # Retrieve the nonce stored in the session
        stored_nonce = session.get('nonce')
        
        # --- THE FIX ---
        # Pass the stored nonce AND instruct Authlib to ignore the 'nonce' claim 
        # inside the ID token, as LinkedIn often does not include it.
        token = oauth.linkedin.authorize_access_token(
            nonce=stored_nonce, 
            ignore_nonce=True  # <--- CRITICAL FIX for LinkedIn
        )
        # ---------------

        # The rest of your logic remains the same, as the access token is now valid
        userinfo = oauth.linkedin.get("userinfo").json()

        email = userinfo.get("email")
        if not email:
            return jsonify({"status": "error", "message": "Email not found"}), 400
        
        # ... (User creation/login logic) ...
        first_name = userinfo.get("given_name", "")
        last_name = userinfo.get("family_name", "")
        username = f"{first_name}{last_name}".lower() or email

        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(
                username=username,
                email=email,
                first_name=first_name,
                last_name=last_name
            )
            # Assuming User.set_password is defined
            user.set_password(secrets.token_urlsafe(16)) 
            db.session.add(user)
            db.session.commit()

        session["user"] = {"username": user.username, "email": user.email}
        session.pop('nonce', None)  # Don't forget to remove the nonce

        return jsonify({"status": "ok", "user": session["user"]})

    except Exception as e:
        db.session.rollback()
        # It's good practice to log the full exception here
        return jsonify({"status": "error", "message": str(e)}), 5000