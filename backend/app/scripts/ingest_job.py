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

from bs4 import BeautifulSoup
from urllib.parse import urlparse
import requests
import html as _html
import re

import logging
logger = logging.getLogger(__name__)

# to run the script 
# python3 -m app.scripts.ingest_job

app = create_app()
app.app_context().push()

HEADERS = {"User-Agent": "HireHub-scraper/1.0"}
SCRAPE_TIMEOUT = 6
SCRAP_SLEEP = 0.25
TIMEOUT = 6 # 6 seconds

def _is_probably_truncated(text: str) -> bool:
    if not text:
        return True
    t = text.strip()
    return len(t) < 200 or t.endswith("...") or t.endswith("…")

def fetch_full_description_from_page(url:str, timeout: int = SCRAPE_TIMEOUT) -> str | None:
    if not url:
        return None
    
    try:
        parsed = urlparse(url)
        if not parsed.scheme:
            url = "https://" + url.lstrip("/")
        
        r = requests.get(url, headers = HEADERS, timeout=timeout, allow_redirects=True)
        if r.status_code != 200 or not r.text:
            return None
        
        soup = BeautifulSoup(r.text, "html.parser")


        # spesific for adzuna part !!!    
        selectors = [
            "section.adp-body"
        ]
        for sel in selectors:
            node = soup.select_one(sel)
            full_desc = []
            if node:
                txt = node.get_text(separator="\n").strip()
                txt = re.sub(r"\r\n?", "\n", txt)
                txt = re.sub(r"[ \t]+\n", "\n", txt)
                txt = re.sub(r"\n\s*\n+", "\n\n", txt)
                txt = _html.unescape(txt).strip()
                if len(txt) >= 80:
                    logger.debug("fetch_full_description_from_page: got text from selector %s (len=%s)", sel, len(txt))
                    return txt
        # Fallback: try to return long text block on page
        all_text = soup.get_text(separator="\n")
        all_text = re.sub(r"\n\s*\n+", "\n\n", _html.unescape(all_text)).strip()
        if len(all_text) >= 200:
            return all_text
            
    except RequestException as e:
        logger.warning("RequestException while fetching page %s: %s", url, e)
    except Exception:
        logger.exception("Unexpected error in fetch_full_description_from_page for %s", url)
    finally:
        time.sleep(SCRAP_SLEEP)
    return None

def is_valid_url(u: str) -> bool:
    if not u:
        return False
    try:
        p = urlparse(u)
        return bool(p.scheme and p.netloc)
    except Exception:
        return False
    
def check_url_alive(u: str) -> bool:
    # return true if url resolves with status < 400 (HEAD or fallback GET)
    if not u:
        return False
    try:
        r = requests.head(u, headers=HEADERS, allow_redirects=True, timeout=TIMEOUT)
        status = r.status_code

        if status >= 400 or status == 405:
            r = requests.get(u, headers=HEADERS, allow_redirects=True, timeout=TIMEOUT, stream=True)
            status = r.status_code
            # ensure we close the stream quickly
            try:
                r.close()
            except Exception:
                pass
        return status < 400
    except RequestException:
        return False
    except Exception:
        logger.exception("check_url_alive unexpected error for %s", u)
        return False

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
            logger.warning("Fetch attemp %s failed (RequestException): %s", attempt, e)
            if attempt == max_retries:
                raise
            time.sleep(backoff**attempt)
        except Exception as e:
            # Non-request exceptions likely indicate a bug — re-raise after logging.
            logger.exception("Non-request exception during fetch attempt %s: %s", attempt, e)
            raise

def clean_html_to_text(html_blob: str, min_length: int = 40) -> str | None:
    if not html_blob:
        return None
    
    try:
        soup = BeautifulSoup(html_blob, "html.parser")
        for node in soup(["script", "style"]):
            node.decompose()

        for tag in soup.find_all(["br", "p", "li", "div", "h1", "h2", "h3", "h4", "h5", "h6"]):
            if tag.string is None:
                tag.append(" ")
            else:
                tag.string = f"{tag.get_text()}\n"

        text = soup.get_text(separator = "\n")
        text = _html.unescape(text)
        text = re.sub(r"\r\n?", "\n", text)
        text = re.sub(r"[ \t]+\n", "\n", text)
        text = re.sub(r"\n\s*\n+", "\n\n", text)
        text = text.strip()
        if len(text) < min_length:
            return None
        return text
    except Exception:
        logger.exception("lean_html_to_text failed")
        return None
    
def sanitize_html_keep_basic(html_blob: str) -> str | None:
    if not html_blob:
        return None
    try:
        soup = BeautifulSoup(html_blob, "html.parser")
        for node in soup(["script", "style"]):
            node.decompose()
        
        for tag in soup.find_all(True):
            attrs = dict(tag.attrs)
            for a in list(attrs):
                if a.startswith("on"):
                    del tag.attrs[a]
        return str(soup).strip()
    except Exception:
        logger.exception("sanitize_html_keep_basic failed")
        return None

