from flask import Blueprint, request, jsonify, send_from_directory, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.profile import Profile
from app.models.skill import Skill
from app.models.user import User
from datetime import datetime
from werkzeug.utils import secure_filename
import os

profile_bp = Blueprint('profile', __name__, url_prefix='/api/profile')


def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']


@profile_bp.route('', methods=['GET'])
@jwt_required()
def get_profile():
    """Get the current user's full profile including skills"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Get profile by user email
        profile = Profile.query.filter_by(user_email=user.email).first()

        # If no profile exists, return user data with empty profile fields
        if not profile:
            return jsonify({
                'user': user.to_dict(),
                'profile': {
                    'headline': None,
                    'education': None,
                    'experience': None,
                    'skills': [],
                    'profile_image': None,
                    'created_at': None,
                    'updated_at': None
                }
            }), 200

        # Get skills for this profile
        skills = Skill.query.filter_by(profile_id=profile.profile_id).all()
        skills_list = [skill.skill_name for skill in skills]

        # Return combined user and profile data
        return jsonify({
            'user': user.to_dict(),
            'profile': {
                'profile_id': profile.profile_id,
                'headline': profile.headline,
                'education': profile.education,
                'experience': profile.experience,
                'skills': skills_list,
                'profile_image': profile.profile_image,
                'created_at': profile.created_at.isoformat() if profile.created_at else None,
                'updated_at': profile.updated_at.isoformat() if profile.updated_at else None
            }
        }), 200

    except Exception as e:
        return jsonify({
            'error': 'Failed to retrieve profile',
            'message': str(e)
        }), 500


@profile_bp.route('', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update or create the current user's profile"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        data = request.get_json()

        # Validate input
        headline = data.get('headline')
        education = data.get('education')
        experience = data.get('experience')

        # Check field lengths
        if headline and len(headline) > 255:
            return jsonify({'error': 'Headline must be 255 characters or less'}), 400

        # Get or create profile
        profile = Profile.query.filter_by(user_email=user.email).first()

        if not profile:
            # Create new profile
            profile = Profile(
                user_email=user.email,
                headline=headline,
                education=education,
                experience=experience,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.session.add(profile)
        else:
            # Update existing profile
            if headline is not None:
                profile.headline = headline
            if education is not None:
                profile.education = education
            if experience is not None:
                profile.experience = experience
            profile.updated_at = datetime.utcnow()

        db.session.commit()

        # Get skills for response
        skills = Skill.query.filter_by(profile_id=profile.profile_id).all()
        skills_list = [skill.skill_name for skill in skills]

        return jsonify({
            'message': 'Profile updated successfully',
            'profile': {
                'profile_id': profile.profile_id,
                'headline': profile.headline,
                'education': profile.education,
                'experience': profile.experience,
                'skills': skills_list,
                'profile_image': profile.profile_image,
                'created_at': profile.created_at.isoformat() if profile.created_at else None,
                'updated_at': profile.updated_at.isoformat() if profile.updated_at else None
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Failed to update profile',
            'message': str(e)
        }), 500


@profile_bp.route('/image', methods=['POST'])
@jwt_required()
def upload_profile_image():
    """Upload a profile image"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Check if file is in request
        if 'image' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['image']

        # Check if file was actually selected
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Validate file type
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Only PNG, JPG, and JPEG are allowed'}), 400

        # Get or create profile
        profile = Profile.query.filter_by(user_email=user.email).first()
        if not profile:
            profile = Profile(
                user_email=user.email,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.session.add(profile)
            db.session.flush()  # Get profile_id

        # Delete old image if exists
        if profile.profile_image:
            old_image_path = os.path.join(
                current_app.config['UPLOAD_FOLDER'],
                'profile_images',
                profile.profile_image
            )
            if os.path.exists(old_image_path):
                os.remove(old_image_path)

        # Generate unique filename
        file_ext = secure_filename(file.filename).rsplit('.', 1)[1].lower()
        filename = f"{user.user_id}_{int(datetime.utcnow().timestamp())}.{file_ext}"

        # Save file
        upload_path = os.path.join(
            current_app.config['UPLOAD_FOLDER'],
            'profile_images'
        )
        os.makedirs(upload_path, exist_ok=True)
        file.save(os.path.join(upload_path, filename))

        # Update profile with image filename
        profile.profile_image = filename
        profile.updated_at = datetime.utcnow()
        db.session.commit()

        return jsonify({
            'message': 'Profile image uploaded successfully',
            'profile_image': filename
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Failed to upload image',
            'message': str(e)
        }), 500


@profile_bp.route('/image/<filename>', methods=['GET'])
def get_profile_image(filename):
    """Serve profile images"""
    try:
        upload_path = os.path.join(
            current_app.config['UPLOAD_FOLDER'],
            'profile_images'
        )
        return send_from_directory(upload_path, filename)
    except Exception as e:
        return jsonify({
            'error': 'Image not found',
            'message': str(e)
        }), 404
