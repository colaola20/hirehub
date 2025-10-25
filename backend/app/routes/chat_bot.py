# backend/chat_route.py
import os, requests
from flask import Blueprint, request, jsonify

chat_bp = Blueprint("chat_bp", __name__)

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")  # set this in your env

@chat_bp.post("/api/chat")
def chat():
    if not GROQ_API_KEY:
        return jsonify({"error": "GROQ_API_KEY not set"}), 500

    data = request.get_json(force=True) or {}
    user_message = (data.get("message") or "").strip()
    job = data.get("job") or {}

    if not user_message:
        return jsonify({"error": "Empty message"}), 400

    # Build a helpful system prompt with job context
    system_prompt = (
        "You are HireHub's helpful job assistant. Be concise and practical. "
        "Use the provided job context to answer questions, suggest resume bullets, "
        "and draft short cover-letter snippets on request."
    )

    job_context = (
        f"JOB CONTEXT:\n"
        f"Title: {job.get('title','N/A')}\n"
        f"Company: {job.get('company','N/A')}\n"
        f"Location: {job.get('location','N/A')}\n"
        f"Skills: {', '.join(job.get('skills', [])) if isinstance(job.get('skills'), list) else job.get('skills','')}\n"
        f"Description: {job.get('description','')[:2000]}\n"
    ).strip()

    payload = {
        "model": "llama-3.3-70b-versatile",   # or "llama-3.1-8b-instant" for max speed
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"{job_context}\n\nUSER QUESTION:\n{user_message}"}
        ],
        "temperature": 0.4,
        "max_tokens": 600,
        "stream": False
    }

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    r = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        json=payload,
        headers=headers,
        timeout=30
    )
    if r.status_code >= 400:
        try:
            return jsonify(r.json()), r.status_code
        except Exception:
            return jsonify({"error": f"Groq API error: {r.text}"}), r.status_code

    data = r.json()
    answer = (data.get("choices") or [{}])[0].get("message", {}).get("content", "")
    return jsonify({"answer": answer})
