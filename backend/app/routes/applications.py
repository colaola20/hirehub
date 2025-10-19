from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.application import Application

applications_bp = Blueprint('applications', __name__, url_prefix="/api")

@applications_bp.route("/apply", methods=["POST"])
@jwt_required()
def apply_job():
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        job_id = data.get("job_id")
        notes = data.get("notes", "")

        if not job_id:
            return jsonify({"status": "error", "message": "Job ID is required"}), 400

        # Check if already applied
        existing = Application.query.filter_by(user_id=user_id, job_id=job_id).first()
        if existing:
            return jsonify({"status": "error", "message": "You already applied to this job"}), 400

        app_entry = Application(user_id=user_id, job_id=job_id, status="applied", notes=notes)
        db.session.add(app_entry)
        db.session.commit()

        return jsonify({"status": "success", "message": "Application saved successfully"}), 201
    except Exception as e:
        db.session.rollback()
        print("Apply Job Error:", e)
        return jsonify({"status": "error", "message": "Failed to apply", "error": str(e)}), 500
