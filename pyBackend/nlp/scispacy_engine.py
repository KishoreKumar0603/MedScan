# nlp/scispacy_engine.py
import spacy
import re
import json

class MedScanNLP:
    def __init__(self):
        self.nlp = spacy.load("en_core_sci_sm")

    def extract_entities(self, text):
        doc = self.nlp(text)

        entities = []
        for ent in doc.ents:
            entities.append({
                "text": ent.text,
                "label": ent.label_
            })

        return entities

    def clean_prescription(self, text):
        pattern = r"\b([A-Za-z]+(?:\s[A-Za-z]+)*)\s(\d{2,4}mg|\d+ml|\d+mcg)"
        matches = re.findall(pattern, text)

        return [{"medicine": m[0], "dosage": m[1]} for m in matches]
