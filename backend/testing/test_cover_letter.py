import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from app.services.database import DatabaseService
from app.models.user import User
from app.models.cover_letter import CoverLetter
from app.models.job import Job

app = create_app()


def test_cover_letter_model():
    """Test the CoverLetter model functionality."""
    with app.app_context():
        print("Testing CoverLetter Model...")

        # Create test user first
        print("\n1. Creating test user...")
        try:
            test_user = User(
                username="cltest_user",
                email="cltest@example.com",
                first_name="CoverLetter",
                last_name="Test"
            )
            test_user.set_password("password123")
            created_user = DatabaseService.create(test_user)
            print(f"✓ Test user created: {created_user.email}")
        except Exception as e:
            print(f"✗ Error creating test user: {e}")
            return

        # Create test job
        print("\n2. Creating test job...")
        try:
            test_job = Job(
                title="Software Engineer",
                company="Test Company",
                location="Remote",
                description="Test job description",
                user_email=created_user.email
            )
            created_job = DatabaseService.create(test_job)
            print(f"✓ Test job created: {created_job.title} at {created_job.company}")
        except Exception as e:
            print(f"✗ Error creating test job: {e}")
            DatabaseService.delete(created_user)
            return

        # Test creating a cover letter
        print("\n3. Testing cover letter creation...")
        try:
            test_cover_letter = CoverLetter(
                user_email=created_user.email,
                job_id=created_job.id,
                file_path="/documents/cover_letters/software_engineer_cover.pdf"
            )
            created_cover_letter = DatabaseService.create(test_cover_letter)
            print(f"✓ CoverLetter created: ID={created_cover_letter.cover_letter_id}")
        except Exception as e:
            print(f"✗ Error creating cover letter: {e}")
            created_cover_letter = None
            DatabaseService.delete(created_job)
            DatabaseService.delete(created_user)
            return

        # Test getting cover letter by ID
        print("\n4. Testing get cover letter by ID...")
        try:
            retrieved_cl = DatabaseService.get_by_id(CoverLetter, created_cover_letter.cover_letter_id)
            if retrieved_cl:
                print(f"✓ CoverLetter retrieved: ID={retrieved_cl.cover_letter_id}")
            else:
                print("✗ CoverLetter not found")
        except Exception as e:
            print(f"✗ Error retrieving cover letter: {e}")

        # Test updating cover letter
        print("\n5. Testing cover letter update...")
        try:
            updated_cl = DatabaseService.update(
                created_cover_letter,
                file_path="/documents/cover_letters/updated_cover.pdf"
            )
            print(f"✓ CoverLetter updated: {updated_cl.file_path}")
        except Exception as e:
            print(f"✗ Error updating cover letter: {e}")

        # Test filtering cover letters by user
        print("\n6. Testing filter cover letters by user email...")
        try:
            user_cover_letters = DatabaseService.filter_by(CoverLetter, user_email=created_user.email)
            print(f"✓ Found {len(user_cover_letters)} cover letter(s) for user")
        except Exception as e:
            print(f"✗ Error filtering cover letters: {e}")

        # Test filtering cover letters by job
        print("\n7. Testing filter cover letters by job ID...")
        try:
            job_cover_letters = DatabaseService.filter_by(CoverLetter, job_id=created_job.id)
            print(f"✓ Found {len(job_cover_letters)} cover letter(s) for job")
        except Exception as e:
            print(f"✗ Error filtering by job: {e}")

        # Test cover letter inheritance from Document
        print("\n8. Testing CoverLetter inherits Document properties...")
        try:
            print(f"✓ CoverLetter has document_id: {created_cover_letter.document_id}")
            print(f"✓ CoverLetter has document_type: {created_cover_letter.document_type}")
            print(f"✓ CoverLetter has file_path: {created_cover_letter.file_path}")
            print(f"✓ CoverLetter has created_at: {created_cover_letter.created_at}")
        except Exception as e:
            print(f"✗ Error accessing inherited properties: {e}")

        # Test relationship with Job
        print("\n9. Testing relationship with Job...")
        try:
            if created_cover_letter.job:
                print(f"✓ CoverLetter linked to job: {created_cover_letter.job.title}")
            else:
                print("✗ Job relationship not working")
        except Exception as e:
            print(f"✗ Error accessing job relationship: {e}")

        # Test to_dict method
        print("\n10. Testing to_dict method...")
        try:
            cl_dict = created_cover_letter.to_dict()
            print(f"✓ CoverLetter dict contains {len(cl_dict)} fields:")
            for key, value in cl_dict.items():
                print(f"   - {key}: {value}")
        except Exception as e:
            print(f"✗ Error converting to dict: {e}")

        # Test __repr__ method
        print("\n11. Testing __repr__ method...")
        try:
            cl_repr = repr(created_cover_letter)
            print(f"✓ CoverLetter representation: {cl_repr}")
        except Exception as e:
            print(f"✗ Error getting representation: {e}")

        # Clean up - delete test data
        print("\n12. Cleaning up test data...")
        try:
            DatabaseService.delete(created_cover_letter)
            print("✓ Test cover letter deleted")
            DatabaseService.delete(created_job)
            print("✓ Test job deleted")
            DatabaseService.delete(created_user)
            print("✓ Test user deleted")
        except Exception as e:
            print(f"✗ Error cleaning up: {e}")


if __name__ == "__main__":
    test_cover_letter_model()
