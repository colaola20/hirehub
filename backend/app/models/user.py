from app.extensions import db
from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    is_active = db.Column(db.Boolean, default=True)

    # ------------------------------------
    # Login + resume logic
    # ------------------------------------
    last_login = db.Column(db.DateTime, nullable=True)
    login_streak = db.Column(db.Integer, default=0)
    last_streak_date = db.Column(db.DateTime, nullable=True)

    resume_score = db.Column(db.Integer, nullable=True)
    resume_updated_at = db.Column(db.DateTime, nullable=True)

    skills = db.Column(db.JSON, nullable=True)
    profile_completion = db.Column(db.Integer, default=0)

    # ------------------------------------
    # Digest Preferences (NEW)
    # ------------------------------------
    digest_interval_minutes = db.Column(db.Integer, default=1440)  # 24 hours
    last_digest_sent = db.Column(db.DateTime, nullable=True)

    # ------------------------------------
    # Job Match Alerts (NEW)
    # ------------------------------------
    last_job_match_sent = db.Column(db.DateTime, nullable=True)

    # ------------------------------------
    # Profile Completion Reminder (NEW)
    # ------------------------------------
    last_profile_reminder_sent = db.Column(db.DateTime, nullable=True)

    # ------------------------------------
    # Login Inactivity Alert (NEW)
    # ------------------------------------
    last_login_notification_sent = db.Column(db.DateTime, nullable=True)

    # ------------------------------------
    # Old fields you already had
    # ------------------------------------
    daily_digest_enabled = db.Column(db.Boolean, default=True)
    weekly_digest_enabled = db.Column(db.Boolean, default=True)

    followed_companies = db.Column(db.JSON, nullable=True)
    saved_filters = db.Column(db.JSON, nullable=True)

    favorites = db.relationship(
        'Favorite',
        backref='user',
        lazy=True,
        cascade='all, delete-orphan'
    )


    def __repr__(self):
        return f'<User {self.username}>'

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'is_active': self.is_active,
            'resume_score': self.resume_score,
            'profile_completion': self.profile_completion,
            'login_streak': self.login_streak,
            'digest_interval_minutes': self.digest_interval_minutes
        }
