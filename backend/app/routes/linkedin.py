import secrets

from flask import Blueprint, redirect, url_for, session, jsonify, request
from app.extensions import db, oauth
from app.models.user import User

linkedin_bp = Blueprint("linkedin", __name__)


def init_linkedin_oauth(app):
    oauth.init_app(app)
    # ... (app.config setup) ...

    oauth.register(
        name="linkedin",
        client_id=app.config['LINKEDIN_CLIENT_ID'],
        client_secret=app.config['LINKEDIN_CLIENT_SECRET'],
        
        # --- Endpoints for OIDC ---
        authorize_url='https://www.linkedin.com/oauth/v2/authorization',
        access_token_url='https://www.linkedin.com/oauth/v2/accessToken',
        
        # --- CRITICAL FIX: Explicitly set the UserInfo endpoint ---
        userinfo_endpoint='https://api.linkedin.com/v2/userinfo',
        
        client_kwargs={
            # ENSURE ALL THREE SCOPES ARE HERE
            'scope': 'openid profile email', 
            'token_endpoint_auth_method': 'client_secret_post'
        },
        # You can keep the server_metadata_url if you prefer OIDC flow, but it's optional now:
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
import requests
from flask import current_app

@linkedin_bp.route("/api/login/linkedin/callback")
def authorize_linkedin():
    try:
        # Step 1: Get the authorization code from LinkedIn callback
        code = request.args.get('code')
        error = request.args.get('error')
        
        if error:
            return jsonify({
                "status": "error", 
                "message": f"LinkedIn OAuth error: {error}"
            }), 400
        
        if not code:
            return jsonify({"status": "error", "message": "No authorization code"}), 400

        # Step 2: MANUAL TOKEN EXCHANGE
        token_url = 'https://www.linkedin.com/oauth/v2/accessToken'
        redirect_uri = url_for("linkedin.authorize_linkedin", _external=True)
        
        # Prepare the token request data
        token_data = {
            'grant_type': 'authorization_code',  # Standard OAuth parameter
            'code': code,  # The temporary code from LinkedIn
            'redirect_uri': redirect_uri,  # Must match your app settings
            'client_id': current_app.config['LINKEDIN_CLIENT_ID'],  # Your app ID
            'client_secret': current_app.config['LINKEDIN_CLIENT_SECRET']  # Your app secret
        }
        
        # Make the HTTP request to exchange code for token
        token_response = requests.post(
            token_url, 
            data=token_data,  # Send as form data
            headers={'Content-Type': 'application/x-www-form-urlencoded'}  # Important header
        )
        
        # Check if token request was successful
        if token_response.status_code != 200:
            return jsonify({
                "status": "error", 
                "message": "Token exchange failed",
                "details": token_response.text  # LinkedIn's error message
            }), 400
            
        # Parse the token response
        token_json = token_response.json()
        access_token = token_json.get('access_token')  # The valuable access token
        
        if not access_token:
            return jsonify({"status": "error", "message": "No access token received"}), 400

        # Step 3: MANUAL USER INFO FETCH
        userinfo_response = requests.get(
            'https://api.linkedin.com/v2/userinfo',  # LinkedIn's user info endpoint
            headers={'Authorization': f'Bearer {access_token}'}  # Include token in header
        )
        
        if userinfo_response.status_code != 200:
            return jsonify({
                "status": "error", 
                "message": "Failed to fetch user info",
                "details": userinfo_response.text
            }), 400
            
        # Parse user information
        userinfo = userinfo_response.json()
        
        # Step 4: Extract user data from the response
        email = userinfo.get("email")
        if not email:
            # LinkedIn sometimes puts email in different fields
            email = userinfo.get("emailAddress")
        
        if not email:
            return jsonify({
                "status": "error", 
                "message": "Email not provided by LinkedIn",
                "userinfo": userinfo  # For debugging what LinkedIn actually returned
            }), 400

        # Extract other user information
        first_name = userinfo.get("given_name", "")
        last_name = userinfo.get("family_name", "")
        linkedin_id = userinfo.get("sub", "")  # LinkedIn's unique user ID
        
        # Step 5: Your existing user creation/login logic
        username = f"{first_name}{last_name}".lower() or email.split('@')[0]

        # Find existing user or create new one
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(
                username=username,
                email=email,
                first_name=first_name,
                last_name=last_name,
                linkedin_id=linkedin_id
            )
            # Set a random password for OAuth users
            user.set_password(secrets.token_urlsafe(32))
            db.session.add(user)
            db.session.commit()

        # Step 6: Create user session
        session["user_id"] = user.id
        session["user_email"] = user.email
        session.pop('linkedin_nonce', None)  # Clean up session

        return jsonify({
            "status": "success", 
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name
            }
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500