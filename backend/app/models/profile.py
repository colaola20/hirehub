from app.extensions import db
from datetime import datetime, timezone


class Profile(db.Model):
    __tablename__ = 'profile'

    profile_id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(120), db.ForeignKey('users.email'), nullable=False)
    headline = db.Column(db.String(255))
    education = db.Column(db.Text)
    experience = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationship
    user = db.relationship('User', backref=db.backref('profile', uselist=False, lazy=True))

    def __repr__(self):
        return f'<Profile {self.user_email}>'

    def to_dict(self):
        return {
            'profile_id': self.profile_id,
            'user_email': self.user_email,
            'headline': self.headline,
            'education': self.education,
            'skills': [skill.skill_name for skill in self.skills],
            'experience': self.experience,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
