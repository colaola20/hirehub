from flask import Flask
from app.extensions import db
from app.routes.github import github_bp, init_oauth
from app.routes.google import google_bp, init_oauth as init_google_oauth
from app.routes.home import home_bp

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'replace_with_env_secret'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:JonataN10.@localhost:5432/hirehub'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    db.init_app(app)
    init_oauth(app)
    init_google_oauth(app)

    # Register blueprints
    app.register_blueprint(home_bp)
    app.register_blueprint(github_bp)
    app.register_blueprint(google_bp)

    return app
