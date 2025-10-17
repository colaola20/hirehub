from app.extensions import db
from datetime import datetime, timezone


class Favorite(db.Model):
    __tablename__ = 'favorites'
    "favorite jobs saved by users"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        db.UniqueConstraint('user_id', 'job_id', name='unique_user_job_favorite'),
    )

    def __repr__(self):
        return f'<Favorite user_id={self.user_id} job_id={self.job_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'job_id': self.job_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
