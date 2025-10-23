from flask import Blueprint, jsonify, request
from app.models.job import Job
from flask_jwt_extended import jwt_required
from app.extensions import db
from sqlalchemy import or_

jobs_bp = Blueprint('jobs', __name__)

@jobs_bp.route("/api/jobs", methods=["GET"])
@jwt_required()
def get_jobs():

    try:
        q = Job.query.filter_by(is_active=True)
        try: 
            limit = min(int(request.args.get("limit", 10)), 200)
        except ValueError:
            limit = 10
        try:
            offset = max(int(request.args.get("offset", 0)), 0)
        except ValueError:
            offset = 0
        try:
            preload = min(int(request.args.get("preload", 10)), 100)
        except ValueError:
            preload = 10
        
        search = (request.args.get("search") or "").strip()
        if search == "[object Object]":
            search = ""

        if search:
            term = f"%{search}%"
            q = q.filter(
                or_(
                    Job.title.ilike(term),
                    Job.description.ilike(term),
                    Job.company.ilike(term)
                ))
        
        company = (request.args.get("company") or "").strip()
        if company and company.lower() != "any":
            q = q.filter(Job.company.ilike(f"%{company}%"))

        location = (request.args.get("location") or "").strip()
        if location:
            q = q.filter(Job.location.ilike(f"%{location}%"))

        employment_type = (request.args.get("employment_type") or "").strip()
        if employment_type and employment_type.lower() != "any":
            q = q.filter(Job.employment_type.ilike(f"%{employment_type}%"))
        
        sort = (request.args.get("sort") or "").strip()
        if sort:
            try:
                field, direction = sort.split(":", 1)
                field = field.strip()
                direction = direction.strip().lower()
                sort_col = getattr(Job, field, None)
                if sort_col is not None:
                    q = q.order_by(sort_col.desc() if direction == "desc" else sort_col.asc())
                else:
                    q = q.order_by(Job.date_posted.desc())
            except Exception:
                q = q.order_by(Job.date_posted.desc())
        else:
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
