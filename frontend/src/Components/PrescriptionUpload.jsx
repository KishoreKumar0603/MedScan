import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "../assets/css/PrescriptionUpload.css";

export default function PrescriptionUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [view, setView] = useState("json");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  // ----------------------------
  // 🔹 Preview handler
  // ----------------------------
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onFile = (f) => f && setFile(f);
  const handleFileChange = (e) => onFile(e.target.files?.[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) onFile(e.dataTransfer.files[0]);
  };
  const handleDragOver = (e) => e.preventDefault();

  // ----------------------------
  // 🔹 Upload Prescription → Node → FastAPI
  // ----------------------------
  const handleUpload = async () => {
    if (!file) return alert("Please select a prescription image first.");
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:5000/api/upload-prescription", // ✅ updated endpoint
        formData,
      );

      setResult(response.data); // response from Node (which calls FastAPI)
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload or process prescription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // 🔹 Save OCR Result (optional)
  // ----------------------------
  const handleSave = async () => {
    if (!result) return alert("No result to save!");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/saveResult", // ✅ updated endpoint
        result,
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.data.success) alert("Result saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save OCR result.");
    }
  };

  // ----------------------------
  // 🔹 Copy to clipboard
  // ----------------------------
  const handleCopy = async () => {
    if (!result) return;

    let text = "";
    switch (view) {
      case "json":
        text = JSON.stringify(result, null, 2);
        break;
      case "table":
        text = result.medicines
          ?.map((m) => `${m.name} | ${m.dose} | ${m.freq}`)
          .join("\n");
        break;
      case "sql":
        text = result.medicines
          ?.map(
            (m) =>
              `INSERT INTO prescriptions (name, dose, freq) VALUES ('${m.name}', '${m.dose}', '${m.freq}');`
          )
          .join("\n");
        break;
      case "mongo":
        text = result.medicines
          ?.map(
            (m) =>
              `db.prescriptions.insertOne({ name: "${m.name}", dose: "${m.dose}", freq: "${m.freq}" });`
          )
          .join("\n");
        break;
      default:
        text = "";
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for unsupported browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ----------------------------
  // 🔹 UI Rendering
  // ----------------------------
  return (
    <div className="prescription-page">
      <div className="floating-title">Upload Prescription here,</div>

      <div className="browser-frame mx-auto">
        <div className="browser-top">
          <div className="traffic">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <div className="url-bar">www.medscan.com</div>
        </div>

        <div className="content">
          <div className="brand">MedScan</div>

          {!result && !loading && (
            <>
              <div className="d-flex justify-content-center">
                <div
                  className="upload-card"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => inputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (["Enter", " "].includes(e.key))
                      inputRef.current?.click();
                  }}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    className="d-none"
                    onChange={handleFileChange}
                  />

                  <div className="upload-inner">
                    {preview ? (
                      <img
                        src={preview}
                        alt="prescription preview"
                        className="img-fluid preview-img"
                      />
                    ) : (
                      <>
                        <div className="muted-text">
                          Drop or Upload your Prescription as JPEG or PNG
                        </div>
                        <button
                          type="button"
                          className="upload-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            inputRef.current?.click();
                          }}
                        >
                          Upload Prescription
                        </button>
                      </>
                    )}
                  </div>

                  {file && (
                    <div className="file-name text-truncate w-75">
                      Selected: <strong>{file.name}</strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="d-flex justify-content-center mt-4">
                <button
                  className="btn btn-primary px-4"
                  onClick={handleUpload}
                >
                  Submit
                </button>
              </div>
            </>
          )}

          {loading && (
            <div className="d-flex justify-content-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {result && (
            <div className="result-box mt-4">
              <div className="d-flex justify-content-between mb-2 align-items-center">
                <div>
                  <i
                    className={`bi bi-braces mx-2 ${
                      view === "json" ? "text-primary" : ""
                    }`}
                    role="button"
                    title="JSON"
                    onClick={() => setView("json")}
                  />
                  <i
                    className={`bi bi-table mx-2 ${
                      view === "table" ? "text-primary" : ""
                    }`}
                    role="button"
                    title="Table"
                    onClick={() => setView("table")}
                  />
                  <i
                    className={`bi bi-database mx-2 ${
                      view === "sql" ? "text-primary" : ""
                    }`}
                    role="button"
                    title="SQL"
                    onClick={() => setView("sql")}
                  />
                  <span
                    className={`mongo-icon mx-2 ${
                      view === "mongo" ? "text-primary" : ""
                    }`}
                    role="button"
                    title="MongoDB"
                    onClick={() => setView("mongo")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0C7 0 4 3 4 3s1 6 8 9c7-3 8-9 8-9s-3-3-8-3zM12 12c-5-2-6-7-6-7s2 1 6 1 6-1 6-1-1 5-6 7z" />
                    </svg>
                  </span>
                </div>

                <div>
                  <button
                    className={`btn btn-sm btn-outline-secondary me-2 ${
                      copied ? "btn-success" : ""
                    }`}
                    onClick={handleCopy}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </div>

              <pre className="output-box">
                {view === "json" && JSON.stringify(result, null, 2)}
                {view === "table" && result.medicines?.length > 0 && (
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Medicine</th>
                        <th>Dose</th>
                        <th>Frequency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.medicines.map((m, idx) => (
                        <tr key={idx}>
                          <td>{m.name}</td>
                          <td>{m.dose}</td>
                          <td>{m.freq}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {view === "sql" &&
                  result.medicines
                    ?.map(
                      (m) =>
                        `INSERT INTO prescriptions (name, dose, freq) VALUES ('${m.name}', '${m.dose}', '${m.freq}');`
                    )
                    .join("\n")}
                {view === "mongo" &&
                  result.medicines
                    ?.map(
                      (m) =>
                        `db.prescriptions.insertOne({ name: "${m.name}", dose: "${m.dose}", freq: "${m.freq}" });`
                    )
                    .join("\n")}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
