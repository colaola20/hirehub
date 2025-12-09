from flask import Blueprint, request, send_file, jsonify
import pypandoc
import tempfile
import os

docx_bp = Blueprint("docx", __name__)

@docx_bp.route("/generate-docx", methods=["POST"])
def generate_docx():
    try:
        data = request.get_json()
        html = data.get("html", "")

        if not html:
            return jsonify({"error": "No HTML provided"}), 400

        temp_docx = tempfile.NamedTemporaryFile(delete=False, suffix=".docx")
        temp_docx.close()

        pypandoc.convert_text(
            html,
            "docx",
            format="html",
            outputfile=temp_docx.name,
            extra_args=["--standalone"]
        )

        return send_file(
            temp_docx.name,
            mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            as_attachment=True,
            download_name="resume.docx"
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500