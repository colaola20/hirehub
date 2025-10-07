# app/models/job.py
from app.extensions import db
from datetime import datetime

class Job(db.Model):
    __tablename__ = 'jobs'

    id = db.Column(db.Integer, primary_key=True)
    api_id = db.Column(db.String(100))
    title = db.Column(db.String(150), nullable=False)
    company = db.Column(db.String(150), nullable=False)
    location = db.Column(db.String(150))
    description = db.Column(db.Text)
    url = db.Column(db.String(500))
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)
    fetched_at = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)
    source = db.Column(db.String(150))

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'company': self.company,
            'location': self.location,
            'description': self.description,
            'url': self.url,
            'date_posted': self.date_posted.isoformat() if self.date_posted else None,
            'source': self.source
        }
