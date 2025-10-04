import os
import requests

FINDWORK_API_KEY = os.getenv("FINDWORK_API_KEY")
BASE_URL = "https://findwork.dev/api/jobs/"

def fetch_findwork_jobs(query=None, location=None, remote=None, ):
    headers = {"Authorization": f"Token {FINDWORK_API_KEY}"}

    params = {}

    if query:
        params["search"] = query
    if location:
        params["location"] = location
    if remote:
        params["remote"] = remote

    response = requests.get(BASE_URL, headers=headers, params=params)

    if response.status_code == 200:
        data = response.json()
        return data['results']
    else:
        return Exception(f"Findwork API error {response.status_code}: {response.text}")

