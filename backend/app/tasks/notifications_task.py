import threading
import time
from datetime import datetime
from flask import current_app


def send_periodic_notifications(app, interval_seconds=60*60*24):
    """Background loop that sends notifications every interval_seconds.
    This is a simple best-effort worker intended for small deployments or dev use.
    It will create Notification records and attempt to send emails via Flask-Mail.
    """

    def _worker():
        # push app context
        with app.app_context():
            from app.services.database import DatabaseService
            from app.models.user import User
            from app.models.notification import Notification
            from app.extensions import mail
            from flask_mail import Message

            app.logger.info('Notification worker started, interval=%s', interval_seconds)

            while True:
                try:
                    # Example: send a short daily digest to all users
                    users = DatabaseService.get_all(User)
                    if not users:
                        app.logger.debug('No users found for notifications')
                    else:
                        for u in users:
                            try:
                                # Compose a simple digest. Replace with real logic (new jobs, reminders, etc.)
                                title = 'Daily digest from HireHub'
                                body = f'Hello {u.first_name or u.username},\n\nHere is your daily summary from HireHub. Check the app for details.'

                                # persist notification
                                note = Notification(user_email=u.email, type=title, message=body, is_read=False, created_at=datetime.utcnow())
                                try:
                                    DatabaseService.create(note)
                                except Exception:
                                    app.logger.exception('Failed to create DB notification for %s', u.email)

                                # try to send email (best-effort)
                                try:
                                    msg = Message(subject=title, recipients=[u.email])
                                    msg.body = body
                                    mail.send(msg)
                                except Exception:
                                    app.logger.exception('Failed to send notification email to %s', u.email)
                            except Exception:
                                app.logger.exception('Error sending notification to user %s', getattr(u, 'email', '<no-email>'))

                    app.logger.info('Notification worker sleeping for %s seconds', interval_seconds)
                except Exception:
                    app.logger.exception('Notification worker crashed, continuing')

                time.sleep(interval_seconds)

    t = threading.Thread(target=_worker, daemon=True, name='notifications-worker')
    t.start()
    return t
