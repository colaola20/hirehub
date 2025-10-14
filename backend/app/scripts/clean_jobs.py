import time
import argparse
from urllib.parse import urlparse

import requests
from sqlalchemy import func

from app import create_app
from app.extensions import db
from app.models.job import Job


# to run the script 
# python3 -m app.scripts.clean_jobs --dry-run
# or
# python3 -m app.scripts.clean_jobs --delete --batch 100

HEADERS = {"User-Agent": "HireHub-cleaner"}
TIMEOUT = 6 # 6 seconds
SLEEP_BETWEEN_BATCHES = 0.25

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
    try:
        r = requests.head(u, headers=HEADERS, allow_redirects=True, timeout=TIMEOUT)
        status = r.status_code

        if status >= 400:
            r = requests.get(u, headers=HEADERS, allow_redirects=True, timeout=TIMEOUT)
            status = r.status_code
        return status < 400
    except Exception:
        return False

def main(dry_run: bool = True, batch: int = 200, limit_pages: int | None = None):
    app = create_app()
    with app.app_context():
        # Checking for missing or empty URLs
        missing_q = db.session.query(func.count()).select_from(Job).filter(
            (Job.url == None) | (func.trim(Job.url) == "")
        )  

        missing_count =  missing_q.scalar()
        print("Missing/empty URL count:", missing_count)
    
        if not dry_run and missing_count > 0:
            print("Deleting jobs with missing/empty URLs")
            db.session.query(Job).filter((Job.url == None) | (func.trim(Job.url) == "")).delete(
                synchronize_session = False
            )
            db.session.commit()
            print("Deleted missing-url jobs.")
        
        # Check for broken URLs
        # Iterates over jobs with a non-empty url, validate format first, then HTTP
        print("Scanning jobs with non-empty URLs for broken links. This may take some time...")
        last_id = 0
        checked = 0
        page = 0
        while True:
            batch_rows = (
                db.session.query(Job.id, Job.url)
                .filter((Job.id > last_id) & (Job.url != None) & (func.trim(Job.url) != ""))
                .order_by(Job.id)
                .limit(batch)
                .all()
            )
            if not batch_rows:
                break

            to_delete = []

            for job_id, url in batch_rows:
                checked += 1
                last_id = job_id
                if not is_valid_url(url):
                    to_delete.append(job_id)
                    continue
                if not check_url_alive(url):
                    to_delete.append(job_id)
            
            if to_delete:
                page += 1
                print(f"Batch {page}: checked {checked}, candidates to delete {len(to_delete)}")
                if not dry_run:
                    db.session.query(Job).filter(Job.id.in_(to_delete)).delete(synchronize_session=False)
                    db.session.commit()
                    print(f"Batch {page} deleted {len(to_delete)} jobs.")
                time.sleep(SLEEP_BETWEEN_BATCHES)

            if limit_pages and page >= limit_pages:
                print("Limit pages reached, stopping early.")
                break
        print("Scan complete. Total checked:", checked)

        # qs = db.session.query(Job).filter((Job.url != None) & ((func.trim(Job.url) != ""))).yield_per(200)
        # to_delete = []
        # checked = 0
        # page = 0

        # for job in qs:
        #     checked += 1
        #     url = job.url
        #     if not is_valid_url(url):
        #         to_delete.append(job.id)
        #     else:
        #         alive = check_url_alive(url)
        #         if not alive:
        #             to_delete.append(job.id)
            
        #     if len(to_delete) >= batch:
        #         page += 1
        #         print(f"Batch {page}: checked {checked}, candidates to delete {len(to_delete)}")
        #         if not dry_run:
        #             db.session.query(Job).filter(Job.id.in_(to_delete)).delete(synchronize_session = False)
        #             db.session.commit()
        #             print(f"Batch {page} deleted {len(to_delete)} jobs.")
                
        #         to_delete = []
        #         time.sleep(SLEEP_BETWEEN_BATCHES)
        #         if limit_pages and page >= limit_pages:
        #             print("Limit pages reaached, atopping early.")
        #             break

        # if to_delete:
        #     print(f"Final batch: checked {checked}, final candidates {len(to_delete)}")
        #     if not dry_run:
        #         db.session.query(Job).filter(Job.id.in_(to_delete)).delete(synchronize_session = False)
        #         db.session.commit()
        #         print("Final batch deleted")
            
        # print("Scan complete. Total checked:", checked)

if __name__=="__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--dry-run", action="store_true", default=True, help="only show count; don't delete.")
    p.add_argument("--delete", action="store_true", help = "Delete candidates (overrides --dry-run)")
    p.add_argument("--batch", type=int, default = 200, help="Delete batch size.")
    p.add_argument("--limit-pages", type=int, default=None, help="Stop after this many delete batches (optional)")
    args = p.parse_args()
    print(args)

    dry = not args.delete
    main(dry_run=dry, batch=args.batch, limit_pages=args.limit_pages)