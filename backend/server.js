import express, { raw } from "express";
import cors from "cors";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import path from "path";

const app = express();
const PORT = 5000;

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
}));
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.post("/api/upload-prescription", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No file uploaded" });
  }

  try {
    const filePath = req.file.path;
    console.log("Uploaded file path:", filePath);

    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    const response = await axios.post("http://localhost:8000/ocr", form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
    });

    fs.unlinkSync(filePath);

    res.json({
      patient_name: response.data.patient_name || null,
      medicines: response.data.medicines || [],
      raw_text: response.data.raw_text || "",
    });
  } catch (err) {
    console.error("OCR error:", err.message);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/saveResult", async (req, res) => {
  try {
    const data = req.body;

    const saveDir = path.join(process.cwd(), "saved_results");
    if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir);

    const filename = `result_${Date.now()}.json`;
    fs.writeFileSync(path.join(saveDir, filename), JSON.stringify(data, null, 2));

  } catch (err) {
    console.error("Save error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("✅ MedScan Node.js API is running 🚀");
});

app.listen(PORT, () => {
  console.log(`✅ MedScan Node.js server running at http://localhost:${PORT}`);
});
