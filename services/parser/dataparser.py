import json
import google.generativeai as genai

GOOGLE_API_KEY = "AIzaMsALnz0oOkrx0N1-0uzMAL1Q2Dim1p0PqsL" # dummy API key
genai.configure(api_key=GOOGLE_API_KEY)

def run_model(prompt):
    model = genai.GenerativeModel('gemini-1.5-flash', generation_config={"response_mime_type": "application/json"})
    response = model.generate_content(prompt)
    return json.loads(response.text)

def parse_education(content):
    schema = """
    education = {
        "degree": { "type": "string" },
        "major": { "type": "string" },
        "institution": { "type": "string" },
        "start_date": { "type": "number" },   # Assuming year as number
        "end_date": { "type": "number" }   # Assuming year as number
    }
    """

    prompt = f"""
    Extract the educational background information (institute name, degree title, major course, join date, graduation date) from provided content below:

    {content}

    Using this JSON schema:

        {schema}

    Return a `list[education]``
    """
    
    return run_model(prompt)

def parse_experience(content):
    schema = """
    experience = {
        "title": { "type": "string" }, # e.g. web developer, or any role in company
        "company": { "type": "string" }, # name of the company
        "start_date": { "type": "number" }, # Assuming year as number
        "end_date": { "type": "number" },   # Assuming year as number
        "description": { "type": "string" } # if present else none
    }
    """

    prompt = f"""
    Extract the experience background information (job role, company name, date of joining, date of leaving, description) from provided content below:

    {content}

    Using this JSON schema:

        {schema}

    Return a `list[experience]``
    """
    return run_model(prompt)

def parse_skills(content):
    schema = """
    skills = {
        "name": { "type": "string" },
    }
    """

    prompt = f"""
    Extract the skills from provided content below:

    {content}

    Using this JSON schema:

        {schema}

    Return a `list[skills]``
    """
    return run_model(prompt)