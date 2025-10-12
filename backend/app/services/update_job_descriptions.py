from app import create_app
from app.extensions import db
from app.models import Job
from app.services.adzuna_service import fetch_adzuna_jobs 

BATCH_SIZE = 50  # original batch size for full update

def analyze_api_responses(sample_size=2):
    """
    Fetch a small number of jobs from Adzuna API for analysis.
    Does NOT update the database.
    """
    app = create_app()
    with app.app_context():
        # Fetch jobs from API
        results, _ = fetch_adzuna_jobs(per_page=sample_size)
        
        print(f"Fetched {len(results)} jobs from Adzuna API for analysis.\n")
        
        for job in results:
            desc = job.get("description", "")
            print(f"Job API ID: {job.get('id')}")
            print(f"Title: {job.get('title')}")
            print(f"Description length: {len(desc)}")
            print(f"Snippet: {desc[:200]}...\n")  # first 200 chars
            # Uncomment below to simulate DB update (for testing)
            # job_in_db = db.session.query(Job).filter_by(api_id=job["id"]).first()
            # if job_in_db:
            #     job_in_db.description = desc
            #     db.session.add(job_in_db)

# def update_truncated_jobs():
#     """
#     Original batch update function.
#     Updates truncated jobs (length = 500) with full descriptions from Adzuna API.
#     """
#     app = create_app()
#     with app.app_context():
#         truncated_jobs = db.session.query(Job).filter(db.func.length(Job.description) == 500).all()
#         print(f"Found {len(truncated_jobs)} truncated jobs.")

#         for i in range(0, len(truncated_jobs), BATCH_SIZE):
#             batch = truncated_jobs[i:i + BATCH_SIZE]
#             try:
#                 results, _ = fetch_adzuna_jobs(per_page=100)
#                 for job in batch:
#                     full_job = next((r for r in results if str(r["id"]) == str(job.api_id)), None)
#                     if full_job:
#                         job.description = full_job.get("description", job.description)
#                         db.session.add(job)
#                         print(f"Updated job {job.id} description.")
#                 db.session.commit()
#                 print(f"Committed batch {i // BATCH_SIZE + 1}")
#             except Exception as e:
#                 db.session.rollback()
#                 print(f"Error processing batch {i // BATCH_SIZE + 1}: {str(e)}")

#         print("Finished updating truncated jobs.")


if __name__ == "__main__":
    # Analyze just 2 jobs to inspect API responses
    analyze_api_responses(sample_size=2)
    
    # Uncomment to run full batch update
    # update_truncated_jobs()
