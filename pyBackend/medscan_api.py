from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from ocr_model.ocr_predict import predict_prescription_full

app = FastAPI(title="MedScan OCR API")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())

    result = predict_prescription_full(file_location)
    return JSONResponse(content=result)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
