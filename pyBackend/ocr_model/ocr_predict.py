import re
import cv2
import numpy as np
from PIL import Image
import easyocr
from fuzzywuzzy import process

# Initialize EasyOCR once
reader = easyocr.Reader(['en'])

# Medicine list
MEDICINE_LIST = ["Paracetamol", "Amoxicillin", "Ibuprofen", "Metformin", "Aspirin",
                 "Cetirizine", "Omeprazole", "Azithromycin"]

NAME_KEYWORDS = ["Patient Name", "Name", "Pt Name"]
NOTE_KEYWORDS = ["Instructions", "Notes", "Advice"]

# Preprocessing
def preprocess_image(image_path):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    denoised = cv2.fastNlMeansDenoising(gray, h=30)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    enhanced = clahe.apply(denoised)
    return enhanced

# OCR
def predict_prescription(image_path):
    preprocessed_img = preprocess_image(image_path)
    results = reader.readtext(preprocessed_img)
    raw_text = " ".join([res[1] for res in results])
    return raw_text

# Fuzzy medicine extraction
def extract_medicines(raw_text):
    words = re.findall(r'\b\w+\b', raw_text)
    medicines_found = []
    for word in words:
        match, score = process.extractOne(word, MEDICINE_LIST)
        if score >= 80:
            pattern = rf"{word}\s*(\d+mg|\d+ ml|\d+ g)?"
            dosage_match = re.search(pattern, raw_text, re.IGNORECASE)
            medicine_info = {'name': match}
            if dosage_match and dosage_match.group(1):
                medicine_info['dosage'] = dosage_match.group(1)
            medicines_found.append(medicine_info)
    return medicines_found

# Parser
def parse_prescription_text(raw_text):
    structured_data = {'patient_name': None, 'medicines': [], 'notes': None}

    # Patient name
    for keyword in NAME_KEYWORDS:
        pattern = rf"{keyword}\s*[:\-]?\s*([A-Za-z ]+)"
        match = re.search(pattern, raw_text, re.IGNORECASE)
        if match:
            structured_data['patient_name'] = match.group(1).strip()
            break

    # Medicines
    structured_data['medicines'] = extract_medicines(raw_text)

    # Notes
    for keyword in NOTE_KEYWORDS:
        pattern = rf"{keyword}\s*[:\-]?\s*(.*)"
        match = re.search(pattern, raw_text, re.IGNORECASE)
        if match:
            structured_data['notes'] = match.group(1).strip()
            break

    return structured_data

# Full pipeline
def predict_prescription_full(image_path):
    raw_text = predict_prescription(image_path)
    structured_data = parse_prescription_text(raw_text)
    return {'raw_text': raw_text, 'structured_data': structured_data}
