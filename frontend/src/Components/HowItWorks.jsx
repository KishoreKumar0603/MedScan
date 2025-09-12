import "../assets/css/HowItWorks.css";
// HowItWorks.jsx
// React (JavaScript) + Bootstrap 5 implementation matching the UI screenshot
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      icon: "bi-cloud-upload-fill",
      title: "Upload Documents",
      description:
        "Simply upload your medical documents - prescriptions, test results, patient forms, or any handwritten medical records through our secure platform.",
      image: "https://via.placeholder.com/360x140?text=Upload+Document",
      colorClass: "step-blue",
    },
    {
      number: "2",
      icon: "bi-gear-fill",
      title: "AI Processing",
      description:
        "Our advanced OCR and NLP algorithms analyze the documents, extracting patient information, medications, dosages, and other critical medical data with 99% accuracy.",
      image: "https://via.placeholder.com/360x140?text=AI+Processing",
      colorClass: "step-green",
    },
    {
      number: "3",
      icon: "bi-file-code-fill",
      title: "Get Structured Data",
      description:
        "Receive clean, structured JSON data ready for integration with your existing healthcare systems, EHRs, or databases. Complete with patient details, medications, and dosages.",
      image: "https://via.placeholder.com/360x140?text=JSON+Output",
      colorClass: "step-orange",
    },
  ];

  return (
    <section className="how-it-works py-5">
      <div className="container text-center">
        <h2 className="how-title mb-2">
          How <span className="brand-med">med</span>
          <span className="brand-scan">Scan</span> Works
        </h2>
        <p className="text-muted lead mb-5">
          Transform your medical documents into structured digital data in just three simple steps
        </p>

        <div className="steps-row position-relative mb-4">
          {/* connector line behind cards */}
          <div className="connector-line" />

          <div className="row gx-4">
            {steps.map((s, idx) => (
              <div className="col-md-4" key={idx}>
                <div className="position-relative d-flex h-100">
                  {/* circular number badge above card */}
                  <div className={`step-badge ${s.colorClass}`}>{s.number}</div>

                  <div className="card step-card shadow-sm w-100">
                    <div className="card-body d-flex flex-column align-items-center">
                      <div className={`icon-box ${s.colorClass} d-flex align-items-center justify-content-center`}>
                        <i className={`bi ${s.icon} fs-4`} />
                      </div>

                      <h5 className="mt-3 text-center fw-bold">{s.title}</h5>

                      <p className="text-muted small text-center mb-3">{s.description}</p>

                      <div
                        className="step-image w-100 rounded overflow-hidden mt-auto"
                        style={{ backgroundImage: `url(${s.image})` }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* stats bar */}
        <div className="stats-wrap mb-4">
          <div className="card stats-card shadow-sm mx-auto">
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center gap-3">
              <div className="stat text-center">
                <div className="stat-value text-primary fw-bold">99%</div>
                <div className="stat-label text-muted small">Accuracy Rate</div>
              </div>
              <div className="stat text-center">
                <div className="stat-value text-success fw-bold">&lt; 30s</div>
                <div className="stat-label text-muted small">Processing Time</div>
              </div>
              <div className="stat text-center">
                <div className="stat-value text-warning fw-bold">75%</div>
                <div className="stat-label text-muted small">Time Saved</div>
              </div>
              <div className="stat text-center">
                <div className="stat-value text-danger fw-bold">500+</div>
                <div className="stat-label text-muted small">Healthcare Partners</div>
              </div>
            </div>
          </div>
        </div>

        <button className="btn trial-btn px-4 py-2">
          Start Your Free Trial <i className="bi bi-arrow-right ms-2"></i>
        </button>
      </div>
    </section>
  );
};

export default HowItWorks;
