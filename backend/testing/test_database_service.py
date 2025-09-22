import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from app.services.database import DatabaseService
from app.models.user import User

app = create_app()

def test_database_service():
    """Test the database service functionality."""
    with app.app_context():
        print("Testing DatabaseService...")

        # Test connection
        print("\n1. Testing database connection...")
        if DatabaseService.test_connection():
            print("✓ Database connection successful!")
        else:
            print("✗ Database connection failed!")
            return

        # Test creating a user
        print("\n2. Testing user creation...")
        try:
            test_user = User(
                username="testuser123",
                email="test@example.com",
                first_name="Test",
                last_name="User"
            )
            created_user = DatabaseService.create(test_user)
            print(f"✓ User created: {created_user.username} (ID: {created_user.id})")
        except Exception as e:
            print(f"✗ Error creating user: {e}")
            return

        # Test getting user by ID
        print("\n3. Testing get user by ID...")
        try:
            retrieved_user = DatabaseService.get_by_id(User, created_user.id)
            if retrieved_user:
                print(f"✓ User retrieved: {retrieved_user.username}")
            else:
                print("✗ User not found")
        except Exception as e:
            print(f"✗ Error retrieving user: {e}")

        # Test updating user
        print("\n4. Testing user update...")
        try:
            updated_user = DatabaseService.update(created_user, first_name="Updated")
            print(f"✓ User updated: {updated_user.first_name}")
        except Exception as e:
            print(f"✗ Error updating user: {e}")

        # Test filtering users
        print("\n5. Testing user filtering...")
        try:
            users = DatabaseService.filter_by(User, first_name="Updated")
            print(f"✓ Found {len(users)} user(s) with first_name='Updated'")
        except Exception as e:
            print(f"✗ Error filtering users: {e}")

        # Test getting all users
        print("\n6. Testing get all users...")
        try:
            all_users = DatabaseService.get_all(User)
            print(f"✓ Total users in database: {len(all_users)}")
        except Exception as e:
            print(f"✗ Error getting all users: {e}")

        # Test table info
        print("\n7. Testing table info...")
        try:
            table_info = DatabaseService.get_table_info('users')
            print(f"✓ Table 'users' has {len(table_info['columns'])} columns")
            for col in table_info['columns']:
                print(f"   - {col['column_name']}: {col['data_type']}")
        except Exception as e:
            print(f"✗ Error getting table info: {e}")

        # Clean up - delete test user
        print("\n8. Testing user deletion...")
        try:
            deleted = DatabaseService.delete(created_user)
            if deleted:
                print("✓ Test user deleted successfully")
            else:
                print("✗ Failed to delete test user")
        except Exception as e:
            print(f"✗ Error deleting user: {e}")

if __name__ == "__main__":
    test_database_service()