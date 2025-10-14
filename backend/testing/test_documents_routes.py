import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from app.services.database import DatabaseService
from app.models.user import User
from app.models.resume import Resume
from app.models.cover_letter import CoverLetter
from app.models.job import Job
from flask_jwt_extended import create_access_token

app = create_app()


def test_documents_routes():
    """Test the documents routes functionality."""
    with app.app_context():
        print("Testing Documents Routes...")

        # Create test user
        print("\n1. Creating test user and access token...")
        try:
            test_user = User(
                username="routetest_user",
                email="routetest@example.com",
                first_name="Route",
                last_name="Test"
            )
            test_user.set_password("password123")
            created_user = DatabaseService.create(test_user)

            # Create access token
            access_token = create_access_token(identity=str(created_user.id))
            print(f"✓ Test user created: {created_user.email}")
            print(f"✓ Access token generated")
        except Exception as e:
            print(f"✗ Error creating test user: {e}")
            return

        # Create test job for cover letter
        print("\n2. Creating test job...")
        try:
            test_job = Job(
                title="Backend Developer",
                company="Tech Corp",
                location="San Francisco",
                description="Backend position",
                user_email=created_user.email
            )
            created_job = DatabaseService.create(test_job)
            print(f"✓ Test job created: {created_job.title}")
        except Exception as e:
            print(f"✗ Error creating test job: {e}")
            DatabaseService.delete(created_user)
            return

        # Create test documents
        print("\n3. Creating test documents...")
        try:
            test_resume = Resume(
                user_email=created_user.email,
                file_path="/test/resume.pdf",
                title="Test Resume"
            )
            created_resume = DatabaseService.create(test_resume)
            print(f"✓ Test resume created: ID={created_resume.resume_id}")

            test_cover_letter = CoverLetter(
                user_email=created_user.email,
                job_id=created_job.id,
                file_path="/test/cover_letter.pdf"
            )
            created_cover_letter = DatabaseService.create(test_cover_letter)
            print(f"✓ Test cover letter created: ID={created_cover_letter.cover_letter_id}")
        except Exception as e:
            print(f"✗ Error creating test documents: {e}")
            DatabaseService.delete(created_job)
            DatabaseService.delete(created_user)
            return

        # Test GET /api/documents - Get all documents
        print("\n4. Testing GET /api/documents...")
        with app.test_client() as client:
            try:
                response = client.get(
                    '/api/documents',
                    headers={'Authorization': f'Bearer {access_token}'}
                )
                if response.status_code == 200:
                    data = response.get_json()
                    print(f"✓ GET /api/documents successful: {data['count']} documents")
                else:
                    print(f"✗ GET /api/documents failed: {response.status_code}")
            except Exception as e:
                print(f"✗ Error testing GET /api/documents: {e}")

        # Test GET /api/documents/resumes - Get all resumes
        print("\n5. Testing GET /api/documents/resumes...")
        with app.test_client() as client:
            try:
                response = client.get(
                    '/api/documents/resumes',
                    headers={'Authorization': f'Bearer {access_token}'}
                )
                if response.status_code == 200:
                    data = response.get_json()
                    print(f"✓ GET /api/documents/resumes successful: {data['count']} resumes")
                else:
                    print(f"✗ GET /api/documents/resumes failed: {response.status_code}")
            except Exception as e:
                print(f"✗ Error testing GET /api/documents/resumes: {e}")

        # Test GET /api/documents/cover-letters - Get all cover letters
        print("\n6. Testing GET /api/documents/cover-letters...")
        with app.test_client() as client:
            try:
                response = client.get(
                    '/api/documents/cover-letters',
                    headers={'Authorization': f'Bearer {access_token}'}
                )
                if response.status_code == 200:
                    data = response.get_json()
                    print(f"✓ GET /api/documents/cover-letters successful: {data['count']} cover letters")
                else:
                    print(f"✗ GET /api/documents/cover-letters failed: {response.status_code}")
            except Exception as e:
                print(f"✗ Error testing GET /api/documents/cover-letters: {e}")

        # Test GET /api/documents/<id> - Get specific document
        print("\n7. Testing GET /api/documents/<id>...")
        with app.test_client() as client:
            try:
                response = client.get(
                    f'/api/documents/{created_resume.document_id}',
                    headers={'Authorization': f'Bearer {access_token}'}
                )
                if response.status_code == 200:
                    data = response.get_json()
                    print(f"✓ GET /api/documents/<id> successful: {data['data']['document_type']}")
                else:
                    print(f"✗ GET /api/documents/<id> failed: {response.status_code}")
            except Exception as e:
                print(f"✗ Error testing GET /api/documents/<id>: {e}")

        # Test GET /api/documents/<id> with unauthorized user
        print("\n8. Testing unauthorized access to document...")
        with app.test_client() as client:
            try:
                # Create another user
                other_user = User(
                    username="other_user",
                    email="other@example.com",
                    first_name="Other",
                    last_name="User"
                )
                other_user.set_password("password123")
                created_other = DatabaseService.create(other_user)
                other_token = create_access_token(identity=str(created_other.id))

                response = client.get(
                    f'/api/documents/{created_resume.document_id}',
                    headers={'Authorization': f'Bearer {other_token}'}
                )
                if response.status_code == 403:
                    print(f"✓ Unauthorized access correctly blocked (403)")
                else:
                    print(f"✗ Expected 403, got {response.status_code}")

                DatabaseService.delete(created_other)
            except Exception as e:
                print(f"✗ Error testing unauthorized access: {e}")

        # Test DELETE /api/documents/<id> - Delete document
        print("\n9. Testing DELETE /api/documents/<id>...")
        with app.test_client() as client:
            try:
                response = client.delete(
                    f'/api/documents/{created_cover_letter.document_id}',
                    headers={'Authorization': f'Bearer {access_token}'}
                )
                if response.status_code == 200:
                    print(f"✓ DELETE /api/documents/<id> successful")
                else:
                    print(f"✗ DELETE /api/documents/<id> failed: {response.status_code}")
            except Exception as e:
                print(f"✗ Error testing DELETE /api/documents/<id>: {e}")

        # Test accessing without authentication
        print("\n10. Testing access without authentication...")
        with app.test_client() as client:
            try:
                response = client.get('/api/documents')
                if response.status_code == 401:
                    print(f"✓ Unauthenticated access correctly blocked (401)")
                else:
                    print(f"✗ Expected 401, got {response.status_code}")
            except Exception as e:
                print(f"✗ Error testing unauthenticated access: {e}")

        # Clean up - delete test data
        print("\n11. Cleaning up test data...")
        try:
            # Resume should still exist, cover letter was deleted in test
            DatabaseService.delete(created_resume)
            print("✓ Test resume deleted")
            DatabaseService.delete(created_job)
            print("✓ Test job deleted")
            DatabaseService.delete(created_user)
            print("✓ Test user deleted")
        except Exception as e:
            print(f"✗ Error cleaning up: {e}")


if __name__ == "__main__":
    test_documents_routes()
