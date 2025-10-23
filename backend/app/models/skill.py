from app.extensions import db
from datetime import datetime, timezone


class Skill(db.Model):
    __tablename__ = 'skills'

    profile_id = db.Column(db.Integer, db.ForeignKey('profile.profile_id'), primary_key=True, nullable=False)
    skill_name = db.Column(db.String(100), primary_key=True, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationship
    profile = db.relationship('Profile', backref=db.backref('skills', lazy=True, cascade='all, delete-orphan'))

    def __repr__(self):
        return f'<Skill {self.skill_name} for Profile {self.profile_id}>'

    def to_dict(self):
        return {
            'profile_id': self.profile_id,
            'skill_name': self.skill_name,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
