import React from 'react'
import Navbar from '../Components/Navbar'
import LandingPage from '../Components/Landingpage'
import PrescriptionUpload from '../Components/PrescriptionUpload'
import HealthcareFeatures from '../Components/HealthcareFeatures'
import HowItWorks from '../Components/HowItWorks'
import AboutMedScan from '../Components/AboutMedScan'

const Root = () => {
  return (
    <>
    <div className="container-fluid min-vh-100 g-0">
        <LandingPage />
        <PrescriptionUpload />
        <HealthcareFeatures />
        <HowItWorks />
        <AboutMedScan />
    </div>
    </>
  )
}

export default Root