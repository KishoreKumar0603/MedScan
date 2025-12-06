# ocr/paddle_ocr_engine.py
from models import medicine_model as PaddleOCR

class MedScanOCR:
    def __init__(self):
        self.ocr = PaddleOCR(use_angle_cls=True, lang="en")

    def extract_text(self, image_path):
        """
        Returns raw text from image using PaddleOCR.
        """
        result = self.ocr.ocr(image_path, cls=True)
        lines = []

        for block in result:
            for line in block:
                lines.append(line[1][0])

        return "\n".join(lines)
