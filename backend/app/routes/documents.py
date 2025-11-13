from flask import Blueprint, jsonify, request
from app.services.database import DatabaseService
from app.models.document import Document
from app.models.resume import Resume
from app.models.cover_letter import CoverLetter
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import logging

# from groq import Groq

# groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))


logger = logging.getLogger(__name__)

# Guarded / lazy GROQ client initialization: only create client when API key is present.
groq_client = None
try:
    from groq import Groq
    groq_api_key = os.environ.get("GROQ_API_KEY")
    if groq_api_key:
        try:
            groq_client = Groq(api_key=groq_api_key)
        except Exception as exc:
            logger.warning("Failed to initialize Groq client: %s", exc)
            groq_client = None
    else:
        logger.info("GROQ_API_KEY not set; GROQ features disabled")
except Exception as exc:
    logger.warning("groq import failed or unavailable, GROQ features disabled: %s", exc)
    groq_client = None

documents_bp = Blueprint('documents', __name__)


# ------------------------
# Get all documents for signed-in user
# ------------------------
@documents_bp.route('/api/documents', methods=['GET'])
@jwt_required()
def get_user_documents():
    """Get all documents (resumes and cover letters) for the authenticated user."""
    try:
        current_user_id = int(get_jwt_identity())

        # Get user's email from user ID
        from app.models.user import User
        user = DatabaseService.get_by_id(User, current_user_id)
        if not user:
            return jsonify({'status': 'error', 'message': 'User not found'}), 404

        # Get all documents for this user
        documents = DatabaseService.filter_by(Document, user_email=user.email)

        documents_data = [doc.to_dict() for doc in documents]

        return jsonify({
            'status': 'success',
            'message': f'Retrieved {len(documents)} documents',
            'data': documents_data,
            'count': len(documents)
        }), 200

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': 'Failed to retrieve documents',
            'error': str(e)
        }), 500


# ------------------------
# Get all resumes for signed-in user
# ------------------------
@documents_bp.route('/api/documents/resumes', methods=['GET'])
@jwt_required()
def get_user_resumes():
    """Get all resumes for the authenticated user."""
    try:
        current_user_id = int(get_jwt_identity())

        # Get user's email from user ID
        from app.models.user import User
        user = DatabaseService.get_by_id(User, current_user_id)
        if not user:
            return jsonify({'status': 'error', 'message': 'User not found'}), 404

        # Get all resumes for this user
        resumes = DatabaseService.filter_by(Resume, user_email=user.email)

        resumes_data = [resume.to_dict() for resume in resumes]

        return jsonify({
            'status': 'success',
            'message': f'Retrieved {len(resumes)} resumes',
            'data': resumes_data,
            'count': len(resumes)
        }), 200

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': 'Failed to retrieve resumes',
            'error': str(e)
        }), 500


# ------------------------
# Get all cover letters for signed-in user
# ------------------------
@documents_bp.route('/api/documents/cover-letters', methods=['GET'])
@jwt_required()
def get_user_cover_letters():
    """Get all cover letters for the authenticated user."""
    try:
        current_user_id = int(get_jwt_identity())

        # Get user's email from user ID
        from app.models.user import User
        user = DatabaseService.get_by_id(User, current_user_id)
        if not user:
            return jsonify({'status': 'error', 'message': 'User not found'}), 404

        # Get all cover letters for this user
        cover_letters = DatabaseService.filter_by(CoverLetter, user_email=user.email)

        cover_letters_data = [cl.to_dict() for cl in cover_letters]

        return jsonify({
            'status': 'success',
            'message': f'Retrieved {len(cover_letters)} cover letters',
            'data': cover_letters_data,
            'count': len(cover_letters)
        }), 200

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': 'Failed to retrieve cover letters',
            'error': str(e)
        }), 500


# ------------------------
# Get specific document by ID
# ------------------------
@documents_bp.route('/api/documents/<int:document_id>', methods=['GET'])
@jwt_required()
def get_document(document_id):
    """Get a specific document by ID for the authenticated user."""
    try:
        current_user_id = int(get_jwt_identity())

        # Get user's email from user ID
        from app.models.user import User
        user = DatabaseService.get_by_id(User, current_user_id)
        if not user:
            return jsonify({'status': 'error', 'message': 'User not found'}), 404

        # Get the document
        document = DatabaseService.get_by_id(Document, document_id)

        if not document:
            return jsonify({'status': 'error', 'message': 'Document not found'}), 404

        # Verify document belongs to the authenticated user
        if document.user_email != user.email:
            return jsonify({'status': 'error', 'message': 'Unauthorized access'}), 403

        return jsonify({
            'status': 'success',
            'message': 'Document retrieved successfully',
            'data': document.to_dict()
        }), 200

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': 'Failed to retrieve document',
            'error': str(e)
        }), 500


# ------------------------
# Delete document by ID
# ------------------------
@documents_bp.route('/api/documents/<int:document_id>', methods=['DELETE'])
@jwt_required()
def delete_document(document_id):
    """Delete a specific document by ID for the authenticated user."""
    try:
        current_user_id = int(get_jwt_identity())

        # Get user's email from user ID
        from app.models.user import User
        user = DatabaseService.get_by_id(User, current_user_id)
        if not user:
            return jsonify({'status': 'error', 'message': 'User not found'}), 404

        # Get the document
        document = DatabaseService.get_by_id(Document, document_id)

        if not document:
            return jsonify({'status': 'error', 'message': 'Document not found'}), 404

        # Verify document belongs to the authenticated user
        if document.user_email != user.email:
            return jsonify({'status': 'error', 'message': 'Unauthorized access'}), 403

        # Delete the document
        DatabaseService.delete(document)

        return jsonify({
            'status': 'success',
            'message': 'Document deleted successfully'
        }), 200

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': 'Failed to delete document',
            'error': str(e)
        }), 500
    

# ------------------------
# Generates cover letter
# ------------------------
@documents_bp.route("/api/generate/cover-letter", methods=["POST"])
@jwt_required()
def generate_cover_letter():
    body = request.get_json(silent=True) or {}
    job_description = body.get("job_description")
    resume_text = body.get("resume_text")

    if not isinstance(job_description, str) or not isinstance(resume_text, str):
        return jsonify({"status": "error", "message": "job_description and resume_text are required strings"}), 400

    prompt = f"""
        Using the resume below, write a personalized cover letter that fits this job.

        RESUME:
        {resume_text}

        JOB DESCRIPTION:
        {job_description}
    """

    try:
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
    except Exception as exc:
        return jsonify({"status": "error", "message": "LLM request failed", "error": str(exc)}), 502
    

    return jsonify({"cover_letter": response.choices[0].message.content})