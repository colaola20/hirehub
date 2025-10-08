from app.extensions import db
from datetime import datetime

class Application(db.Model):
    __tablename__ = 'applications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey("jobs.id"), nullable=False)
    status = db.Column(db.String(50), default="saved")
    notes = db.Column(db.Text)
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)