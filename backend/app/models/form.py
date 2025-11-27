from app.extensions import db

class ResumeForm(db.model):
    _table_name_ = "resume_form"
    id = db.Column(db.Integer, primary_key=True)

    personalInfo = db.Column(db.JSON)
    socialInfo = db.Column(db.JSON)
    miscInfo = db.Column(db.JSON)
    jobHistory = db.Column(db.JSON)
    edHistory = db.Column(db.JSON)
    projInfo = db.Column(db.JSON)

