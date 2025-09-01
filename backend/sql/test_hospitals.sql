-- First clear existing data (if needed)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE blood_stock;
TRUNCATE TABLE hospitals;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert just two hospitals with actual coordinates in Kolkata
INSERT INTO hospitals (name, location, phone, latitude, longitude) VALUES
('SSKM Hospital', 'Bhowanipore, Kolkata, West Bengal 700020', '033-2223-6026', 22.5403, 88.3421),
('Apollo Gleneagles Hospital', 'JBS Haldane Avenue, Kolkata', '033-2320-3040', 22.5726, 88.3639);

-- Insert blood stock data for just these two hospitals
INSERT INTO blood_stock (hospital_id, blood_group, quantity) VALUES
(1, 'A+', 50), (1, 'B+', 30), (1, 'O+', 25),
(2, 'A+', 45), (2, 'B+', 40), (2, 'O+', 30);

-- Test query
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
