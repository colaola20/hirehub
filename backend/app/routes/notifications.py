from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.database import DatabaseService
from app.models.notification import Notification
from app.models.user import User
from app.extensions import mail
from flask_mail import Message
from datetime import datetime, timezone

notifications_bp = Blueprint('notifications', __name__, url_prefix="/api")

# HIREHUB LOGO (small, clean SVG)
HIREHUB_LOGO = """
<div style="text-align:center;margin-bottom:22px;">
  <img src="https://unsplash.com/photos/person-holding-pencil-near-laptop-computer-5fNmWej4tAA" 
       alt="HireHub" 
       style="width:110px;opacity:0.95;" />
</div>
"""

# ----------------------------------------------------------
# UNIVERSAL EMAIL TEMPLATE (modern, Reddit-inspired)
# ----------------------------------------------------------
BASE_EMAIL_TEMPLATE = """
<!DOCTYPE html>
<html>
<body style="font-family:Inter, Arial, sans-serif; background:#f4f6f9; padding:32px;">
  <div style="max-width:640px;margin:auto;background:white;border-radius:14px;padding:32px;
              box-shadow:0 4px 20px rgba(0,0,0,0.08);">

    {logo}

    <h2 style="color:#4169E1; margin-top:0; text-align:center; font-weight:600;">
      {title}
    </h2>

    <div style="margin-top:24px;font-size:15px;color:#333;line-height:1.7;">
      {body}
    </div>

    <hr style="border:none;border-top:1px solid #e5e7ef; margin:32px 0;">

    <p style="font-size:12px; color:#777; text-align:center;">
      Sent by <strong>HireHub</strong> • Do not reply to this email.
    </p>

  </div>
</body>
</html>
"""

# ... (keep all your other email templates)

# --------------------------------------------------------------------------
# LIST NOTIFICATIONS - FIXED TO MATCH MODEL
# --------------------------------------------------------------------------
@notifications_bp.route('/notifications', methods=['GET'])
@jwt_required()
def list_notifications():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        notes = Notification.query.filter_by(user_email=user.email).order_by(Notification.created_at.desc()).all()
        
        # Return fields matching your Notification model structure
        return jsonify([{
            'notification_id': n.notification_id,
            'user_email': n.user_email,
            'type': n.type,
            'message': n.message,
            'is_read': bool(n.is_read),
            'created_at': n.created_at.isoformat() if n.created_at else None
        } for n in notes]), 200
    except Exception as e:
        current_app.logger.exception('Failed to list notifications')    
        return jsonify({'error': 'Failed to list notifications', 'detail': str(e)}), 500

# --------------------------------------------------------------------------
# SEND NOTIFICATION (GENERIC EMAIL) - FIXED
# --------------------------------------------------------------------------
@notifications_bp.route('/notifications/send', methods=['POST'])
@jwt_required()
def send_notification():
    data = request.get_json() or {}
    # Accept both 'title' and 'type' for backwards compatibility
    title = data.get('title') or data.get('type') or data.get('subject') or 'Notification'
    # Accept both 'body' and 'message' for backwards compatibility
    body = data.get('body') or data.get('message') or ''
    recipients = data.get('to')

    try:
        if recipients:
            if isinstance(recipients, str):
                recipients = [recipients]
            elif isinstance(recipients, list):
                recipients = [r for r in recipients if isinstance(r, str)]
        else:
            users = DatabaseService.get_all(User)
            recipients = [u.email for u in users if u.email]

        created = []
        for email in recipients:
            try:
                # Create notification with correct field names
                note = Notification(
                    user_email=email, 
                    type=title,           # ← 'type' field
                    message=body,         # ← 'message' field
                    is_read=False, 
                    created_at=datetime.now(timezone.utc)
                )
                DatabaseService.create(note)
                created.append(email)
            except Exception:
                current_app.logger.exception('Failed to create notification for %s', email)

            try:
                html_email = BASE_EMAIL_TEMPLATE.format(title=title, body=body, logo=HIREHUB_LOGO)
                msg = Message(subject=title, recipients=[email], sender=current_app.config['MAIL_USERNAME'])
                msg.html = html_email
                mail.send(msg)
            except Exception:
                current_app.logger.exception('Failed to send email to %s', email)

        return jsonify({'ok': True, 'sent_to': created}), 200
    except Exception as e:
        current_app.logger.exception('Failed to send notifications')
        return jsonify({'error': 'Failed to send notifications', 'detail': str(e)}), 500

