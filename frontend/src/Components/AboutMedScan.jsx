// AboutMedScan.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/AboutMedScan.css";

const AboutMedScan = () => {
  return (
    <section className="about-medscan py-5 vh-100 d-flex justify-content-center align-items-center" id="about-section">
      <div className="container">
        {/* Top heading */}
        <div className="text-center mb-5">
          <h2 className="fw-bold">About <span className="brand-med">medScan</span></h2>
          <p className="text-muted lead">
            Founded by healthcare professionals and AI experts, medScan is dedicated to bridging the gap 
            between traditional medical documentation and modern digital healthcare systems.
          </p>
        </div>

        <div className="row align-items-center g-5">
          {/* Left Column */}
          <div className="col-md-7">
            <h3 className="fw-bold mb-3">Our Mission</h3>
            <p className="text-muted mb-4">
              We believe that healthcare technology should enhance, not complicate, medical practice. 
              Our mission is to eliminate the friction between handwritten prescriptions and digital healthcare systems, 
              improving accuracy, reducing errors, and saving valuable time for healthcare providers.
            </p>

            <ul className="list-unstyled">
              <li className="mb-2">
                <span className="dot dot-blue"></span> Reduce medication errors by 95%
              </li>
              <li className="mb-2">
                <span className="dot dot-green"></span> Save 2+ hours per day on documentation
              </li>
              <li className="mb-2">
                <span className="dot dot-teal"></span> Improve patient safety through digital accuracy
              </li>
            </ul>
          </div>

          {/* Right Column */}
          <div className="col-md-5">
            <div className="why-box p-4 text-white shadow-sm">
              <h5 className="fw-bold mb-4">Why It Matters</h5>
              <p className="mb-3">
                <span className="why-stat fw-bold">200K+</span><br />
                <span className="small">Medication errors annually in US hospitals</span>
              </p>
              <p className="mb-3">
                <span className="why-stat fw-bold">4 hours</span><br />
                <span className="small">Average daily time spent on documentation</span>
              </p>
              <p>
                <span className="why-stat fw-bold">$42B</span><br />
                <span className="small">Annual cost of medical errors</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMedScan;
