from app.extensions import db
from datetime import datetime, timezone
from app.models.document import Document


class CoverLetter(Document):
    __tablename__ = 'cover_letters'

    cover_letter_id = db.Column(db.Integer, db.ForeignKey('documents.document_id'), primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)

    # Polymorphic discriminator
    __mapper_args__ = {
        'polymorphic_identity': 'cover_letter',
    }

    # Relationship
    job = db.relationship('Job', backref=db.backref('cover_letters', lazy=True))

    def __repr__(self):
        return f'<CoverLetter {self.cover_letter_id}>'

    def to_dict(self):
        data = super().to_dict()
        data.update({
            'cover_letter_id': self.cover_letter_id,
            'job_id': self.job_id
        })
        return data
