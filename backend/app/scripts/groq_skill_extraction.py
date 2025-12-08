"""
Groq-Based Skill Extraction for Job Descriptions (Standalone)
FREE tier: 30 requests/minute, 14,400 requests/day
FAST: ~10x faster than OpenAI/Claude
"""

import json
import logging
from typing import Dict, List, Optional
import os
import time
from functools import wraps
import re

logger = logging.getLogger(__name__)


# ============================================================
# SIMPLE REGEX FALLBACK (No external dependencies)
# ============================================================

SIMPLE_SKILL_PATTERNS = {
    "python": r"\bpython\b",
    "javascript": r"\b(?:javascript|js)\b",
    "typescript": r"\btypescript\b",
    "java": r"\bjava\b(?!script)",
    "sql": r"\bsql\b",
    "react": r"\breact(?:js)?\b",
    "nodejs": r"\bnode(?:\.js|js)?\b",
    "aws": r"\baws\b",
    "docker": r"\bdocker\b",
    "kubernetes": r"\bk8s|kubernetes\b",
    "git": r"\bgit\b",
    "postgresql": r"\bpostgres(?:ql)?\b",
    "mongodb": r"\bmongo(?:db)?\b",
    "mysql": r"\bmysql\b",
    "redis": r"\bredis\b",
}

def simple_extract_skills(text: str) -> List[str]:
    """Simple regex skill extraction (fallback)"""
    if not text:
        return []
    
    text_lower = text.lower()
    found = []
    
    for skill, pattern in SIMPLE_SKILL_PATTERNS.items():
        if re.search(pattern, text_lower, re.IGNORECASE):
            found.append(skill)
    
    return found


def simple_extract_experience_level(text: str) -> str:
    """Simple experience level extraction"""
    if not text:
        return "unknown"
    
    text_lower = text.lower()
    
    if re.search(r"\b(?:senior|sr\.|staff|principal|lead)\b", text_lower):
        return "senior"
    elif re.search(r"\b(?:mid|intermediate|mid-level)\b", text_lower):
        return "mid"
    elif re.search(r"\b(?:junior|entry|graduate|intern)\b", text_lower):
        return "entry"
    else:
        return "unknown"


# ============================================================
# GROQ SKILL EXTRACTION
# ============================================================

def extract_skills_with_groq(
    job_title: str,
    job_description: str,
    company: str = None,
    model: str = "llama-3.1-8b-instant"  # Fastest model
) -> Dict:
    """
    Extract skills using Groq's free API
    
    Available models:
    - llama-3.1-8b-instant (FASTEST - best for most jobs)
    - llama-3.3-70b-versatile (Smartest but slower)
    - mixtral-8x7b-32768 (Good balance)
    """
    
    # Build the prompt
    prompt = f"""Extract technical skills and requirements from this job posting.

Job Title: {job_title}
Company: {company or "Unknown"}

Description:
{job_description[:2000]}

Analyze and extract:
1. Technical skills (programming languages, frameworks, databases, cloud)
2. Tools (git, docker, CI/CD, etc.)
3. Soft skills (communication, leadership, etc.)
4. Experience level (entry/junior/mid/senior/lead)
5. Years of experience required
6. Education requirements

IMPORTANT:
- If vague description, list COMMON skills for that job title
- For non-technical roles (tester, marketing, etc.), return EMPTY arrays
- Return ONLY valid JSON, no markdown

{{
    "technical_skills": ["python", "aws"],
    "tools": ["git", "docker"],
    "soft_skills": ["communication"],
    "experience_level": "mid",
    "years_required": 3,
    "education": ["bachelor"],
    "confidence": "high",
    "reasoning": "Brief explanation"
}}"""

    try:
        from groq import Groq
        
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            logger.warning("GROQ_API_KEY not set, falling back to simple regex")
            raise ValueError("GROQ_API_KEY not set")
        
        client = Groq(api_key=api_key)
        
        # Call Groq API
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a job analyzer. Return ONLY valid JSON."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model=model,
            temperature=0.3,
            max_tokens=1000,
            response_format={"type": "json_object"}
        )
        
        result = chat_completion.choices[0].message.content
        parsed = json.loads(result)
        
        # Normalize skill names
        parsed["technical_skills"] = [
            s.lower().replace(" ", "_").replace("-", "_") 
            for s in parsed.get("technical_skills", [])
        ]
        parsed["tools"] = [
            s.lower().replace(" ", "_").replace("-", "_") 
            for s in parsed.get("tools", [])
        ]
        
        # Combine all technical skills
        all_technical = list(set(
            parsed.get("technical_skills", []) + 
            parsed.get("tools", [])
        ))
        
        parsed["all_skills"] = all_technical
        parsed["extraction_method"] = "groq"
        
        logger.info(f"Groq extracted {len(all_technical)} skills")
        return parsed
        
    except Exception as e:
        logger.warning(f"Groq extraction failed, using simple regex: {e}")
        # Fallback to simple regex
        full_text = f"{job_title}\n\n{job_description}"
        skills = simple_extract_skills(full_text)
        exp_level = simple_extract_experience_level(full_text)
        
        return {
            "technical_skills": skills,
            "tools": [],
            "soft_skills": [],
            "all_skills": skills,
            "experience_level": exp_level,
            "years_required": None,
            "education": [],
            "confidence": "low",
            "reasoning": "Fallback regex extraction",
            "extraction_method": "regex_fallback"
        }


# ============================================================
# HYBRID APPROACH
# ============================================================

