from app.extensions import db
from datetime import datetime

class Job(db.Model):
    __tablename__ = 'jobs'

    id = db.Column(db.Integer, primary_key=True)
    api_id = db.Column(db.String(50), unique=True, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    company = db.Column(db.String(255))
    location = db.Column(db.String(255))
    description = db.Column(db.Text)
    url = db.Column(db.String(500))
    date_posted = db.Column(db.DateTime) # stores original posting date of a job, coming from API
    fetched_at = db.Column(db.DateTime, default=datetime.utcnow) # when job was inserted in our db
    is_active = db.Column(db.Boolean, default=True) # indicates if a job is still open
    applications = db.relationship("Application", backref='job', lazy=True)


