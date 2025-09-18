from flask import Blueprint, jsonify
from app import db 

home_bp = Blueprint('home', __name__)

@home_bp.route('/')
def home():
    return jsonify({
        'message': 'Welcome to HireHub',
        'status': 'success',
        'version': '1.0.0'
    })


@home_bp.route('/pingdb')
def ping_db():
    try:
        result = db.session.execute("SELECT NOW();")
        current_time = result.scalar()
        return jsonify({
            "status": "ok",
            "time": str(current_time)
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

