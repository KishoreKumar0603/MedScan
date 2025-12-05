from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image
import torch
import io
import numpy as np
import re
import pytesseract

app = FastAPI(title="MedScan Prescription OCR")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ocr_model_name = "microsoft/trocr-base-handwritten"  # stable
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

@app.on_event("startup")
async def load_model():
    global processor, model
    try:
        print("Loading OCR model from local cache...")
        processor = TrOCRProcessor.from_pretrained(ocr_model_name, local_files_only=True)
        model = VisionEncoderDecoderModel.from_pretrained(ocr_model_name, local_files_only=True)
        model.to(device)
        print(f"✅ TrOCR model loaded on {device}")
    except Exception as e:
        print("❌ Failed to load model locally:", e)
        raise RuntimeError(
            "Model not found in local cache. Please download it first."
        )

def preprocess_image(pil_image: Image.Image) -> Image.Image:
    return pil_image.resize((384, 384))

def extract_prescription_info(ocr_text: str):
    lines = ocr_text.splitlines()
    patient_name = None
    medicines = []

    for line in lines:
        clean_line = line.strip()
        if any(c.isalpha() for c in clean_line):
            patient_name = clean_line
            break

    med_pattern = r"([A-Za-z0-9\-]+)\s+(\d+\s*(?:mg|ml|g))(\s*[0-9x/]+)?"
    for line in lines:
        match = re.search(med_pattern, line)
        if match:
            name = match.group(1)
            dosage = match.group(2)
            frequency = match.group(3).strip() if match.group(3) else None
            medicines.append({"name": name, "dosage": dosage, "frequency": frequency})

    return patient_name, medicines

@app.post("/ocr")
async def ocr_image(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read uploaded file as an image")

    image = preprocess_image(image)

    try:
        pixel_values = processor(images=image, return_tensors="pt").pixel_values.to(device)
        with torch.no_grad():
            generated_ids = model.generate(pixel_values, max_length=64)
            raw_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
        if not raw_text.strip():
            raise ValueError("TrOCR returned empty text")
        print("✅ OCR successful using TrOCR")
    except Exception as e:
        print(f"⚠️ TrOCR failed: {e}, falling back to Tesseract OCR")
        try:
            raw_text = pytesseract.image_to_string(np.array(image))
            if not raw_text.strip():
                raise ValueError("Tesseract returned empty text")
            print("✅ OCR successful using Tesseract")
        except Exception as e2:
            raise HTTPException(status_code=500, detail=f"OCR failed: {e2}")

    patient_name, medicines = extract_prescription_info(raw_text)

    return {
        "patient_name": patient_name,
        "medicines": medicines,
        "raw_text": raw_text
    }

@app.get("/")
def home():
    return {"message": "✅ MedScan Prescription OCR API is running"}
