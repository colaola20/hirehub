from app.extensions import db
from datetime import datetime, timezone


class Notification(db.Model):
    __tablename__ = 'notification'

    notification_id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(120), db.ForeignKey('users.email'), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationship
    user = db.relationship('User', backref=db.backref('notifications', lazy=True, cascade='all, delete-orphan'))

    def __repr__(self):
        return f'<Notification {self.notification_id} - {self.type}>'

    def to_dict(self):
        return {
            'notification_id': self.notification_id,
            'user_email': self.user_email,
            'type': self.type,
            'message': self.message,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
