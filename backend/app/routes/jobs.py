from flask import Blueprint, jsonify, request
from app.models.job import Job
from flask_jwt_extended import jwt_required

jobs_bp = Blueprint('jobs', __name__)

@jobs_bp.route("/api/jobs", methods=["GET"])
@jwt_required()
def get_jobs():

    try:
        q = Job.query.filter_by(is_active=True)
        search = request.args.get("search")
        limit = int(request.args.get("limit", 10))
        offset = int(request.args.get("offset", 0))
        preload = int(request.args.get("preload", 10))

        if search:
            q = q.filter(Job.title.ilike(f"%{search}%") | Job.description.ilike(f"%{search}%"))
        
        location = request.args.get("location")
        if location:
            q = q.filter(Job.location.ilike(f"%{location}%"))

        # Order by most recent jobs
        q = q.order_by(Job.date_posted.desc()) 

        total_count = q.count()

        total_limit = limit + preload
        jobs = q.offset(offset).limit(total_limit).all()

        jobs_data = [job.to_dict() for job in jobs]
        current_jobs = jobs_data[:limit]
        preloaded_jobs = jobs_data[limit:]

        data = jsonify({
            "status": "success",
            "current": current_jobs,
            "preload": preloaded_jobs,
            "count": len(current_jobs),
            "total": total_count
            }), 200
        return data
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": "Failed to fetch jobs",
            "error": str(e)
        }), 500
