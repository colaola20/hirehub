from app.extensions import db
from datetime import datetime, timezone


class Resume(db.Model):
    __tablename__ = 'resume'

    resume_id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(120), db.ForeignKey('users.email'), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    title = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationship
    user = db.relationship('User', backref=db.backref('resumes', lazy=True))

    def __repr__(self):
        return f'<Resume {self.resume_id} - {self.title}>'

    def to_dict(self):
        return {
            'resume_id': self.resume_id,
            'user_email': self.user_email,
            'file_path': self.file_path,
            'title': self.title,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
