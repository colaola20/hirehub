from flask import Blueprint, request, jsonify
import requests
import os
import json

resume_bp = Blueprint("resume_generation", __name__)

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

HTML_TEMPLATE = """
<div class="resume-preview">
    <div class="header">
        <h1 class="headerName">{{fullname}}</h1>
        <p>
            Email: {{email}} | Phone: {{phone}} | {{city}} |
            <a href="{{linkedin}}">LinkedIn</a> |
            <a href="{{github}}">GitHub</a>
        </p>
        <hr class="divider" />
    </div>

    <div class="body">

        {{#skills_section}}
        <div class="misc">
            <h2 class="sectionTitle">Skills</h2>
            <hr class="dividerSmall" />
            <div class="miscSection">
                {{skills_line}}
                {{languages_line}}
            </div>
        </div>
        {{/skills_section}}

        <div class="projects">
            <h2 class="sectionTitle">Projects</h2>
            <hr class="dividerSmall" />
            {{projects}}
        </div>

        <div class="experience">
            <h2 class="sectionTitle">Experience</h2>
            <hr class="dividerSmall" />
            {{experience}}
        </div>

        <div class="education">
            <h2 class="sectionTitle">Education</h2>
            <hr class="dividerSmall" />
            {{education}}
        </div>

    </div>
</div>
"""

@resume_bp.route("/api/generate_resume", methods=['POST'])
def generate_resume():
    if not GROQ_API_KEY:
        return jsonify({"error": "GROQ_API_KEY not set"}), 500

    form_data = request.get_json()
    if not form_data:
        return jsonify({"error": "No form data provided"}), 400

    system_prompt = (
        "You will receive: "
        "1. A JSON object of structured resume data. "
        "2. An HTML resume template containing placeholders. "

        "Your job: "
        "- Fill the HTML template with the JSON data. "
        "- Do NOT modify the structure, class names, layout, or formatting. "
        "- Do NOT add any extra text, notes/footnotes or explanations. "
        "- Do NOT add or remove HTML elements unless the template explicitly uses placeholders like {{skills_section}}, {{projects}}, etc. "
        "- Remove sections whose placeholders would be empty (e.g., return an empty string for {{skills_section}} if there are no skills). "
        "- Fit the resume content within a single page. Keep entries concise. "
        "- Do NOT output JSX or React code. "
        "- Return ONLY the final HTML. "

        "Available placeholders: "
        "{{fullname}}, {{email}}, {{phone}}, {{city}}, {{linkedin}}, {{github}} "
        "{{skills_section}} "
        "{{projects}}, {{experience}}, {{education}} "
    )

    prompt = f"""
    Here is the resume template you must fill:

    {HTML_TEMPLATE}

    Here is the user data in JSON:

    {json.dumps(form_data, indent=2)}

    Return ONLY the final HTML.
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
