import threading
import time
from datetime import datetime, timedelta, timezone
from flask import current_app

def _load_dependencies():
    from app.services.database import DatabaseService
    from app.models.user import User
    from app.models.job import Job
    from app.models.notification import Notification
    from app.models.recommended_job import RecommendedJob
    from app.extensions import mail, db
    from flask_mail import Message
    return DatabaseService, User, Job, Notification, RecommendedJob, mail, db, Message

def to_aware(dt):
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt

def push_in_app(Notification, DatabaseService, email, n_type, msg):
    n = Notification(
        user_email=email,
        type=n_type,
        message=msg,
        is_read=False,
        created_at=datetime.now(timezone.utc)
    )
    DatabaseService.create(n)

# --------------------------------------------------------
# FINAL UNIFIED WORKER — FIXED COMPLETELY
# --------------------------------------------------------
def unified_notification_worker(app):

    def _worker():

        with app.app_context():

            DatabaseService, User, Job, Notification, RecommendedJob, mail, db, Message = _load_dependencies()
            current_app.logger.info("🔥 Notification Worker Running")

            CHECK_INTERVAL_SECONDS = 10
            INACTIVITY_LIMIT = timedelta(hours=72)

            # Frequency → timedelta map
            freq_map = {
                "immediately": timedelta(seconds=0),
                "2 minutes": timedelta(minutes=2),
                "3 minutes": timedelta(minutes=3),
                "5 minutes": timedelta(minutes=5),
                "daily summary": timedelta(days=1),
                "weekly summary": timedelta(days=7),

                # job alerts
                "up to 1 alert/day": timedelta(days=1),
                "up to 3 alerts/week": timedelta(days=2),
                "unlimited": timedelta(seconds=0)
            }

            while True:
                try:
                    now = datetime.now(timezone.utc)
                    users = DatabaseService.get_all(User)

                    for u in users:
                        print("\n----------------------------")
                        print(f"USER: {u.email}")
                        print(f"GENERAL ENABLED: {u.general_notifications_enabled}")
                        print(f"GENERAL FREQ: {u.general_notifications_frequency}")
                        print(f"JOB ALERTS ENABLED: {u.job_alerts_enabled}")
                        print(f"JOB ALERTS FREQ: {u.job_alerts_frequency}")
                        print(f"SKILLS: {u.skills}")
                        print("----------------------------")

                        # ======================================================
                        # 1) GENERAL NOTIFICATIONS
                        # ======================================================
                        if u.general_notifications_enabled:

                            freq = (u.general_notifications_frequency or "immediately").lower()
                            delta = freq_map.get(freq, timedelta(seconds=0))
                            last = to_aware(u.last_general_notification_sent)

                            if not last or (now - last) >= delta:
                                try:
                                    msg = Message("General HireHub Notification",
                                                  recipients=[u.email],
                                                  body="This is your general notification based on your settings.")

                                    mail.send(msg)
                                    push_in_app(Notification, DatabaseService, u.email,
                                                "General Notification",
                                                "General notification delivered.")

                                    u.last_general_notification_sent = now
                                    db.session.commit()

                                    print("✔ SENT GENERAL NOTIFICATION")
                                except:
                                    current_app.logger.exception("General Email Failed")
                        # ======================================================
                        # 2) JOB ALERTS (using RecommendedJob table)
                        # ======================================================
                        if u.job_alerts_enabled:

                            jf = (u.job_alerts_frequency or "unlimited").lower()
                            delta = freq_map.get(jf, timedelta(seconds=0))
                            last = to_aware(u.last_job_alert_sent)

                            if not last or (now - last) >= delta:

                                # --------------------------------------------
                                # Load recommended jobs for this user
                                # --------------------------------------------
                                recs = RecommendedJob.query.filter_by(
                                    user_id=u.id,
                                    is_active=True
                                ).all()

                                matched_jobs = []

                                for r in recs:
                                   # Skip expired recommendations
                                    exp = to_aware(r.expires_at)
                                    if exp and exp < now:
                                        r.is_active = False
                                        continue


                                    # Only include if the related job still exists + is active
                                    if r.job and r.job.is_active:
                                        matched_jobs.append(r)

                                db.session.commit()

                                print("RECOMMENDED JOBS FOR USER:", [r.job.title for r in matched_jobs])

                                # --------------------------------------------
                                # Send the alerts
                                # --------------------------------------------
                                if matched_jobs:
                                    try:
                                        # Build readable email
                                        body_lines = []
                                        for r in matched_jobs:
                                            job = r.job
                                            score = round(r.match_score, 2)

                                            body_lines.append(
                                                f"- {job.title} at {job.company} ({job.location}) "
                                                f" | Match Score: {score}"
                                                f" | Skills: {', '.join(r.matched_skills or [])}"
                                                f"\n{job.url}\n"
                                            )

                                        email_body = (
                                            "Here are your latest recommended jobs from HireHub:\n\n"
                                            + "\n".join(body_lines)
                                        )

                                        # SEND EMAIL
                                        mail.send(Message(
                                            "Your HireHub Job Recommendations",
                                            recipients=[u.email],
                                            body=email_body
                                        ))

                                        # IN-APP NOTIFICATIONS
                                        for r in matched_jobs:
                                            push_in_app(
                                                Notification, DatabaseService,
                                                u.email, "Job Recommendation",
                                                f"A recommended job is available: {r.job.title}"
                                            )

                                        u.last_job_alert_sent = now
                                        db.session.commit()

                                        print("✔ SENT JOB RECOMMENDATION EMAIL + IN-APP ALERTS")

                                    except Exception as e:
                                        current_app.logger.exception("Job Recommendation Email Failed")

                        # ======================================================
                        # 3) DIGEST (old behavior)
                        # ======================================================
                        last_digest = to_aware(u.last_digest_sent)

                        if u.digest_interval_minutes:
                            if not last_digest or now - last_digest >= timedelta(minutes=u.digest_interval_minutes):
                                jobs = Job.query.limit(5).all()
                                if jobs:
                                    html = "<h3>Your Job Digest</h3>"
                                    for j in jobs:
                                        html += f"<p><b>{j.title}</b> – {j.company} ({j.location})</p>"

                                    try:
                                        mail.send(Message("Your HireHub Digest", recipients=[u.email], html=html))
                                        push_in_app(Notification, DatabaseService, u.email,
                                                    "Digest", "Your job digest is ready.")
                                    except:
                                        current_app.logger.exception("Digest Failed")

                                u.last_digest_sent = now
                                db.session.commit()

                        # ======================================================
                        # 4) INACTIVITY ALERT
                        # ======================================================
                        if u.last_login:

                            last_login = to_aware(u.last_login)
                            last_inact = to_aware(u.last_login_notification_sent)

                            if (now - last_login) >= INACTIVITY_LIMIT:
                                if not last_inact or (now - last_inact) >= INACTIVITY_LIMIT:

                                    try:
                                        mail.send(Message("We Miss You",
                                                          recipients=[u.email],
                                                          body="You haven't logged in for a few days."))

                                        push_in_app(Notification, DatabaseService, u.email,
                                                    "Inactivity",
                                                    "You haven't logged in recently.")
                                        u.last_login_notification_sent = now
                                        db.session.commit()
                                    except:
                                        current_app.logger.exception("Inactivity Email Failed")

                        # ======================================================
                        # 5) PROFILE REMINDER
                        # ======================================================
                        last_profile = to_aware(u.last_profile_reminder_sent)

                        if u.profile_completion is not None and u.profile_completion < 60:
                            if not last_profile or (now - last_profile) >= timedelta(hours=24):

                                try:
                                    mail.send(Message("Improve Your HireHub Profile",
                                                      recipients=[u.email],
                                                      body="Your profile is below 60%. Complete it!"))

                                    push_in_app(Notification, DatabaseService, u.email,
                                                "Profile Reminder",
                                                "Your profile is incomplete.")

                                    u.last_profile_reminder_sent = now
                                    db.session.commit()
                                except:
                                    current_app.logger.exception("Profile Reminder Failed")

                except Exception as e:
                    current_app.logger.exception("Unified Worker ERROR: %s", e)

                time.sleep(CHECK_INTERVAL_SECONDS)

    threading.Thread(target=_worker, daemon=True).start()
