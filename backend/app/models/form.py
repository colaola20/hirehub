from app.extensions import db
# from app.model.user import User

class ResumeForm(db.Model):
    _tablename_ = "resume_form"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    personalInfo = db.Column(db.JSON)
    socialInfo = db.Column(db.JSON)
    miscInfo = db.Column(db.JSON)
    jobHistory = db.Column(db.JSON)
    edHistory = db.Column(db.JSON)
    projInfo = db.Column(db.JSON)


    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "personalInfo": self.personalInfo,
            "socialInfo": self.socialInfo,
            "miscInfo": self.miscInfo,
            "jobHistory": self.jobHistory,
            "edHistory": self.edHistory,
            "projInfo": self.projInfo
        }