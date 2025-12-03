from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.extensions import db

settings_bp = Blueprint("settings", __name__)

@settings_bp.route("/notifications/settings", methods=["POST"])
@jwt_required()
def save_notification_settings():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json() or {}

    # GENERAL
    if "general_enabled" in data:
        user.general_notifications_enabled = data["general_enabled"]

    if "general_frequency" in data:
        user.general_notifications_frequency = data["general_frequency"].lower()

    # JOB ALERTS
    if "job_alerts_enabled" in data:
        user.job_alerts_enabled = data["job_alerts_enabled"]

    if "job_alerts_frequency" in data:
        user.job_alerts_frequency = data["job_alerts_frequency"].lower()

    db.session.commit()
    return jsonify({"ok": True})

@settings_bp.route("/notifications/settings", methods=["GET"])
@jwt_required()
def load_notification_settings():
    user_id = get_jwt_identity()
    u = User.query.get(user_id)

    return jsonify({
        "general_enabled": u.general_notifications_enabled,
        "general_frequency": u.general_notifications_frequency,
        "job_alerts_enabled": u.job_alerts_enabled,
        "job_alerts_frequency": u.job_alerts_frequency
    })
