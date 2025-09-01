import React from "react";
import { Link } from "react-router-dom";

const WelcomePage = () => (
  <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(90deg, #d32f2f 60%, #fff 40%)' }}>
    <div className="container py-5">
      <div className="row align-items-center flex-column-reverse flex-md-row">
        <div className="col-12 col-md-6 text-center text-md-start d-flex flex-column justify-content-center align-items-center align-items-md-start" style={{background: '#d32f2f', borderRadius: 16, minHeight: 320, padding: '2rem 1rem'}}>
          <h1 className="display-3 fw-bold mb-3 text-white">Donate Blood, Save Lives</h1>
          <p className="lead mb-4 text-white">
            Join our mission to connect donors and recipients. Your contribution can make a difference—be a hero today!
          </p>
          <Link to="/user" className="btn btn-light btn-lg px-5 py-3 rounded-pill shadow mb-4 fw-bold">
            Request or Donate Blood
          </Link>
          <div className="bg-white rounded p-3 shadow-sm w-100" style={{maxWidth: 350}}>
            <h5 className="mb-2" style={{color: '#212529'}}>Did you know?</h5>
            <ul className="mb-0 ps-3 text-start" style={{color: '#212529'}}>
              <li>One donation can save up to 3 lives.</li>
              <li>Someone needs blood every 2 seconds.</li>
              <li>All blood types are needed regularly.</li>
            </ul>
          </div>
        </div>
        <div className="col-12 col-md-6 d-flex justify-content-center align-items-center mb-4 mb-md-0">
          <div className="bg-white rounded-4 shadow-lg p-3 border border-2" style={{maxWidth: 600, width: '100%'}}>
            <img
              src="https://www.bhf.org.uk/-/media/images/information-support/heart-matters/2024/august-2024/medical/blood-tests-what-happens-update/blood-tests-what-happens-ssnoexp-620x400.jpg?rev=6528813f1e19460ea6b4ce66e23a02f2&la=en&h=400&w=620&hash=E5FB9225E8C374066A4D7818BAE21F02"
              alt="Blood Donation Illustration"
              className="img-fluid rounded-3"
              style={{ maxHeight: 350, width: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default WelcomePage;
