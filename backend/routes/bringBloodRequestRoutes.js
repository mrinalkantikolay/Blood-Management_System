const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Get all bring blood requests
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT bbr.*, 
                   bbr.patient_name AS patientName,
                   bbr.blood_group AS bloodType,
                   bbr.urgency AS urgency,
                   bbr.contact_number AS contactNumber,
                   bbr.reason AS reason,
                   bbr.hospital_name AS hospital,
                   bbr.request_date AS requestDate,
                   bbr.quantity AS unitsNeeded,
                   bbr.status,
                   bbr.approved_date AS approvedDate,
                   bbr.fulfilled_date AS fulfilledDate
            FROM bring_blood_requests bbr
            ORDER BY bbr.request_date DESC
        `;
        const [results] = await db.query(query);
        res.json(results);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new bring blood request
router.post('/', async (req, res) => {
    try {
        const {
            patientName,
            bloodGroup,
            unitsNeeded,
            urgency,
            requestDate,
            status,
            location,
            contactNumber,
            reason,
            hospitalName
        } = req.body;

        if (!patientName || !bloodGroup || !unitsNeeded || !urgency || !requestDate || !contactNumber || !reason || !hospitalName) {
            return res.status(400).json({ error: 'Required fields missing' });
        }

        const query = `
            INSERT INTO bring_blood_requests (
                patient_name, blood_group, quantity, urgency, request_date, status, location, contact_number, reason, hospital_name
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            patientName,
            bloodGroup,
            unitsNeeded,
            urgency,
            requestDate,
            status || 'Pending',
            location || null,
            contactNumber,
            reason,
            hospitalName
        ];
        const [result] = await db.query(query, values);
        res.status(201).json({ message: 'Bring blood request created', id: result.insertId });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a bring blood request by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    let { status, approved_date, fulfilled_date } = req.body;
    if (approved_date === '') approved_date = null;
    if (fulfilled_date === '') fulfilled_date = null;
    const fields = [];
    const values = [];
    if (status !== undefined) {
        fields.push('status = ?');
        values.push(status);
    }
    if (approved_date !== undefined) {
        fields.push('approved_date = ?');
        values.push(approved_date);
    }
    if (fulfilled_date !== undefined) {
        fields.push('fulfilled_date = ?');
        values.push(fulfilled_date);
    }
    if (fields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }
    values.push(id);
    const sql = `UPDATE bring_blood_requests SET ${fields.join(', ')} WHERE id = ?`;
    try {
        const [result] = await db.query(sql, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Bring blood request not found' });
        }
        res.json({ message: 'Bring blood request updated' });
    } catch (err) {
        console.error('Error updating bring blood request:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Delete a bring blood request by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM bring_blood_requests WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Bring blood request not found' });
        }
        res.json({ message: 'Bring blood request deleted' });
    } catch (err) {
        console.error('Error deleting bring blood request:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
