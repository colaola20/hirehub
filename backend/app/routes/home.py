from flask import Blueprint, jsonify

home_bp = Blueprint('home', __name__)

@home_bp.route('/')
def home():
    return jsonify({
        'message': 'Welcome to HireHub',
        'status': 'success',
        'version': '1.0.0'
    })