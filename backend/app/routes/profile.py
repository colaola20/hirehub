from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.profile import Profile
from app.models.skill import Skill
from app.models.user import User
from datetime import datetime

profile_bp = Blueprint('profile', __name__, url_prefix='/api/profile')


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
