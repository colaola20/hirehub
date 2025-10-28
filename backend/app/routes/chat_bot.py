# backend/chat_route.py
import os, sys, requests
from flask import Blueprint, request, jsonify, send_file
from io import BytesIO
from datetime import datetime

chat_bp = Blueprint("chat_bp", __name__)
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

@chat_bp.post("/chat")
def chat():
    if not GROQ_API_KEY:
        return jsonify({"error": "GROQ_API_KEY not set"}), 500

    data = request.get_json(force=True) or {}
    user_message = (data.get("message") or "").strip()
    job = data.get("job") or {}
    if not user_message:
        return jsonify({"error": "Empty message"}), 400

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
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"{job_context}\n\nUSER QUESTION:\n{user_message}"}
        ],
        "temperature": 0.4,
        "max_tokens": 600,
        "stream": False
    }
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
    r = requests.post("https://api.groq.com/openai/v1/chat/completions", json=payload, headers=headers, timeout=30)
    if r.status_code >= 400:
        try:
            return jsonify(r.json()), r.status_code
        except Exception:
            return jsonify({"error": f"Groq API error: {r.text}"}), r.status_code

    data = r.json()
    answer = (data.get("choices") or [{}])[0].get("message", {}).get("content", "")
    return jsonify({"answer": answer})



# -------- PDF export (lazy import with explicit errors) --------
@chat_bp.post("/chat/pdf")
def chat_pdf():
    try:
        from reportlab.lib.pagesizes import LETTER
        from reportlab.lib import colors
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
    except Exception as e:
        return jsonify({
            "error": (
                "PDF export unavailable: install 'reportlab' (pip install reportlab). "
                f"Running interpreter: {sys.executable}"
            )
        }), 501

    data = request.get_json(force=True) or {}
    content = (data.get("content") or "").strip()
    if not content:
        return jsonify({"error": "No content to export"}), 400

    question = (data.get("question") or "").strip()
    job = data.get("job") or {}

    buf = BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=LETTER, leftMargin=54, rightMargin=54, topMargin=54, bottomMargin=54)

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('title', parent=styles['Heading1'], fontName='Helvetica-Bold',
                                 fontSize=16, leading=20, textColor=colors.HexColor('#222222'), spaceAfter=10)
    meta_style = ParagraphStyle('meta', parent=styles['Normal'], fontSize=10,
                                textColor=colors.HexColor('#555575'), spaceAfter=6)
    h_style = ParagraphStyle('h', parent=styles['Heading2'], fontSize=12,
                             textColor=colors.HexColor('#111111'), spaceBefore=8, spaceAfter=6)
    body_style = ParagraphStyle('body', parent=styles['Normal'], fontSize=11,
                                leading=15, textColor=colors.HexColor('#111111'))

    elems = []
    ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
    elems.append(Paragraph("HireHub – Job Assistant Reply", title_style))
    elems.append(Paragraph(f"Generated: {ts}", meta_style))
    if job:
        elems.append(Paragraph(
            f"Job: {job.get('title','N/A')} @ {job.get('company','N/A')} &middot; {job.get('location','')}",
            meta_style
        ))
    if question:
        elems.append(Paragraph("Question", h_style))
        elems.append(Paragraph(question.replace("\n", "<br/>"), body_style))

    elems.append(Spacer(1, 8))
    elems.append(Paragraph("Assistant Reply", h_style))
    for para in content.split("\n\n"):
        elems.append(Paragraph(para.strip().replace("\n", "<br/>"), body_style))
        elems.append(Spacer(1, 6))

    doc.build(elems)
    buf.seek(0)
    return send_file(buf, mimetype="application/pdf", as_attachment=True, download_name="assistant_reply.pdf")


# -------- tiny env probe to see where Flask runs --------
@chat_bp.get("/chat/pdf/debug")
def chat_pdf_debug():
    out = {
        "python_executable": sys.executable,
        "python_version": sys.version,
        "sys_path_first": sys.path[:3],
        "reportlab_importable": False,
        "reportlab_location": None,
    }
    try:
        import reportlab  # type: ignore
        out["reportlab_importable"] = True
        out["reportlab_location"] = getattr(reportlab, "__file__", None)
    except Exception:
        pass
    return jsonify(out)