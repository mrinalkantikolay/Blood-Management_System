CREATE TABLE donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  donor_id INT NOT NULL,
  blood_group VARCHAR(10) NOT NULL,
  quantity INT NOT NULL,
  donation_date DATE NOT NULL,
  hospital_id INT NOT NULL,
  FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE CASCADE,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
);
