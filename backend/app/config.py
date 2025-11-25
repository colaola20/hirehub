import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'

    # SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql+psycopg://username:password@localhost:5432/dbname'

    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # GitHub
    GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
    GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")

    # Google
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

    # LinkedIn
    LINKEDIN_CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID")
    LINKEDIN_CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET")

    # OpenAI
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'h1r3hub@gmail.com'
    MAIL_PASSWORD = 'jlep ysje dcvf kmuz'
    MAIL_DEFAULT_SENDER = ('HireHub', 'h1r3hub@gmail.com')


class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}