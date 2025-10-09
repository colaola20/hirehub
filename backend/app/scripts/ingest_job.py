from datetime import datetime, timezone
import os
from sqlalchemy.dialects.postgresql import insert
from app.extensions import db
from app.models.job import Job
from app.services.findwork_api import fetch_findwork_jobs
from app.services.adzuna_service import fetch_adzuna_jobs
from app import create_app

from dateutil import parser as date_parser
import time
from requests.exceptions import RequestException

import logging
logger = logging.getLogger(__name__)

app = create_app()
app.app_context().push()


# to run the script 
# python3 -m app.scripts.ingest_job

def _is_remote_flag(value):
    # return true if remote true
    if isinstance(value, bool):
        return value
    if value is None:
        return False
    if isinstance(value, (int, float)):
        return bool(value)
    
    s = str(value).strip().lower()
    return s in ("true", "1", "yes", "y", "remote", "wfh", "work from home")

def parse_date_to_dt(date_str):
    # return timezone_aware datetime or None
    if not date_str:
        return None
    
    try:
        dt = date_parser.isoparse(date_str)
        if dt.tzinfo is None:
            from datetime import timezone
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except Exception:
        logger.exception("Failed to parse date: %s", date_str)
        return None

def safe_fetch_with_retries(fetch_fn, *args, max_retries=3, backoff=2, **kwargs):
    for attempt in range(1, max_retries + 1):
        try:
            return fetch_fn(*args, **kwargs)
        except RequestException as e:
            logger.warning("Fetch attemp %s failed: %s", attempt, e)
            if attempt == max_retries:
                raise
            time.sleep(backoff**attempt)

def normalize_findwork_job(api_job):
    remote_val = api_job.get("remote")
    is_remote = _is_remote_flag(remote_val)

    if is_remote:
        location_value = "Remote"
    else:
        location_value = api_job.get("location")


    return {
        "api_id": api_job["id"],
        "source": "findwork",
        "title": api_job.get("role"),
        "company": api_job.get("company_name"),
        "location": location_value,
        "description": api_job.get("text"),
        "url": api_job.get("url"),
        "date_posted": parse_date_to_dt(api_job.get("date_posted")),
        "fetched_at": datetime.now(timezone.utc),
        "is_active": True,
    }

def normalize_adzuna_job(api_job):
    location = api_job.get("location")
    if isinstance(location, dict):
        location_name = location.get("display_name")
    else:
        location_name = location

    return {
        "api_id": str(api_job.get("id")),
        "source": "adzuna",
        "title": api_job.get("title"),
        "company": api_job.get("company", {}).get("display_name"),
        "location": location_name,
        "description": api_job.get("description"),
        "url": api_job.get("redirect_url"),
        "date_posted": parse_date_to_dt(api_job.get("created")),
        "fetched_at": datetime.now(timezone.utc),
        "is_active": True,
    }

def upsert_job(session, job_data):
    stmt = insert(Job).values(**job_data)
    update_cols = {
        c.key: stmt.excluded[c.key] 
        for c in Job.__table__.columns
        if c.key not in ("id", "api_id", "source")
    }
    stmt=stmt.on_conflict_do_update(
        index_elements=["api_id", "source"],
        set_=update_cols
    )
    session.execute(stmt)

def ingest_source_with_upsert(fetch_fn, normalize_fn, *, page_arg_name="page", start_page=1):
    page=start_page
    while True:
        try:
            result = safe_fetch_with_retries(fetch_fn, page=page)
        except Exception as e:
            logger.exception("Failed fetching page %s from %s: %s", page, normalize_fn.__name__, e)
            break

        if isinstance(result, tuple) and len(result) == 2:
            items, nxt = result
        else:
            items = result or []
            nxt = None

        if not items:
            break

        with db.session.begin():
            for api_job in items:
                try:
                    with db.session.begin_nested(): #Savepoint
                        job_data = normalize_fn(api_job)
                        #print(api_job)
                        upsert_job(db.session, job_data)
                except Exception:
                    logger.exception("Failed upserting job %s from %s", api_job.get("id") or api_job.get("title"), normalize_fn.__name__)
                    # nested transaction rolls back to savepoint; continue to next job
        if not nxt: break
        page +=1

def run_all_sources():
    logger.info("Starting ingestion: adzuna")
    ingest_source_with_upsert(fetch_adzuna_jobs, normalize_adzuna_job)
    logger.info("Starting ingestion: findwork")
    ingest_source_with_upsert(fetch_findwork_jobs, normalize_findwork_job)

if __name__=="__main__":
    run_all_sources()