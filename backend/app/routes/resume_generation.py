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


@resume_bp.route("/api/generate_resume", methods=['POST'])
def generate_resume():
    if not OPENAI_API_KEY:
        return jsonify({"error": "OPENAI_API_KEY not set"}), 500

    form_data = request.get_json()
    if not form_data:
        return jsonify({"error": "No form data provided"}), 400

    # -------------------------------------------------------------
    # SYSTEM PROMPT (OpenAI will generate ALL styling + HTML)
    # -------------------------------------------------------------
    system_prompt = """
    You are an expert resume generator and professional designer.

    Your task:
    - Generate a complete, visually modern, professionally styled resume in clean HTML.
    - Include a <style> section with elegant, polished, modern CSS.
    - DO NOT output backticks of any kind.
    - DO NOT wrap the HTML in ```html or any code block.
    - Your response must be PURE HTML.

    Design requirements:
    - Use a centered container with soft shadows, rounded corners, and generous spacing.
    - Use a beautiful, readable Google-style font (e.g., Inter, Roboto, Lato, etc.).
    - Use clear section headers with accent colors and horizontal dividers.
    - Use good spacing, padding, and alignment.
    - Use subtle blue accent lines for section separators.
    - Use bold headings, structured grids, and clean whitespace.
    - Ensure everything fits a one-page resume layout.

    Content requirements:
    - Rewrite job descriptions into 2–3 impactful bullet points showing measurable outcomes.
    - Rewrite projects into 1–2 polished sentences explaining purpose, impact, and technology.
    - Present Skills and Languages in clean tag-like boxes or comma-separated lists.
    - Format Education cleanly with degree, school, year, and details.
    - Include sections ONLY if data is provided.
    - Improve clarity and professionalism of all user text.

    Output:
    - Return ONLY the final HTML document with <html>, <head>, <style>, and <body>.
    - NO explanations.
    - NO markdown.
    - NO backticks.
    """


    # -------------------------------------------------------------
    # USER PROMPT – sends the raw JSON
    # -------------------------------------------------------------
    user_prompt = f"""
    Here is the JSON resume data you must use:

    {json.dumps(form_data, indent=2)}

    Generate a more detailed, polished, professionally written resume.
    Enhance all descriptions using strong action verbs and quantifiable impact.

    Return ONLY valid HTML.
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
        "max_tokens": 1500,
        "stream": False
    }

    try:
        res = requests.post(OPENAI_URL, headers=headers, json=payload)
        res.raise_for_status()
        data = res.json()

        ai_text = data.get("choices", [{}])[0].get("message", {}).get("content", "")

        if not ai_text:
            return jsonify({
                "error": "No resume text returned from AI",
                "details": data
            }), 500

        return jsonify({
            "message": "Resume generated successfully",
            "resume_text": ai_text
        }), 200

    except Exception as e:
        return jsonify({
            "error": "Failed to generate resume",
            "details": str(e)
        }), 500


def html_to_docx(html_content):
    """Convert resume HTML to DOCX document"""
    doc = Document()
    
    # Parse the HTML
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Process HTML elements and convert to DOCX
    for element in soup.find_all(['h1', 'h2', 'h3', 'p', 'ul', 'li', 'strong', 'a']):
        if element.name == 'h1':
            p = doc.add_paragraph()
            p.style = 'Heading 1'
            p.text = element.get_text(strip=True)
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            
        elif element.name == 'h2':
            p = doc.add_paragraph()
            p.style = 'Heading 2'
            p.text = element.get_text(strip=True)
            
        elif element.name == 'h3':
            p = doc.add_paragraph()
            p.style = 'Heading 3'
            p.text = element.get_text(strip=True)
            
        elif element.name == 'p':
            text = element.get_text(strip=True)
            if text:
                p = doc.add_paragraph(text)
                
        elif element.name == 'li':
            text = element.get_text(strip=True)
            if text:
                doc.add_paragraph(text, style='List Bullet')
                
        elif element.name == 'ul':
            for li in element.find_all('li', recursive=False):
                text = li.get_text(strip=True)
                if text:
                    doc.add_paragraph(text, style='List Bullet')
    
    return doc


@resume_bp.route("/api/generate-docx", methods=['POST'])
def generate_docx():
    """Convert resume HTML to DOCX format and download"""
    try:
        data = request.get_json()
        html_content = data.get('html', '')
        
        if not html_content:
            return jsonify({"error": "No HTML content provided"}), 400
        
        # Convert HTML to DOCX
        doc = html_to_docx(html_content)
        
        # Save DOCX to BytesIO
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
    """Convert resume HTML to DOCX and save to AWS S3"""
    try:
        print("=== Starting save-resume-to-storage ===")
        print(f"AWS_ACCESS_KEY set: {bool(AWS_ACCESS_KEY)}")
        print(f"AWS_SECRET_KEY set: {bool(AWS_SECRET_KEY)}")
        print(f"AWS_S3_BUCKET: {AWS_S3_BUCKET}")
        
        if not all([AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_S3_BUCKET]):
            error_msg = "AWS configuration not set"
            print(f"Error: {error_msg}")
            return jsonify({"error": error_msg}), 500
        
        data = request.get_json()
        print(f"Request data keys: {data.keys() if data else 'None'}")
        
        html_content = data.get('html', '')
        user_id = data.get('user_id')
        filename = data.get('filename', 'resume.docx')
        
        print(f"HTML content length: {len(html_content)}")
        print(f"User ID: {user_id}")
        print(f"Filename: {filename}")
        
        if not html_content:
            error_msg = "No HTML content provided"
            print(f"Error: {error_msg}")
            return jsonify({"error": error_msg}), 400
        
        if not user_id:
            error_msg = "User ID is required"
            print(f"Error: {error_msg}")
            return jsonify({"error": error_msg}), 400
        
        # Convert HTML to DOCX
        print("Converting HTML to DOCX...")
        doc = html_to_docx(html_content)
        
        # Save to BytesIO
        docx_io = BytesIO()
        doc.save(docx_io)
        docx_io.seek(0)
        print(f"DOCX file size: {len(docx_io.getvalue())} bytes")
        
        # Generate S3 key with user_id and timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        s3_key = f"resumes/{user_id}/{timestamp}_{filename}"
        print(f"S3 Key: {s3_key}")
        
        # Upload to S3
        print("Uploading to S3...")
        s3_client.put_object(
            Bucket=AWS_S3_BUCKET,
            Key=s3_key,
            Body=docx_io.getvalue(),
            ContentType='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
        print("Successfully uploaded to S3")
        
        # Import here to avoid circular imports
        from flask_jwt_extended import get_jwt_identity
        from app.extensions import db
        from app.models.document import Document
        from app.models.user import User
        
        try:
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            
            if not user:
                print(f"Warning: User not found for ID: {current_user_id}")
                return jsonify({
                    "message": "Resume saved to S3 but could not link to user account",
                    "s3_key": s3_key,
                    "filename": filename
                }), 200
            
            # Create database record for the uploaded resume
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
            # Don't fail the S3 upload if database insert fails
        
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