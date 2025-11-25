from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.database import DatabaseService
from app.models.notification import Notification
from app.models.user import User
from app.extensions import mail
from flask_mail import Message
from datetime import datetime
from datetime import datetime, timezone

notifications_bp = Blueprint('notifications', __name__)



@notifications_bp.route('/notifications', methods=['GET'])
@jwt_required()
def list_notifications():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        notes = Notification.query.filter_by(user_email=user.email).order_by(Notification.created_at.desc()).all()
        return jsonify([{
            'id': n.notification_id,
            'title': getattr(n, 'type', 'Notification'),
            'body': n.message,
            'created_at': n.created_at.isoformat() if n.created_at else None,
            'read': bool(n.is_read)
        } for n in notes]), 200
    except Exception as e:
        current_app.logger.exception('Failed to list notifications')    
        return jsonify({'error': 'Failed to list notifications', 'detail': str(e)}), 500


@notifications_bp.route('/notifications/send', methods=['POST'])
@jwt_required()

def send_notification():
    """Send notification(s). Body: { title, body, to } where `to` is optional email or array; if absent send to all users."""
    data = request.get_json() or {}
    title = data.get('title') or data.get('subject') or 'Notification'
    body = data.get('body') or data.get('message') or ''
    recipients = data.get('to')
    print("MAIL_USERNAME =", current_app.config.get("MAIL_USERNAME"))
    print("MAIL_DEFAULT_SENDER =", current_app.config.get("MAIL_DEFAULT_SENDER"))

    try:
        # resolve recipients list
        if recipients:
            if isinstance(recipients, str):
                recipients = [recipients]
            elif isinstance(recipients, list):
                recipients = [r for r in recipients if isinstance(r, str)]
        else:
            # broadcast to all users
            users = DatabaseService.get_all(User)
            recipients = [u.email for u in users if u.email]

        created = []
        for email in recipients:
            try:
                note = Notification(user_email=email, type=title, message=body, is_read=False, created_at=datetime.utcnow())
                DatabaseService.create(note)
                created.append(email)
            except Exception:
                current_app.logger.exception('Failed to create notification for %s', email)
                # continue to try sending email to others

            try:
                print("SENDING AS:", sender=current_app.config['MAIL_USERNAME'])
                msg = Message(subject=title, recipients=[email],sender=current_app.config['MAIL_USERNAME'])
                msg.body = body
                mail.send(msg)
            except Exception:
                current_app.logger.exception('Failed to send email to %s', email)

        return jsonify({'ok': True, 'sent_to': created}), 200
    except Exception as e:
        current_app.logger.exception('Failed to send notifications')
        return jsonify({'error': 'Failed to send notifications', 'detail': str(e)}), 500


@notifications_bp.route('/notifications/<int:note_id>/read', methods=['POST'])
@jwt_required()
def mark_notification_read(note_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        note = Notification.query.get(note_id)
        if not note:
            return jsonify({'error': 'Not found'}), 404
        if note.user_email != user.email:
            return jsonify({'error': 'Forbidden'}), 403
        note.is_read = True
        DatabaseService.update(note)
        return jsonify({'ok': True}), 200
    except Exception as e:
        current_app.logger.exception('Failed to mark read')
        return jsonify({'error': 'Failed to mark read', 'detail': str(e)}), 500


@notifications_bp.route('/notifications/<int:note_id>', methods=['DELETE'])
@jwt_required()
def delete_notification(note_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        note = Notification.query.get(note_id)
        if not note:
            return jsonify({'error': 'Not found'}), 404
        if note.user_email != user.email:
            return jsonify({'error': 'Forbidden'}), 403
        DatabaseService.delete(note)
        return jsonify({'ok': True}), 200
    except Exception as e:
        current_app.logger.exception('Failed to delete notification')
        return jsonify({'error': 'Failed to delete', 'detail': str(e)}), 500
    
@notifications_bp.route("/debug-email")
def debug_email():
    return {
        "MAIL_USERNAME": current_app.config['MAIL_USERNAME'],
        "MAIL_DEFAULT_SENDER": str(current_app.config['MAIL_DEFAULT_SENDER'])
    }

@notifications_bp.route("/notifications/test/digest", methods=["POST"])
def test_digest():
    from app.models.user import User
    from app.models.job import Job
    from flask_mail import Message
    from app.extensions import mail, db

    users = User.query.all()
    jobs = Job.query.limit(5).all()

    if not users:
        return {"error": "No users in database"}, 500

    html = "<h3>Your Job Digest</h3>"
    for j in jobs:
        html += f"<p><b>{j.title}</b> – {j.company} ({j.location})</p>"

    sent = []
    for user in users:
        try:
            msg = Message(
                subject="TEST DIGEST",
                recipients=[user.email],
                html=html
            )
            mail.send(msg)

            user.last_digest_sent = datetime.now(timezone.utc)
            db.session.commit()

            sent.append(user.email)
        except Exception as e:
            current_app.logger.exception("Failed sending digest to %s", user.email)

    return {"ok": True, "sent_to": sent}

@notifications_bp.route("/notifications/test/inactivity", methods=["POST"])
def test_inactivity():
    from app.models.user import User
    from flask_mail import Message
    from app.extensions import mail

    users = User.query.all()

    if not users:
        return {"error": "No users found"}, 500

    sent = []

    for user in users:
        try:
            msg = Message(
                "TEST Inactivity",
                recipients=[user.email],
                body="This is a test inactivity email."
            )
            mail.send(msg)
            sent.append(user.email)
        except:
            current_app.logger.exception("Failed to send inactivity email")

    return {"ok": True, "sent_to": sent}

@notifications_bp.route("/notifications/test/jobmatch", methods=["POST"])
def test_jobmatch():
    from app.models.user import User
    from app.models.job import Job
    from app.services.database import DatabaseService
    from app.models.notification import Notification

    users = User.query.all()
    if not users:
        return {"error": "No users in database"}, 500

    jobs = Job.query.limit(5).all()
    if not jobs:
        return {"error": "No jobs available"}, 500

    results = {}

    for user in users:
        matched = []

        # match by skills (if available)
        if user.skills:
            matched_jobs = (
                Job.query.filter(Job.skills_required.overlap(user.skills))
                .limit(5)
                .all()
            )
        else:
            matched_jobs = jobs

        # create in-app notifications
        for j in matched_jobs:
            note = Notification(
                user_email=user.email,
                type="New Job Match",
                message=f"New job matches your skills: {j.title}",
                is_read=False,
                created_at=datetime.now(timezone.utc)
            )
            DatabaseService.create(note)
            matched.append(j.title)

        results[user.email] = matched

    return {"ok": True, "job_matches": results}
