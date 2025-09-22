from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
import os
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()
from app.extensions import db
from app.routes.github import github_bp, init_oauth
from app.routes.google import google_bp, init_oauth as init_google_oauth
from app.routes.home import home_bp

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-string'

    CORS(app)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # Register routes
    from app.routes.home import home_bp
    from app.routes.users import users_bp
    init_oauth(app)
    init_google_oauth(app)

    # Register blueprints
    app.register_blueprint(home_bp)
    app.register_blueprint(users_bp)

    app.register_blueprint(github_bp)
    app.register_blueprint(google_bp)

    return app
