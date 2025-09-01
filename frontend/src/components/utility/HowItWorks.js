import React from 'react';
import './utility.css';
import { FaCogs } from 'react-icons/fa';

const HowItWorks = () => {
  return (
    <div className="how-it-works-container">
      <h2 style={{ color: '#dc3545', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <FaCogs style={{ color: '#dc3545' }} /> How It Works
      </h2>
      
      <div className="process-steps">
        <div className="step">
          <div className="step-number">1</div>
          <h3>Register as a Donor</h3>
          <p>Create an account and complete your donor profile with basic information and medical history.</p>
        </div>

        <div className="step">
          <div className="step-number">2</div>
          <h3>Health Screening</h3>
          <p>Undergo a quick health check including blood pressure, pulse, and hemoglobin levels.</p>
        </div>

        <div className="step">
          <div className="step-number">3</div>
          <h3>Blood Donation</h3>
          <p>The actual donation process takes only 8-10 minutes in a safe, sterile environment.</p>
        </div>

        <div className="step">
          <div className="step-number">4</div>
          <h3>Rest & Refresh</h3>
          <p>Take a short rest and enjoy refreshments before leaving the donation center.</p>
        </div>
      </div>

      <div className="donation-types">
        <h3>Types of Donations</h3>
        <div className="type-grid">
          <div className="type">
            <h4>Whole Blood</h4>
            <p>Most common type of donation. Takes about 8-10 minutes.</p>
          </div>
          
          <div className="type">
            <h4>Platelets</h4>
            <p>Takes about 2-3 hours. Can donate every 7 days.</p>
          </div>
          
          <div className="type">
            <h4>Plasma</h4>
            <p>Takes about 1-2 hours. Can donate every 28 days.</p>
          </div>
          
          <div className="type">
            <h4>Double Red Cells</h4>
            <p>Takes about 30 minutes. Can donate every 112 days.</p>
          </div>
        </div>
      </div>

      <div className="benefits-section">
        <h3>Benefits of Donating</h3>
        <ul>
          <li>Save up to three lives with one donation</li>
          <li>Free health screening with each donation</li>
          <li>Learn your blood type</li>
          <li>Reduce risk of heart disease</li>
          <li>Burn calories</li>
        </ul>
      </div>
    </div>
  );
};

export default HowItWorks;
