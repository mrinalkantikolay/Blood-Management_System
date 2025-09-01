import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

const About = () => (
  <div className="container py-5">
    <h2 style={{ color: '#dc3545', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
      <FaInfoCircle style={{ color: '#dc3545' }} /> About
    </h2>
    <p>
      Our Blood Management System connects donors, recipients, and hospitals to make blood donation and requests easy, safe, and efficient. Join us in saving lives!
    </p>
  </div>
);

export default About;
