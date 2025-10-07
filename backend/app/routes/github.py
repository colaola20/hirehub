import secrets

from flask import Blueprint, redirect, url_for, session, jsonify
from app.extensions import db, oauth
from app.models.user import User
from flask_jwt_extended import create_access_token 

github_bp = Blueprint("github", __name__)

def init_oauth(app):
    oauth.init_app(app)
    app.config['GITHUB_CLIENT_ID'] = app.config.get("GITHUB_CLIENT_ID")
    app.config['GITHUB_CLIENT_SECRET'] = app.config.get("GITHUB_CLIENT_SECRET")

    oauth.register(
        name="github",
        client_id=app.config['GITHUB_CLIENT_ID'],
        client_secret=app.config['GITHUB_CLIENT_SECRET'],
        access_token_url="https://github.com/login/oauth/access_token",
        authorize_url="https://github.com/login/oauth/authorize",
        api_base_url="https://api.github.com/",
        client_kwargs={"scope": "user:email"},
    )

@github_bp.route("/api/login/github")
def login_github():
    redirect_uri = url_for("github.authorize_github", _external=True)
    return oauth.github.authorize_redirect(redirect_uri)

@github_bp.route("/api/login/github/callback")
def authorize_github():
    try:
        token = oauth.github.authorize_access_token()
        user_info = oauth.github.get("user").json()
        email_info = oauth.github.get("user/emails").json()

        primary_email = next((e["email"] for e in email_info if e.get("primary")), None)
        if not primary_email:
            return jsonify({"status": "error", "message": "No primary email found"}), 400


        user = User.query.filter_by(email=primary_email).first()
        if not user:
            name = user_info.get("name") or ""
            name_parts = name.split(" ", 1)

            user = User(
                username=user_info["login"],
                email=primary_email,
                first_name=name_parts[0] if len(name_parts) > 0 else "",
                last_name=name_parts[1] if len(name_parts) > 1 else "",
            )

            user.set_password(secrets.token_urlsafe(16))

            try:
                db.session.add(user)
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                return jsonify({"status": "error", "message": str(e)}), 500

        access_token = create_access_token(identity=str(user.id))
        frontend_url = f"http://localhost:5173/login?token={access_token}&username={user.username}"
        return redirect(frontend_url)

        # session["user"] = {"username": user.username, "email": user.email}
        # return jsonify({"status": "ok", "user": session["user"]})
    except Exception as e:
         return jsonify({"status": "error", "message": str(e)}), 500
