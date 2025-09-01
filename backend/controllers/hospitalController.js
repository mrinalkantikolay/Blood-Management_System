const db = require('../config/db');

const hospitalController = {
    // Add a new hospital
    addHospital: async (req, res) => {
        try {
            const { name, location, phone, latitude, longitude } = req.body;
            const query = `
                INSERT INTO hospitals (name, location, phone, latitude, longitude)
                VALUES (?, ?, ?, ?, ?)
            `;
            const [result] = await db.query(query, [name, location, phone, latitude, longitude]);
            res.json({ id: result.insertId, message: 'Hospital added successfully' });
        } catch (error) {
            console.error('Error adding hospital:', error);
            res.status(500).json({ message: 'Error adding hospital' });
        }
    },

    // Get all hospitals
    getAllHospitals: async (req, res) => {
        try {
            const query = `
                SELECT h.*, 
                       GROUP_CONCAT(DISTINCT CONCAT(bs.blood_group, ' (', bs.quantity, ')')) as blood_stock
                FROM hospitals h
                LEFT JOIN blood_stock bs ON h.id = bs.hospital_id
                GROUP BY h.id
            `;
            const [hospitals] = await db.query(query);
            res.json(hospitals);
        } catch (error) {
            console.error('Error fetching hospitals:', error);
            res.status(500).json({ message: 'Error fetching hospitals' });
        }
    },

    // Get hospitals within 30km radius
    getNearbyHospitals: async (req, res) => {
        try {
            const { latitude, longitude } = req.query;
            
            // Using Haversine formula directly in MySQL
            // Convert latitude and longitude to numbers
            const lat = parseFloat(latitude);
            const lon = parseFloat(longitude);
            
            const query = `
                SELECT 
                    h.*,
                    bs.blood_group,
                    bs.quantity,
                    (
                        6371 * 
                        ACOS(
                            COS(RADIANS(?)) * 
                            COS(RADIANS(latitude)) * 
                            COS(RADIANS(longitude) - RADIANS(?)) + 
                            SIN(RADIANS(?)) * 
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
                    h.address, 
                    h.phone, 
                    h.latitude, 
                    h.longitude,
                    bs.blood_group,
                    bs.quantity
                HAVING distance_km <= 30
                ORDER BY distance_km
            `;


            const [hospitals] = await db.query(query, [
                lat, lon, lat
            ]);
            console.log('Nearby hospitals found:', hospitals);

            // Group blood stock information
            const groupedHospitals = hospitals.reduce((acc, curr) => {
                if (!acc[curr.id]) {
                    acc[curr.id] = {
                        ...curr,
                        blood_stock: [],
                        blood_groups: new Set()
                    };
                }
                if (curr.blood_group) {
                    acc[curr.id].blood_stock.push(`${curr.blood_group} (${curr.quantity})`);
                    acc[curr.id].blood_groups.add(curr.blood_group);
                }
                return acc;
            }, {});

            const result = Object.values(groupedHospitals).map(hospital => ({
                ...hospital,
                blood_stock: hospital.blood_stock.join(', ') || 'No blood stock information',
                blood_groups: Array.from(hospital.blood_groups),
                distance: hospital.distance_km !== undefined ? parseFloat(hospital.distance_km).toFixed(2) + ' km' : 'N/A'
            }));

            res.json(result);
        } catch (error) {
            console.error('Error fetching nearby hospitals:', error);
            res.status(500).json({ message: 'Error fetching hospitals' });
        }
    },

    // Update hospital details
    updateHospital: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, location, phone, latitude, longitude } = req.body;
            const query = `
                UPDATE hospitals 
                SET name = ?, location = ?, phone = ?, latitude = ?, longitude = ?
                WHERE id = ?
            `;
            await db.query(query, [name, location, phone, latitude, longitude, id]);
            res.json({ message: 'Hospital updated successfully' });
        } catch (error) {
            console.error('Error updating hospital:', error);
            res.status(500).json({ message: 'Error updating hospital' });
        }
    },

    // Delete hospital
    deleteHospital: async (req, res) => {
        try {
            const { id } = req.params;
            const query = 'DELETE FROM hospitals WHERE id = ?';
            await db.query(query, [id]);
            res.json({ message: 'Hospital deleted successfully' });
        } catch (error) {
            console.error('Error deleting hospital:', error);
            res.status(500).json({ message: 'Error deleting hospital' });
        }
    },

    // Update blood stock for a hospital
    updateBloodStock: async (req, res) => {
        try {
            const { hospitalId } = req.params;
            const { bloodStocks } = req.body; // array of {blood_group, quantity}
            
            // Start a transaction
            await db.query('START TRANSACTION');
            
            // Delete existing blood stock for this hospital
            await db.query('DELETE FROM blood_stock WHERE hospital_id = ?', [hospitalId]);
            
            // Insert new blood stock entries
            const insertQuery = 'INSERT INTO blood_stock (hospital_id, blood_group, quantity) VALUES ?';
            const values = bloodStocks.map(stock => [hospitalId, stock.blood_group, stock.quantity]);
            
            await db.query(insertQuery, [values]);
            await db.query('COMMIT');
            
            res.json({ message: 'Blood stock updated successfully' });
        } catch (error) {
            await db.query('ROLLBACK');
            console.error('Error updating blood stock:', error);
            res.status(500).json({ message: 'Error updating blood stock' });
        }
    }
};

module.exports = hospitalController;
