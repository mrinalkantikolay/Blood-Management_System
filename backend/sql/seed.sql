-- Seed users for bring blood requests and blood sections

-- User 1: For bring blood requests
INSERT INTO users (first_name, last_name, email, username, password)
VALUES ('Rohit', 'Verma', 'rohit.verma@example.com', 'rohitverma', 'password123');

-- User 2: For blood section
INSERT INTO users (first_name, last_name, email, username, password)
VALUES ('Priya', 'Singh', 'priya.singh@example.com', 'priyasingh', 'password456');

-- Optionally, you can add related patients, donors, or requests for these users as needed.

-- Add patients linked to users
INSERT INTO patients (name, blood_group, age, contact, address, user_id)
VALUES ('Rohit Verma', 'A+', 30, '+91-90000-00001', 'Delhi', (SELECT id FROM users WHERE username='rohitverma'));
INSERT INTO patients (name, blood_group, age, contact, address, user_id)
VALUES ('Priya Singh', 'B+', 28, '+91-90000-00002', 'Mumbai', (SELECT id FROM users WHERE username='priyasingh'));

-- Add blood requests for these patients
INSERT INTO blood_requests (patient_id, quantity, request_date, status, location, user_id)
VALUES ((SELECT id FROM patients WHERE name='Rohit Verma'), 2, '2025-08-31', 'Pending', 'Delhi', (SELECT id FROM users WHERE username='rohitverma'));
INSERT INTO blood_requests (patient_id, quantity, request_date, status, location, user_id)
VALUES ((SELECT id FROM patients WHERE name='Priya Singh'), 1, '2025-08-31', 'Pending', 'Mumbai', (SELECT id FROM users WHERE username='priyasingh'));
