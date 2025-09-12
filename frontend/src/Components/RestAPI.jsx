import React, { useState } from "react";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy"; // ❌ remove this if not using MUI

const RestAPI = () => {
  const [tab, setTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const endpoints = [
    {
      title: "Upload Prescription",
      method: "POST",
      url: "/api/prescriptions/upload",
      description: "Upload a handwritten prescription image and extract structured data.",
      request: `curl -X POST http://localhost:5000/api/prescriptions/upload \\
  -F "file=@prescription.png"`,
      response: `{
  "patient": "John Doe",
  "age": 32,
  "medicines": [
    { "name": "Paracetamol", "dose": "500mg", "freq": "2/day" },
    { "name": "Amoxicillin", "dose": "250mg", "freq": "3/day" }
  ]
}`
    },
    {
      title: "Get All Prescriptions",
      method: "GET",
      url: "/api/prescriptions",
      description: "Fetch all saved prescriptions with parsed data.",
      request: `curl http://localhost:5000/api/prescriptions`,
      response: `[
  {
    "id": "p1",
    "patient": "John Doe",
    "medicines": [
      { "name": "Paracetamol", "dose": "500mg", "freq": "2/day" }
    ]
  },
  {
    "id": "p2",
    "patient": "Jane Smith",
    "medicines": [
      { "name": "Ibuprofen", "dose": "200mg", "freq": "1/day" }
    ]
  }
]`
    },
    {
      title: "Health Insights",
      method: "GET",
      url: "/api/insights",
      description: "AI-based insights on prescribed medicines (side effects, dosage warnings).",
      request: `curl http://localhost:5000/api/insights`,
      response: `{
  "warnings": [
    "Paracetamol: Avoid alcohol",
    "Amoxicillin: May cause nausea"
  ],
  "suggestions": [
    "Take medicines after food",
    "Stay hydrated"
  ]
}`
    }
  ];

  return (
    <div className="container my-5">
      <h1 className="fw-bold text-center mb-3" style={{ color: "#009688" }}>
        MedScan REST API
      </h1>
      <p className="text-center text-muted mb-4">
        Explore and integrate MedScan’s doctor prescription scanning services with these API endpoints.
      </p>

      {/* Tabs */}
      <ul className="nav nav-pills justify-content-center mb-4">
        {endpoints.map((ep, idx) => (
          <li className="nav-item" key={idx}>
            <button
              className={`nav-link ${tab === idx ? "active" : ""}`}
              style={{ color: tab === idx ? "white" : "#009688" }}
              onClick={() => setTab(idx)}
            >
              {ep.title}
            </button>
          </li>
        ))}
      </ul>

      {/* Endpoint Card */}
      <div className="card shadow p-4 rounded-4">
        <h4>
          <span
            style={{
              background: "#009688",
              color: "white",
              padding: "4px 10px",
              borderRadius: "8px",
              marginRight: "10px",
              fontSize: "14px",
            }}
          >
            {endpoints[tab].method}
          </span>
          {endpoints[tab].url}
        </h4>
        <p className="text-muted">{endpoints[tab].description}</p>

        {/* Request Section */}
        <h6 className="mt-3">Request</h6>
        <div className="bg-dark text-light p-3 rounded position-relative">
          <pre className="m-0">{endpoints[tab].request}</pre>
          <button
            className="btn btn-sm btn-outline-light position-absolute top-0 end-0 m-2"
            onClick={() => handleCopy(endpoints[tab].request)}
          >
            📋
          </button>
        </div>

        {/* Response Section */}
        <h6 className="mt-3">Response</h6>
        <div className="bg-dark text-light p-3 rounded position-relative">
          <pre className="m-0">{endpoints[tab].response}</pre>
          <button
            className="btn btn-sm btn-outline-light position-absolute top-0 end-0 m-2"
            onClick={() => handleCopy(endpoints[tab].response)}
          >
            📋
          </button>
        </div>

        {copied && (
          <p className="text-success mt-2" style={{ fontSize: "14px" }}>
            ✅ Copied to clipboard!
          </p>
        )}
      </div>
    </div>
  );
};

export default RestAPI;
