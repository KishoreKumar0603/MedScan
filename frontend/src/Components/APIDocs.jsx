import React from "react";
import "../assets/css/APIDocs.css"; // optional custom CSS

const APIDocs = () => {
  return (
    <div className="container my-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="fw-bold text-success">MedScan API Documentation</h1>
        <p className="text-muted">
          Developer guide for integrating MedScan prescription scanner into your applications.
        </p>
      </div>

      {/* Overview */}
      <div className="mb-5">
        <h3 className="fw-semibold">Overview</h3>
        <p>
          The MedScan API allows you to upload handwritten or digital prescriptions and
          extract structured medical data such as <strong>Patient Name</strong>, <strong>Medicines</strong>,
          <strong>Dosages</strong>, and <strong>Instructions</strong>.  
          It uses advanced OCR (Tesseract) combined with a trained classification model for accuracy.
        </p>
      </div>

      {/* Base URL */}
      <div className="mb-5">
        <h3 className="fw-semibold">Base URL</h3>
        <code className="bg-light px-3 py-2 d-block rounded">
          https://api.medscan.com/v1
        </code>
      </div>

      {/* Endpoints */}
      <div className="mb-5">
        <h3 className="fw-semibold">Endpoints</h3>

        <div className="card mb-3 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">1. Upload Prescription</h5>
            <p className="card-text">
              <code>POST /upload</code>
            </p>
            <p>
              Upload a prescription image (JPG/PNG). The server will return extracted structured data.
            </p>
            <pre className="bg-light p-3 rounded">
{`Request:
POST /upload
Content-Type: multipart/form-data
Body: { file: prescription.jpg }`}
            </pre>
            <pre className="bg-dark text-white p-3 rounded">
{`Response:
{
  "patient_name": "John Doe",
  "medicines": [
    { "name": "Paracetamol", "dosage": "500mg", "frequency": "2x daily" },
    { "name": "Amoxicillin", "dosage": "250mg", "frequency": "3x daily" }
  ],
  "doctor": "Dr. Smith"
}`}
            </pre>
          </div>
        </div>

        <div className="card mb-3 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">2. Get Results</h5>
            <p className="card-text">
              <code>GET /results/:id</code>
            </p>
            <p>Retrieve the extracted prescription results by request ID.</p>
          </div>
        </div>
      </div>

      {/* Model Info */}
      <div className="mb-5">
        <h3 className="fw-semibold">Model Used</h3>
        <p>
          MedScan uses <strong>Tesseract OCR</strong> for text extraction and a
          <strong> Random Forest Classifier</strong> trained on prescription datasets to
          categorize medicines, dosages, and instructions accurately.
        </p>
      </div>

      {/* Footer */}
      <div className="text-center text-muted small">
        © 2025 MedScan API – Built with ❤️ for healthcare innovation.
      </div>
    </div>
  );
};

export default APIDocs;
