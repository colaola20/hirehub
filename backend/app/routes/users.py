from flask import Blueprint, jsonify, request
from app.services.database import DatabaseService
from app.models.user import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, unset_jwt_cookies
from flask_mail import Message
from app.extensions import mail
import jwt, datetime, os

users_bp = Blueprint('users', __name__)

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret")  # should match your app config

# ------------------------
# Get all users
# ------------------------
@users_bp.route('/api/users', methods=['GET'])
@jwt_required(optional=True)
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


# ------------------------
# Register
# ------------------------
@users_bp.route('/api/register', methods=['POST'])
def register_user():
    """Register a new user."""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'status': 'error', 'message': 'No data provided'}), 400

        required_fields = ['username', 'email', 'first_name', 'last_name', 'password']
        for field in required_fields:
            if field not in data:
                return jsonify({'status': 'error', 'message': f'Missing required field: {field}'}), 400

        # Check if username or email already exists
        existing_user = DatabaseService.filter_by(User, username=data['username'])
        if existing_user:
            return jsonify({'status': 'error', 'message': 'Username already exists'}), 409

        existing_email = DatabaseService.filter_by(User, email=data['email'])
        if existing_email:
            return jsonify({'status': 'error', 'message': 'Email already exists'}), 409

        # Create new user
        new_user = User(
            username=data['username'],
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name']
        )
        new_user.set_password(data['password'])

        created_user = DatabaseService.create(new_user)

        # Create access token
        access_token = create_access_token(identity=str(created_user.id))

        return jsonify({
            'status': 'success',
            'message': 'User registered successfully',
            'data': created_user.to_dict(),
            'access_token': access_token
        }), 201

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': 'Failed to register user',
            'error': str(e)
        }), 500


# ------------------------
# Login
# ------------------------
@users_bp.route('/api/login', methods=['POST'])
def login_user():
    """Authenticate user login."""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'status': 'error', 'message': 'No data provided'}), 400

        required_fields = ['email', 'password']
        for field in required_fields:
            if field not in data:
                return jsonify({'status': 'error', 'message': f'Missing required field: {field}'}), 400

        # Find user by Email
        users = DatabaseService.filter_by(User, email=data['email'])
        if not users:
            return jsonify({'status': 'error', 'message': 'Invalid username'}), 401

        user = users[0]

        # Check password
        if not user.check_password(data['password']):
            return jsonify({'status': 'error', 'message': 'Invalid password'}), 401

        # Check if user is active
        if not user.is_active:
            return jsonify({'status': 'error', 'message': 'Account is deactivated'}), 401

        # Create access token
        access_token = create_access_token(identity=str(user.id))

        return jsonify({
            'status': 'success',
            'message': 'Login successful',
            'data': user.to_dict(),
            'access_token': access_token
        }), 200

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': 'Failed to authenticate user',
            'error': str(e)
        }), 500


# ------------------------
# Logout
# ------------------------
@users_bp.route('/api/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        response = jsonify({"message": "Logged out successfully"})
        unset_jwt_cookies(response)
        return response, 200
    except Exception as e:
        return jsonify({"message": "Logout failed", "error": str(e)}), 500


# ------------------------
# Profile
# ------------------------
@users_bp.route('/api/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    """Get current user's profile."""
    try:
        current_user_id = int(get_jwt_identity())
        user = DatabaseService.get_by_id(User, current_user_id)

        if not user:
            return jsonify({'status': 'error', 'message': 'User not found'}), 404

        return jsonify({
            'status': 'success',
            'message': 'Profile retrieved successfully',
            'data': user.to_dict()
        }), 200

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': 'Failed to retrieve profile',
            'error': str(e)
        }), 500


# ------------------------
# Forgot Password
# ------------------------
@users_bp.route("/api/forgot-password", methods=["POST"])
def forgot_password():
    try:
        data = request.get_json()
        email = data.get("email")

        if not email:
            return jsonify({"status": "error", "message": "Email is required"}), 400

        users = DatabaseService.filter_by(User, email=email)
        if not users:
            return jsonify({"status": "error", "message": "No account found with that email"}), 404

        user = users[0]

        # Generate reset token
        token = jwt.encode(
            {"user_id": user.id, "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=15)},
            SECRET_KEY,
            algorithm="HS256"
        )

        reset_link = f"http://localhost:3000/reset-password?token={token}"

        try:
            msg = Message("HireHub Password Reset", recipients=[email])
            msg.body = f"Hello {user.username}, reset link: {reset_link}"
            mail.send(msg)
        except Exception as e:
            # 👇 This ensures you can still test without real email
            print(f"[DEBUG] Could not send email. Reset link: {reset_link}")
            print(f"[DEBUG] Error: {e}")

        return jsonify({"status": "success", "message": "If your email is registered, a reset link has been sent"}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": "Failed to process request", "error": str(e)}), 500

# ------------------------
# Reset Password
# ------------------------
@users_bp.route("/api/reset-password", methods=["POST"])
def reset_password():
    """Reset password using secure token."""
    try:
        data = request.get_json()
        token = data.get("token")
        new_password = data.get("password")

        if not token or not new_password:
            return jsonify({"status": "error", "message": "Token and new password required"}), 400

        try:
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user_id = decoded.get("user_id")
        except jwt.ExpiredSignatureError:
            return jsonify({"status": "error", "message": "Reset link expired"}), 400
        except jwt.InvalidTokenError:
            return jsonify({"status": "error", "message": "Invalid reset token"}), 400

        # Fetch user
        user = DatabaseService.get_by_id(User, user_id)
        if not user:
            return jsonify({"status": "error", "message": "User not found"}), 404

        # Update password
        user.set_password(new_password)  # make sure User model hashes passwords
        DatabaseService.update()

        return jsonify({"status": "success", "message": "Password reset successful. You can now login."}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": "Failed to reset password", "error": str(e)}), 500
