# app.py
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image
import io
import torch

app = FastAPI(title="MedScan TrOCR Inference")

# CORS - allow your frontend origin(s)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # replace "*" with your frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# load model & processor once at startup
MODEL_NAME = "microsoft/trocr-base-handwritten"

device = "cuda" if torch.cuda.is_available() else "cpu"
print("Using device:", device)

processor = TrOCRProcessor.from_pretrained(MODEL_NAME)
model = VisionEncoderDecoderModel.from_pretrained(MODEL_NAME).to(device)
model.eval()

@app.post("/ocr")
async def ocr_image(file: UploadFile = File(...)):
    print("inside ocr_image endpoint")
    if not file.content_type.startswith("image") and file.content_type != "application/octet-stream":
        print("Invalid file type:", file.content_type)
        raise HTTPException(status_code=400, detail="File must be an image")

    contents = await file.read()
    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        print("Image successfully opened")
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read image")

    pixel_values = processor(images=image, return_tensors="pt").pixel_values.to(device)
    print("Image processed, starting OCR generation")
    
    try:
        with torch.no_grad():
            generated_ids = model.generate(pixel_values, max_length=512)
            preds = processor.batch_decode(generated_ids, skip_special_tokens=True)
            print("OCR generation completed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR generation failed: {e}")

    return {
        "raw_text": preds[0] if preds else "",
        "filename": file.filename,
        "content_type": file.content_type,
    }


@app.get("/")
def root():
    return {"msg": "MedScan TrOCR service is up"}
