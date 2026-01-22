from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Blueprint, request, jsonify, send_file
import requests
import os
import json
from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from io import BytesIO
from bs4 import BeautifulSoup
import boto3
from datetime import datetime

resume_bp = Blueprint("resume_generation", __name__)

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
OPENAI_URL = "https://api.openai.com/v1/chat/completions"

# AWS S3 Configuration
AWS_ACCESS_KEY = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
AWS_S3_BUCKET = os.environ.get("S3_BUCKET_NAME")
AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")

s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=AWS_REGION
)


@resume_bp.route("/api/generate_resume", methods=["POST"])
def generate_resume_json():
    if not OPENAI_API_KEY:
        return jsonify({"error": "OPENAI_API_KEY not set"}), 500

    raw_data = request.get_json()
    if not raw_data:
        return jsonify({"error": "No form data provided"}), 400

    data = raw_data

    # SYSTEM PROMPT: JSON output only, improve wording & bullet points
    system_prompt = """
You are a professional resume JSON generator. You must output a JSON object ONLY in the following format:

{
  step1: {...},
  step2: {...},
  step3: {...},
  step4: { jobs: [...] },
  step5: { education: [...] },
  step6: { projects: [...] }
}

Rules:
1. Only include entries that have actual data.
2. For jobs and projects, if the description is missing or minimal, generate 2-4 professional, detailed bullet points.
3. Improve wording, grammar, and professionalism for all fields.
4. Do not output HTML or markdown. JSON only.
5. Ensure step3 fields are arrays. All other fields are strings/objects.
6. Do not add extra keys or metadata.
7. Output valid JSON.
"""

    user_prompt = f"""
Generate a professional resume JSON object using the following user data:

{json.dumps(data, indent=2)}
"""

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.5,
        "max_tokens": 1000
    }

    try:
        res = requests.post(OPENAI_URL, headers=headers, json=payload)
        res.raise_for_status()
        ai_data = res.json()

        # Extract JSON from AI output
        ai_text = ai_data.get("choices", [{}])[0].get("message", {}).get("content", "")
        if not ai_text:
            return jsonify({"error": "No resume text returned from AI", "details": ai_data}), 500

        # Parse AI JSON safely
        try:
            ai_json = json.loads(ai_text)
        except Exception as e:
            return jsonify({"error": "AI returned invalid JSON", "details": str(e), "raw": ai_text}), 500

        return jsonify({"message": "Resume JSON generated successfully", "resume_json": ai_json}), 200

    except Exception as e:
        return jsonify({"error": "Failed to generate resume JSON", "details": str(e)}), 500


@resume_bp.route("/api/generate-docx", methods=['POST'])
def generate_docx():
    """Convert resume HTML to DOCX format and download"""
    try:
        data = request.get_json()
        html_content = data.get('html', '')
        
        if not html_content:
            return jsonify({"error": "No HTML content provided"}), 400
        
        doc = html_to_docx(html_content)
        
        docx_io = BytesIO()
        doc.save(docx_io)
        docx_io.seek(0)
        
        return send_file(
            docx_io,
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            as_attachment=True,
            download_name='resume.docx'
        )
        
    except Exception as e:
        print(f"Error generating DOCX: {str(e)}")
        return jsonify({
            "error": "Failed to generate DOCX",
            "details": str(e)
        }), 500


@resume_bp.route("/api/save-resume-to-storage", methods=['POST'])
@jwt_required()
def save_resume_to_storage():
    """Save resume HTML directly to AWS S3"""
    try:
        if not all([AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_S3_BUCKET]):
            error_msg = "AWS configuration not set"
            print(f"Error: {error_msg}")
            return jsonify({"error": error_msg}), 500
        
        # data = request.get_json()
        file = request.files.get("file")
        # user_id = request.form.get("user_id")
        filename = request.form.get("filename", "resume.docx")

        if file is None:
            return jsonify({"error": "No file uploaded"}), 400


        # print(f"Request data keys: {data.keys() if data else 'None'}")
        
        # html_content = data.get('html', '')
        # user_id = data.get('user_id')
        # filename = data.get('filename', 'resume.docx')
        
        # print(f"HTML content length: {len(html_content)}")
        # print(f"User ID: {user_id}")
        # print(f"Filename: {filename}")
        
        # if not html_content:
        #     error_msg = "No HTML content provided"
        #     print(f"Error: {error_msg}")
        #     return jsonify({"error": error_msg}), 400
        
        # Get current user
        current_user_id = get_jwt_identity()
        from app.models.user import User
        user = User.query.get(current_user_id)

        if not user:
            error_msg = "User ID is required"
            print(f"Error: {error_msg}")
            return jsonify({"error": error_msg}), 400
        
        # print("Converting HTML to DOCX...")
        # doc = html_to_docx(html_content)
        
        # docx_io = BytesIO()
        # doc.save(docx_io)
        # docx_io.seek(0)
        # print(f"DOCX file size: {len(docx_io.getvalue())} bytes")

        # Get filename from the uploaded file
        filename = file.filename or "resume.doc"


        doc_bytes = file.read()
        print(f"DOCX file size: {len(doc_bytes)} bytes")
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        s3_key = f"resumes/{user}/{timestamp}_{filename}"
        print(f"S3 Key: {s3_key}")
        
        # Upload HTML directly to S3
        s3_client.put_object(
            Bucket=AWS_S3_BUCKET,
            Key=s3_key,
            Body = doc_bytes,
            # Body=docx_io.getvalue(),
            ContentType='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
        print("Successfully uploaded HTML to S3")
        
        from app.extensions import db
        from app.models.document import Document
        from app.models.user import User
        
        try:
            new_document = Document(
                user_email=user.email,
                file_path=s3_key,
                original_filename=filename,
                document_type='resume'
            )
            db.session.add(new_document)
            db.session.commit()
            print(f"Database record created for document ID: {new_document.document_id}")
            
        except Exception as db_error:
            db.session.rollback()
            print(f"Warning: Could not create database record: {str(db_error)}")
            import traceback
            traceback.print_exc()
        
        return jsonify({
            "message": "Resume saved to storage successfully",
            "s3_key": s3_key,
            "filename": filename
        }), 200
        
    except Exception as e:
        error_msg = f"Error saving resume to storage: {str(e)}"
        print(error_msg)
        import traceback
        traceback.print_exc()
        return jsonify({
            "error": "Failed to save resume to storage",
            "details": str(e)
        }), 500