import os
import requests

FINDWORK_API_KEY = os.getenv("FINDWORK_API_KEY")
BASE_URL = "https://findwork.dev/api/jobs/"

def fetch_findwork_jobs(page=1, search=None, remote=None):
    headers = {"Authorization": f"Token {FINDWORK_API_KEY}"}

    params = {"page":page, "sort_by":"date"}

    if search: params["search"] = search
    if remote: params["remote"] = remote

    response = requests.get(BASE_URL, headers=headers, params=params, timeout=15)
    response.raise_for_status()
    data = response.json()

    return data.get("results", []), data.get("next")

