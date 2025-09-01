-- Blood Management System SQL Schema

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE donors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  blood_group VARCHAR(10) NOT NULL,
  age INT NOT NULL,
  contact VARCHAR(20),
  address TEXT,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  blood_group VARCHAR(10) NOT NULL,
  age INT,
  contact VARCHAR(20),
  address TEXT,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE blood_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  quantity INT NULL,
  request_date DATE NOT NULL,
  status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  location VARCHAR(255),
  document_path VARCHAR(255),
  user_id INT,
  approved_date DATE NULL,
  fulfilled_date DATE NULL,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE hospitals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  pincode VARCHAR(10),
  latitude DECIMAL(9,6) DEFAULT NULL,
  longitude DECIMAL(9,6) DEFAULT NULL
);

CREATE TABLE blood_stock (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hospital_id INT NOT NULL,
  blood_group VARCHAR(10) NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
);

CREATE TABLE staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  username VARCHAR(100) NULL,
  password VARCHAR(255) NULL,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  donor_id INT NOT NULL,
  blood_group VARCHAR(10) NOT NULL,
  quantity INT NOT NULL,
  donation_date DATE NOT NULL,
  hospital_id INT,
  FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE CASCADE,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL
);

-- Sample Inserts (for reference, not required for schema)
-- INSERT INTO admins (username, password) VALUES ('mrinalkolay', '1234567890qQ@');
-- INSERT INTO users (first_name, last_name, email, username, password) VALUES ('Anjali', 'Sharma', 'anjali.sharma@example.com', 'anjalisharma', 'anjalisharma1');
-- ...other sample inserts...
