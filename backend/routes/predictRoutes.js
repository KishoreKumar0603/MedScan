import express from "express";
import multer from "multer";
import { predictMedicine } from "../controllers/predictController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/predict", upload.single("image"), predictMedicine);

export default router;
