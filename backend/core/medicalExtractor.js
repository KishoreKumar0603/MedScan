import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.MEDSCAN_OCR_KEY);

export async function extractMedicalEntities(rawText) {
  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash",
    });

    const prompt = `
You are a SciSpaCy-based medical entity extractor.

Extract the following structure ONLY as PURE VALID JSON. No extra text. No commentary. No markdown.
If a field is missing in the text, leave it as an empty string.

JSON format:
{
  "patient_name": "",
  "age": "",
  "gender": "",
  "diagnosis": "",
  "medicines": [
    {
      "name": "",
      "dose": "",
      "freq": "",
      "duration": ""
    }
  ],
  "notes": ""
}

Here is the text to analyze:
""" 
${rawText}
"""

Output only JSON.
`;

    const result = await model.generateContent(prompt);

    // Gemini returns extra content sometimes → clean it
    let raw = result.response.text().trim();

    // Remove markdown fences
    raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

    // Extract only JSON block using regex
    const jsonMatch = raw.match(/\{[\s\S]*\}$/);

    if (!jsonMatch) {
      console.error("No JSON detected in model output:", raw);
      return emptyJsonResponse();
    }

    let cleanJson = jsonMatch[0];

    try {
      const parsed = JSON.parse(cleanJson);
      parsed.medicines = (parsed.medicines || []).map((m) => ({
        name: m.name || "",
        dose: m.dosage || m.dose || "",
        freq: m.frequency || m.freq || "",
        duration: m.duration || "",
      }));

      return parsed;
    } catch (err) {
      console.error("JSON parse error:", err.message);
      console.log("RAW RESPONSE:", cleanJson);
      return emptyJsonResponse();
    }

  } catch (error) {
    console.error("Medical Extractor Error:", error.message);
    return emptyJsonResponse();
  }
}

function emptyJsonResponse() {
  return {
    patient_name: "",
    age: "",
    gender: "",
    diagnosis: "",
    medicines: [],
    notes: ""
  };
}
