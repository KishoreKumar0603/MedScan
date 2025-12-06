# app.py
from flask import Flask, request, jsonify
from ocr.paddle_ocr_engine import MedScanOCR
from nlp.scispacy_engine import MedScanNLP
from utils.json_formatter import format_medscan_output
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

ocr_engine = MedScanOCR()
nlp_engine = MedScanNLP()

@app.route("/api/upload-prescription", methods=["POST"])
def upload_prescription():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    os.makedirs("uploads", exist_ok=True)
    filepath = os.path.join("uploads", file.filename)
    file.save(filepath)

    raw_text = ocr_engine.extract_text(filepath)

    entities = nlp_engine.extract_entities(raw_text)
    medicines = nlp_engine.clean_prescription(raw_text)

    response = format_medscan_output(raw_text, entities, medicines)

    return jsonify(response), 200


if __name__ == "__main__":
    app.run(debug=True, port=5001)
