import boto3
from botocore.exceptions import ClientError
from flask import current_app
from werkzeug.utils import secure_filename
import os
from datetime import datetime


class S3Service:
    """Service for handling AWS S3 file uploads"""

    def __init__(self):
        self.s3_client = None
        self.bucket_name = None

    def _get_s3_client(self):
        """Get or create S3 client"""
        if self.s3_client is None:
            self.s3_client = boto3.client(
                's3',
                aws_access_key_id=current_app.config['AWS_ACCESS_KEY_ID'],
                aws_secret_access_key=current_app.config['AWS_SECRET_ACCESS_KEY'],
                region_name=current_app.config['AWS_REGION']
            )
            self.bucket_name = current_app.config['AWS_S3_BUCKET']
        return self.s3_client

    def upload_profile_image(self, file, user_id):
        """
        Upload profile image to S3

        Args:
            file: FileStorage object from request.files
            user_id: User ID for generating unique filename

        Returns:
            str: S3 key (filename) of uploaded file

        Raises:
            ValueError: If file type is not allowed
            Exception: If upload fails
        """
        if not file:
            raise ValueError("No file provided")

        # Validate file extension
        if not self._allowed_file(file.filename):
            raise ValueError("Invalid file type. Only PNG, JPG, and JPEG are allowed")

        # Generate unique filename
        file_ext = secure_filename(file.filename).rsplit('.', 1)[1].lower()
        filename = f"profile_images/{user_id}_{int(datetime.utcnow().timestamp())}.{file_ext}"

        try:
            s3_client = self._get_s3_client()

            # Upload file to S3
            s3_client.upload_fileobj(
                file,
                self.bucket_name,
                filename,
                ExtraArgs={
                    'ContentType': file.content_type
                }
            )

            # Return the S3 key (we'll generate signed URLs when needed)
            return filename

        except ClientError as e:
            current_app.logger.error(f"S3 upload failed: {str(e)}")
            raise Exception(f"Failed to upload file to S3: {str(e)}")

    def generate_signed_url(self, s3_key, expiration=3600):
        """
        Generate a signed URL for an S3 object

        Args:
            s3_key: S3 key (filename) of the object
            expiration: URL expiration time in seconds (default: 1 hour)

        Returns:
            str: Signed URL for the object
        """
        if not s3_key:
            return None

        try:
            s3_client = self._get_s3_client()

            signed_url = s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': s3_key
                },
                ExpiresIn=expiration
            )

            return signed_url

        except ClientError as e:
            current_app.logger.error(f"Failed to generate signed URL: {str(e)}")
            return None

    def delete_profile_image(self, s3_key):
        """
        Delete profile image from S3

        Args:
            s3_key: S3 key (filename) of the file to delete
        """
        if not s3_key:
            return

        try:
            s3_client = self._get_s3_client()
            s3_client.delete_object(Bucket=self.bucket_name, Key=s3_key)

        except ClientError as e:
            current_app.logger.error(f"S3 delete failed: {str(e)}")
            # Don't raise exception for delete failures

    def _allowed_file(self, filename):
        """Check if file extension is allowed"""
        allowed_extensions = current_app.config.get('ALLOWED_EXTENSIONS', {'png', 'jpg', 'jpeg'})
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions


# Create singleton instance
s3_service = S3Service()
