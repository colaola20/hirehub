from flask import Blueprint, redirect, url_for, session, jsonify
from app.extensions import db, oauth
from app.models.user import User

linkedin_bp = Blueprint("linkedin", __name__)

def init_oauth(app):
    oauth.init_app(app)
    app.config['LINKEDIN_CLIENT_ID'] = ""
    app.config['LINKEDIN_CLIENT_SECRET'] = ""

    oauth.register(
        name="linkedin",
        client_id=app.config['LINKEDIN_CLIENT_ID'],
        client_secret=app.config['LINKEDIN_CLIENT_SECRET'],
        server_metadata_url="https://www.linkedin.com/oauth/.well-known/openid-configuration",
        client_kwargs={
            "scope": "openid profile email",
            "token_endpoint_auth_method": "client_secret_post"
        }
    )

@linkedin_bp.route("/login/linkedin")
def login_linkedin():
    redirect_uri = url_for("linkedin.authorize_linkedin", _external=True)
    # Remove the nonce from the authorization request
    return oauth.linkedin.authorize_redirect(redirect_uri)

@linkedin_bp.route("/login/linkedin/callback")
def authorize_linkedin():
    try:
        # Remove nonce=nonce from this call. Authlib will not expect the claim
        token = oauth.linkedin.authorize_access_token()
        user_info = oauth.linkedin.parse_id_token(token)
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error during LinkedIn OIDC flow: {str(e)}"
        }), 500

    email = user_info.get("email")
    first_name = user_info.get("given_name", "")
    last_name = user_info.get("family_name", "")
    username = user_info.get("name", email)

    if not email:
        return jsonify({"status": "error", "message": "No email found in LinkedIn profile"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name
        )
        db.session.add(user)
        db.session.commit()

    session["user"] = {"username": user.username, "email": user.email}
    return jsonify({"status": "ok", "user": session["user"]})