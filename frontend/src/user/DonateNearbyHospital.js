import React, { useEffect, useState } from 'react';
import './DonateNearbyHospital.css';
import { Card, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';

const DonateNearbyHospital = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', age: '', phone: '', blood_group: '', address: '' });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`http://localhost:5001/api/hospitals/nearby?latitude=${latitude}&longitude=${longitude}`);
            if (!response.ok) throw new Error('Failed to fetch hospitals');
            const data = await response.json();
            setHospitals(data);
          } catch (err) {
            setError('Failed to fetch hospitals for your location.');
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          setError('Location access denied. Cannot fetch nearby hospitals.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  }, []);

  const onRequestDonate = (hospital) => {
    setSelectedHospital(hospital);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setForm({ name: '', email: '', age: '', phone: '', blood_group: '', address: '' });
    setSubmitError(null);
    setSubmitSuccess(null);
    setSubmitLoading(false);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5001/api/donors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          age: form.age,
          contact: form.phone, // backend expects 'contact'
          blood_group: form.blood_group,
          address: form.address,
          hospital_id: selectedHospital?.id
        })
      });
      if (!res.ok) throw new Error('Failed to submit request.');
      setSubmitSuccess('Request submitted! Staff will review your donation.');
      setTimeout(() => {
        handleModalClose();
      }, 1500);
    } catch (err) {
      setSubmitError('Could not submit request. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <Spinner animation="border" variant="danger" className="mt-4" />;
  if (error) return <Alert variant="danger" className="mt-4">{error}</Alert>;

  return (
    <div>
  <div style={{position: 'relative', marginTop: 32}}>
        <Button
          variant="outline-danger"
          style={{position: 'absolute', top: 0, right: 0, borderRadius: 20, padding: '6px 24px', fontWeight: 600, fontSize: 18, zIndex: 1000}}
          onClick={() => { localStorage.removeItem('token'); window.location.replace('/'); }}
        >
          Logout
        </Button>
        <div className="d-flex flex-column align-items-center mb-4" style={{justifyContent: 'center'}}>
          <span role="img" aria-label="hospital" style={{fontSize: 48, marginBottom: -8}}>🏥</span>
          <h2 className="fw-bold text-danger mb-0" style={{fontSize: 32, letterSpacing: 1}}>
            Hospital
          </h2>
        </div>
      </div>
  <div style={{marginBottom: 65}}></div>
      {hospitals && hospitals.length > 0 ? (
        hospitals.map(hospital => (
          <Card
            key={hospital.id}
            className="mb-4 shadow-sm hospital-hover-card"
            style={{ borderRadius: 18, background: '#fff' }}
          >
            <Card.Body style={{ padding: '1.5rem 1.5rem 1rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: '#d32f2f', display: 'flex', alignItems: 'center' }}>
                  <span role="img" aria-label="hospital" style={{marginRight: 8}}>🏥</span>{hospital.name}
                </span>
                <span style={{ marginLeft: 'auto', color: '#1976d2', fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#d32f2f" viewBox="0 0 24 24" style={{marginRight: 6, marginBottom: 2}}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>{hospital.distance || 'N/A'}
                </span>
              </div>
              <div style={{ marginBottom: 8, color: '#444', fontSize: 15, display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 500, marginRight: 8 }}>📍 Address:</span> {hospital.location || hospital.address}
              </div>
              <div style={{ display: 'flex', gap: 24, marginBottom: 8, color: '#444', fontSize: 15 }}>
                <div><span style={{ fontWeight: 500 }}>📞 Phone:</span> {hospital.phone}</div>
                <div><span style={{ fontWeight: 500 }}>🗺️ Pincode:</span> {hospital.pincode}</div>
              </div>
              <div className="d-flex justify-content-end">
                <Button
                  className="custom-red-btn"
                  style={{ fontWeight: 600, borderRadius: 8, minWidth: 160, fontSize: 16 }}
                  onClick={() => onRequestDonate(hospital)}
                >
                  <span role="img" aria-label="donate" style={{marginRight: 6, marginBottom: 2}}>🩸</span>
                  Request to Donate
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No hospitals found nearby.</p>
      )}

      {/* Modal for Request to Donate */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Request to Donate at {selectedHospital?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {submitError && <Alert variant="danger">{submitError}</Alert>}
          {submitSuccess && <Alert variant="success">{submitSuccess}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={form.name} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={form.email} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control type="number" name="age" value={form.age} onChange={handleFormChange} required min="18" max="65" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control name="phone" value={form.phone} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Blood Type</Form.Label>
              <Form.Control name="blood_group" value={form.blood_group} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control name="address" value={form.address} onChange={handleFormChange} required />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleModalClose} className="me-2" disabled={submitLoading}>Cancel</Button>
              <Button variant="danger" type="submit" disabled={submitLoading}>
                {submitLoading ? <Spinner size="sm" animation="border" /> : 'Submit Request'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DonateNearbyHospital;
