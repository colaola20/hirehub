from flask import Blueprint, jsonify, request
from app.models.job import Job
from flask_jwt_extended import jwt_required

jobs_bp = Blueprint('jobs', __name__)

@jobs_bp.route("/api/jobs", methods=["GET"])
@jwt_required()
def get_jobs():
    q = Job.query.filter_by(is_active=True)
    search = request.args.get("search")
    if search:
        q = q.filter(Job.title.ilike(f"%{search}%") | Job.description.ilike(f"%{search}%"))
    
    location = request.args.get("location")
    if location:
        q = q.filter(Job.location.ilike(f"%{location}%"))

    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 20))
    res = q.order_by(Job.date_posted.desc()).paginate(page=page, per_page=per_page, error_out=False)
    items = [{
        "id": job.id,
        "title": job.title,
        "company": job.company,
        "location": job.location,
        "url": job.url,
        "date_posted": job.date_posted.isoformat() if job.date_posted else None
    } for job in res.items]
    return jsonify({"jobs": items, "total": res.total})
