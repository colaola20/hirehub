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
        
        "- Keep content concise and fit within a single page of 816px x 1056px. "
        "- Avoid excessive padding or margins. "

        "- For job experience: write 1 to 2 concise bullet points per job describing achievements or responsibilities. "
        "Do not just repeat the role name; create realistic, professional sentences."
        "Put role on a separate line from the company name and time period, but above the job description bullets. "
        "- Format exactly as follows: "
        "\"Company Name - Time Period\" (newline) "
        "\"Role Name\" (newline) "
        "\"- Bullet point 1\" (newline) "
        "\"- Bullet point 2\" "
        "Do NOT use commas to separate fields in the experience section in any circumstance. Use hyphens only. "
        

        "- For projects: summarize each project in 1 to 2 sentences describing its purpose, functionality, and impact. "
        "Include a link if available. Do not only just copy the description from the form. "
        "- Description should be separate from the title and the link. Insert the newly generated description as a newline after the line containing the project title and link. Example: "
        "\"HireHub - \", at the end of the first line: \"Project Link \", then on a new link, the description: \"Project Description\" "
        "- For any project, make sure to output links as: <a href=\"{projLink}\" target=\"_blank\" rel=\"noopener noreferrer\">Project Link</a> "
        "Do NOT use commas to separate fields in the projects section in any circumstance. If needed, use hyphens only. "

        "- For skills and languages, list them clearly and on separate bulletpoints if both are present. "
        "Format example: \"Skills: Skill1, Skill2\" new line, then \"Languages: Language1, Language2.\" "
        "- Do the same with certifications and interests if provided. Do NOT combine them into one line. "
        "- Capitalize the first letter of each word in a field. Do NOT use all caps or all lowercase. "
        "Do NOT use hyphens to separate fields in any circumstance. If needed, use commas for the skills section only. "

        "For education, include school name and graduation year on one line, followed by \"- Degree in: {degree}\" on the next line. "
        "Do NOT use commas to separate fields in education in any circumstance. If needed, use hyphens only. "

        "- Replace {{skills_line}} with a comma-separated list of skills. "
        "- Replace {{languages_line}} with a comma-separated list of languages. "
        "- Replace {{projects}} with HTML divs for each project containing a title, description, and link. "
        "- Replace {{experience}} with HTML divs for each job containing company, role, time, and bullets. "
        
        
        "- Keep in mind that the HTML template given explicitely uses the entire line to separate different fields. "
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
