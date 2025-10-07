# app/routes/jobs.py
from flask import Blueprint, jsonify, request
from app.models.job import Job

jobs_bp = Blueprint('jobs', __name__)

@jobs_bp.route('/api/jobs', methods=['GET'])
def get_jobs():
    try:
        limit = int(request.args.get("limit", 10))
        offset = int(request.args.get("offset", 0))
        preload = int(request.args.get("preload", 10))

        total_limit = limit + preload
        jobs_query = Job.query.order_by(Job.id.asc()).offset(offset).limit(total_limit).all()
        jobs_data = [job.to_dict() for job in jobs_query]

        current_jobs = jobs_data[:limit]
        preloaded_jobs = jobs_data[limit:]

        return jsonify({
            "status": "success",
            "page": 1,
            "current": current_jobs,
            "preload": preloaded_jobs,
            "count": 10
            }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": "Failed to fetch jobs",
            "error": str(e)
        }), 500

