import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../assets/css/HealthcareFeatures.css";

const HealthcareFeatures = () => {
  const features = [
    {
      icon: "bi-eye",
      title: "Optical Character Recognition",
      description:
        "Advanced OCR technology that accurately reads both typed and handwritten medical content with 99% precision.",
      points: [
        "Handwriting recognition",
        "Multi-language support",
        "Poor quality document processing",
      ],
    },
    {
      icon: "bi-braces",
      title: "Natural Language Processing",
      description:
        "AI-powered NLP extracts meaningful medical information and structures it into standardized formats.",
      points: [
        "Medical term recognition",
        "Dosage extraction",
        "Patient data structuring",
      ],
    },
    {
      icon: "bi-code-slash",
      title: "JSON Data Output",
      description:
        "Structured JSON format enables seamless integration with existing healthcare systems and databases.",
      points: ["Standardized format", "API-ready output", "Easy system integration"],
    },
    {
      icon: "bi-shield-lock",
      title: "HIPAA Compliant",
      description:
        "Enterprise-grade security ensures patient data privacy and compliance with healthcare regulations.",
      points: ["End-to-end encryption", "Secure data processing", "Audit trail logging"],
    },
    {
      icon: "bi-speedometer2",
      title: "Real-time Processing",
      description:
        "Process medical documents in seconds, not hours, with our optimized cloud infrastructure.",
      points: ["Sub-second processing", "Batch processing", "Scalable infrastructure"],
    },
    {
      icon: "bi-plug",
      title: "Easy Integration",
      description:
        "Simple API integration with existing healthcare systems, EHRs, and digital health platforms.",
      points: ["RESTful API", "SDK libraries", "Custom workflows"],
    },
  ];

  return (
    <section className="features-section py-5">
      <div className="container text-center">
        <h2 className="fw-bold mb-3">
          Advanced Technology for{" "}
          <span className="gradient-text">Healthcare Digitization</span>
        </h2>
        <p className="text-muted mb-5">
          Our cutting-edge OCR and NLP technology processes both handwritten and
          printed medical documents with unprecedented accuracy and speed.
        </p>

        <div className="row g-4">
          {features.map((feature, index) => (
            <div className="col-md-6 col-lg-4" key={index}>
              <div className="feature-card shadow-sm h-100">
                <div className="icon-box mx-auto">
                  <i className={`bi ${feature.icon}`}></i>
                </div>
                <h5 className="mt-3 fw-semibold">{feature.title}</h5>
                <p className="text-muted small">{feature.description}</p>
                <ul className="list-unstyled text-start small ps-3">
                  {feature.points.map((point, i) => (
                    <li key={i} className="text-muted mb-1">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <button className="btn btn-primary explore-btn">
            Explore Our Technology <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HealthcareFeatures;
