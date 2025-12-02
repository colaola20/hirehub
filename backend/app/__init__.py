from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
import os
from dotenv import load_dotenv
from app.routes.notifications import notifications_bp
from app.extensions import db, mail   
from app.routes.github import github_bp, init_oauth
from app.routes.google import google_bp, init_oauth as init_google_oauth
from app.routes.linkedin import linkedin_bp, init_linkedin_oauth
from app.routes.home import home_bp
from app.routes.users import users_bp
from app.routes.jobs import jobs_bp
from app.routes.favorites import favorites_bp
from app.routes.skills import skills_bp
from app.routes.applications import applications_bp
from app.routes.skills import skills_bp
from app.routes.profile import profile_bp
from app.routes.documents import documents_bp
from app.routes.form import form_bp
from datetime import timedelta
from app.routes.chat_bot import chat_bp
from app.routes.resume_generation import resume_bp
from flask_cors import CORS
from .config import Config

from app.models.settings_page import settings_bp
from app.models.user import User
from app.models.job import Job
from app.models.application import Application
from app.models.profile import Profile
from app.models.skill import Skill
from app.routes.chat_bot import chat_bp

load_dotenv()

jwt = JWTManager()
migrate = Migrate()


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-string'

    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=12)

    # File upload configuration
    app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
    app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # 5MB max file size
    app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}

    # Allow frontend requests
    CORS(app, origins=["http://localhost:5173"])

    # Load Config defaults
    app.config.from_object(Config)

    # Email config fallbacks
    app.config.setdefault("MAIL_SERVER", "smtp.gmail.com")
    app.config.setdefault("MAIL_PORT", 587)
    app.config.setdefault("MAIL_USE_TLS", True)
    app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME", "harisakber21@gmail.com")
    app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD", "xqzw mvej cyxb pkuw")
    app.config["MAIL_DEFAULT_SENDER"] = os.getenv("MAIL_DEFAULT_SENDER", "harisakber21@gmail.com")

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)

    # OAuth Providers
    init_oauth(app)
    init_google_oauth(app)
    init_linkedin_oauth(app)

    # Register blueprints
    app.register_blueprint(home_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(jobs_bp)
    app.register_blueprint(favorites_bp)
    app.register_blueprint(skills_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(github_bp)
    app.register_blueprint(google_bp)
    app.register_blueprint(linkedin_bp)
    app.register_blueprint(applications_bp)
    app.register_blueprint(documents_bp)
    app.register_blueprint(form_bp)
    app.register_blueprint(notifications_bp, url_prefix="/api")
    app.register_blueprint(chat_bp, url_prefix="/api")
    app.register_blueprint(settings_bp, url_prefix="/api")
    app.register_blueprint(resume_bp)

    # --------------------------------------------------
    # Unified notification worker integration (FIXED)
    # --------------------------------------------------
    init_notification_workers = None

    try:
        from app.tasks.notifications_task import unified_notification_worker as worker_func
        init_notification_workers = worker_func
    except Exception as e:
        app.logger.error(f"❌ Failed to import unified worker: {e}")
        init_notification_workers = None

    # Start worker normally (old code had 'if False:', preventing startup)
    if init_notification_workers:
        try:
            init_notification_workers(app)
            app.logger.info("✔ Unified Notification Worker started.")
        except Exception as e:
            app.logger.error(f"❌ Failed to start unified worker: {e}")
    else:
        app.logger.info("ℹ Unified worker unavailable — not started.")

    return app
