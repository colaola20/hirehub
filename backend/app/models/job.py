from app.extensions import db
from datetime import datetime, timezone

class Job(db.Model):
    __tablename__ = 'jobs'

    id = db.Column(db.Integer, primary_key=True)
    api_id = db.Column(db.String(50), nullable=False)
    source = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    company = db.Column(db.String(255))
    location = db.Column(db.String(255))
    description = db.Column(db.Text)
    url = db.Column(db.String(500))
    date_posted = db.Column(db.DateTime) # stores original posting date of a job, coming from API
    fetched_at = db.Column(db.DateTime, default=lambda:datetime.now(timezone.utc)) # when job was inserted in our db
    is_active = db.Column(db.Boolean, default=True) # indicates if a job is still open
    applications = db.relationship("Application", backref='job', lazy=True)


    __table_args__ = (
        db.UniqueConstraint('api_id', 'source', name='unique_job_per_source'),
    )

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
    