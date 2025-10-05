from datetime import datetime, timezone
import os
from sqlalchemy.dialects.postgresql import insert
from app.extensions import db
from app.models.job import Job
from app.services.findwork_api import fetch_findwork_jobs
from app import create_app

import logging
logger = logging.getLogger(__name__)

app = create_app()
app.app_context().push()


# to run the script 
# python3 -m app.scripts.ingest_job

def normalize_job(api_job):
    return {
        "api_id": api_job["id"],
        "source": "findwork",
        "title": api_job.get("role"),
        "company": api_job.get("company_name"),
        "location": api_job.get("location"),
        "description": api_job.get("text"),
        "url": api_job.get("url"),
        "date_posted": api_job.get("date_posted"),
        "fetched_at": datetime.now(timezone.utc),
        "is_active": True,
    }

def upsert_job(session, job_data):
    stmt = insert(Job).values(**job_data)
    update_cols = {c.key: stmt.excluded[c.key] for c in Job.__table__.columns
                   if c.key not in ("id", "api_id", "source")}
    stmt = stmt.on_conflict_do_update(
        index_elements=["api_id", 'source'],
        set_=update_cols
    )
    session.execute(stmt)


def run_once():
    page = 1
    while True:
        try:
            results, nxt = fetch_findwork_jobs(page=page)
        except Exception as e:
            print(f"Fetch error on page {page}: {e}")
            break
        
        if not results:
            break
        with db.session.begin():
            for api_job in results:
                try:
                    with db.session.begin_nested(): #Savepoint
                        job_data = normalize_job(api_job)
                        upsert_job(db.session, job_data)
                except Exception:
                    logger.exception("Failed upserting job %s - continuing", api_job.get("id"))
                    # nested transaction rolls back to savepoint; continue to next job
        if not nxt: break
        page +=1

if __name__=="__main__":
    run_once()