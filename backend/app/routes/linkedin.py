from flask import Flask, redirect, url_for, jsonify
from authlib.integrations.flask_client import OAuth

app = Flask(__name__)
app.secret_key = "dev-secret-key"  # replace in production

oauth = OAuth(app)

# Register LinkedIn
oauth.register(
    name="linkedin",
    client_id="YOUR_LINKEDIN_CLIENT_ID",
    client_secret="YOUR_LINKEDIN_CLIENT_SECRET",
    access_token_url="https://www.linkedin.com/oauth/v2/accessToken",
    authorize_url="https://www.linkedin.com/oauth/v2/authorization",
    client_kwargs={
        "scope": "r_liteprofile r_emailaddress",
    },
)

@app.route("/")
def home():
    return '<a href="/login">Login with LinkedIn</a>'

@app.route("/login")
def login():
    redirect_uri = url_for("authorize", _external=True)
    return oauth.linkedin.authorize_redirect(redirect_uri)

@app.route("/authorize")
def authorize():
    token = oauth.linkedin.authorize_access_token()

    # Get basic profile
    profile = oauth.linkedin.get(
        "https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName)"
    ).json()

    # Get email
    email_data = oauth.linkedin.get(
        "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))"
    ).json()
    email = email_data["elements"][0]["handle~"]["emailAddress"]

    return jsonify(
        {
            "id": profile.get("id"),
            "first_name": profile.get("localizedFirstName"),
            "last_name": profile.get("localizedLastName"),
            "email": email,
        }
    )

if __name__ == "__main__":
    app.run(debug=True, port=5000)
