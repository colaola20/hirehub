from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
import os
from dotenv import load_dotenv
from app.extensions import db, mail   # ✅ import mail here
from app.routes.github import github_bp, init_oauth
from app.routes.google import google_bp, init_oauth as init_google_oauth
from app.routes.linkedin import linkedin_bp, init_linkedin_oauth
from app.routes.home import home_bp
from app.routes.users import users_bp
from .config import Config

load_dotenv()

jwt = JWTManager()
migrate = Migrate()


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-string'

    # Load any extra config (like mail settings) from Config class
    app.config.from_object(Config)

    # ✅ Flask-Mail config (defaults, can be overridden via .env)
    app.config.setdefault("MAIL_SERVER", "smtp.gmail.com")
    app.config.setdefault("MAIL_PORT", 587)
    app.config.setdefault("MAIL_USE_TLS", True)
    app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME", "harisakber21@gmail.com")
    app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD", "xqzw mvej cyxb pkuw")
    app.config["MAIL_DEFAULT_SENDER"] = os.getenv("MAIL_DEFAULT_SENDER", "harisakber21@gmail.com")
    # ✅ Suppress sending in dev mode if placeholder password is used
    if app.config["MAIL_PASSWORD"] == "xqzw mvej cyxb pkuw":
        app.config["MAIL_SUPPRESS_SEND"] = False

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)   # ✅ initialize mail

    # Register OAuth providers
    init_oauth(app)
    init_google_oauth(app)
    init_linkedin_oauth(app)

    # Register blueprints
    app.register_blueprint(home_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(github_bp)
    app.register_blueprint(google_bp)
    app.register_blueprint(linkedin_bp)

    return app
