from flask import Blueprint, jsonify
from app.services.database import DatabaseService
from app.models.user import User

users_bp = Blueprint('users', __name__)

@users_bp.route('/users', methods=['GET'])
def get_all_users():
    """Get all users from the database."""
    try:
        users = DatabaseService.get_all(User)

        users_data = []
        for user in users:
            users_data.append(user.to_dict())

        return jsonify({
            'status': 'success',
            'message': f'Retrieved {len(users)} users',
            'data': users_data,
            'count': len(users)
        }), 200

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': 'Failed to retrieve users',
            'error': str(e)
        }), 500