from app.extensions import db
from datetime import datetime, timezone


class AIAssistantLog(db.Model):
    __tablename__ = 'ai_assistant_log'

    log_id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(120), db.ForeignKey('users.email'), nullable=False)
    action = db.Column(db.String(100), nullable=False)
    input_data = db.Column(db.Text)
    output_data = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationship
    user = db.relationship('User', backref=db.backref('ai_logs', lazy=True))

    def __repr__(self):
        return f'<AIAssistantLog {self.log_id} - {self.action}>'

    def to_dict(self):
        return {
            'log_id': self.log_id,
            'user_email': self.user_email,
            'action': self.action,
            'input_data': self.input_data,
            'output_data': self.output_data,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
