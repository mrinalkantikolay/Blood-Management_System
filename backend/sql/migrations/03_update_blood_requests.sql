-- Update blood_requests table schema
ALTER TABLE blood_requests DROP FOREIGN KEY blood_requests_ibfk_1;
ALTER TABLE blood_requests DROP COLUMN patient_id;
ALTER TABLE blood_requests DROP COLUMN document_path;

-- Add new columns
ALTER TABLE blood_requests
ADD COLUMN blood_group VARCHAR(10) AFTER id,
ADD COLUMN hospital_name VARCHAR(255) AFTER location,
ADD COLUMN patient_name VARCHAR(255) AFTER hospital_name,
ADD COLUMN contact_number VARCHAR(20) AFTER patient_name,
ADD COLUMN reason TEXT AFTER contact_number,
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE blood_requests
  ADD COLUMN blood_group VARCHAR(10) NOT NULL AFTER id,
  ADD COLUMN units INT NOT NULL AFTER blood_group,
  ADD COLUMN required_date DATE NOT NULL AFTER units,
  ADD COLUMN patient_name VARCHAR(255) NOT NULL AFTER required_date,
  ADD COLUMN hospital_name VARCHAR(255) NOT NULL AFTER patient_name,
  ADD COLUMN contact_number VARCHAR(20) NOT NULL AFTER location,
  ADD COLUMN reason TEXT AFTER contact_number,
  ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
