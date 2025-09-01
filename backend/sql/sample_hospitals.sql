-- First clear existing data (if needed)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE blood_stock;
TRUNCATE TABLE hospitals;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert hospitals with actual coordinates in Kolkata
INSERT INTO hospitals (name, location, phone, latitude, longitude) VALUES
('SSKM Hospital', 'Bhowanipore, Kolkata, West Bengal 700020', '033-2223-6026', 22.5403, 88.3421),
('Fortis Hospital', 'Anandapur, E.M. Bypass Road, Kolkata', '033-6628-4444', 22.5144, 88.3945),
('Apollo Gleneagles Hospital', 'JBS Haldane Avenue, Kolkata', '033-2320-3040', 22.5726, 88.3639),
('Woodlands Hospital', 'Alipore Road, Kolkata', '033-4033-7000', 22.5238, 88.3348),
('R.N. Tagore International Institute', 'Mukundapur, Kolkata', '033-6605-3000', 22.4962, 88.3997),
('Columbia Asia Hospital', 'Salt Lake City, Kolkata', '033-6600-3300', 22.5892, 88.4103),
('Belle Vue Clinic', 'Loudon Street, Kolkata', '033-2287-2321', 22.5451, 88.3562),
('Ruby General Hospital', 'Kasba, E.M. Bypass, Kolkata', '033-2443-7373', 22.5147, 88.3962);

-- Insert blood stock data
INSERT INTO blood_stock (hospital_id, blood_group, quantity) VALUES
(1, 'A+', 50), (1, 'B+', 30), (1, 'O+', 25), (1, 'AB+', 15),
(2, 'A+', 40), (2, 'B+', 35), (2, 'O-', 20), (2, 'AB-', 10),
(3, 'A+', 45), (3, 'B+', 40), (3, 'O+', 30), (3, 'AB+', 20),
(4, 'A+', 30), (4, 'B-', 25), (4, 'O+', 35), (4, 'AB+', 15),
(5, 'A-', 20), (5, 'B+', 30), (5, 'O+', 40), (5, 'AB+', 10),
(6, 'A+', 35), (6, 'B+', 25), (6, 'O-', 15), (6, 'AB+', 20),
(7, 'A+', 25), (7, 'B+', 35), (7, 'O+', 30), (7, 'AB-', 10),
(8, 'A+', 40), (8, 'B+', 30), (8, 'O+', 25), (8, 'AB+', 15);

-- Test query for hospitals within 30km of Apollo Gleneagles (22.5726, 88.3639)
SELECT 
    h.*,
    GROUP_CONCAT(CONCAT(bs.blood_group, ' (', bs.quantity, ')')) as available_blood,
    (
        6371 * 
        ACOS(
            COS(RADIANS(22.5726)) * 
            COS(RADIANS(latitude)) * 
            COS(RADIANS(longitude) - RADIANS(88.3639)) + 
            SIN(RADIANS(22.5726)) * 
            SIN(RADIANS(latitude))
        )
    ) AS distance_km
FROM hospitals h
LEFT JOIN blood_stock bs ON h.id = bs.hospital_id
WHERE 
    latitude IS NOT NULL AND 
    longitude IS NOT NULL
GROUP BY 
    h.id, 
    h.name, 
    h.location, 
    h.phone, 
    h.latitude, 
    h.longitude
HAVING distance_km <= 30
ORDER BY distance_km;
