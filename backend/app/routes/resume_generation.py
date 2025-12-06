from flask import Blueprint, request, jsonify
import requests
import os

resume_bp = Blueprint("resume_generation", __name__)

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

@resume_bp.route("/api/generate_resume", methods=['POST'])
def generate_resume():
    if not GROQ_API_KEY:
        return jsonify({"error": "GROQ_API_KEY not set"}), 500

    form_data = request.get_json()
    if not form_data:
        return jsonify({"error": "No form data provided"}), 400

    system_prompt = (
        "You are HireHub's expert resume generator. Use the given structured form to enhance the content given, "
        "ensuring it is concise and resume-appropriate. Keep in mind that skills may be conditionally removed if "
        "other sections are too lengthy and exceed a limit of one page."
    )

    prompt = f"""
    Create a clean, one-page technical resume using this structured data:

    {form_data}

    Requirements:
    - Keep all content concise and resume-appropriate.
    - Improve job descriptions with achievement-focused bullet points.
    - Ensure formatting fits a single page.
    - Do NOT return JSON — return clean resume text only.
    """

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.4,
        "max_tokens": 700,
        "stream": False
    }

    try:
        res = requests.post(GROQ_URL, headers=headers, json=payload)
        res.raise_for_status()  # raises exception if status != 2xx
        response_json = res.json()
        
        # debug: log the full API response
        print("GROQ API response:", response_json)

        # safely get the content
        ai_text = ""
        choices = response_json.get("choices")
        if choices and len(choices) > 0:
            message = choices[0].get("message")
            if message:
                ai_text = message.get("content", "")

        if not ai_text:
            return jsonify({
                "error": "No resume text returned from AI",
                "details": response_json
            }), 500

        return jsonify({
            "message": "Resume generated successfully",
            "resume_text": ai_text
        }), 200

    except requests.exceptions.RequestException as e:
        print("GROQ API request failed:", e)
        return jsonify({
            "error": "Failed to generate resume",
            "details": str(e)
        }), 500
    except Exception as e:
        print("Unexpected error in generate_resume:", e)
        return jsonify({
            "error": "Unexpected error generating resume",
            "details": str(e)
        }), 500
