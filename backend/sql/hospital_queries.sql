-- Function to find hospitals within 30km radius
DELIMITER //

CREATE FUNCTION calculate_distance(lat1 DECIMAL(9,6), lon1 DECIMAL(9,6), lat2 DECIMAL(9,6), lon2 DECIMAL(9,6))
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE R INTEGER DEFAULT 6371; -- Earth's radius in kilometers
    DECLARE dlat DECIMAL(10,8);
    DECLARE dlon DECIMAL(10,8);
    DECLARE a DECIMAL(10,8);
    DECLARE c DECIMAL(10,8);
    
    SET dlat = RADIANS(lat2 - lat1);
    SET dlon = RADIANS(lon2 - lon1);
    SET a = SIN(dlat/2) * SIN(dlat/2) + COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * SIN(dlon/2) * SIN(dlon/2);
    SET c = 2 * ATAN2(SQRT(a), SQRT(1-a));
    
    RETURN R * c;
END //

DELIMITER ;

-- Create a view for hospitals with blood stock
CREATE VIEW hospital_blood_availability AS
SELECT 
    h.id,
    h.name,
    h.location,
    h.phone,
    h.latitude,
    h.longitude,
    GROUP_CONCAT(DISTINCT CONCAT(bs.blood_group, ' (', bs.quantity, ')') ORDER BY bs.blood_group) as available_blood
FROM hospitals h
LEFT JOIN blood_stock bs ON h.id = bs.hospital_id
GROUP BY h.id;

-- Example query to find hospitals within 30km of a given point:
-- SELECT 
--     h.*,
--     calculate_distance(:userLat, :userLon, h.latitude, h.longitude) as distance
-- FROM hospital_blood_availability h
-- WHERE calculate_distance(:userLat, :userLon, h.latitude, h.longitude) <= 30
-- ORDER BY distance;
