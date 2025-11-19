import threading
import time
from datetime import datetime
from flask import current_app


def send_periodic_notifications(app, interval_seconds=60 * 60 * 24):
    """
    Background loop that sends daily digest notifications.
    Includes:
    - DB notification entry
    - HTML email with job suggestions, resume score, and tips
    """

    def _worker():
        with app.app_context():
            from app.services.database import DatabaseService
            from app.models.user import User
            from app.models.notification import Notification
            from app.extensions import mail
            from flask_mail import Message

            app.logger.info("Notification worker started, interval=%s", interval_seconds)

            while True:
                try:
                    users = DatabaseService.get_all(User)

                    if not users:
                        app.logger.debug("No users found for notifications")
                    else:
                        for u in users:
                            try:
                                # ------------ EXAMPLE DATA (replace with real logic) ---------------- #

                                # Fake job recommendations
                                job_recommendations = [
                                    {"title": "Frontend React Developer", "company": "TechNova",
                                     "location": "NYC", "match": 92},
                                    {"title": "Python Backend Engineer", "company": "DataFuse",
                                     "location": "Remote", "match": 88},
                                    {"title": "Full-Stack Engineer (React + Flask)", "company": "SkyLabs",
                                     "location": "Boston", "match": 85},
                                ]

                                # Fake resume score
                                resume_score = 78  # replace with AI scoring output

                                # Tips (AI-generated placeholder)
                                ai_tips = [
                                    "Add impact-based bullet points to your last experience.",
                                    "Update your skills section with the latest frameworks.",
                                    "Upload a tailored resume for better job matches.",
                                ]

                                # --------------------------------------------------------------------- #

                                title = "Your HireHub Daily Digest"

                                # ------------- HTML EMAIL TEMPLATE ------------- #
                                html_body = f"""
                                <div style="font-family: Arial, sans-serif; background: #f6f7fb; padding: 20px;">
                                    <div style="max-width: 620px; margin: auto; background: #fff; border-radius: 10px;
                                                overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.08);">

                                        <!-- Header -->
                                        <div style="background: linear-gradient(135deg,#6f67f0,#4839eb); padding: 20px; text-align:center;">
                                            <img src="https://i.imgur.com/CM8YQnN.png" alt="HireHub" 
                                                 style="width:70px; margin-bottom:10px;" />
                                            <h2 style="color:white; margin:0; font-size:26px;">HireHub Daily Digest</h2>
                                        </div>

                                        <!-- Body -->
                                        <div style="padding: 26px;">
                                            <p style="font-size:16px;">
                                                Hello <strong>{u.first_name or u.username}</strong>,
                                            </p>

                                            <p style="font-size:15px; line-height:1.6;">
                                                Here is your personalized daily update.  
                                                Your dashboard has new job recommendations, resume improvements,
                                                and tailored insights — all designed to help you land your next opportunity.
                                            </p>

                                            <!-- Resume Score -->
                                            <div style="margin:25px 0; padding:20px; background:#eef0ff; border-left:4px solid #6f67f0; border-radius:8px;">
                                                <h3 style="margin:0 0 10px 0; color:#4839eb;">📄 Resume Score</h3>
                                                <p style="margin:0; font-size:15px;">
                                                    Your current resume score is: 
                                                    <strong style="font-size:18px;">{resume_score}%</strong>
                                                </p>
                                                <p style="margin-top:10px; font-size:14px; color:#555;">
                                                    Improve your score by updating your work experience and project descriptions with measurable results.
                                                </p>
                                            </div>

                                            <!-- Job Recommendations -->
                                            <h3 style="margin-top:0; color:#4839eb;">🔥 Top Job Matches for You</h3>

                                            {''.join([f'''
                                                <div style="padding:14px; border:1px solid #eee; border-radius:8px; margin-bottom:12px;">
                                                    <h4 style="margin:0;">{job['title']}</h4>
                                                    <p style="margin:4px 0; font-size:14px; color:#555;">
                                                        {job['company']} • {job['location']}
                                                    </p>
                                                    <p style="margin:0; font-size:14px;">
                                                        <strong>Match Score:</strong> {job['match']}%
                                                    </p>
                                                </div>
                                            ''' for job in job_recommendations])}

                                            <!-- AI Tips -->
                                            <h3 style="margin-top:30px; color:#4839eb;">💡 AI Resume Tips</h3>
                                            <ul style="font-size:15px; color:#444; line-height:1.6;">
                                                {''.join([f'<li>{tip}</li>' for tip in ai_tips])}
                                            </ul>

                                            <!-- Button -->
                                            <div style="text-align:center; margin-top:40px;">
                                                <a href="https://your-hirehub-url.com/dashboard"
                                                   style="padding:14px 26px; background:#6f67f0; color:white; 
                                                   text-decoration:none; border-radius:6px; font-size:16px;">
                                                   Open HireHub Dashboard
                                                </a>
                                            </div>

                                            <p style="font-size:13px; color:#888; margin-top:40px; text-align:center;">
                                                You are receiving this email because you enabled daily digests.  
                                                Update your notification settings to change this.
                                            </p>

                                        </div>
                                    </div>
                                </div>
                                """

                                # --------- SEND EMAIL --------- #
                                msg = Message(subject=title, recipients=[u.email], html=html_body)
                                mail.send(msg)

                                # --------- DB NOTIFICATION --------- #
                                note = Notification(
                                    user_email=u.email,
                                    type=title,
                                    message="Your daily HireHub digest is ready.",
                                    is_read=False,
                                    created_at=datetime.utcnow(),
                                )
                                DatabaseService.create(note)

                            except Exception:
                                app.logger.exception("Error sending notification to user %s", u.email)

                    app.logger.info("Notification worker sleeping for %s seconds", interval_seconds)

                except Exception:
                    app.logger.exception("Notification worker crashed, continuing")

                time.sleep(interval_seconds)

    t = threading.Thread(target=_worker, daemon=True, name="notifications-worker")
    t.start()
    return t
