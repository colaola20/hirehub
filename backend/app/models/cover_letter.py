from app.extensions import db
from datetime import datetime, timezone


class CoverLetter(db.Model):
    __tablename__ = 'cover_letter'

    cover_letter_id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(120), db.ForeignKey('users.email'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = db.relationship('User', backref=db.backref('cover_letters', lazy=True))
    job = db.relationship('Job', backref=db.backref('cover_letters', lazy=True))

    def __repr__(self):
        return f'<CoverLetter {self.cover_letter_id}>'

    def to_dict(self):
        return {
            'cover_letter_id': self.cover_letter_id,
            'user_email': self.user_email,
            'job_id': self.job_id,
            'file_path': self.file_path,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
