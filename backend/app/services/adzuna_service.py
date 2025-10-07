import os
import requests

ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_APP_KEY=os.getenv("ADZUNA_APP_KEY")

BASE_URL="https://api.adzuna.com/v1/api/jobs"

def fetch_adzuna_jobs(country="us", page=1, category=None, per_page=20):
    url=f"{BASE_URL}/{country}/search/{page}"
    params = {
        # Adzuna expects 'app_id' and 'app_key' as the credential param names
        "app_id": ADZUNA_APP_ID,
        "app_key": ADZUNA_APP_KEY,
        "results_per_page": per_page,
        "category": "it-jobs",
        "sort_by": "date", 
    }

    if category:
        params["category"] = category

    response = requests.get(url, params=params)
    response.raise_for_status()
    data = response.json()
    results = data.get("results", [])
    total = data.get("count")
    has_more=False
    if total is not None:
        has_more = page * per_page < int(total)
    else:
        has_more = len(results) == per_page
    return results, has_more