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


def to_aware(dt):
    """Ensure datetimes are timezone-aware."""
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


def push_in_app(Notification, DatabaseService, user_email, n_type, message):
    note = Notification(
        user_email=user_email,
        type=n_type,
        message=message,
        is_read=False,
        created_at=datetime.now(timezone.utc)
    )
    DatabaseService.create(note)


def unified_notification_worker(app):

    def _worker():
        with app.app_context():
            (DatabaseService, User, Job, Notification,
             mail, db, Message) = _load_dependencies()

            app.logger.info("🔥 Unified Notification Worker started.")

            CHECK_INTERVAL_SECONDS = 10 
            INACTIVITY_LIMIT = timedelta(hours=72)

            while True:
                try:
                    now = datetime.now(timezone.utc)
                    users = DatabaseService.get_all(User)

                    for u in users:

                        # ======================================================
                        # GENERAL NOTIFICATIONS (Your new settings)
                        # ======================================================

                        last_general = to_aware(u.last_general_notification_sent)

                        allow_general = False
                        freq = (u.general_notifications_frequency or "immediately").lower()
                        if freq == "immediately":
                            allow_general = True

                        elif freq == "5 minutes":
                            if not last_general or now - last_general >= timedelta(minutes=1):
                                allow_general = True

                        elif freq == "10 minutes":
                            if not last_general or now - last_general >= timedelta(minutes=3):
                                allow_general = True

                        elif freq == "15 minutes":
                            if not last_general or now - last_general >= timedelta(minutes=15):
                                allow_general = True

                        elif freq == "daily summary":
                            if not last_general or now - last_general >= timedelta(days=1):
                                allow_general = True

                        elif freq == "weekly summary":
                            if not last_general or now - last_general >= timedelta(days=7):
                                allow_general = True


                        if allow_general:
                            msg = Message("General HireHub Notification",
                                          recipients=[u.email],
                                          body="This is your general notification based on your settings.")
                            try:
                                mail.send(msg)
                                push_in_app(Notification, DatabaseService, u.email,
                                            "General Notification",
                                            "Your general notification was sent.")
                                u.last_general_notification_sent = now
                                db.session.commit()
                            except Exception as e:
                                current_app.logger.exception("General email send failed")


                        # ======================================================
                        # JOB ALERTS (Your new settings)
                        # ======================================================

                        last_alert = to_aware(u.last_job_alert_sent)

                        allow_job_alert = False
                        jf = (u.job_alerts_frequency or "unlimited").lower()
                        if jf == "5 minutes":
                            if not last_alert or now - last_alert >= timedelta(minutes=1):
                                allow_job_alert = True

                        elif jf == "10 minutes":
                            if not last_alert or now - last_alert >= timedelta(minutes=3):
                                allow_job_alert = True

                        elif jf == "15 minutes":
                            if not last_alert or now - last_alert >= timedelta(minutes=15):
                                allow_job_alert = True

                        elif jf == "up to 1 alert/day":
                            if not last_alert or now - last_alert >= timedelta(days=1):
                                allow_job_alert = True

                        elif jf == "up to 3 alerts/week":
                            if not last_alert or now - last_alert >= timedelta(days=2):
                                allow_job_alert = True

                        elif jf == "unlimited":
                            allow_job_alert = True


                        if allow_job_alert and u.skills:
                            # Job match logic
                            matched_jobs = Job.query.filter(
                                Job.skills_required.overlap(u.skills)
                            ).limit(5).all()

                            if matched_jobs:
                                try:
                                    for j in matched_jobs:
                                        push_in_app(
                                            Notification, DatabaseService,
                                            u.email, "Job Match",
                                            f"New job matches your skills: {j.title}"
                                        )

                                    u.last_job_alert_sent = now
                                    db.session.commit()
                                except:
                                    current_app.logger.exception("Job alert failed")

                        # ======================================================
                        # (Original) DIGEST BASED ON digest_interval_minutes
                        # ======================================================

                        last_digest = to_aware(u.last_digest_sent)

                        if u.digest_interval_minutes:
                            if not last_digest or now - last_digest >= timedelta(minutes=u.digest_interval_minutes):

                                jobs = Job.query.limit(5).all()

                                if jobs:
                                    html = "<h3>Your Job Digest</h3>"
                                    for j in jobs:
                                        html += f"<p><b>{j.title}</b> – {j.company} ({j.location})</p>"

                                    msg = Message("Your HireHub Digest", recipients=[u.email], html=html)
                                    try:
                                        mail.send(msg)
                                        push_in_app(
                                            Notification, DatabaseService,
                                            u.email, "Digest", "Your latest job digest is ready."
                                        )
                                    except:
                                        current_app.logger.exception("Digest send failed")

                                u.last_digest_sent = now
                                db.session.commit()

                        # ======================================================
                        # (Original) INACTIVITY ALERT
                        # ======================================================
                        if u.last_login:
                            last_login = to_aware(u.last_login)
                            last_inactivity = to_aware(u.last_login_notification_sent)

                            inactive_for = now - last_login

                            if inactive_for >= INACTIVITY_LIMIT:
                                if not last_inactivity or now - last_inactivity >= INACTIVITY_LIMIT:

                                    msg = Message("We Miss You at HireHub",
                                                  recipients=[u.email],
                                                  body="You haven’t logged in for a few days.")
                                    try:
                                        mail.send(msg)
                                        push_in_app(
                                            Notification, DatabaseService,
                                            u.email, "Inactivity",
                                            "You haven't logged in recently."
                                        )
                                        u.last_login_notification_sent = now
                                        db.session.commit()
                                    except:
                                        current_app.logger.exception("Inactivity email failed")

                        # ======================================================
                        # (Original) PROFILE REMINDER
                        # ======================================================
                        last_profile_rem = to_aware(u.last_profile_reminder_sent)

                        if u.profile_completion is not None and u.profile_completion < 60:
                            if not last_profile_rem or now - last_profile_rem >= timedelta(hours=24):

                                msg = Message("Improve Your HireHub Profile",
                                              recipients=[u.email],
                                              body="Your profile is below 60%. Complete it!")
                                try:
                                    mail.send(msg)
                                    push_in_app(
                                        Notification, DatabaseService,
                                        u.email, "Profile Reminder",
                                        "Your profile is incomplete."
                                    )
                                    u.last_profile_reminder_sent = now
                                    db.session.commit()
                                except:
                                    current_app.logger.exception("Profile reminder failed")

                except Exception as e:
                    current_app.logger.exception("UnifiedWorker ERROR: %s", e)

                time.sleep(CHECK_INTERVAL_SECONDS)

    threading.Thread(target=_worker, daemon=True).start()
