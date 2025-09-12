import sharp from "sharp";
import ort from "onnxruntime-node";
import Tesseract from "tesseract.js";  // ✅ OCR for text extraction
import { getSession, getLabels } from "../config/modelConfig.js";

async function extractText(filePath) {
  const { data: { text } } = await Tesseract.recognize(filePath, "eng");
  return text;
}

function parsePrescription(text) {
  let patientName = "";
  let prescription = [];

  const lines = text.split("\n").map(l => l.trim()).filter(l => l);

  for (const line of lines) {
    if (line.toLowerCase().includes("patient")) {
      patientName = line.split(":")[1]?.trim() || "";
    } else if (/\d+mg/i.test(line)) {
      // Example: "Paracetamol 500mg"
      const [medicine, dosage] = line.split(/(\d+mg)/i);
      prescription.push({
        medicine: medicine.trim(),
        dosage: dosage?.trim() || ""
      });
    }
  }

  return { patient_name: patientName, prescription };
}

export async function predictMedicine(req, res) {
  try {
    // 🔹 Step 1: OCR → extract raw text
    const rawText = await extractText(req.file.path);

    // 🔹 Step 2: Parse structured JSON
    const parsed = parsePrescription(rawText);

    res.json(parsed);
  } catch (err) {
    console.error("❌ Prescription parsing error:", err.message);
    res.status(500).json({ error: "Failed to process prescription" });
  }
}
