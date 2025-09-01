import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

const RequestBloodTransfer = ({ show, onClose, onSubmit, hospital }) => {
  const [bloodType, setBloodType] = useState('');
  const [unitsNeeded, setUnitsNeeded] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      hospital,
      bloodType,
      unitsNeeded,
      reason,
    });
    setBloodType('');
    setUnitsNeeded('');
    setReason('');
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Request Blood Transfer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
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
          <Form.Group className="mb-3">
            <Form.Label>Units Needed</Form.Label>
            <Form.Control
              type="number"
              value={unitsNeeded}
              onChange={e => setUnitsNeeded(e.target.value)}
              required
              min={1}
              placeholder="Enter number of units"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Reason</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={reason}
              onChange={e => setReason(e.target.value)}
              required
              placeholder="Enter reason for transfer"
            />
          </Form.Group>
          <Button variant="danger" type="submit">
            Submit Request
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RequestBloodTransfer;
