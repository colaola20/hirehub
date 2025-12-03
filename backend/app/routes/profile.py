from flask import Blueprint, request, jsonify, send_from_directory, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.profile import Profile
from app.models.skill import Skill
from app.models.user import User
from datetime import datetime
from werkzeug.utils import secure_filename
from app.models.recommended_job import RecommendedJob
from app.models.job import Job
from app.services.s3_service import s3_service
import os
import openai
import json

profile_bp = Blueprint('profile', __name__, url_prefix='/api/profile')


@profile_bp.route('', methods=['GET'])
@jwt_required()
def get_profile():
    """Get the current user's full profile including skills"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Get profile by user email
        profile = Profile.query.filter_by(user_email=user.email).first()

        # If no profile exists, return user data with empty profile fields
        if not profile:
            return jsonify({
                'user': user.to_dict(),
                'profile': {
                    'headline': None,
                    'education': None,
                    'experience': None,
                    'skills': [],
                    'profile_image': None,
                    'created_at': None,
                    'updated_at': None
                }
            }), 200

        # Get skills for this profile
        skills = Skill.query.filter_by(profile_id=profile.profile_id).all()
        skills_list = [skill.skill_name for skill in skills]

        # Generate signed URL for profile image if it exists
        profile_image_url = None
        if profile.profile_image:
            profile_image_url = s3_service.generate_signed_url(profile.profile_image, expiration=86400)  # 24 hours

        # Return combined user and profile data
        return jsonify({
            'user': user.to_dict(),
            'profile': {
                'profile_id': profile.profile_id,
                'headline': profile.headline,
                'education': profile.education,
                'experience': profile.experience,
                'skills': skills_list,
                'profile_image': profile_image_url,
                'created_at': profile.created_at.isoformat() if profile.created_at else None,
                'updated_at': profile.updated_at.isoformat() if profile.updated_at else None
            }
        }), 200

    except Exception as e:
        return jsonify({
            'error': 'Failed to retrieve profile',
            'message': str(e)
        }), 500


@profile_bp.route('', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update or create the current user's profile"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        data = request.get_json()

        # Validate input
        headline = data.get('headline')
        education = data.get('education')
        experience = data.get('experience')

        # Check field lengths
        if headline and len(headline) > 255:
            return jsonify({'error': 'Headline must be 255 characters or less'}), 400

        # Get or create profile
        profile = Profile.query.filter_by(user_email=user.email).first()

        if not profile:
            # Create new profile
            profile = Profile(
                user_email=user.email,
                headline=headline,
                education=education,
                experience=experience,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.session.add(profile)
        else:
            # Update existing profile
            if headline is not None:
                profile.headline = headline
            if education is not None:
                profile.education = education
            if experience is not None:
                profile.experience = experience
            profile.updated_at = datetime.utcnow()

        db.session.commit()

        # Get skills for response
        skills = Skill.query.filter_by(profile_id=profile.profile_id).all()
        skills_list = [skill.skill_name for skill in skills]

        # Generate signed URL for profile image if it exists
        profile_image_url = None
        if profile.profile_image:
            profile_image_url = s3_service.generate_signed_url(profile.profile_image, expiration=86400)  # 24 hours

        return jsonify({
            'message': 'Profile updated successfully',
            'profile': {
                'profile_id': profile.profile_id,
                'headline': profile.headline,
                'education': profile.education,
                'experience': profile.experience,
                'skills': skills_list,
                'profile_image': profile_image_url,
                'created_at': profile.created_at.isoformat() if profile.created_at else None,
                'updated_at': profile.updated_at.isoformat() if profile.updated_at else None
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Failed to update profile',
            'message': str(e)
        }), 500


@profile_bp.route('/image', methods=['POST'])
@jwt_required()
def upload_profile_image():
    """Upload a profile image to S3"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Check if file is in request
        if 'image' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['image']

        # Check if file was actually selected
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Get or create profile
        profile = Profile.query.filter_by(user_email=user.email).first()
        if not profile:
            profile = Profile(
                user_email=user.email,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.session.add(profile)
            db.session.flush()  # Get profile_id

        # Delete old image from S3 if exists
        if profile.profile_image:
            s3_service.delete_profile_image(profile.profile_image)

        # Upload to S3 (returns S3 key/filename)
        s3_key = s3_service.upload_profile_image(file, current_user_id)

        # Update profile with S3 key
        profile.profile_image = s3_key
        profile.updated_at = datetime.utcnow()
        db.session.commit()

        # Generate signed URL to return to frontend
        signed_url = s3_service.generate_signed_url(s3_key, expiration=86400)  # 24 hours

        return jsonify({
            'message': 'Profile image uploaded successfully',
            'profile_image': signed_url
        }), 200

    except ValueError as e:
        db.session.rollback()
        return jsonify({
            'error': str(e)
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Failed to upload image',
            'message': str(e)
        }), 500


# No longer needed - images are served directly from S3
# @profile_bp.route('/image/<filename>', methods=['GET'])
# def get_profile_image(filename):
#     """Serve profile images"""
#     try:
#         upload_path = os.path.join(
#             current_app.config['UPLOAD_FOLDER'],
#             'profile_images'
#         )
#         return send_from_directory(upload_path, filename)
#     except Exception as e:
#         return jsonify({
#             'error': 'Image not found',
#             'message': str(e)
#         }), 404




@profile_bp.route('/analyze', methods=['POST'])
@jwt_required()
def analyze_job_fit():
    import json
    from flask import request, jsonify
    import openai

    openai.api_key = current_app.config["OPENAI_API_KEY"]

    try:
       # Get current user and profile
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        profile = Profile.query.filter_by(user_email=user.email).first()
        if not profile:
            profile = Profile(
                user_email=user.email,
                headline="",
                education="",
                experience="",
                profile_image=None
            )
            db.session.add(profile)
            db.session.commit()

        # Pull skills from the skills table
        user_skills = [skill.skill_name for skill in profile.skills] if profile.skills else []

        # Pull experience from the profile
        user_experience = (profile.experience or "")[:400]

        # Get job info from request
        data = request.get_json()
        job = data.get("job", {})
        skills_extracted = job.get("skills_extracted", [])
        
       # ===========================
        #  OpenAI Model Options (2025)
        # ===========================

        # -- GPT-4.1 Series 
        # "gpt-4.1"        – ~ $2/M input, $8/M output – Deep reasoning, slower, expensive.
        # "gpt-4.1-mini"   – ~ $0.40/M input, $1.60/M output – Best balance of quality + cost.

        # -- GPT-4o Family 
        # "gpt-4o"         – ~ $0.50/M input, $1.50/M output – High performance, fast.
        # "gpt-4o-mini"    – ~ $0.20/M input, $0.80/M output – Very fast & cheap, great for backend calls.
        # "gpt-4o-audio-preview"   – Same pricing tier – Audio/voice optimized.
        # "gpt-4o-realtime-preview" – Same pricing – Low latency streaming model.

        # -- GPT-3.5 Turbo 
        # "gpt-3.5-turbo"  – ~ $0.50/M input, $1.50/M output – Very fast but weakest reasoning.

        # Recommended 
        #  "gpt-4o-mini"      – fast + cheap + accurate enough
        # "gpt-4.1-mini"     – if you need stronger reasoning

        # Make the OpenAI call
        completion = openai.chat.completions.create(
            model="gpt-4.1-mini", 
            messages=[
            {
                "role": "user",
                "content": f"""
            TASK:
            Match the USER to a JOB based ONLY on JOB_SKILLS.

            OUTPUT:
            Return ONLY this JSON:
            {{
            "percentage_match": number,
            "job_skills": [...],
            "matched_skills": [...]
            }}

            OBJECTIVE:
            - Flexible matching (python = python3 = python scripting, etc.)
            - Score = matched_job_skills / total_job_skills * 100
            - If job has 1 skill and user matches → 100%
            - If user matches 0 → % based on users experience
            - Extra user skills DO NOT increase score
            - Experience may boost score by up to +10% if highly relevant

            NOTES:
            USER_SKILLS = {user_skills}
            USER_EXPERIENCE = {user_experience}
            JOB_SKILLS = {skills_extracted}
            """
            }
            ]

            ,
            temperature= 0,
            max_completion_tokens= 300,
            response_format={"type": "json_object"}  # strict JSON response
        )

        raw_reply = completion.choices[0].message.content or ""
        raw_reply = raw_reply.strip()

        # Try to extract JSON safely
        try:
            response_data = json.loads(raw_reply)
        except json.JSONDecodeError:
            # fallback: remove text before/after JSON braces
            start = raw_reply.find('{')
            end = raw_reply.rfind('}') + 1
            response_data = json.loads(raw_reply[start:end]) if start >= 0 else {}

        # Default safe values if something went wrong
        return jsonify({
            "percentage_match": response_data.get("percentage_match", 0),
            "job_skills": response_data.get("job_skills", []),
            "matched_skills": response_data.get("matched_skills", [])
           
        })

    except Exception as e:
        print("❌ Error in /analyze:", e)
        return jsonify({"error": str(e)}), 500


@profile_bp.route('/generate_recommendations', methods=['POST'])
@jwt_required()
def generate_recommendations():
    import openai
    import json
    from datetime import datetime, timedelta, timezone

    openai.api_key = current_app.config["OPENAI_API_KEY"]

    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        profile = Profile.query.filter_by(user_email=user.email).first()
        if not profile:
            return jsonify({"error": "User profile not found"}), 400

        user_skills = [s.skill_name for s in profile.skills]
        user_experience = (profile.experience or "")[:400]

        now = datetime.now()

        # ----------------------------------------------------
        # Check newest recommendation age
        # ----------------------------------------------------
        latest_rec = RecommendedJob.query.filter_by(
            user_id=current_user_id
        ).order_by(RecommendedJob.created_at.desc()).first()

        should_generate = (
            latest_rec is None or
            (now - latest_rec.created_at) >= timedelta(days=7)
        )

        if not should_generate:
            print(">>> generate_recommendations: SKIPPED")
            return jsonify({"status": "ok", "skipped": True})

        # ----------------------------------------------------
        # Disable old active recommendations
        # ----------------------------------------------------
        RecommendedJob.query.filter_by(
            user_id=current_user_id,
            is_active=True
        ).update({"is_active": False, "expires_at": now})
        db.session.commit()

        # ----------------------------------------------------
        # Get all job_ids already recommended to avoid duplicates
        # ----------------------------------------------------
        existing_ids = {
            r.job_id for r in RecommendedJob.query.filter_by(
                user_id=current_user_id
            ).all()
        }

        # ----------------------------------------------------
        # Fetch random jobs & score them
        # ----------------------------------------------------
        jobs = Job.query.filter(Job.is_active == True).order_by(
            db.func.random()
        ).limit(50).all()

        recommended_list = []

        for job in jobs:
            if job.id in existing_ids:
                continue  # prevent unique constraint violation

            skills_extracted = job.skills_extracted or []

            gpt_prompt = f"""
            TASK:
            Match the USER to a JOB based ONLY on JOB_SKILLS.

            OUTPUT:
            Return ONLY this JSON:
            {{
            "percentage_match": number,
            "job_skills": [...],
            "matched_skills": [...]
            }}

            OBJECTIVE:
            - Flexible matching (python = python3 = python scripting)
            - Score = matched_job_skills / total_job_skills * 100
            - User experience can increase score +10% max

            USER_SKILLS = {user_skills}
            USER_EXPERIENCE = {user_experience}
            JOB_SKILLS = {skills_extracted}
            """

            completion = openai.chat.completions.create(
                model="gpt-4.1-mini",
                messages=[{"role": "user", "content": gpt_prompt}],
                temperature=0,
                max_completion_tokens=400,
                response_format={"type": "json_object"}
            )

            raw_reply = completion.choices[0].message.content.strip()
            try:
                match = json.loads(raw_reply)
            except json.JSONDecodeError:
                start = raw_reply.find('{')
                end = raw_reply.rfind('}') + 1
                match = json.loads(raw_reply[start:end])

            score = match.get("percentage_match", 0)

            if score >= 85:
                recommended_list.append((job, score))

            if len(recommended_list) == 20:
                break

        # ----------------------------------------------------
        # Insert new recommendations safely
        # ----------------------------------------------------
        for job, score in recommended_list:
            new_rec = RecommendedJob(
                user_id=current_user_id,
                job_id=job.id,
                match_score=score,
                created_at=now,
                expires_at=now + timedelta(days=7),
                is_active=True,
                matched_skills=match.get("matched_skills", [])
            )
            db.session.add(new_rec)

        db.session.commit()
        
        print(">>> generate_recommendations: GENERATED")
        return jsonify({"status": "ok", "generated": True})

    except Exception as e:
        print("❌ Recommendation Error:", e)
        return jsonify({"error": str(e)}), 500

    

@profile_bp.route('/recommendations', methods=['GET'])
@jwt_required()
def get_recommendations():
    current_user_id = int(get_jwt_identity())

    # Load ACTIVE recommendations only
    active_recs = (
        RecommendedJob.query
        .filter_by(user_id=current_user_id, is_active=True)
        .order_by(RecommendedJob.match_score.desc())
        .all()
    )

    # Serialize to dicts with nested job
    recommendations = [rec.to_dict() for rec in active_recs]

    return jsonify({
        "status": "fresh",
        "message": "Recommendations recently generated. Using cached results.",
        "recommended_jobs_count": len(recommendations),
        "recommendations": recommendations,
    })
