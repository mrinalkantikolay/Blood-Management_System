import React from 'react';
import './utility.css';
import { FaPhoneAlt } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="contact-container">
      <h2 style={{ color: '#dc3545', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <FaPhoneAlt style={{ color: '#dc3545' }} /> Contact Us
      </h2>
      <div className="contact-info">
        <div className="contact-section" style={{ border: '2px solid #dc3545', borderRadius: '1rem', padding: '1rem' }}>
          <h3 style={{ color: '#dc3545' }}>Emergency Contact</h3>
          <p>24/7 Helpline: 03212 254 033</p>
          <p>Emergency Email: emergency@bloodbank.com</p>
        </div>
        
        <div className="contact-section" style={{ border: '2px solid #dc3545', borderRadius: '1rem', padding: '1rem' }}>
          <h3 style={{ color: '#dc3545' }}>General Inquiries</h3>
          <p>Phone: +1 (555) 987-6543</p>
          <p>Email: info@bloodbank.com</p>
          <p>Address: 123 Blood Bank Street, Healthcare City, ST 12345</p>
        </div>

        <div className="contact-form">
          <h3 style={{ color: '#dc3545' }}>Send us a Message</h3>
          <form>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" name="name" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject:</label>
              <input type="text" id="subject" name="subject" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message:</label>
              <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
