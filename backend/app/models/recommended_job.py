from app.extensions import db
from datetime import datetime, timezone

class RecommendedJob(db.Model):
    __tablename__ = "recommended_jobs"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    job_id = db.Column(
        db.Integer,
        db.ForeignKey("jobs.id", ondelete="CASCADE"),
        nullable=False
    )

    match_score = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    expires_at = db.Column(db.DateTime, nullable=True)
    is_active = db.Column(db.Boolean, default=True)

    matched_skills = db.Column(db.ARRAY(db.String), nullable=True)

    user = db.relationship("User", backref="recommended_jobs", lazy=True)
    job = db.relationship("Job", backref="recommended_to", lazy=True)

    __table_args__ = (
        db.UniqueConstraint("user_id", "job_id",
                            name="unique_recommendation_per_user_job"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "job_id": self.job_id,
            "match_score": self.match_score,
            "created_at": self.created_at.isoformat(),
            "expires_at": self.expires_at.isoformat() if self.expires_at else None,
            "is_active": self.is_active,
            "matched_skills": self.matched_skills or [],
            "job": self.job.to_dict() if self.job else None
        }
