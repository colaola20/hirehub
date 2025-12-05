from flask import Blueprint, jsonify
from app import db
from sqlalchemy import text

home_bp = Blueprint('home', __name__)

@home_bp.route('/')
def home():
    return jsonify({
        'message': 'Welcome to HireHub',
        'status': 'success',
        'version': '1.0.0'
    })


@home_bp.route('/api/health')
def health():
    """Health check endpoint for Docker and monitoring"""
    try:
        # Quick database check
        with db.session.connection() as conn:
            conn.execute(text("SELECT 1;"))

        return jsonify({
            "status": "healthy",
            "service": "hirehub-backend",
            "database": "connected"
        }), 200
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "service": "hirehub-backend",
            "error": str(e)
        }), 500


@home_bp.route('/pingdb')
def ping_db():
    try:

        with db.session.connection() as conn:
            result = conn.execute(text("SELECT NOW();"))
            current_time = result.scalar_one()
        return jsonify({
            "status": "ok",
            "time": str(current_time)
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

