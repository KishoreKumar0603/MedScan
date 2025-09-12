
function Dashboard() {
  return (
    <div className="card shadow rounded-3 p-3">
      <h6 className="fw-bold">Doctor's medicines</h6>

      {/* Patient Overview */}
      <div className="d-flex justify-content-between mt-3">
        <div>
          <h6 className="text-muted">Patient Overview</h6>
          <div className="text-center">
            <h3 className="fw-bold text-primary">86</h3>
            <p className="mb-0">John Smith</p>
            <small className="text-muted">43 • Zone 34 • Mox</small>
          </div>
        </div>

        {/* Current Prescription */}
        <div>
          <h6 className="text-muted">Current Prescription</h6>
          <ul className="list-unstyled">
            <li>Amlodipine</li>
            <li>Metformin</li>
            <li>Atorvastatin</li>
          </ul>
        </div>
      </div>

      {/* Issues */}
      <div className="mt-3">
        <h6 className="text-muted">Issues</h6>
        <ul className="list-unstyled">
          <li>✔ Hypertension</li>
          <li>✔ Diabetes</li>
          <li>✔ High cholesterol</li>
          <li className="text-danger">✘ Smoker</li>
        </ul>
      </div>

      {/* Pain Level Trend */}
      <div className="mt-3">
        <h6 className="text-muted">Pain Level Trend</h6>
        <div className="progress" style={{ height: "6px" }}>
          <div
            className="progress-bar bg-info"
            role="progressbar"
            style={{ width: "70%" }}
            aria-valuenow="70"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <small className="text-muted">Mon - Wed trend shown</small>
      </div>
    </div>
  );
}

export default Dashboard;

