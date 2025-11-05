from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.application import Application
from app.models.job import Job
from app.models.user import User
from datetime import datetime

applications_bp = Blueprint('applications', __name__, url_prefix='/api/applications')


@applications_bp.route('', methods=['POST'])
@jwt_required()
def apply_job():
    """Apply to a job"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        data = request.get_json()
        job_id = data.get('job_id')
        notes = data.get('notes', '')

        if not job_id:
            return jsonify({'error': 'Job ID is required'}), 400

        # Check if already applied
        existing = Application.query.filter_by(user_id=user_id, job_id=job_id).first()
        if existing:
            return jsonify({'error': 'You already applied to this job'}), 409

        # Create new application entry
        application = Application(
            user_id=user_id,
            job_id=job_id,
            status="applied",
            notes=notes,
            applied_at=datetime.utcnow()
        )
        db.session.add(application)
        db.session.commit()

        return jsonify({
            'message': 'Application submitted successfully',
            'application': {
                'id': application.id,
                'job_id': application.job_id,
                'status': application.status,
                'notes': application.notes,
                'applied_at': application.applied_at.isoformat() if application.applied_at else None
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        print("Apply Job Error:", e)
        return jsonify({'error': 'Failed to apply', 'details': str(e)}), 500


@applications_bp.route('', methods=['GET'])
@jwt_required()
def get_applied_jobs():
    """Get all applied jobs for the current user"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        applications = Application.query.filter_by(user_id=user.id).all()
        applied_list = []

        for app_entry in applications:
            job = Job.query.get(app_entry.job_id)
            if job:
                applied_list.append({
                    'application_id': app_entry.id,
                    'status': app_entry.status,
                    'notes': app_entry.notes,
                    'applied_at': app_entry.applied_at.strftime("%Y-%m-%d %H:%M:%S") if app_entry.applied_at else None,
                    'job': {
                        **job.to_dict(),
                        'date_posted': job.date_posted.strftime("%Y-%m-%d") if job.date_posted else None
                    }
                })

        return jsonify({
            'applied': applied_list,
            'count': len(applied_list)
        }), 200

    except Exception as e:
        print("Get Applied Jobs Error:", e)
        return jsonify({'error': 'Failed to load applied jobs', 'details': str(e)}), 500

# this method might not be correct
# this method might not be correct
# this method might not be correct
@applications_bp.route('/<int:job_id>', methods=['DELETE'])
@jwt_required()
def remove_application(job_id):
    """Withdraw an application"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        app_entry = Application.query.filter_by(user_id=user.id, job_id=job_id).first()
        if not app_entry:
            return jsonify({'error': 'Application not found'}), 404

        db.session.delete(app_entry)
        db.session.commit()

        return jsonify({'message': 'Application withdrawn successfully'}), 200

    except Exception as e:
        db.session.rollback()
        print("Delete Application Error:", e)
        return jsonify({'error': 'Failed to withdraw application', 'details': str(e)}), 500


@applications_bp.route('/check/<int:job_id>', methods=['GET'])
@jwt_required()
def check_application(job_id):
    """Check if the current user applied for this job"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        app_entry = Application.query.filter_by(user_id=user.id, job_id=job_id).first()

        return jsonify({
            'is_applied': app_entry is not None,
            'application_id': app_entry.id if app_entry else None,
            'status': app_entry.status if app_entry else None
        }), 200

    except Exception as e:
        print("Check Application Error:", e)
        return jsonify({'error': 'Failed to check application', 'details': str(e)}), 500
    

@applications_bp.route('/<int:application_id>', methods=['PATCH'])
@jwt_required()
def update_application_status(application_id):
    try:
        user_id = int(get_jwt_identity())
        app_entry = Application.query.filter_by(id=application_id, user_id=user_id).first()
        if not app_entry:
            return jsonify({'error': 'Application not found'}), 404

        data = request.get_json()
        new_status = data.get('status')
        if new_status not in ['applied', 'interviewed', 'offer', 'rejected']:
            return jsonify({'error': 'Invalid status value'}), 400

        app_entry.status = new_status
        db.session.commit()

        return jsonify({'message': 'Status updated successfully', 'status': app_entry.status}), 200

    except Exception as e:
        db.session.rollback()
        print("Update Status Error:", e)
        return jsonify({'error': 'Failed to update status', 'details': str(e)}), 500

@applications_bp.route('/<int:application_id>/notes', methods=['PATCH'])
@jwt_required()
def update_application_notes(application_id):
    """Update the notes for a user's application"""
    try:
        user_id = int(get_jwt_identity())
        app_entry = Application.query.filter_by(id=application_id, user_id=user_id).first()
        if not app_entry:
            return jsonify({'error': 'Application not found'}), 404

        data = request.get_json()
        new_notes = data.get('notes', '').strip()

        app_entry.notes = new_notes
        db.session.commit()

        return jsonify({
            'message': 'Notes updated successfully',
            'notes': app_entry.notes
        }), 200

    except Exception as e:
        db.session.rollback()
        print("Update Notes Error:", e)
        return jsonify({'error': 'Failed to update notes', 'details': str(e)}), 500
