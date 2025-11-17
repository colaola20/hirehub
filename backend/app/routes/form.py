from flask import Blueprint, request, jsonify
# from app.models.form import Form # currently not needed
from app.models.user import User
from app.models.skill import Skill
from app.models.profile import Profile
from flask_jwt_extended import jwt_required, get_jwt_identity

form_bp = Blueprint('form', __name__)


@form_bp.route('/api/form', methods=['GET'])
@jwt_required()
def get_resume_form():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    # getting skills from profile
    profile = Profile.query.filter_by(user_email=user.email).first()
    skills_list = []
    if profile:
        skills = Skill.query.filter_by(profile_id=profile.profile_id).all()
        skills_list = [skill.skill_name for skill in skills]

    data = {
        "step1": {
            "fullname": user.first_name + " " + user.last_name,
            "email": user.email,
            "phNum": "",
            "address": "",
            "city": "",
            "state": "",
            "zip": "",
            "summary": ""
        },
        "step2": {
            "linkedIn":"",
            "github": "",
            "portfolio": ""
        },
        "step3": {
            "skills": skills_list,
            "languages": [],
            "certifications": [],
            "interests": []
        },
        "step4":{
            "companies": "",
            "roles": "",
            "durations": "",
        },
        "step5":{
            "school": "",
            "degree": "",
            "gradYear": ""
        },
        "step6":{
            "projTitle":"",
            "projDesc":"",
            "projLink":""
        }
    }
    return jsonify(data), 200

#post
@form_bp.route('/api/form', methods=['POST'])
@jwt_required()
def submit_form():
    form_data = request.get_json()

    if not form_data:
        return jsonify({
            "error": "No form data provided"
        }), 400

    # result = generate_resume(form_data) #to be implemented

    return jsonify({
        "message": "Resume generated successfully", 
        "data": form_data}), 200