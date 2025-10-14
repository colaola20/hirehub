from app.extensions import db
from datetime import datetime, timezone


class Document(db.Model):
    __tablename__ = 'documents'

    document_id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(120), db.ForeignKey('users.email'), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    document_type = db.Column(db.String(50), nullable=False)  # 'resume' or 'cover_letter'
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Polymorphic discriminator
    __mapper_args__ = {
        'polymorphic_identity': 'document',
        'polymorphic_on': document_type
    }

    # Relationship
    user = db.relationship('User', backref=db.backref('documents', lazy=True))

    def __repr__(self):
        return f'<Document {self.document_id} - {self.document_type}>'

    def to_dict(self):
        return {
            'document_id': self.document_id,
            'user_email': self.user_email,
            'file_path': self.file_path,
            'document_type': self.document_type,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
