
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();


const genAI = new GoogleGenerativeAI(process.env.MEDSCAN_OCR_KEY);


export async function runOcrEngine(imagePath) {
  try {
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString("base64");

    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash",
    });

    const prompt = `
You are a medical OCR engine similar to PaddleOCR.
Extract ALL visible handwritten or printed text from this prescription image.
Return ONLY plain text. Do not interpret or explain.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image,
        }
      }
    ]);

    return result.response.text();

  } catch (error) {
    console.error("OCR Engine Error:", error.message);
    return "";
  }
}
