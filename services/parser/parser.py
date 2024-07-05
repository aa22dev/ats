import re
import json
import pdfplumber
import spacy
from dataparser import parse_education, parse_experience, parse_skills
import sys
nlp = spacy.load('en_core_web_sm')

def extract_text_from_pdf(pdf_path):
    full_text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                full_text += text + "\n"
    return full_text

def extract_section(text, section_title):
    pattern = rf"(?i)({section_title})\s*\n([\s\S]*?)(?=\n(?:Education|Experience|Projects|Skills|Languages|Certifications|Licenses|$))"
    matches = re.findall(pattern, text, re.DOTALL)
    return matches[0][1].strip() if matches else ""

def extract_education(text):
    return extract_section(text, "Education")

def extract_experience(text):
    return extract_section(text, "Experience|Work Experience|Employment History|Experiences")

def extract_skills(text):
    return extract_section(text, "Top Skills|Skills|Technical Skills|Languages")

def extract_name(text):
    doc = nlp(text)
    for ent in doc.ents:
        if ent.label_ == 'PERSON':
            return ent.text
    return None

def extract_contact_details(text):
    linkedin_pattern = r"(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|pub|profile)\/[A-Za-z0-9_-]+"
    github_pattern = r"(?:https?:\/\/)?(?:www\.)?github\.com\/[A-Za-z0-9_-]+"
    phone_pattern = r"((?:\+92|92|0)(?:[-.\s]?\d{3}){2}[-.\s]?\d{4})"
    email_pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"

    linkedin = re.findall(linkedin_pattern, text)
    github = re.findall(github_pattern, text)
    phone = re.findall(phone_pattern, text)
    email = re.findall(email_pattern, text)
    name = extract_name(text)

    return {
        "linkedin": linkedin[0] if linkedin else "",
        "github": github[0] if github else "",
        "phone_number": phone[0] if phone else "",
        "email": email[0] if email else "",
        "name": name
    }

def parse_resume(text):
    education = parse_education(extract_education(text))
    experience = parse_experience(extract_experience(text))
    skills = parse_skills(extract_skills(text))
    contact_details = extract_contact_details(text)
    
    return {
        **contact_details,
        "education": education,
        "experience": experience,
        "skills": skills
    }

pdf_path = sys.argv[1]

pdf_text = extract_text_from_pdf(pdf_path)
parsed_resume = parse_resume(pdf_text)

parsed_resume_json = json.dumps(parsed_resume, indent=4)
print(parsed_resume_json)
