from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.document import Document
from app.models.user import User
import os
import logging
import jwt
import time
import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)

onlyoffice_bp = Blueprint('onlyoffice', __name__)

# S3 Configuration
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION')
)

BUCKET_NAME = os.getenv('S3_BUCKET_NAME')
ONLYOFFICE_JWT_SECRET = os.getenv('ONLYOFFICE_JWT_SECRET', 'local-dev-secret-change-in-production-min32chars')
ONLYOFFICE_SERVER_URL = os.getenv('ONLYOFFICE_DOCUMENT_SERVER_URL', 'http://localhost/onlyoffice')
ONLYOFFICE_CALLBACK_URL = os.getenv('ONLYOFFICE_CALLBACK_URL', 'http://backend:5001/api/onlyoffice/callback')


def get_document_type(filename):
    """Determine OnlyOffice document type based on file extension."""
    extension = filename.rsplit('.', 1)[-1].lower() if '.' in filename else ''

    word_extensions = ['doc', 'docx', 'docm', 'dot', 'dotx', 'dotm', 'odt', 'fodt', 'ott', 'rtf', 'txt']
    cell_extensions = ['xls', 'xlsx', 'xlsm', 'xlt', 'xltx', 'xltm', 'ods', 'fods', 'ots', 'csv']
    slide_extensions = ['ppt', 'pptx', 'pptm', 'pot', 'potx', 'potm', 'odp', 'fodp', 'otp']

    if extension in word_extensions:
        return 'word'
    elif extension in cell_extensions:
        return 'cell'
    elif extension in slide_extensions:
        return 'slide'
    else:
        return 'word'  # default


def generate_jwt_token(payload):
    """Generate JWT token for OnlyOffice."""
    return jwt.encode(payload, ONLYOFFICE_JWT_SECRET, algorithm='HS256')


@onlyoffice_bp.route('/api/onlyoffice/config/<int:document_id>', methods=['GET'])
@jwt_required()
def get_editor_config(document_id):
    """
    Generate OnlyOffice editor configuration for a document.
    This endpoint is called by the frontend to get the config needed to initialize the editor.
    """
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Get the document
        document = Document.query.get(document_id)

        if not document:
            return jsonify({'error': 'Document not found'}), 404

        # Verify ownership
        if document.user_email != user.email:
            return jsonify({'error': 'Unauthorized'}), 403

        # Generate presigned URL for OnlyOffice to download the document
        try:
            download_url = s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': BUCKET_NAME,
                    'Key': document.file_path
                },
                ExpiresIn=3600  # 1 hour
            )
        except ClientError as e:
            logger.error(f"Failed to generate presigned URL: {e}")
            return jsonify({'error': 'Failed to generate document URL'}), 500

        # Determine document type
        doc_type = get_document_type(document.original_filename)

        # Create unique document key (changes when document is updated)
        # OnlyOffice uses this to determine if document has changed
        document_key = f"{document.document_id}_{int(document.updated_at.timestamp())}"

        # Build editor configuration
        config = {
            "documentType": doc_type,
            "document": {
                "fileType": document.original_filename.rsplit('.', 1)[-1].lower() if '.' in document.original_filename else 'docx',
                "key": document_key,
                "title": document.original_filename,
                "url": download_url,
                "permissions": {
                    "edit": True,
                    "download": True,
                    "print": True,
                    "review": True,
                    "comment": True
                }
            },
            "editorConfig": {
                "mode": "edit",
                "callbackUrl": f"{ONLYOFFICE_CALLBACK_URL}/{document_id}",
                "user": {
                    "id": str(user.id),
                    "name": user.name or user.email.split('@')[0]
                },
                "customization": {
                    "autosave": True,
                    "forcesave": True,
                    "comments": True,
                    "hideRightMenu": False
                }
            }
        }

        # Generate JWT token for the config
        token = generate_jwt_token(config)

        return jsonify({
            'config': config,
            'token': token,
            'documentServerUrl': ONLYOFFICE_SERVER_URL
        }), 200

    except Exception as e:
        logger.exception("Failed to generate editor config")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500


@onlyoffice_bp.route('/api/onlyoffice/callback/<int:document_id>', methods=['POST'])
def onlyoffice_callback(document_id):
    """
    Callback endpoint for OnlyOffice Document Server.
    OnlyOffice calls this when documents are saved/edited.

    Status codes:
    - 0: Document opened for editing
    - 1: Document being edited
    - 2: Document ready for saving
    - 3: Document save error
    - 4: Document closed with no changes
    - 6: Document being edited (force save requested)
    - 7: Error during force save
    """
    try:
        data = request.json
        logger.info(f"OnlyOffice callback for document {document_id}: {data}")

        status = data.get('status')
        download_url = data.get('url')

        # Status 2: Document ready for saving
        # Status 6: Force save requested
        if status in [2, 6]:
            if not download_url:
                logger.error("No download URL provided in callback")
                return jsonify({'error': 0}), 200  # Return 0 to indicate error to OnlyOffice

            # Get the document
            document = Document.query.get(document_id)
            if not document:
                logger.error(f"Document {document_id} not found")
                return jsonify({'error': 0}), 200

            try:
                # Download the edited document from OnlyOffice
                import requests
                response = requests.get(download_url, timeout=30)
                response.raise_for_status()

                # Upload the updated document back to S3
                s3_client.put_object(
                    Bucket=BUCKET_NAME,
                    Key=document.file_path,
                    Body=response.content,
                    ContentType=response.headers.get('Content-Type', 'application/octet-stream')
                )

                # Update document timestamp
                from datetime import datetime
                from app.extensions import db
                document.updated_at = datetime.utcnow()
                db.session.commit()

                logger.info(f"Document {document_id} saved successfully")

                # Return success to OnlyOffice
                return jsonify({'error': 0}), 200

            except requests.exceptions.RequestException as e:
                logger.error(f"Failed to download document from OnlyOffice: {e}")
                return jsonify({'error': 1}), 200

            except ClientError as e:
                logger.error(f"Failed to upload to S3: {e}")
                return jsonify({'error': 1}), 200

            except Exception as e:
                logger.error(f"Unexpected error saving document: {e}")
                return jsonify({'error': 1}), 200

        # For other statuses, just acknowledge
        return jsonify({'error': 0}), 200

    except Exception as e:
        logger.exception("Error in OnlyOffice callback")
        return jsonify({'error': 1}), 200
