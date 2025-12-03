from datetime import datetime
from app.extensions import db

class DocumentContent(db.Model):
    __tablename__ = 'document_contents'
    
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('documents.document_id'), nullable=False)
    
    # Structured data as JSON
    content_data = db.Column(db.JSON, nullable=False)
    # Example structure:
    # {
    #   "type": "resume",
    #   "template": "professional",
    #   "data": {
    #     "personal": {"name": "John Doe", "email": "...", "phone": "..."},
    #     "experience": [...],
    #     "education": [...],
    #     "skills": [...]
    #   }
    # }
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    document = db.relationship('Document', backref='content')