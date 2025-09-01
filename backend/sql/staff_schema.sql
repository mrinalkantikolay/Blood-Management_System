-- Staff Management Tables

-- Table for admin-created staff invitations
CREATE TABLE staff_invitations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_by_admin VARCHAR(255) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('invited', 'registered', 'inactive') DEFAULT 'invited',
    INDEX idx_email (email)
);

-- Table for completed staff profiles
CREATE TABLE staff_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invitation_id INT NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'staff',
    hospital_id INT,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_complete BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    FOREIGN KEY (invitation_id) REFERENCES staff_invitations(id) ON DELETE CASCADE,
    INDEX idx_invitation (invitation_id),
    INDEX idx_phone (phone)
);

-- Update staff_invitations status when profile is created
DELIMITER $$
CREATE TRIGGER update_invitation_status 
AFTER INSERT ON staff_profiles
FOR EACH ROW
BEGIN
    UPDATE staff_invitations 
    SET status = 'registered' 
    WHERE id = NEW.invitation_id;
END$$
DELIMITER ;
