from flask_sqlalchemy import SQLAlchemy
from authlib.integrations.flask_client import OAuth
from flask_mail import Mail

mail = Mail()
db =  SQLAlchemy()
oauth = OAuth()
