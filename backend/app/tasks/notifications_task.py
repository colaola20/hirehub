import threading
import time
from datetime import datetime, timedelta, timezone
from flask import current_app
from sqlalchemy import and_, or_
print("🔥 notification_task.py LOADED")

# ============================================================
# HYBRID NOTIFICATION SYSTEM – COMPLETE REPLACEMENT FILE
# ============================================================

"""
This file contains:
- Daily digest worker (email)
- Weekly insights worker (email)
- Job match worker (in-app)
- Skill gap worker (in-app)
- Deadline worker (email + in-app)
- Event-triggered utilities

This is the full Hybrid Notification Engine (Option C).
"""


# ============================================================
# IMPORTS (inside worker to avoid circular imports)
# ============================================================

def _load_dependencies():
    from app.services.database import DatabaseService
    from app.models.user import User
    from app.models.job import Job
    from app.models.recommended_job import RecommendedJob
    from app.models.notification import Notification
    from app.extensions import mail, db
    from flask_mail import Message
    return DatabaseService, User, Job, RecommendedJob, Notification, mail, db, Message


# ============================================================
# EMAIL TEMPLATES
# ============================================================

def _email_header():
    return """
    <div style="font-family: Arial, sans-serif; background: #f5f6fa; padding: 22px;">
        <div style="max-width: 650px; margin:auto; background:#fff; border-radius:10px; 
                    overflow:hidden; box-shadow:0 4px 16px rgba(0,0,0,0.12);">
            <div style="background: linear-gradient(135deg, #6f67f0, #4839eb); 
                        color:white; padding:22px; text-align:center;">
                <h2 style="margin:0; font-size:26px;">HireHub Notification</h2>
            </div>
            <div style="padding:25px; font-size:15px; color:#333;">
    """


def _email_footer():
    return """
            </div>
        </div>
        <p style="text-align:center; color:#777; font-size:13px; margin-top:18px;">
            You can change notification preferences in your HireHub account.
        </p>
    </div>
    """


# ============================================================
# CREATE IN-APP NOTIFICATION
# ============================================================

def create_in_app_notification(Notification, DatabaseService, user_email, n_type, message):
    note = Notification(
        user_email=user_email,
        type=n_type,
        message=message,
        created_at=datetime.now(timezone.utc),
        is_read=False
    )
    try:
        # Assuming DatabaseService.create commits. If not, you need db.session.commit()
        DatabaseService.create(note)
        current_app.logger.info(f"Notification created for {user_email}")
    except Exception as e:
        current_app.logger.error(f"Failed to commit notification for {user_email}: {e}")


# ============================================================
# DAILY DIGEST EMAIL WORKER (RUNS EVERY 24 HOURS)
# ============================================================

def daily_digest_worker(app):
    def _worker():
        with app.app_context():
            (DatabaseService, User, Job, RecommendedJob,
             Notification, mail, db, Message) = _load_dependencies()

            app.logger.info("[DailyDigestWorker] Started")

            # 24 hours * 60 minutes/hour * 60 seconds/minute
            SLEEP_TIME_SECONDS = 24 * 60 * 60

            while True:
                try:
                    users = DatabaseService.get_all(User)

                    for u in users:
                        if not u.daily_digest_enabled:
                            continue

                        # Fetch recommended jobs
                        recs = (
                            db.session.query(RecommendedJob)
                            .filter(RecommendedJob.user_id == u.id)
                            .order_by(RecommendedJob.match_score.desc())
                            .limit(5)
                            .all()
                        )

                        rec_html = ""
                        for r in recs:
                            if r.job:
                                rec_html += f"""
                                <div style="border:1px solid #eee; padding:14px; margin-bottom:10px; border-radius:8px;">
                                    <h4 style="margin:0;">{r.job.title}</h4>
                                    <p style="margin:3px 0; color: #555;">{r.job.company} • {r.job.location}</p>
                                    <p style="margin:0;"><b>Match:</b> {r.match_score}%</p>
                                </div>
                                """

                        html = (
                            _email_header() +
                            f"<p>Hello <b>{u.first_name}</b>, here is your daily job digest:</p>"
                            f"{rec_html}"
                            + _email_footer()
                        )

                        msg = Message("Your HireHub Daily Digest", recipients=[u.email], html=html)
                        mail.send(msg)

                        create_in_app_notification(
                            Notification, DatabaseService,
                            u.email,
                            "Daily Digest",
                            "Your daily job digest was emailed to you."
                        )

                    app.logger.info("[DailyDigestWorker] Completed daily run")

                except Exception as e:
                    app.logger.exception("[DailyDigestWorker] Error: %s", e)

                time.sleep(SLEEP_TIME_SECONDS)  # 24 hours

    threading.Thread(target=_worker, daemon=True).start()