def extract_skills_hybrid_groq(
    job_title: str,
    job_description: str,
    company: str = None,
    force_llm: bool = False,
    model: str = "llama-3.1-8b-instant"
) -> Dict:
    """
    Hybrid: Try simple regex first, use Groq if needed
    """
    if not force_llm:
        # Try simple regex first
        full_text = f"{job_title}\n\n{job_description}"
        regex_skills = simple_extract_skills(full_text)
        exp_level = simple_extract_experience_level(full_text)
        
        # If found 3+ skills, use regex
        if len(regex_skills) >= 3:
            logger.info(f"Simple regex found {len(regex_skills)} skills")
            return {
                "all_skills": regex_skills,
                "technical_skills": regex_skills,
                "tools": [],
                "soft_skills": [],
                "experience_level": exp_level,
                "years_required": None,
                "education": [],
                "confidence": "medium",
                "reasoning": "Simple regex extraction",
                "extraction_method": "regex"
            }
    
    # Use Groq for vague descriptions
    logger.info("Using Groq for extraction")
    return extract_skills_with_groq(job_title, job_description, company, model=model)


# ============================================================
# RATE LIMITING
# ============================================================

def rate_limit_groq(calls_per_minute: int = 28):
    """Rate limiter for Groq free tier (30/min, using 28 for safety)"""
    min_interval = 60.0 / calls_per_minute
    last_called = [0.0]
    
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            elapsed = time.time() - last_called[0]
            left_to_wait = min_interval - elapsed
            if left_to_wait > 0:
                time.sleep(left_to_wait)
            
            result = func(*args, **kwargs)
            last_called[0] = time.time()
            return result
        return wrapper
    return decorator


@rate_limit_groq(calls_per_minute=28)
def extract_with_rate_limit(*args, **kwargs):
    """Rate-limited extraction"""
    return extract_skills_with_groq(*args, **kwargs)


# ============================================================
# INTEGRATION HELPER
# ============================================================

def enhance_job_with_groq_skills(job_data: Dict) -> Dict:
    """
    Add skills to job data dict
    """
    if not job_data:
        return job_data
    
    try:
        # Extract skills
        skills = extract_skills_hybrid_groq(
            job_data.get("title", ""),
            job_data.get("description", ""),
            job_data.get("company")
        )
        
        # Add to job_data
        job_data["skills_extracted"] = skills.get("all_skills", [])
        job_data["skills_by_category"] = json.dumps({
            "technical": skills.get("technical_skills", []),
            "tools": skills.get("tools", []),
            "soft_skills": skills.get("soft_skills", [])
        })
        job_data["required_skills"] = skills.get("technical_skills", [])
        job_data["preferred_skills"] = skills.get("tools", [])
        job_data["experience_level"] = skills.get("experience_level", "unknown")
        job_data["years_experience"] = skills.get("years_required")
        job_data["education_requirements"] = skills.get("education", [])
        
        logger.debug(f"Enhanced job with {len(skills.get('all_skills', []))} skills via {skills.get('extraction_method')}")
        
    except Exception as e:
        logger.exception(f"Failed to enhance job with skills: {e}")
        # Don't fail the whole job, just add empty skills
        job_data["skills_extracted"] = []
        job_data["skills_by_category"] = json.dumps({"technical": [], "tools": [], "soft_skills": []})
        job_data["required_skills"] = []
        job_data["preferred_skills"] = []
        job_data["experience_level"] = "unknown"
        job_data["years_experience"] = None
        job_data["education_requirements"] = []
    
    return job_data


# ============================================================
# BATCH PROCESSING
# ============================================================

def batch_extract_with_progress(
    jobs: List[Dict],
    batch_size: int = 10
) -> List[Dict]:
    """
    Process jobs in batches with progress reporting
    """
    results = []
    total = len(jobs)
    groq_count = 0
    regex_count = 0
    
    for i, job in enumerate(jobs, 1):
        try:
            enhanced = enhance_job_with_groq_skills(job)
            results.append(enhanced)
            
            # Track method
            method = enhanced.get("skills_extracted", {})
            if isinstance(method, dict):
                if method.get("extraction_method") == "groq":
                    groq_count += 1
                else:
                    regex_count += 1
            
            # Progress every 10 jobs
            if i % batch_size == 0:
                print(f"Progress: {i}/{total} | Groq: {groq_count} | Regex: {regex_count}")
                
        except Exception as e:
            logger.exception(f"Failed job {i}: {e}")
            results.append(job)
    
    print(f"\n✅ Done! Groq calls: {groq_count}, Regex: {regex_count}")
    return results


# ============================================================
# TESTING
# ============================================================

if __name__ == "__main__":
    # Test with your actual job examples
    
    print("=" * 70)
    print("TEST 1: Vague FindWork Job")
    print("=" * 70)
    
    job1 = {
        "title": "Mid-level to Senior Software Engineer",
        "company": "Boost My School",
        "description": """Love building a product that improves a user's life?
Our team has less experience in Support, QA, and DevOps Engineering.
For full details: https://www.boostmyschool.com/careers"""
    }
    
    result1 = enhance_job_with_groq_skills(job1)
    print(f"\nSkills: {result1.get('skills_extracted')}")
    print(f"Experience: {result1.get('experience_level')}")
    print(f"Method: {result1.get('skills_by_category')}")
    
    print("\n" + "=" * 70)
    print("TEST 2: Non-Technical Adzuna Job")
    print("=" * 70)
    
    job2 = {
        "title": "College Student Gig - Paid App Tester",
        "company": "Solara Health",
        "description": """Get paid $200 to test an app.
Personal experience with anxiety required.
Access to computer or tablet needed."""
    }
    
    result2 = enhance_job_with_groq_skills(job2)
    print(f"\nSkills: {result2.get('skills_extracted')}")
    print(f"Experience: {result2.get('experience_level')}")
    
    print("\n✅ Tests complete!")




# to run
# python -m app.scripts.groq_skill_extraction