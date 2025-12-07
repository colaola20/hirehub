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
                {{skills_line}} <br>
                {{languages_line}} <br>
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

    system_prompt = """
        You will receive:
        1. A JSON object of structured resume data.
        2. An HTML resume template containing placeholders.

        Your job:
        - Fill the HTML template with the JSON data.
        - Keep content concise and fit within a single page of 816px x 1056px.
        - Avoid excessive padding or margins.

        - For job experience: write 1 to 2 concise bullet points per job describing achievements or responsibilities.
        Do not just repeat the role name; create realistic, professional sentences.
        Put role on a separate line from the company name and time period, but above the job description bullets.
        Do NOT use commas to separate fields in the experience section in any circumstance. Use hyphens only.

        - For projects: summarize each project in 1–2 sentences describing its purpose, functionality, and impact.
        Include a link if available. Do not simply copy the form’s description.
        Description MUST be separate from the title and link.
        Insert the description on a NEW LINE after the title+link.
        Output links as: <a href="{projLink}" target="_blank" rel="noopener noreferrer">Project Link</a>
        Do NOT use commas to separate fields in projects.

        - For skills and languages, list them clearly and on separate lines.
        Capitalize the first letter of each word.

        - For education: school name + graduation year on one line, then “Degree in: {degree}” on the next line.
        Do NOT use commas for education. Use hyphens only.

        ----------------------------------------
        STRUCTURE RULES
        ----------------------------------------

        When replacing {{projects}}, use EXACTLY this HTML:

        <div class="projectEntry">
            <div class="projectHeader">
                <div class="projectTitle">{Project Title}</div>
                <div class="projectLink">
                    <a href="{Project Link}" target="_blank" rel="noopener noreferrer">Project Link</a>
                </div>
            </div>
            <div class="projectDescription">
                {1–2 sentence description}
            </div>
        </div>

        When replacing {{experience}}, use EXACTLY this structure:

        <div class="experienceEntry">
            <div class="experienceCompany">{Company Name}</div>
            <div class="experienceTime">{Time Period}</div>
            <div class="experienceRole">{Role Name}</div>
            <div class="experienceBullets">
                - {Bullet 1}<br>
                - {Bullet 2}
            </div>
        </div>

        When replacing {{education}}, use EXACTLY this structure:

        <div class="educationEntry">
            <div class="educationSchool">{School Name}</div>
            <div class="educationGradYear">{Graduation Year}</div>
            <div class="educationDegree">
                Degree in: {Degree}
            </div>
        </div>

        ----------------------------------------
        SKILLS / LANGUAGES RULES
        ----------------------------------------

        The template contains a .misc section containing:

        {{skills_line}}
        {{languages_line}}

        When replacing {{skills_line}}, output:

        Skills: Skill1, Skill2, Skill3

        When replacing {{languages_line}}, output:

        Languages: Lang1, Lang2

        These MUST be two separate lines.
        Skills ALWAYS on its own line.
        Languages ALWAYS directly below skills.
        Any additional misc fields must also be separate lines.

        ----------------------------------------
        STRICT STRUCTURE ENFORCEMENT
        ----------------------------------------

        You MUST:
        - Follow the exact HTML structures above.
        - Put each field ONLY in its correct div.
        - NOT merge title/link/description fields.
        - NOT merge fields in experience.
        - NOT add or remove divs.
        - NOT rearrange elements.
        - NOT combine fields into one line.

        If you deviate from these structures, the output is invalid.

        ----------------------------------------
        GLOBAL RESTRICTIONS
        ----------------------------------------

        - The HTML template uses full lines to separate fields — preserve this.
        - Do NOT modify layout, class names, or structure.
        - Do NOT add explanations, comments, or JSX.
        - Only fill placeholders such as {{projects}}, {{experience}}, etc.
        - Remove sections if data is empty.
        - Return ONLY the final HTML.

        Available placeholders:
        {{fullname}}, {{email}}, {{phone}}, {{city}}, {{linkedin}}, {{github}}
        {{skills_section}}
        {{projects}}, {{experience}}, {{education}}
        """

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
