-- Add pincode column to hospitals table
USE blood_donation;
ALTER TABLE hospitals ADD COLUMN pincode VARCHAR(10);
