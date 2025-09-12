import ort from "onnxruntime-node";
import fs from "fs";

let session;
let labels = [];

export async function loadModel() {
  session = await ort.InferenceSession.create("models/medicine_model.onnx");
  labels = JSON.parse(fs.readFileSync("models/labels.json"));
  console.log("✅ Model & labels loaded!");
}

export function getSession() {
  if (!session) throw new Error("Model not loaded yet");
  return session;
}

export function getLabels() {
  return labels;
}
