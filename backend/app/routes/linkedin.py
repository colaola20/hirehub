import secrets
import requests
from flask import Blueprint, redirect, url_for, session, jsonify, request, current_app
from app.extensions import db, oauth
from app.models.user import User
from flask_jwt_extended import create_access_token

linkedin_bp = Blueprint("linkedin", __name__)


def init_linkedin_oauth(app):
    oauth.init_app(app)

    oauth.register(
        name="linkedin",
        client_id=app.config['LINKEDIN_CLIENT_ID'],
        client_secret=app.config['LINKEDIN_CLIENT_SECRET'],
        authorize_url='https://www.linkedin.com/oauth/v2/authorization',
        access_token_url='https://www.linkedin.com/oauth/v2/accessToken',
        userinfo_endpoint='https://api.linkedin.com/v2/userinfo',
        client_kwargs={
            'scope': 'openid profile email',
            'token_endpoint_auth_method': 'client_secret_post'
        },
        server_metadata_url="https://www.linkedin.com/oauth/.well-known/openid-configuration"
    )


@linkedin_bp.route("/api/login/linkedin")
def login_linkedin():
    nonce = secrets.token_urlsafe(32)
    session['nonce'] = nonce

    redirect_uri = url_for("linkedin.authorize_linkedin", _external=True)
    return oauth.linkedin.authorize_redirect(redirect_uri, nonce=nonce)


@linkedin_bp.route("/api/login/linkedin/callback")
def authorize_linkedin():
    try:
        code = request.args.get('code')
        error = request.args.get('error')

        if error:
            return jsonify({"status": "error", "message": f"LinkedIn OAuth error: {error}"}), 400
        if not code:
            return jsonify({"status": "error", "message": "No authorization code"}), 400

        # --- Token exchange ---
        token_url = 'https://www.linkedin.com/oauth/v2/accessToken'
        redirect_uri = url_for("linkedin.authorize_linkedin", _external=True)
        token_data = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': redirect_uri,
            'client_id': current_app.config['LINKEDIN_CLIENT_ID'],
            'client_secret': current_app.config['LINKEDIN_CLIENT_SECRET']
        }
        token_response = requests.post(token_url, data=token_data,
                                       headers={'Content-Type': 'application/x-www-form-urlencoded'})
        if token_response.status_code != 200:
            return jsonify({"status": "error", "message": "Token exchange failed",
                            "details": token_response.text}), 400

        token_json = token_response.json()
        access_token = token_json.get('access_token')
        if not access_token:
            return jsonify({"status": "error", "message": "No access token received"}), 400

        # --- Fetch user info ---
        userinfo_response = requests.get(
            'https://api.linkedin.com/v2/userinfo',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        if userinfo_response.status_code != 200:
            return jsonify({"status": "error", "message": "Failed to fetch user info",
                            "details": userinfo_response.text}), 400

        userinfo = userinfo_response.json()
        email = userinfo.get("email") or userinfo.get("emailAddress")
        if not email:
            return jsonify({"status": "error", "message": "Email not provided by LinkedIn",
                            "userinfo": userinfo}), 400

        first_name = userinfo.get("given_name", "")
        last_name = userinfo.get("family_name", "")
        linkedin_id = userinfo.get("sub", "")
        username = f"{first_name}{last_name}".lower() or email.split('@')[0]

        # --- Create/find user ---
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(
                username=username,
                email=email,
                first_name=first_name,
                last_name=last_name,
                linkedin_id=linkedin_id
            )
            user.set_password(secrets.token_urlsafe(32))
            db.session.add(user)
            db.session.commit()

        # --- Create JWT + redirect frontend ---
        jwt_token = create_access_token(identity=str(user.id))
        session["user_id"] = user.id
        session["user_email"] = user.email
        session.pop('linkedin_nonce', None)

        frontend_url = f"http://localhost:5173/{user.username}?token={jwt_token}&username={user.username}"
        return redirect(frontend_url)

    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500
