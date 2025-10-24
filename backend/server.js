import express from "express";
import cors from "cors";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import path from "path";

const app = express();
const PORT = 5000; // match your frontend save endpoint

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // your React dev server
  methods: ["GET", "POST"],
}));
app.use(express.json());

// File upload setup
const upload = multer({ dest: "uploads/" });

// ------------------------------
// 🔹 1. Upload and OCR via FastAPI (TrOCR)
// ------------------------------
app.post("/api/upload-prescription", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    console.log("Uploaded file path:", filePath);
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    // send image to Python FastAPI OCR service
    const response = await axios.post("http://localhost:8000/ocr", form, {
      headers: form.getHeaders(),
    });

    // clean up uploaded temp file
    fs.unlinkSync(filePath);

    // return OCR result to frontend
    res.json({
      success: true,
      filename: req.file.originalname,
      raw_text: response.data.raw_text || "",
      structured_data: response.data.structured_data || {},
    });
  } catch (err) {
    console.error("OCR error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------------------
// 🔹 2. Save OCR Result to Database or JSON
// ------------------------------
app.post("/api/saveResult", async (req, res) => {
  try {
    const data = req.body;

    // Example: save results to local JSON file
    const saveDir = path.join(process.cwd(), "saved_results");
    if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir);

    const filename = `result_${Date.now()}.json`;
    fs.writeFileSync(path.join(saveDir, filename), JSON.stringify(data, null, 2));

    res.json({ success: true, message: "Result saved", filename });
  } catch (err) {
    console.error("Save error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------------------
// 🔹 3. Default route
// ------------------------------
app.get("/", (req, res) => {
  res.send("MedScan Node.js API is running 🚀");
});

// ------------------------------
// 🔹 4. Start server
// ------------------------------
app.listen(PORT, () => {
  console.log(`✅ MedScan Node.js server running at http://localhost:${PORT}`);
});
