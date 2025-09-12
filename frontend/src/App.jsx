import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';// JS for dropdowns
import Root from './Layouts/Root';
import RestAPI from "./Components/RestAPI";
import APIDocs from "./Components/APIDocs";
import AboutMedScan from './Components/AboutMedScan';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

   return (
    <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/rest-api" element={<RestAPI />} />
          <Route path="/api-docs" element={<APIDocs />} />
        </Routes>
    </Router>
  );
}

export default App
