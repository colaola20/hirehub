from app.models.user import User
from app.models.job import Job
from app.models.application import Application
from app.models.profile import Profile
from app.models.skill import Skill
from app.models.notification import Notification
from app.models.ai_assistant_log import AIAssistantLog
from app.models.cover_letter import CoverLetter
from app.models.resume import Resume
from app.models.form import ResumeForm
from app.models.favorite import Favorite
from app.models.recommended_job import RecommendedJob


__all__ = ['User', 'Job', 'Application', 'Profile', 'Skill', 'Notification', 'AIAssistantLog', 'CoverLetter', 'Resume', 'Favorite','RecommendedJob']
