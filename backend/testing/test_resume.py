import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from app.services.database import DatabaseService
from app.models.user import User
from app.models.resume import Resume

app = create_app()


def test_resume_model():
    """Test the Resume model functionality."""
    with app.app_context():
        print("Testing Resume Model...")

        # Create test user first
        print("\n1. Creating test user...")
        try:
            test_user = User(
                username="resumetest_user",
                email="resumetest@example.com",
                first_name="Resume",
                last_name="Test"
            )
            test_user.set_password("password123")
            created_user = DatabaseService.create(test_user)
            print(f"✓ Test user created: {created_user.email}")
        except Exception as e:
            print(f"✗ Error creating test user: {e}")
            return

        # Test creating a resume
        print("\n2. Testing resume creation...")
        try:
            test_resume = Resume(
                user_email=created_user.email,
                file_path="/documents/resumes/software_engineer.pdf",
                title="Senior Software Engineer"
            )
            created_resume = DatabaseService.create(test_resume)
            print(f"✓ Resume created: {created_resume.resume_id} - {created_resume.title}")
        except Exception as e:
            print(f"✗ Error creating resume: {e}")
            created_resume = None
            DatabaseService.delete(created_user)
            return

        # Test getting resume by ID
        print("\n3. Testing get resume by ID...")
        try:
            retrieved_resume = DatabaseService.get_by_id(Resume, created_resume.resume_id)
            if retrieved_resume:
                print(f"✓ Resume retrieved: {retrieved_resume.title}")
            else:
                print("✗ Resume not found")
        except Exception as e:
            print(f"✗ Error retrieving resume: {e}")

        # Test updating resume
        print("\n4. Testing resume update...")
        try:
            updated_resume = DatabaseService.update(created_resume, title="Lead Software Engineer")
            print(f"✓ Resume updated: {updated_resume.title}")
        except Exception as e:
            print(f"✗ Error updating resume: {e}")

        # Test filtering resumes by user
        print("\n5. Testing filter resumes by user email...")
        try:
            user_resumes = DatabaseService.filter_by(Resume, user_email=created_user.email)
            print(f"✓ Found {len(user_resumes)} resume(s) for user")
            for resume in user_resumes:
                print(f"   - {resume.title}")
        except Exception as e:
            print(f"✗ Error filtering resumes: {e}")

        # Test resume inheritance from Document
        print("\n6. Testing Resume inherits Document properties...")
        try:
            print(f"✓ Resume has document_id: {created_resume.document_id}")
            print(f"✓ Resume has document_type: {created_resume.document_type}")
            print(f"✓ Resume has file_path: {created_resume.file_path}")
            print(f"✓ Resume has created_at: {created_resume.created_at}")
        except Exception as e:
            print(f"✗ Error accessing inherited properties: {e}")

        # Test to_dict method
        print("\n7. Testing to_dict method...")
        try:
            resume_dict = created_resume.to_dict()
            print(f"✓ Resume dict contains {len(resume_dict)} fields:")
            for key, value in resume_dict.items():
                print(f"   - {key}: {value}")
        except Exception as e:
            print(f"✗ Error converting to dict: {e}")

        # Test __repr__ method
        print("\n8. Testing __repr__ method...")
        try:
            resume_repr = repr(created_resume)
            print(f"✓ Resume representation: {resume_repr}")
        except Exception as e:
            print(f"✗ Error getting representation: {e}")

        # Clean up - delete test resume and user
        print("\n9. Cleaning up test data...")
        try:
            DatabaseService.delete(created_resume)
            print("✓ Test resume deleted")
            DatabaseService.delete(created_user)
            print("✓ Test user deleted")
        except Exception as e:
            print(f"✗ Error cleaning up: {e}")


if __name__ == "__main__":
    test_resume_model()
