import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from app.services.database import DatabaseService
from app.models.user import User
from app.models.document import Document
from app.models.resume import Resume
from app.models.cover_letter import CoverLetter

app = create_app()


def test_document_model():
    """Test the Document model functionality."""
    with app.app_context():
        print("Testing Document Model...")

        # Create test user first
        print("\n1. Creating test user...")
        try:
            test_user = User(
                username="doctest_user",
                email="doctest@example.com",
                first_name="Doc",
                last_name="Test"
            )
            test_user.set_password("password123")
            created_user = DatabaseService.create(test_user)
            print(f"✓ Test user created: {created_user.email}")
        except Exception as e:
            print(f"✗ Error creating test user: {e}")
            return

        # Test creating a Resume (child of Document)
        print("\n2. Testing Resume creation (Document child)...")
        try:
            test_resume = Resume(
                user_email=created_user.email,
                file_path="/path/to/resume.pdf",
                title="Software Engineer Resume"
            )
            created_resume = DatabaseService.create(test_resume)
            print(f"✓ Resume created: ID={created_resume.resume_id}, Type={created_resume.document_type}")
        except Exception as e:
            print(f"✗ Error creating resume: {e}")
            created_resume = None

        # Test creating a CoverLetter (child of Document)
        print("\n3. Testing CoverLetter creation (Document child)...")
        try:
            # First need to create a job (assuming job model exists)
            test_cover_letter = CoverLetter(
                user_email=created_user.email,
                file_path="/path/to/cover_letter.pdf",
                job_id=1  # Assuming job with ID 1 exists
            )
            created_cover_letter = DatabaseService.create(test_cover_letter)
            print(f"✓ CoverLetter created: ID={created_cover_letter.cover_letter_id}, Type={created_cover_letter.document_type}")
        except Exception as e:
            print(f"✗ Error creating cover letter: {e}")
            created_cover_letter = None

        # Test querying all documents (polymorphic query)
        print("\n4. Testing polymorphic query for all documents...")
        try:
            all_docs = DatabaseService.filter_by(Document, user_email=created_user.email)
            print(f"✓ Found {len(all_docs)} documents for user")
            for doc in all_docs:
                print(f"   - Document ID: {doc.document_id}, Type: {doc.document_type}")
        except Exception as e:
            print(f"✗ Error querying documents: {e}")

        # Test filtering by document type
        print("\n5. Testing filter by Resume type...")
        try:
            resumes = DatabaseService.filter_by(Resume, user_email=created_user.email)
            print(f"✓ Found {len(resumes)} resumes for user")
        except Exception as e:
            print(f"✗ Error querying resumes: {e}")

        # Test to_dict method
        print("\n6. Testing to_dict method...")
        try:
            if created_resume:
                resume_dict = created_resume.to_dict()
                print(f"✓ Resume dict: {resume_dict}")
            if created_cover_letter:
                cl_dict = created_cover_letter.to_dict()
                print(f"✓ CoverLetter dict: {cl_dict}")
        except Exception as e:
            print(f"✗ Error converting to dict: {e}")

        # Clean up - delete test documents and user
        print("\n7. Cleaning up test data...")
        try:
            if created_resume:
                DatabaseService.delete(created_resume)
                print("✓ Test resume deleted")
            if created_cover_letter:
                DatabaseService.delete(created_cover_letter)
                print("✓ Test cover letter deleted")
            DatabaseService.delete(created_user)
            print("✓ Test user deleted")
        except Exception as e:
            print(f"✗ Error cleaning up: {e}")


if __name__ == "__main__":
    test_document_model()