# ============================================================
# WEEKLY INSIGHTS EMAIL WORKER (RUNS EVERY 7 DAYS)
# ============================================================

def weekly_insights_worker(app):
    def _worker():
        with app.app_context():
            (DatabaseService, User, Job, RecommendedJob,
             Notification, mail, db, Message) = _load_dependencies()

            app.logger.info("[WeeklyInsightsWorker] Started")

            # 7 days * 24 hours/day * 60 minutes/hour * 60 seconds/minute
            SLEEP_TIME_SECONDS = 7 * 24 * 60 * 60

            while True:
                try:
                    users = DatabaseService.get_all(User)

                    for u in users:
                        if not u.weekly_digest_enabled:
                            continue

                        html = (
                            _email_header() +
                            f"<p>Hello <b>{u.first_name}</b>, here are your weekly insights.</p>"
                            f"<p>Profile completion: {u.profile_completion or 0}%</p>"
                            f"<p>Resume Score: {u.resume_score or 0}%</p>"
                            + _email_footer()
                        )

                        msg = Message("Weekly Insights Report", recipients=[u.email], html=html)
                        mail.send(msg)

                        create_in_app_notification(
                            Notification, DatabaseService,
                            u.email,
                            "Weekly Insights",
                            "Your weekly insights report has been emailed."
                        )

                    app.logger.info("[WeeklyInsightsWorker] Completed weekly run")

                except Exception as e:
                    app.logger.exception("[WeeklyInsightsWorker] Error: %s", e)

                time.sleep(SLEEP_TIME_SECONDS)  # 7 days

    threading.Thread(target=_worker, daemon=True).start()


# ============================================================
# JOB MATCH WORKER (RUNS EVERY 4 HOURS)
# ============================================================

def job_match_worker(app):
    def _worker():
        with app.app_context():
            (DatabaseService, User, Job, RecommendedJob,
             Notification, mail, db, Message) = _load_dependencies()

            app.logger.info("[JobMatchWorker] Started")

            # 4 hours * 60 minutes/hour * 60 seconds/minute
            SLEEP_TIME_SECONDS = 4 * 60 * 60

            while True:
                try:
                    users = DatabaseService.get_all(User)

                    for u in users:
                        if not u.skills:
                            continue

                        # Simple example: find jobs with overlapping skills
                        jobs = (
                            db.session.query(Job)
                            .filter(Job.skills_required.overlap(u.skills))
                            .limit(10)
                            .all()
                        )

                        for j in jobs:
                            create_in_app_notification(
                                Notification, DatabaseService,
                                u.email,
                                "New Job Match",
                                f"A new job matches your skills: {j.title}"
                            )

                    app.logger.info("[JobMatchWorker] Completed cycle")

                except Exception:
                    app.logger.exception("[JobMatchWorker] Error")

                time.sleep(SLEEP_TIME_SECONDS)  # 4 hours

    threading.Thread(target=_worker, daemon=True).start()


# ============================================================
# DEADLINE WORKER (RUNS EVERY 12 HOURS)
# ============================================================

def deadline_worker(app):
    def _worker():
        with app.app_context():
            (DatabaseService, User, Job, RecommendedJob,
             Notification, mail, db, Message) = _load_dependencies()

            app.logger.info("[DeadlineWorker] Started")

            # 12 hours * 60 minutes/hour * 60 seconds/minute
            SLEEP_TIME_SECONDS = 12 * 60 * 60

            while True:
                try:
                    now = datetime.now(timezone.utc)
                    deadline_limit = now + timedelta(hours=48)

                    expiring_jobs = (
                        db.session.query(Job)
                        .filter(and_(Job.expires_at != None, Job.expires_at <= deadline_limit))
                        .all()
                    )

                    for j in expiring_jobs:
                        for rec in j.recommended_to:
                            u = rec.user

                            # Email
                            html = (
                                _email_header() +
                                f"<p>The job <b>{j.title}</b> is closing soon.</p>" +
                                _email_footer()
                            )
                            mail.send(Message("Job Closing Soon", recipients=[u.email], html=html))

                            # In-app
                            create_in_app_notification(
                                Notification, DatabaseService,
                                u.email,
                                "Closing Soon",
                                f"The job {j.title} expires in less than 48 hours."
                            )

                    app.logger.info("[DeadlineWorker] Completed cycle")

                except Exception:
                    app.logger.exception("[DeadlineWorker] Error")

                time.sleep(SLEEP_TIME_SECONDS) # 12 hours

    threading.Thread(target=_worker, daemon=True).start()


# ============================================================
# REGISTER ALL WORKERS
# ============================================================

def init_notification_workers(app):
    print("🔥 init_notification_workers() CALLED")
    daily_digest_worker(app)
    weekly_insights_worker(app)
    job_match_worker(app)
    deadline_worker(app) 
    app.logger.info("[NotificationSystem] All workers started successfully.")