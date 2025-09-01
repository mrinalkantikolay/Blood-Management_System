
import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import './DonateNearbyHospital.css';
import './NearbyHospital.css';

const NearbyHospital = () => {
  const fromDonate = useSelector(state => state.source.fromDonate);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Try to get user's location
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

  // Modal state for blood availability
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [units, setUnits] = useState(1);
  const [availabilityResult, setAvailabilityResult] = useState(null);
  const [checking, setChecking] = useState(false);

  // Handler for opening modal
  const onCheckAvailability = (hospital) => {
    setSelectedHospital(hospital);
    setShowAvailabilityModal(true);
    setAvailabilityResult(null);
    setBloodGroup('A+');
    setUnits(1);
  };

  // Handler for checking availability (real API)
  const handleCheckAvailable = async () => {
    setChecking(true);
    setAvailabilityResult(null);
    try {
  const res = await fetch(`http://localhost:5001/api/blood_stock/availability?hospital_id=${selectedHospital.id}&blood_group=${encodeURIComponent(bloodGroup)}`);
      const data = await res.json();
      if (res.ok) {
        if (data.quantity >= Number(units)) {
          setAvailabilityResult('Yes, available');
        } else {
          setAvailabilityResult('Not available');
        }
      } else {
        setAvailabilityResult('Error checking availability');
      }
    } catch (err) {
      setAvailabilityResult('Error checking availability');
    }
    setChecking(false);
  };
  const onRequestDonate = () => alert('Request to Donate clicked');
  // Request Blood Modal state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({
    patientName: '',
    bloodType: 'A+',
    unitsNeeded: 1,
    urgency: 'Normal',
    requestDate: '',
    contact: '',
    reason: ''
  });
  const [requesting, setRequesting] = useState(false);
  const [requestResult, setRequestResult] = useState(null);
  const onRequestBlood = (hospital) => {
    setSelectedHospital(hospital);
    setShowRequestModal(true);
    setRequestForm({
      patientName: '',
      bloodType: 'A+',
      unitsNeeded: 1,
      urgency: 'Normal',
      requestDate: '',
      contact: '',
      reason: ''
    });
    setRequestResult(null);
  };
  // Bring Blood Request Modal state
  const [showBringBloodModal, setShowBringBloodModal] = useState(false);
  const [bringBloodForm, setBringBloodForm] = useState({
    patientName: '',
    bloodType: 'A+',
    unitsNeeded: 1,
    urgency: 'Normal',
    requestDate: '',
    contact: '',
    reason: ''
  });
  const [bringBloodRequesting, setBringBloodRequesting] = useState(false);
  const [bringBloodResult, setBringBloodResult] = useState(null);
  const onRequestTransfer = (hospital) => {
    setSelectedHospital(hospital);
    setShowBringBloodModal(true);
    setBringBloodForm({
      patientName: '',
      bloodType: 'A+',
      unitsNeeded: 1,
      urgency: 'Normal',
      requestDate: '',
      contact: '',
      reason: ''
    });
    setBringBloodResult(null);
  };

  // Handle bring blood form input change
  const handleBringBloodFormChange = (e) => {
    const { name, value } = e.target;
    setBringBloodForm(prev => ({ ...prev, [name]: value }));
  };

  // Submit bring blood request
  const handleSubmitBringBlood = async (e) => {
    e.preventDefault();
    setBringBloodRequesting(true);
    setBringBloodResult(null);
    try {
      const res = await fetch('http://localhost:5001/api/bring_blood_requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: bringBloodForm.patientName,
          bloodGroup: bringBloodForm.bloodType,
          unitsNeeded: bringBloodForm.unitsNeeded,
          urgency: bringBloodForm.urgency,
          requestDate: bringBloodForm.requestDate,
          contactNumber: bringBloodForm.contact,
          reason: bringBloodForm.reason,
          hospitalName: selectedHospital?.name
        })
      });
      if (res.ok) {
        setBringBloodResult('Request submitted successfully!');
        setShowBringBloodModal(false);
      } else {
        setBringBloodResult('Failed to submit request.');
      }
    } catch (err) {
      setBringBloodResult('Failed to submit request.');
    }
    setBringBloodRequesting(false);
  };

  // Handle form input change
  const handleRequestFormChange = (e) => {
    const { name, value } = e.target;
    setRequestForm(prev => ({ ...prev, [name]: value }));
  };

  // Submit blood request
  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setRequesting(true);
    setRequestResult(null);
    try {
      const res = await fetch('http://localhost:5001/api/blood_requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bloodGroup: requestForm.bloodType,
          units: requestForm.unitsNeeded,
          requiredDate: requestForm.requestDate,
          patientName: requestForm.patientName,
          hospitalName: selectedHospital?.name,
          location: selectedHospital?.location || selectedHospital?.address || '',
          contactNumber: requestForm.contact,
          reason: requestForm.reason
        })
      });
      if (res.ok) {
        setRequestResult('Request submitted successfully!');
        setShowRequestModal(false);
      } else {
        setRequestResult('Failed to submit request.');
      }
    } catch (err) {
      setRequestResult('Failed to submit request.');
    }
    setRequesting(false);
  };

  if (loading) return <p>Loading nearby hospitals...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <div style={{position: 'relative', marginTop: 32}}>
        <Button
          className="custom-red-btn"
          style={{position: 'absolute', top: -12, right: 0, borderRadius: 16.94, padding: '4.84px 19.36px', fontWeight: 600, fontSize: 16, zIndex: 1000}}
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
              <div className="d-flex flex-wrap justify-content-end" style={{gap: 12}}>
                {/* Force horizontal scroll on small screens for buttons */}
                <div className="hospital-action-row" style={{display: 'flex', gap: 12, overflowX: 'auto', flexWrap: 'nowrap'}}>
                {fromDonate ? (
                    <Button
                      className="responsive-action-btn custom-red-btn"
                      style={{ fontWeight: 600, borderRadius: 8, minWidth: 160, fontSize: 16 }}
                      onClick={() => onRequestDonate(hospital)}
                    >
                      <span role="img" aria-label="donate" style={{marginRight: 6, marginBottom: 2}}>🩸</span>
                      <span className="btn-label">Request to Donate</span>
                    </Button>
                ) : (
                  <>
                    <Button
                      className="responsive-action-btn custom-red-btn"
                      style={{ fontWeight: 600, borderRadius: 8, minWidth: 160, fontSize: 16, marginRight: 12, whiteSpace: 'normal', wordBreak: 'break-word' }}
                      onClick={() => onCheckAvailability(hospital)}
                    >
                      <span role="img" aria-label="search" style={{marginRight: 6, marginBottom: 2}}>🔍</span>
                      <span className="btn-label">Check Blood Availability</span>
                    </Button>
                    <Button
                      className="responsive-action-btn custom-red-btn"
                      style={{ fontWeight: 600, borderRadius: 8, minWidth: 160, fontSize: 16, marginRight: 12, whiteSpace: 'normal', wordBreak: 'break-word' }}
                      onClick={() => onRequestBlood(hospital)}
                    >
                      <span role="img" aria-label="blood" style={{marginRight: 6, marginBottom: 2}}>🩸</span>
                      <span className="btn-label">Request Blood</span>
                    </Button>
                    <Button
                      className="responsive-action-btn custom-red-btn"
                      style={{ fontWeight: 600, borderRadius: 8, minWidth: 160, fontSize: 16, whiteSpace: 'normal', wordBreak: 'break-word' }}
                      onClick={() => onRequestTransfer(hospital)}
                    >
                      <span role="img" aria-label="transfer" style={{marginRight: 6, marginBottom: 2}}>🔄</span>
                      <span className="btn-label">Request for Bring Blood</span>
                    </Button>
                  </>
                )}
                </div>
              </div>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No hospitals found nearby.</p>
      )}
  {/* Modal for Check Blood Availability */}
    <Modal show={showAvailabilityModal} onHide={() => setShowAvailabilityModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Check Blood Availability at {selectedHospital?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Blood Group</Form.Label>
            <Form.Select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)}>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Units</Form.Label>
            <Form.Control type="number" min={1} value={units} onChange={e => setUnits(e.target.value)} />
          </Form.Group>
          <Button className="custom-red-btn" onClick={handleCheckAvailable} disabled={checking}>
            {checking ? 'Checking...' : 'Check Available'}
          </Button>
        </Form>
        {availabilityResult && (
          <Alert variant={availabilityResult === 'Yes, available' ? 'success' : 'danger'} className="mt-3 text-center">
            {availabilityResult}
          </Alert>
        )}
      </Modal.Body>
    </Modal>
  {/* Modal for Request Blood */}
    {/* Modal for Request for Bring Blood */}
    <Modal show={showBringBloodModal} onHide={() => setShowBringBloodModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Request for Bring Blood at {selectedHospital?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmitBringBlood}>
          <Form.Group className="mb-3">
            <Form.Label>Patient Name</Form.Label>
            <Form.Control name="patientName" value={bringBloodForm.patientName} onChange={handleBringBloodFormChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Blood Type</Form.Label>
            <Form.Select name="bloodType" value={bringBloodForm.bloodType} onChange={handleBringBloodFormChange} required>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Units Needed</Form.Label>
            <Form.Control name="unitsNeeded" type="number" min={1} value={bringBloodForm.unitsNeeded} onChange={handleBringBloodFormChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Urgency</Form.Label>
            <Form.Select name="urgency" value={bringBloodForm.urgency} onChange={handleBringBloodFormChange} required>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Request Date</Form.Label>
            <Form.Control name="requestDate" type="date" value={bringBloodForm.requestDate} onChange={handleBringBloodFormChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contact</Form.Label>
            <Form.Control name="contact" value={bringBloodForm.contact} onChange={handleBringBloodFormChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Reason</Form.Label>
            <Form.Control name="reason" value={bringBloodForm.reason} onChange={handleBringBloodFormChange} required />
          </Form.Group>
          <Button className="custom-red-btn" type="submit" disabled={bringBloodRequesting}>
            {bringBloodRequesting ? 'Requesting...' : 'Submit Request'}
          </Button>
        </Form>
        {bringBloodResult && (
          <Alert variant={bringBloodResult.includes('success') ? 'success' : 'danger'} className="mt-3 text-center">
            {bringBloodResult}
          </Alert>
        )}
      </Modal.Body>
    </Modal>
    <Modal show={showRequestModal} onHide={() => setShowRequestModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Request Blood at {selectedHospital?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmitRequest}>
          <Form.Group className="mb-3">
            <Form.Label>Patient Name</Form.Label>
            <Form.Control name="patientName" value={requestForm.patientName} onChange={handleRequestFormChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Blood Type</Form.Label>
            <Form.Select name="bloodType" value={requestForm.bloodType} onChange={handleRequestFormChange} required>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Units Needed</Form.Label>
            <Form.Control name="unitsNeeded" type="number" min={1} value={requestForm.unitsNeeded} onChange={handleRequestFormChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Urgency</Form.Label>
            <Form.Select name="urgency" value={requestForm.urgency} onChange={handleRequestFormChange} required>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Request Date</Form.Label>
            <Form.Control name="requestDate" type="date" value={requestForm.requestDate} onChange={handleRequestFormChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contact</Form.Label>
            <Form.Control name="contact" value={requestForm.contact} onChange={handleRequestFormChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Reason</Form.Label>
            <Form.Control name="reason" value={requestForm.reason} onChange={handleRequestFormChange} required />
          </Form.Group>
          <Button className="custom-red-btn" type="submit" disabled={requesting}>
            {requesting ? 'Requesting...' : 'Submit Request'}
          </Button>
        </Form>
        {requestResult && (
          <Alert variant={requestResult.includes('success') ? 'success' : 'danger'} className="mt-3 text-center">
            {requestResult}
          </Alert>
        )}
      </Modal.Body>
    </Modal>
    </div>
  );
};

export default NearbyHospital;
