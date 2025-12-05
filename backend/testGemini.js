import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.MEDSCAN_OCR_KEY);

  const model = genAI.getGenerativeModel({
    model: "models/gemini-2.5-flash"
  });

  const response = await model.generateContent("Hello! Extract this text.");
  console.log(response.response.text());
}

test();
