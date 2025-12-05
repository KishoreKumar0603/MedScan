import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

async function listModels() {
  const url = "https://generativelanguage.googleapis.com/v1beta/models?key=" + process.env.MEDSCAN_OCR_KEY;

  const res = await fetch(url);
  const data = await res.json();

  console.log(JSON.stringify(data, null, 2));
}

listModels().catch(console.error);
