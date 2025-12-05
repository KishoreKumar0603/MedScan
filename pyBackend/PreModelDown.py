from transformers import VisionEncoderDecoderModel, TrOCRProcessor

ocr_model_name = "microsoft/trocr-large-handwritten"

processor = TrOCRProcessor.from_pretrained(ocr_model_name)
model = VisionEncoderDecoderModel.from_pretrained(ocr_model_name)

print("Model and processor downloaded successfully.")
