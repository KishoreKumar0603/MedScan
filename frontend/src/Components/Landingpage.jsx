import Dashboard from "./Dashboard";
import Prescription from "./Prescription";
import Navbar from "./Navbar";
const LandingPage = () => (
    <>
        <Navbar />
        <div className="container py-5 main-container">
        <div className="row align-items-center h-100">
            <div className="col-md-8 mb-4">
                <h6 className="text-uppercase text-muted rubik">MedScan</h6>
                <h1 className="fw-bold rubik">
                    Is your report digitalized <br /> not yet?
                </h1>
                <p className="mt-3">
                    A free and fast AI Prescription Parsing tool to digitalize the
                    unstructured prescription <br /> to Structured json format, which is easy to handle with databases
                </p>
            </div>
            <div className="col-md-4">
                <Prescription />
            </div>
        </div>
        </div>
    </>
    
  );
export default LandingPage;
