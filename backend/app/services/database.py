from typing import Optional, List, Dict, Any, Type
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text
from flask import current_app
from app.extensions import db
import logging

logger = logging.getLogger(__name__)

class DatabaseService:
    """
    A service class to handle database operations with error handling and logging.
    Provides common CRUD operations and connection management.
    """

    @staticmethod
    def get_session():
        """Get the current database session."""
        return db.session

    @staticmethod
    def execute_query(query: str, params: Optional[Dict] = None) -> Any:
        """
        Execute a raw SQL query.

        Args:
            query (str): The SQL query to execute
            params (dict, optional): Parameters for the query

        Returns:
            Result of the query execution

        Raises:
            SQLAlchemyError: If there's an error executing the query
        """
        try:
            result = db.session.execute(text(query), params or {})
            db.session.commit()
            return result
        except SQLAlchemyError as e:
            db.session.rollback()
            logger.error(f"Error executing query: {query}. Error: {str(e)}")
            raise

    @staticmethod
    def create(model_instance) -> Any:
        """
        Create a new record in the database.

        Args:
            model_instance: An instance of a SQLAlchemy model

        Returns:
            The created model instance

        Raises:
            SQLAlchemyError: If there's an error creating the record
        """
        try:
            db.session.add(model_instance)
            db.session.commit()
            db.session.refresh(model_instance)
            logger.info(f"Created new record: {model_instance}")
            return model_instance
        except SQLAlchemyError as e:
            db.session.rollback()
            logger.error(f"Error creating record: {str(e)}")
            raise

    @staticmethod
    def get_by_id(model_class: Type, record_id: int) -> Optional[Any]:
        """
        Get a record by its ID.

        Args:
            model_class: The SQLAlchemy model class
            record_id (int): The ID of the record to retrieve

        Returns:
            The model instance or None if not found
        """
        try:
            return db.session.get(model_class, record_id)
        except SQLAlchemyError as e:
            logger.error(f"Error getting record by ID {record_id}: {str(e)}")
            raise

    @staticmethod
    def get_all(model_class: Type) -> List[Any]:
        """
        Get all records of a specific model.

        Args:
            model_class: The SQLAlchemy model class

        Returns:
            List of model instances
        """
        try:
            return db.session.query(model_class).all()
        except SQLAlchemyError as e:
            logger.error(f"Error getting all records for {model_class.__name__}: {str(e)}")
            raise

    @staticmethod
    def filter_by(model_class: Type, **kwargs) -> List[Any]:
        """
        Filter records by specified criteria.

        Args:
            model_class: The SQLAlchemy model class
            **kwargs: Filter criteria

        Returns:
            List of filtered model instances
        """
        try:
            return db.session.query(model_class).filter_by(**kwargs).all()
        except SQLAlchemyError as e:
            logger.error(f"Error filtering records for {model_class.__name__}: {str(e)}")
            raise

    @staticmethod
    def update(model_instance, **kwargs) -> Any:
        """
        Update a model instance with new values.

        Args:
            model_instance: The model instance to update
            **kwargs: Fields and values to update

        Returns:
            The updated model instance

        Raises:
            SQLAlchemyError: If there's an error updating the record
        """
        try:
            for key, value in kwargs.items():
                if hasattr(model_instance, key):
                    setattr(model_instance, key, value)

            db.session.commit()
            db.session.refresh(model_instance)
            logger.info(f"Updated record: {model_instance}")
            return model_instance
        except SQLAlchemyError as e:
            db.session.rollback()
            logger.error(f"Error updating record: {str(e)}")
            raise

    @staticmethod
    def delete(model_instance) -> bool:
        """
        Delete a model instance from the database.

        Args:
            model_instance: The model instance to delete

        Returns:
            bool: True if deletion was successful

        Raises:
            SQLAlchemyError: If there's an error deleting the record
        """
        try:
            db.session.delete(model_instance)
            db.session.commit()
            logger.info(f"Deleted record: {model_instance}")
            return True
        except SQLAlchemyError as e:
            db.session.rollback()
            logger.error(f"Error deleting record: {str(e)}")
            raise

    @staticmethod
    def delete_by_id(model_class: Type, record_id: int) -> bool:
        """
        Delete a record by its ID.

        Args:
            model_class: The SQLAlchemy model class
            record_id (int): The ID of the record to delete

        Returns:
            bool: True if deletion was successful, False if record not found

        Raises:
            SQLAlchemyError: If there's an error deleting the record
        """
        try:
            record = DatabaseService.get_by_id(model_class, record_id)
            if record:
                return DatabaseService.delete(record)
            return False
        except SQLAlchemyError as e:
            logger.error(f"Error deleting record by ID {record_id}: {str(e)}")
            raise

    @staticmethod
    def bulk_create(model_instances: List[Any]) -> List[Any]:
        """
        Create multiple records in a single transaction.

        Args:
            model_instances: List of model instances to create

        Returns:
            List of created model instances

        Raises:
            SQLAlchemyError: If there's an error creating the records
        """
        try:
            db.session.add_all(model_instances)
            db.session.commit()
            for instance in model_instances:
                db.session.refresh(instance)
            logger.info(f"Bulk created {len(model_instances)} records")
            return model_instances
        except SQLAlchemyError as e:
            db.session.rollback()
            logger.error(f"Error bulk creating records: {str(e)}")
            raise

    @staticmethod
    def test_connection() -> bool:
        """
        Test the database connection.

        Returns:
            bool: True if connection is successful, False otherwise
        """
        try:
            db.session.execute(text('SELECT 1'))
            return True
        except Exception as e:
            logger.error(f"Database connection test failed: {str(e)}")
            return False

    @staticmethod
    def get_table_info(table_name: str) -> Dict[str, Any]:
        """
        Get information about a table structure.

        Args:
            table_name (str): Name of the table

        Returns:
            Dict containing table information
        """
        try:
            query = """
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_name = :table_name
            ORDER BY ordinal_position;
            """
            result = db.session.execute(text(query), {'table_name': table_name})
            columns = [dict(row._mapping) for row in result]
            return {
                'table_name': table_name,
                'columns': columns
            }
        except SQLAlchemyError as e:
            logger.error(f"Error getting table info for {table_name}: {str(e)}")
            raise