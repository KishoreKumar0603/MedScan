import React, { useState } from "react";
import { Spinner } from "react-bootstrap";

export default function OCRUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Use environment variables for flexibility
  const OCR_API = import.meta.env.VITE_OCR_API || "http://localhost:8000/ocr";
  const NODE_SAVE_URL = import.meta.env.VITE_NODE_API || "http://localhost:5000/api/saveResult";

  const onFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setResult(null);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  };

  const upload = async () => {
    if (!file) return alert("Please select an image to upload.");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(OCR_API, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "OCR request failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("OCR Error:", err);
      alert("OCR failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveResult = async () => {
    if (!result) return alert("No OCR result to save!");
    try {
      const response = await fetch(NODE_SAVE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });

      if (!response.ok) throw new Error("Failed to save result");
      alert("Result saved successfully!");
    } catch (err) {
      console.error("Save Error:", err);
      alert("Error saving result: " + err.message);
    }
  };

  const clearAll = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm p-4">
        <h3 className="text-center mb-3">🩺 MedScan — Prescription OCR (TrOCR)</h3>

        {/* File Upload */}
        <div className="mb-3 text-center">
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={onFileChange}
          />
        </div>

        {/* Image Preview */}
        {preview && (
          <div className="text-center mb-3">
            <img
              src={preview}
              alt="Prescription preview"
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: "350px" }}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="d-flex justify-content-center mb-3">
          <button
            className="btn btn-primary me-2"
            onClick={upload}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" /> Recognizing...
              </>
            ) : (
              "Run OCR"
            )}
          </button>

          <button className="btn btn-secondary me-2" onClick={clearAll}>
            Clear
          </button>

          {result && (
            <button className="btn btn-success" onClick={saveResult}>
              Save Result
            </button>
          )}
        </div>

        {/* OCR Result Display */}
        {result && (
          <div className="card border-0 shadow-sm bg-light p-3 mt-3">
            <h5>OCR Result</h5>
            <p className="mb-1">
              <strong>Filename:</strong> {result.filename}
            </p>
            <p className="mb-1">
              <strong>Content Type:</strong> {result.content_type}
            </p>
            <div className="mt-2">
              <strong>Extracted Text:</strong>
              <pre
                className="p-2 mt-2 bg-white rounded"
                style={{
                  whiteSpace: "pre-wrap",
                  fontFamily: "monospace",
                  fontSize: "0.95rem",
                }}
              >
                {result.raw_text}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
