

const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Delete a blood request by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM blood_requests WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Blood request not found' });
        }
        res.json({ message: 'Blood request deleted' });
    } catch (err) {
        console.error('Error deleting blood request:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Update a blood request by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    let { status, approvedDate, fulfilledDate } = req.body;
    if (approvedDate === '') approvedDate = null;
    if (fulfilledDate === '') fulfilledDate = null;
    const fields = [];
    const values = [];
    if (status !== undefined) {
        fields.push('status = ?');
        values.push(status);
    }
    if (approvedDate !== undefined) {
        fields.push('approved_date = ?');
        values.push(approvedDate);
    }
    if (fulfilledDate !== undefined) {
        fields.push('fulfilled_date = ?');
        values.push(fulfilledDate);
    }
    if (fields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }
    values.push(id);
    const sql = `UPDATE blood_requests SET ${fields.join(', ')} WHERE id = ?`;
    try {
        const [result] = await db.query(sql, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Blood request not found' });
        }
        res.json({ message: 'Blood request updated' });
    } catch (err) {
        console.error('Error updating blood request:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get all blood requests
// GET all blood requests (with all expected frontend fields)
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT br.*, 
                   br.hospital_name AS hospitalName,
                   br.patient_name AS patientName,
                   br.blood_group AS bloodType,
                   br.urgency AS urgency,
                   br.contact_number AS contactNumber,
                   br.location AS patientAddress,
                   h.name AS hospitalDisplayName
            FROM blood_requests br
            LEFT JOIN hospitals h ON br.hospital_name = h.name
            ORDER BY br.created_at DESC
        `;
        const [results] = await db.query(query);
        // Prefer hospitalDisplayName if available, else hospitalName
        const withHospitalName = results.map(r => ({
            ...r,
            hospital: r.hospitalDisplayName || r.hospitalName || ''
        }));
        res.json(withHospitalName);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Public: submit a blood request (no token required)
router.post('/', async (req, res) => {
    try {
        console.log('Incoming blood request body:', req.body);
        const {
            bloodGroup,
            units,
            urgency,
            requiredDate,
            patientName,
            hospitalName,
            location,
            contactNumber,
            reason
        } = req.body;

        // Validate required fields
        if (!bloodGroup || !units || !requiredDate || !patientName || !hospitalName || !location || !contactNumber) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Insert blood request directly
        const query = `
            INSERT INTO blood_requests (
                blood_group,
                quantity,
                urgency,
                request_date,
                patient_name,
                hospital_name,
                location,
                contact_number,
                reason,
                status,
                created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NOW())
        `;

        const values = [
            bloodGroup,
            units,
            urgency || 'Normal',
            requiredDate,
            patientName,
            hospitalName,
            location,
            contactNumber,
            reason || null
        ];

        const [result] = await db.query(query, values);
        res.status(201).json({
            message: 'Blood request submitted successfully',
            requestId: result.insertId
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;