# ... (rest of your routes remain the same)
# --------------------------------------------------------------------------
# MARK NOTIFICATION READ
# --------------------------------------------------------------------------
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

# --------------------------------------------------------------------------
# DELETE NOTIFICATION
# --------------------------------------------------------------------------
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

# --------------------------------------------------------------------------
# DEBUG EMAIL
# --------------------------------------------------------------------------
@notifications_bp.route("/debug-email")
def debug_email():
    return {
        "MAIL_USERNAME": current_app.config['MAIL_USERNAME'],
        "MAIL_DEFAULT_SENDER": str(current_app.config['MAIL_DEFAULT_SENDER'])
    }
# --------------------------------------------------------------------------
# TEST DIGEST EMAIL
# --------------------------------------------------------------------------
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

    job_html = ""
    for j in jobs:
        img = getattr(j, "image_url", "https://i.imgur.com/qB3M9QH.png")  

        job_html += f"""
          <div style='padding:20px 0;border-bottom:1px solid #eceff5;display:flex;gap:18px;'>

              <div style="flex:1;">
                  <div style="font-size:13px;color:#777;margin-bottom:4px;">
                      🏢 {j.company} • 📍 {j.location}
                  </div>

                  <div style="font-weight:600;color:#111;font-size:18px;margin-bottom:6px;">
                      {j.title}
                  </div>

                  <a href="{j.url}" style="display:inline-block;margin-top:10px;
                         background:#4169E1;color:white;padding:8px 14px;
                         border-radius:6px;font-size:13px;text-decoration:none;">
                      View Job →
                  </a>
              </div>

              <img src="{img}" style="width:82px;height:82px;border-radius:10px;object-fit:cover;" />
          </div>
        """

    html = DIGEST_TEMPLATE.format(jobs=job_html, logo=HIREHUB_LOGO)

    sent = []
    for user in users:
        try:
            msg = Message(subject="TEST DIGEST", recipients=[user.email], html=html)
            mail.send(msg)

            user.last_digest_sent = datetime.now(timezone.utc)
            db.session.commit()

            sent.append(user.email)
        except Exception:
            current_app.logger.exception("Failed sending digest to %s", user.email)

    return {"ok": True, "sent_to": sent}

# --------------------------------------------------------------------------
# TEST INACTIVITY EMAIL
# --------------------------------------------------------------------------
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
                html=INACTIVITY_TEMPLATE.format(logo=HIREHUB_LOGO)
            )
            mail.send(msg)
            sent.append(user.email)
        except:
            current_app.logger.exception("Failed to send inactivity email")

    return {"ok": True, "sent_to": sent}

# --------------------------------------------------------------------------
# TEST JOB MATCH EMAIL
# --------------------------------------------------------------------------
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

        if user.skills:
            matched_jobs = (
                Job.query.filter(Job.skills_required.overlap(user.skills))
                .limit(5)
                .all()
            )
        else:
            matched_jobs = jobs

        job_match_html = ""
        for j in matched_jobs:

            img = getattr(j, "image_url", "https://i.imgur.com/ETfurrP.png")

            job_match_html += f"""
              <div style='padding:20px 0;border-bottom:1px solid #e3e9e3;display:flex;gap:18px;'>

                  <div style="flex:1;">
                      <div style="font-size:13px;color:#6b8e6b;margin-bottom:4px;">
                          🏢 {j.company} • 📍 {j.location}
                      </div>

                      <div style="font-weight:600;color:#2E8B57;font-size:18px;margin-bottom:6px;">
                          {j.title}
                      </div>

                      <a href="{j.url}" style="display:inline-block;margin-top:10px;
                             background:#2E8B57;color:white;padding:8px 14px;
                             border-radius:6px;font-size:13px;text-decoration:none;">
                          View Job →
                      </a>
                  </div>

                  <img src="{img}" style="width:82px;height:82px;border-radius:10px;object-fit:cover;" />
              </div>
            """

            note = Notification(
                user_email=user.email,
                type="New Job Match",
                message=f"New job matches your skills: {j.title}",
                is_read=False,
                created_at=datetime.now(timezone.utc)
            )
            DatabaseService.create(note)
            matched.append(j.title)

        msg_html = JOB_MATCH_TEMPLATE.format(matches=job_match_html, logo=HIREHUB_LOGO)

        results[user.email] = matched

    return {"ok": True, "job_matches": results}
