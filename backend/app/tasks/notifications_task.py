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

def generate_job_recommendation_email(user_name, matched_jobs):
    """Generate beautiful HTML email for job recommendations"""
    
    # Build job cards HTML
    job_cards = ""
    for r in matched_jobs:
        job = r.job
        score = round(r.match_score, 2)
        skills = ', '.join(r.matched_skills or []) if r.matched_skills else 'N/A'
        
        # Color coding based on match score
        if score >= 90:
            badge_color = "#00c853"
            badge_text = "Excellent Match"
        elif score >= 75:
            badge_color = "#86bbf0"
            badge_text = "Great Match"
        else:
            badge_color = "#7a5bbf"
            badge_text = "Good Match"
        
        job_cards += f'''
        <div style="background: #ffffff; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid {badge_color};">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                <h3 style="margin: 0; font-size: 20px; color: #1d1d1d; font-weight: 700;">{job.title}</h3>
                <span style="background: {badge_color}; color: white; padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; white-space: nowrap; margin-left: 12px;">
                    {score}% Match
                </span>
            </div>
            
            <div style="color: #555; font-size: 16px; margin-bottom: 8px;">
                <strong style="color: #562fac;">📍 {job.company}</strong> • {job.location}
            </div>
            
            <div style="background: #f0f4ff; padding: 12px; border-radius: 8px; margin: 12px 0;">
                <div style="font-size: 13px; color: #666; margin-bottom: 4px;"><strong>Skills Match:</strong></div>
                <div style="font-size: 14px; color: #333;">{skills}</div>
            </div>
            
            <div style="margin-top: 16px;">
                <a href="{job.url}" style="display: inline-block; background: linear-gradient(to right, #86bbf0, #562fac); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                    View Job Details →
                </a>
            </div>
        </div>
        '''
    
    # Complete email HTML
    html = f'''
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f7fa;">
        <div style="max-width: 600px; margin: 0 auto; background: #f5f7fa;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #7fa0ee 0%, #4a2a86 100%); padding: 40px 30px; text-align: center; border-radius: 0 0 20px 20px;">
                <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 800; letter-spacing: 0.5px;">
                    HireHub
                </h1>
                <p style="margin: 8px 0 0; color: rgba(255,255,255,0.95); font-size: 16px;">
                    Your Personalized Job Recommendations
                </p>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 30px 20px;">
                
                <div style="background: white; border-radius: 16px; padding: 30px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
                    <h2 style="margin: 0 0 12px; font-size: 24px; color: #1d1d1d; font-weight: 700;">
                        Hi there! 👋
                    </h2>
                    <p style="margin: 0; color: #555; font-size: 16px; line-height: 1.6;">
                        We've found <strong style="color: #562fac;">{len(matched_jobs)} job{'' if len(matched_jobs) == 1 else 's'}</strong> that match your profile and skills. These opportunities are tailored specifically for you!
                    </p>
                </div>
                
                <!-- Job Cards -->
                {job_cards}
                
                <!-- Footer CTA -->
                <div style="background: linear-gradient(135deg, #f0f4ff 0%, #e8edff 100%); border-radius: 16px; padding: 30px; text-align: center; margin-top: 30px;">
                    <h3 style="margin: 0 0 12px; font-size: 20px; color: #1d1d1d; font-weight: 700;">
                        Want to see more opportunities?
                    </h3>
                    <p style="margin: 0 0 20px; color: #555; font-size: 15px;">
                        Visit your HireHub dashboard to explore all available positions
                    </p>
                    <a href="http://localhost:5173/jobs" style="display: inline-block; background: linear-gradient(to right, #86bbf0, #562fac); color: white; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(86, 47, 172, 0.3);">
                        Browse All Jobs
                    </a>
                </div>
                
            </div>
            
            <!-- Footer -->
            <div style="padding: 30px 20px; text-align: center; color: #999; font-size: 13px;">
                <p style="margin: 0 0 8px;">
                    You're receiving this because you enabled job alerts in your HireHub settings.
                </p>
                <p style="margin: 0;">
                    <a href="http://localhost:5173/settings" style="color: #562fac; text-decoration: none;">Manage your preferences</a> • 
                    <a href="mailto:h1r3hub@gmail.com" style="color: #562fac; text-decoration: none;">Contact Support</a>
                </p>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0; color: #bbb; font-size: 12px;">
                        © 2025 HireHub • Farmingdale State College, NY
                    </p>
                </div>
            </div>
            
        </div>
    </body>
    </html>
    '''
    
    return html

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
                                # Send the alerts with STYLED EMAIL
                                # --------------------------------------------
                                if matched_jobs:
                                    try:
                                        # Generate beautiful HTML email
                                        user_name = u.full_name if hasattr(u, 'full_name') and u.full_name else u.email.split('@')[0]
                                        email_html = generate_job_recommendation_email(user_name, matched_jobs)

                                        # SEND EMAIL
                                        mail.send(Message(
                                            "Your HireHub Job Recommendations 🎯",
                                            recipients=[u.email],
                                            html=email_html
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