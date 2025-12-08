from flask import Blueprint, request, jsonify
# from app.models.form import Form # currently not needed
from app.extensions import db
from app.models.user import User
from app.models.skill import Skill
from app.models.profile import Profile
from app.models.form import ResumeForm
from flask_jwt_extended import jwt_required, get_jwt_identity

form_bp = Blueprint('form', __name__)


@form_bp.route('/api/form', methods=['GET'])
@jwt_required()
def get_resume_form():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404


    # fetch existing form if it can
    resume_form = ResumeForm.query.filter_by(user_id=current_user_id).first()

    if resume_form:
        return jsonify(resume_form.to_dict()), 200

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
        "step4": {
            "jobs": [
                {
                    "company": "",
                    "role": "",
                    "roleTime": ""
                }
            ]
        },
        "step5":{
            "education": [
                {
                    "school": "",
                    "degree": "",
                    "gradYear": ""
                }
            ]
        },
        "step6":{
            "projects": [
                {
                    "projTitle": "",
                    "projDesc": "",
                    "projLink": ""
                }
            ]
        }
    }
    return jsonify(data), 200

#post
@form_bp.route('/api/form', methods=['POST'])
@jwt_required()
def submit_form():
    current_user_id = int(get_jwt_identity())
    form_data = request.get_json()

    if not form_data:
        return jsonify({
            "error": "No form data provided"
        }), 400



    # update table
    resume_form = ResumeForm.query.filter_by(user_id=current_user_id).first()

    if resume_form:
        resume_form.personalInfo = form_data.get("step1")
        resume_form.socialInfo = form_data.get("step2")
        resume_form.miscInfo = form_data.get("step3")
        resume_form.jobHistory = form_data.get("step4")
        resume_form.edHistory = form_data.get("step5")
        resume_form.projInfo = form_data.get("step6")

    # or create
    else: 
        resume_form = ResumeForm(
            user_id = current_user_id,
            personalInfo = form_data.get("step1"),
            socialInfo = form_data.get("step2"),
            miscInfo = form_data.get("step3"),
            jobHistory = form_data.get("step4"),
            edHistory = form_data.get("step5"),
            projInfo = form_data.get("step6")
        )
        db.session.add(resume_form)

    db.session.commit()

    # result = generate_resume(form_data) #to be implemented

    return jsonify({
        "message": "Resume generated successfully", 
        "data": form_data}), 200