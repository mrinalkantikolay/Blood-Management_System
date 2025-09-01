import React from 'react';

export const Staff = () => (
  <div className="container py-5">
    <h2>Staff Section</h2>
    <p>Staff features and management will be available here.</p>
  </div>
);

export const Admin = () => (
  <div className="container py-5">
    <h2>Admin Section (build your admin pages here)</h2>
  </div>
);

export const About = () => (
  <div className="container py-5">
    <h2>About</h2>
    <p>
      Our Blood Management System connects donors, recipients, and hospitals to make blood donation and requests easy, safe, and efficient. Join us in saving lives!
    </p>
  </div>
);

export const Contact = () => (
  <div className="container py-5">
    <h2>Contact</h2>
    <p>
      Have questions or need help? Email us at <a href="mailto:support@bloodsystem.com">support@bloodsystem.com</a> or call 1-800-BLOOD-HELP.
    </p>
  </div>
);

export const FAQ = () => (
  <div className="container py-5">
    <h2>FAQ</h2>
    <ul>
      <li><strong>Who can donate blood?</strong> Most healthy adults can donate. Check with your local guidelines.</li>
      <li><strong>How often can I donate?</strong> Usually every 3 months for whole blood.</li>
      <li><strong>Is it safe?</strong> Yes, all equipment is sterile and single-use.</li>
    </ul>
  </div>
);

export const HowItWorks = () => (
  <div className="container py-5">
    <h2>How It Works</h2>
    <ol>
      <li>Sign up or log in as a donor, recipient, or hospital staff.</li>
      <li>Request blood, donate, or manage hospital inventory.</li>
      <li>Get notified and track your requests or donations.</li>
    </ol>
  </div>
);
