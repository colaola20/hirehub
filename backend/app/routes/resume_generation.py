from flask import Blueprint, request, jsonify
import requests
import os
import json

resume_bp = Blueprint("resume_generation", __name__)

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

HTML_TEMPLATE = """

    <div class="header">
        <h1 class="headerName">{{fullname}}</h1>
        <p>
            Email: {{email}} | Phone: {{phone}} | {{city}} |
            <a href="{{linkedin}}">LinkedIn</a> |
            <a href="{{github}}">GitHub</a>
        </p>
        <hr class="divider" />
    </div>


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
            {{#projects}}
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
            {{/projects}}
        </div>

        <div class="experience">
            <h2 class="sectionTitle">Experience</h2>
            <hr class="dividerSmall" />
            {{#experience}}
            <div class="experienceEntry">
                <div class="experienceCompany">{Company Name}</div>
                <div class="experienceTime">{Time Period}</div>
                <div class="experienceRole">{Role Name}</div>
                <div class="experienceBullets">
                    - {Bullet 1}<br>
                    - {Bullet 2}
                </div>
            </div>
            {{/experience}}
        </div>

        <div class="education">
            <h2 class="sectionTitle">Education</h2>
            <hr class="dividerSmall" />
            {{#education}}
            <div class="educationEntry">
                <div class="educationSchool">{School Name}</div>
                <div class="educationGradYear">{Graduation Year}</div>
                <div class="educationDegree">
                    Degree in: {Degree}
                </div>
            </div>
            {{/education}}
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
        1. Structured resume JSON data.
        2. Instructions to generate a modern, visually appealing resume.

        Your task:
        - Do NOT include any outer container div. 
        - Only output the sections themselves (header, skills, projects, experience, education).
        - Do NOT wrap everything in a single parent div.
        - Each section should start at the top level of the HTML.
        - Do NOT follow any previous CSS or templates.
        - Make it look modern, professional, and readable.
        - Keep the content concise and one-page friendly.
        - Fill all placeholders like {{fullname}}, {{email}}, {{projects}}, etc.
        - Include sections for Skills, Languages, Projects, Experience, Education.
        - Use creative styling: colors, fonts, spacing, layout (columns, flexbox, grids, etc.)
        - Output HTML only, no explanations.

        Enhancement Rules:

        1. Job Experience (step4.jobs):
        - Use company, role, roleTime, and jobDescription fields.
        - Rewrite the jobDescription into 1–2 professional bullet points per job.
        - Highlight accomplishments, skills, or measurable impact.
        - Avoid simply repeating the role name.
        - Use active, results-oriented language.
        - Place the role on a separate line from company and time period.
        - Use hyphens for bullets; do not use commas to separate fields.
        - Example enhancement:
            Input: "Worked as a Sales Associate -"
            Output:
                - Delivered excellent customer service, assisting 50+ customers daily.
                - Organized store displays to increase product visibility and sales.

        2. Projects (step6.projects):
        - Summarize each project in 1–2 sentences describing purpose, functionality, and impact.
        - Include a link if available using:
        <a href="{projLink}" target="_blank" rel="noopener noreferrer">Project Link</a>
        - Put the description on a new line below the title and link.
        - Do not copy the description verbatim; improve clarity and professionalism.
        - Use concise language emphasizing achievements or results.

        3. Skills and Languages (step3):
        - List skills and languages clearly on separate lines.
        - Capitalize the first letter of each word.
        - Skills must be on their own line, languages directly below.
        - Do NOT use hyphens for skills, use commas for skills ONLY.
        - On each new line, specify what section you are writing about. Example: "Skills: Skill1, Skill2", etc.

        4. Education (step5.education):
        - Display school name + graduation year on one line.
        - Display degree on a new line: "Degree in: {Degree}".
        - Use hyphens only; do not use commas to separate fields.
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
