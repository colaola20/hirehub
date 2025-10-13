from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.favorite import Favorite
from app.models.job import Job
from app.models.user import User

favorites_bp = Blueprint('favorites', __name__, url_prefix='/api/favorites')


@favorites_bp.route('', methods=['POST'])
@jwt_required()
def add_favorite():
    """Add a job to user's favorites"""
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    job_id = data.get('job_id')

    if not job_id:
        return jsonify({'error': 'job_id is required'}), 400

    # Check if job exists
    job = Job.query.get(job_id)
    if not job:
        return jsonify({'error': 'Job not found'}), 404

    # Check if already favorited
    existing_favorite = Favorite.query.filter_by(
        user_id=user.id,
        job_id=job_id
    ).first()

    if existing_favorite:
        return jsonify({'error': 'Job already favorited'}), 409

    # Create new favorite
    favorite = Favorite(user_id=user.id, job_id=job_id)
    db.session.add(favorite)
    db.session.commit()

    return jsonify({
        'message': 'Job added to favorites',
        'favorite': favorite.to_dict()
    }), 201


@favorites_bp.route('/<int:job_id>', methods=['DELETE'])
@jwt_required()
def remove_favorite(job_id):
    """Remove a job from user's favorites"""
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Find the favorite
    favorite = Favorite.query.filter_by(
        user_id=user.id,
        job_id=job_id
    ).first()

    if not favorite:
        return jsonify({'error': 'Favorite not found'}), 404

    db.session.delete(favorite)
    db.session.commit()

    return jsonify({'message': 'Job removed from favorites'}), 200


@favorites_bp.route('', methods=['GET'])
@jwt_required()
def get_favorites():
    """Get all favorited jobs for the current user"""
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Get all favorites with job details
    favorites = Favorite.query.filter_by(user_id=user.id).all()

    favorites_list = []
    for favorite in favorites:
        job = Job.query.get(favorite.job_id)
        if job:
            favorites_list.append({
                'favorite_id': favorite.id,
                'created_at': favorite.created_at.isoformat() if favorite.created_at else None,
                'job': job.to_dict()
            })

    return jsonify({
        'favorites': favorites_list,
        'count': len(favorites_list)
    }), 200


@favorites_bp.route('/check/<int:job_id>', methods=['GET'])
@jwt_required()
def check_favorite(job_id):
    """Check if a job is favorited by the current user"""
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    favorite = Favorite.query.filter_by(
        user_id=user.id,
        job_id=job_id
    ).first()

    return jsonify({
        'is_favorited': favorite is not None,
        'favorite_id': favorite.id if favorite else None
    }), 200
