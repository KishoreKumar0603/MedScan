import React, { useEffect, useState, useMemo } from "react";
import "../assets/css/Prescription.css";

function TypeText({ text, speed = 45, delay = 0, as: Tag = "span", className = "" }) {
  const [out, setOut] = useState("");
  useEffect(() => {
  setOut("");
  const start = setTimeout(() => {
    let i = 0;
    const id = setInterval(() => {
      setOut(text.slice(0, i + 1));  // <- build substring instead of appending
      i++;
      if (i >= text.length) clearInterval(id);
    }, speed);
  }, delay);
  return () => clearTimeout(start);
}, [text, speed, delay]);

  return <Tag className={className}>{out}</Tag>;
}

export default function Prescription() {
  const doctors = useMemo(
    () => ["Dr. Krishna Veni", "Dr. Mithun Shanjai", "Dr. Sophia Wong", "Dr. Aarav Mehta"],
    []
  );
  const patients = useMemo(
    () => ["John Doe", "Priya Nair", "Michael Chen", "Sara Khan", "Ravi Iyer"],
    []
  );
  const meds = useMemo(
    () => [
      "Paracetamol 500 mg — 1 tab after food",
      "Amoxicillin 250 mg — 1 cap × 3/day",
      "Metformin 500 mg — morning & night",
      "Amlodipine 10 mg — once daily",
    ],
    []
  );

  const doctor = useMemo(() => doctors[Math.floor(Math.random() * doctors.length)], [doctors]);
  const patient = useMemo(() => patients[Math.floor(Math.random() * patients.length)], [patients]);
  const signature = useMemo(() => doctor, [doctor]);

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div className="prescription-stack">
        <div className="prescription-card">
          <div className="text-center mb-3">
            <TypeText as="h4" className="fw-bold" text={doctor} delay={100} speed={35} />
            <TypeText as="p" className="mb-0" text="8972, Borice, Secrancxz" delay={800} />
            <TypeText as="p" className="mb-0" text="Phone: (000) 123-4567" delay={1100} />
          </div>

          <div className="d-flex align-items-start gap-3 mb-2">
            <h2 className="fw-bold text-primary m-0">Rx</h2>
            <div>
              <p className="mb-1">
                <strong>Patient: </strong>
                <TypeText text={patient} delay={900} speed={45} />
              </p>
              <p className="mb-0">
                <strong>Date: </strong>
                <TypeText text={new Date().toLocaleDateString()} delay={1200} speed={45} />
              </p>
            </div>
          </div>

          <hr className="my-3" />

          <div className="mb-3">
            <TypeText as="p" className="fw-bold mb-2" text="Prescription" delay={1300} speed={40} />
            <ul className="list-unstyled small m-0">
              {meds.map((m, i) => (
                <li key={i} className="mb-1">
                  <TypeText text={m} delay={1500 + i * 300} speed={35} />
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <div className="signature-line" />
            <TypeText
              as="p"
              className="text-end signature-text"
              text={signature}
              delay={1500 + meds.length * 300 + 300}
              speed={45}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
