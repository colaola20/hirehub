from flask import Blueprint, request, jsonify
from app.models.form import Form
from app.models.user import User
from flask_jwt_extended import jwt_required, get_jwt_identity

form_bp = Blueprint('form', __name__, url_prefix='/api/forms')

@form_bp.route('/', methods=['GET'])
@jwt_required()

def get_resume_form():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    

    data = {
        "step1": {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "phone": user.phone,
            "summary": user.summary
        },
        "step2": {
            "linkedIn": user.linkedin,
            "github": user.github,
            "portfolio": user.portfolio
        },
        "step3": {
            "skills": user.skills,
            "languages": user.languages,
            "certifications": user.certifications,
            "hobbies": user.hobbies
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
    @form.bp.route('/', methods=['POST'])
    @jwt_required()

    def submit_form():
        form_data = request.get_json()

        result = generate_resume(form_data)

        return jsonify({"message": "Resume generated successfully", "resume": result}), 200