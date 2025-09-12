import express from "express";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";

const app = express();
const PORT = 3000;

const upload = multer({ dest: "uploads/" }); // temporary folder

app.post("/upload-prescription", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path; // <- this is the uploaded file path

    // Send to Python FastAPI
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    const response = await axios.post("http://localhost:8000/predict", form, {
      headers: form.getHeaders(),
    });

    // Optional: delete temp file after sending
    fs.unlinkSync(filePath);

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
