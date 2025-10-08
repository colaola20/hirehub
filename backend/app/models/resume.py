from app.extensions import db
from datetime import datetime, timezone
from app.models.document import Document


class Resume(Document):
    __tablename__ = 'resumes'

    resume_id = db.Column(db.Integer, db.ForeignKey('documents.document_id'), primary_key=True)
    title = db.Column(db.String(255))

    # Polymorphic discriminator
    __mapper_args__ = {
        'polymorphic_identity': 'resume',
    }

    def __repr__(self):
        return f'<Resume {self.resume_id} - {self.title}>'

    def to_dict(self):
        data = super().to_dict()
        data.update({
            'resume_id': self.resume_id,
            'title': self.title
        })
        return data
