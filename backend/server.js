import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();


import { runOcrEngine } from "./core/ocrEngine.js";
import { extractMedicalEntities } from "./core/medicalExtractor.js";


const app = express();
const PORT = 5000;

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"]
}));

app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.post("/api/upload-prescription", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No file uploaded" });
  }

  const filePath = req.file.path;

  try {
    console.log("Uploaded file path:", filePath);

    const rawText = await runOcrEngine(filePath);
    console.log("Extracted raw text:", rawText);

    const extracted = await extractMedicalEntities(rawText);
    console.log("Extracted medical entities:", extracted);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return res.json({
      patient_name: extracted.patient_name || null,
      medicines: extracted.medicines || [],
      raw_text: rawText || "",
    });

  } catch (err) {
    console.error("OCR/NLP error:", err.message);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return res.status(500).json({ success: false, error: "Processing failed" });
  }
});

app.post("/api/saveResult", async (req, res) => {
  try {
    const data = req.body;

    const saveDir = path.join(process.cwd(), "saved_results");
    if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir);

    const filename = `result_${Date.now()}.json`;
    fs.writeFileSync(path.join(saveDir, filename), JSON.stringify(data, null, 2));

    res.json({ success: true, message: "Saved successfully" });

  } catch (err) {
    console.error("Save error:", err.message);
    res.status(500).json({ success: false, error: "Save failed" });
  }
});

app.get("/", (req, res) => {
  res.send("MedScan Node.js API is running 🚀");
});

app.listen(PORT, () => {
  console.log(`MedScan Node server running at http://localhost:${PORT}`);
});
