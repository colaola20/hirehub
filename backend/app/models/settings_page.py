from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.extensions import db

settings_bp = Blueprint("settings", __name__)

@settings_bp.route("/settings/notifications", methods=["POST"])
@jwt_required()
def save_notification_settings():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    data = request.get_json()

    user.general_notifications_enabled = data.get("general_enabled", True)
    user.general_notifications_frequency = data.get("general_frequency", "Immediately")
    user.job_alerts_enabled = data.get("job_enabled", True)
    user.job_alerts_frequency = data.get("job_frequency", "Up to 1 alert/day")

    db.session.commit()

    return jsonify({"ok": True})
