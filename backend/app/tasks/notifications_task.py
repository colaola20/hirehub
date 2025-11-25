
import threading
import time
from datetime import datetime, timedelta, timezone
from flask import current_app


def _load_dependencies():
    from app.services.database import DatabaseService
    from app.models.user import User
    from app.models.job import Job
    from app.models.notification import Notification
    from app.extensions import mail, db
    from flask_mail import Message
    return DatabaseService, User, Job, Notification, mail, db, Message


# ---------------------------------------------------------
# Helper: create in-app notification
# ---------------------------------------------------------
def push_in_app(Notification, DatabaseService, user_email, n_type, message):
    note = Notification(
        user_email=user_email,
        type=n_type,
        message=message,
        is_read=False,
        created_at=datetime.now(timezone.utc)
    )
    DatabaseService.create(note)


# ---------------------------------------------------------
# The unified worker (runs every 10 minutes)
# ---------------------------------------------------------
def unified_notification_worker(app):

    def _worker():
        with app.app_context():
            (DatabaseService, User, Job, Notification,
             mail, db, Message) = _load_dependencies()

            app.logger.info("🔥 Unified Notification Worker started.")

            CHECK_INTERVAL_SECONDS = 10 * 60  # 10 minutes
            INACTIVITY_LIMIT = timedelta(hours=72)  # 3 days

            while True:
                try:
                    now = datetime.now(timezone.utc)
                    users = DatabaseService.get_all(User)

                    for u in users:

                        # ---------------------------------------------------------
                        # 1. USER-CONTROLLED DIGEST (job recommendations only)
                        # ---------------------------------------------------------
                        if u.digest_interval_minutes:

                            if not u.last_digest_sent or \
                               now - u.last_digest_sent >= timedelta(minutes=u.digest_interval_minutes):

                                # Fetch recommended jobs (basic version)
                                jobs = Job.query.limit(5).all()

                                if jobs:
                                    html = "<h3>Your Job Digest</h3>"
                                    for j in jobs:
                                        html += f"<p><b>{j.title}</b> – {j.company} ({j.location})</p>"

                                    msg = Message("Your HireHub Digest", recipients=[u.email], html=html)
                                    mail.send(msg)

                                    push_in_app(
                                        Notification, DatabaseService,
                                        u.email, "Digest", "Your latest job digest is ready."
                                    )

                                u.last_digest_sent = now
                                db.session.commit()

                        # ---------------------------------------------------------
                        # 2. LAST LOGIN INACTIVITY NOTIFICATION (72 hours)
                        # ---------------------------------------------------------
                        if u.last_login:

                            inactive_for = now - u.last_login

                            if inactive_for >= INACTIVITY_LIMIT:
                                if not u.last_login_notification_sent or \
                                   (now - u.last_login_notification_sent >= INACTIVITY_LIMIT):

                                    msg = Message(
                                        "We Miss You at HireHub",
                                        recipients=[u.email],
                                        body="You haven’t logged in for a few days. New job matches are waiting!"
                                    )
                                    mail.send(msg)

                                    push_in_app(
                                        Notification, DatabaseService,
                                        u.email, "Inactivity",
                                        "You haven't logged in recently. Check out new job opportunities!"
                                    )

                                    u.last_login_notification_sent = now
                                    db.session.commit()

                        # ---------------------------------------------------------
                        # 3. NEW JOB MATCHES BASED ON SKILLS
                        # ---------------------------------------------------------
                        if u.skills:
                            # Fetch jobs requiring ANY overlapping skills
                            matched_jobs = (
                                Job.query
                                .filter(Job.skills_required.overlap(u.skills))
                                .limit(5)
                                .all()
                            )

                            if matched_jobs:
                                if not u.last_job_match_sent or \
                                   now - u.last_job_match_sent >= timedelta(hours=1):  # minimum 1 hour gap

                                    for j in matched_jobs:
                                        push_in_app(
                                            Notification, DatabaseService,
                                            u.email, "New Job Match",
                                            f"New job matches your skills: {j.title}"
                                        )

                                    u.last_job_match_sent = now
                                    db.session.commit()

                        # ---------------------------------------------------------
                        # 4. PROFILE COMPLETION REMINDER (< 60%)
                        # ---------------------------------------------------------
                        if u.profile_completion is not None and u.profile_completion < 60:

                            if not u.last_profile_reminder_sent or \
                               now - u.last_profile_reminder_sent >= timedelta(hours=24):

                                msg = Message(
                                    "Improve Your HireHub Profile",
                                    recipients=[u.email],
                                    body="Your profile is below 60%. Completing it improves your job matches!"
                                )
                                mail.send(msg)

                                push_in_app(
                                    Notification, DatabaseService,
                                    u.email, "Profile Reminder",
                                    "Your profile is incomplete. Update it to improve your job matches."
                                )

                                u.last_profile_reminder_sent = now
                                db.session.commit()

                except Exception as e:
                    current_app.logger.exception("UnifiedWorker ERROR: %s", e)

                time.sleep(CHECK_INTERVAL_SECONDS)

    threading.Thread(target=_worker, daemon=True).start()
