from datetime import datetime, timedelta, timezone
from app.extensions import db
from app.models.job import Job
from app import create_app

app = create_app()
app.app_context().push()

# to run the script
# python3 -m app.scripts.expire_jobs

def expire_old_jobs(days=14):
    try:
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        updated = Job.query.filter(Job.fetched_at < cutoff, Job.is_active == True).update(
            {"is_active": False}, synchronize_session=False
            )
        db.session.commit()
        print(f"Expired {updated} jobs.")
    except Exception:
        db.session.rollback()
        raise

if __name__=="__main__":
    expire_old_jobs(30)