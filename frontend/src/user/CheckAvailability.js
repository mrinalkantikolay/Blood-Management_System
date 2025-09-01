import React, { useState } from 'react';
import { Button, Form, Modal, Alert } from 'react-bootstrap';

const CheckAvailability = ({ show, onClose, hospital, bloodInventory }) => {
  const [bloodType, setBloodType] = useState('');
  const [result, setResult] = useState(null);

  const handleCheck = (e) => {
    e.preventDefault();
    if (bloodType && bloodInventory && bloodInventory[bloodType]) {
      setResult({ available: true, units: bloodInventory[bloodType] });
    } else {
      setResult({ available: false });
    }
  };

  const handleClose = () => {
    setBloodType('');
    setResult(null);
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Check Blood Availability</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleCheck}>
          <Form.Group className="mb-3">
            <Form.Label>Blood Type</Form.Label>
            <Form.Control
              type="text"
              value={bloodType}
              onChange={e => setBloodType(e.target.value)}
              required
              placeholder="Enter blood type (e.g. A+, O-)"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Check Availability
          </Button>
        </Form>
        {result && (
          <Alert variant={result.available ? 'success' : 'danger'} className="mt-3">
            {result.available
              ? `Available: ${result.units} units of ${bloodType} at ${hospital}`
              : `Not available: ${bloodType} at ${hospital}`}
          </Alert>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default CheckAvailability;
