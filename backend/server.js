import express from "express";
import cors from "cors";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";

const app = express();
const PORT = 3000;

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
}));

const upload = multer({ dest: "uploads/" });

app.post("/upload-prescription", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;

    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    const response = await axios.post("http://localhost:8000/predict", form, {
      headers: form.getHeaders(),
    });

    fs.unlinkSync(filePath);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(PORT, () => console.log(`Node.js server running on http://localhost:${PORT}`));