def normalize_findwork_job(api_job):
    url = api_job.get("url")
    if not url:
        logger.debug("normalize_findwork_job: no url")
        return None
    
    if not check_url_alive(url):
        logger.debug("normalize_findwork_job: url not alive: %s", url)
        return None

    raw_html = api_job.get("text")
    description_text = clean_html_to_text(raw_html, min_length=40) if raw_html else None

    if not description_text:
        # try sanitize and then extract text
        san = sanitize_html_keep_basic(raw_html) if raw_html else None
        description_text = clean_html_to_text(san, min_length=40) if san else None
    #print(description_text)


    remote_val = api_job.get("remote")
    is_remote = _is_remote_flag(remote_val)

    if is_remote:
        location_value = "Remote"
    else:
        location_value = api_job.get("location")


    return {
        "api_id": api_job.get("id"),
        "source": "findwork",
        "title": api_job.get("role"),
        "company": api_job.get("company_name"),
        "location": location_value,
        "description": description_text,
        "url": url,
        "date_posted": parse_date_to_dt(api_job.get("date_posted")),
        "fetched_at": datetime.now(timezone.utc),
        "is_active": True,
        "employment_type": api_job.get("employment_type")
    }

def _canonicalize_employment_type(val):
    if not val:
        return None
    s = str(val).strip().lower()
    # exact mappings first
    map_exact = {
        "full time": "full-time",
        "full-time": "full-time",
        "full_time": "full-time",
        "permanent": "full-time",
        "part time": "part-time",
        "part-time": "part-time",
        "part_time": "part-time",
        "contract": "contract",
        "temporary": "temporary",
        "temp": "temporary",
        "internship": "internship",
        "intern": "internship",
        "freelance": "freelance",
        "freelancer": "freelance"
    }
    if s in map_exact:
        return map_exact[s]
    # contains-match fallback
    for k, v in map_exact.items():
        if k in s:
            return v
    # unknown: return cleaned raw value
    return s

def normalize_adzuna_job(api_job):
    url = api_job.get("redirect_url")
    if not url:
        logger.debug("normalize_adzuna_job: no redirect_url")
        return None
    
    if not check_url_alive(url):
        logger.debug("normalize_adzuna_job: url not alive: %s", url)
        return None
    
    desc = api_job.get("description")
    full = None

    if _is_probably_truncated(desc):
        try:
            page_url = api_job.get("redirect_url")
            full = fetch_full_description_from_page(page_url)
        except Exception:
            logger.exception("Failed to fetch full page for adzuna id=%s", api_job.get("id"))

        desc_text = None

    if full and isinstance(full, str) and len(full) >= (len(desc or "") + 50):
        desc_text = full
    else:
        # try to clean html desc first
        desc_text = clean_html_to_text(desc) or clean_html_to_text(sanitize_html_keep_basic(desc or "")) or desc

    location = api_job.get("location")
    if isinstance(location, dict):
        location_name = location.get("display_name")
    else:
        location_name = location

    raw_emp = (
        api_job.get("contract_time")
        or api_job.get("contract-type")
        or api_job.get("contract_type")
        or api_job.get("contractTime")
        or api_job.get("employment_type")
        or api_job.get("job_type")
        or api_job.get("type")
    )
    employment_type = _canonicalize_employment_type(raw_emp)

    return {
        "api_id": str(api_job.get("id")),
        "source": "adzuna",
        "title": api_job.get("title"),
        "company": (api_job.get("company", {}).get("display_name")),
        "location": location_name,
        "description": desc_text,
        "url": url,
        "date_posted": parse_date_to_dt(api_job.get("created")),
        "fetched_at": datetime.now(timezone.utc),
        "is_active": True,
        "employment_type": employment_type
    }

def upsert_job(session, job_data):
    allowed = {c.key for c in Job.__table__.columns}
    data = {k: v for k, v in job_data.items() if k in allowed}

    stmt = insert(Job).values(**data)
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
    session = db.session
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
            logger.info("No more items for %s at page %s", normalize_fn.__name__, page)
            break

        with session.begin():
            for api_job in items:
                try:
                    job_data = normalize_fn(api_job)
                    if not job_data:
                        continue
                    # print("Our data")
                    # print(job_data)
                    # print("API data")
                    # print(api_job)
                    print("Job saved")
                    logger.debug("Upserting job %s from %s", api_job.get("id") or api_job.get("title"), normalize_fn.__name__)
                    try:
                        with session.begin_nested():
                            upsert_job(session, job_data)
                    except Exception:
                        logger.exception("Failed upserting job %s from %s", api_job.get("id") or api_job.get("title"), normalize_fn.__name__)
                        # nested transaction rolls back to savepoint; continue to next job
                except Exception:
                    logger.exception("Rollback failed after batch commit error")
        if not nxt: break
        page +=1

def run_all_sources():
    logger.info("Starting ingestion: adzuna")
    ingest_source_with_upsert(fetch_adzuna_jobs, normalize_adzuna_job)
    #logger.info("Starting ingestion: findwork")
    #ingest_source_with_upsert(fetch_findwork_jobs, normalize_findwork_job)

if __name__=="__main__":
    run_all_sources()