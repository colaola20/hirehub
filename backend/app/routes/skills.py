from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.skill import Skill
from app.models.profile import Profile
from app.models.user import User

skills_bp = Blueprint('skills', __name__, url_prefix='/api/skills')


@skills_bp.route('', methods=['POST'])
@jwt_required()
def add_skill():
    """Add a skill to the current user's profile"""
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Get or create profile for user
    profile = Profile.query.filter_by(user_email=user.email).first()
    if not profile:
        return jsonify({'error': 'Profile not found. Please create a profile first.'}), 404

    data = request.get_json()
    skill_name = data.get('skill_name')

    if not skill_name:
        return jsonify({'error': 'skill_name is required'}), 400

    # Validate skill_name length
    if len(skill_name) > 100:
        return jsonify({'error': 'Skill name must be 100 characters or less'}), 400

    # Check if skill already exists for this profile
    existing_skill = Skill.query.filter_by(
        profile_id=profile.profile_id,
        skill_name=skill_name
    ).first()

    if existing_skill:
        return jsonify({'error': 'Skill already exists for this profile'}), 409

    # Create new skill
    skill = Skill(profile_id=profile.profile_id, skill_name=skill_name)
    db.session.add(skill)
    db.session.commit()

    return jsonify({
        'message': 'Skill added successfully',
        'skill': skill.to_dict()
    }), 201


@skills_bp.route('/<string:skill_name>', methods=['DELETE'])
@jwt_required()
def remove_skill(skill_name):
    """Remove a skill from the current user's profile"""
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Get profile
    profile = Profile.query.filter_by(user_email=user.email).first()
    if not profile:
        return jsonify({'error': 'Profile not found'}), 404

    # Find the skill
    skill = Skill.query.filter_by(
        profile_id=profile.profile_id,
        skill_name=skill_name
    ).first()

    if not skill:
        return jsonify({'error': 'Skill not found'}), 404

    db.session.delete(skill)
    db.session.commit()

    return jsonify({'message': 'Skill removed successfully'}), 200


@skills_bp.route('', methods=['GET'])
@jwt_required()
def get_skills():
    """Get all skills for the current user's profile"""
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Get profile
    profile = Profile.query.filter_by(user_email=user.email).first()
    if not profile:
        return jsonify({'error': 'Profile not found'}), 404

    # Get all skills for this profile
    skills = Skill.query.filter_by(profile_id=profile.profile_id).all()

    skills_list = [skill.to_dict() for skill in skills]

    return jsonify({
        'skills': skills_list,
        'count': len(skills_list)
    }), 200
