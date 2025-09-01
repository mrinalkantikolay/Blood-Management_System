import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Nav, Alert, Spinner, Button, Modal, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [activeTab, setActiveTab] = useState('donations');
  const [bringBloodRequests, setBringBloodRequests] = useState([]);
  const [showBringModal, setShowBringModal] = useState(false);
  const [bringModalData, setBringModalData] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setIsLoading(true);
    setError(null);
    Promise.all([
      fetch('/api/users/history', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('/api/bring_blood_requests', { headers: { Authorization: `Bearer ${token}` } })
    ])
      .then(async ([historyRes, bringRes]) => {
        if (!historyRes.ok) throw new Error('Failed to fetch user history');
        if (!bringRes.ok) throw new Error('Failed to fetch bring blood requests');
        const historyData = await historyRes.json();
        const bringData = await bringRes.json();
        setDonations(historyData.donations || []);
        setRequests(historyData.requests || []);
        setBringBloodRequests(bringData.requests || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [navigate]);



  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingTop: '2rem' }}>
  <Container>
        <div className="d-flex justify-content-between align-items-center mb-5" style={{ position: 'relative' }}>
          <div className="text-center w-100">
            <h1 className="display-4 fw-bold text-danger mb-3">🕑 History</h1>
            <p className="lead text-muted">Your blood donation and request history</p>
            {/* Optionally show user badge if username is in localStorage */}
            {localStorage.getItem('username') && (
              <div className="mt-3">
                <span className="badge bg-danger me-2 fs-6">👤 {localStorage.getItem('username')}</span>
              </div>
            )}
          </div>
        </div>
        <div className="sticky-nav" style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', boxShadow: 'none', borderBottom: 'none', padding: '0.5rem 0' }}>
          <Nav variant="pills" activeKey={activeTab} onSelect={setActiveTab} className="mb-4 justify-content-center">
            <Nav.Item>
              <Nav.Link eventKey="donations" className={`custom-nav-link fw-bold rounded${activeTab === 'donations' ? ' bg-red-deep active' : ' bg-transparent text-dark'}`}>🩸 Donations</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="bringblood" className={`custom-nav-link fw-bold rounded${activeTab === 'bringblood' ? ' bg-red-deep active' : ' bg-transparent text-dark'}`}>🚚 Bring Blood Requests</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="requests" className={`custom-nav-link fw-bold rounded${activeTab === 'requests' ? ' bg-red-deep active' : ' bg-transparent text-dark'}`}>📋 Blood Requests</Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
        <Card className="shadow-lg border-0 mb-4" style={{ border: '2px solid #dc3545', borderRadius: '1rem' }}>
          <Card.Body>
            {isLoading ? (
              <div className="text-center my-5"><Spinner animation="border" variant="danger" /></div>
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : activeTab === 'donations' ? (
              donations.length === 0 ? (
                <Alert variant="info">No donation history found.</Alert>
              ) : (
                    <div className="table-responsive">
                  <table className="table table-striped table-bordered table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>📅 Date</th>
                        <th>🩸 Blood Group</th>
                        <th>📍 Location</th>
                        <th>📊 Total Donations</th>
                        <th>📅 Last Donation</th>
                        <th>🏥 Hospital</th>
                        <th>📊 Status</th>
                        <th>📝 Remarks</th>
                        <th>✅ Eligibility</th>
                        <th>⚙️ Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.map((donation, index) => (
                        <tr key={index}>
                          <td>{donation.donation_date ? new Date(donation.donation_date).toLocaleDateString() : '-'}</td>
                          <td><span className="badge bg-info">{donation.blood_group || '-'}</span></td>
                          <td>{donation.location || '-'}</td>
                          <td><span className="badge bg-warning">{donation.totalDonations || '-'}</span></td>
                          <td>{donation.lastDonation ? new Date(donation.lastDonation).toLocaleDateString() : '-'}</td>
                          <td>{donation.hospital || '-'}</td>
                          <td><span className={`badge ${donation.status === 'Completed' ? 'bg-success' : 'bg-warning'}`}>{donation.status}</span></td>
                          <td>{donation.remarks || '-'}</td>
                          <td><span className={`badge ${donation.eligibility === 'Eligible' ? 'bg-success' : 'bg-warning'}`}>{donation.eligibility || '-'}</span></td>
                          <td>
                            <Button variant="outline-primary" size="sm" onClick={() => { setModalData(donation); setShowModal(true); }}>View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : activeTab === 'bringblood' ? (
              bringBloodRequests.length === 0 ? (
                <Alert variant="info">No bring blood requests found.</Alert>
              ) : (
                <Table responsive hover className="align-middle">
                  <thead>
                    <tr>
                      <th>Patient Name</th>
                      <th>Blood Type</th>
                      <th>Units Needed</th>
                      <th>Urgency</th>
                      <th>Hospital</th>
                      <th>Request Date</th>
                      <th>Contact</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Approved Date</th>
                      <th>Fulfilled Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bringBloodRequests.map((request, index) => (
                      <tr key={index}>
                        <td>{request.patientName || '-'}</td>
                        <td>{request.bloodType || '-'}</td>
                        <td>{request.unitsNeeded || '-'}</td>
                        <td><span className={`badge ${request.urgency === 'Critical' ? 'bg-danger' : request.urgency === 'High' ? 'bg-warning' : 'bg-secondary'}`}>{request.urgency || '-'}</span></td>
                        <td>{request.hospital || '-'}</td>
                        <td>{request.requestDate ? request.requestDate.split('T')[0] : '-'}</td>
                        <td>{request.contactNumber || '-'}</td>
                        <td>{request.reason || '-'}</td>
                        <td><span className={`badge ${request.status === 'Pending' ? 'bg-warning' : request.status === 'Approved' ? 'bg-info' : request.status === 'Rejected' ? 'bg-danger' : 'bg-success'}`}>{request.status}</span></td>
                        <td>{request.approvedDate ? request.approvedDate.split('T')[0] : '-'}</td>
                        <td>{request.fulfilledDate ? request.fulfilledDate.split('T')[0] : '-'}</td>
                        <td>
                          <Button variant="outline-primary" size="sm" onClick={() => { setBringModalData(request); setShowBringModal(true); }}>View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )
            ) : (
              requests.length === 0 ? (
                <Alert variant="info">No request history found.</Alert>
              ) : (
                <Table responsive hover className="align-middle">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Blood Group</th>
                      <th>Units</th>
                      <th>Hospital</th>
                      <th>Urgency</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Approved Date</th>
                      <th>Fulfilled Date</th>
                      <th>Contact</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request, index) => (
                      <tr key={index}>
                        <td>{request.required_date ? new Date(request.required_date).toLocaleDateString() : '-'}</td>
                        <td>{request.blood_group || '-'}</td>
                        <td>{request.units || '-'}</td>
                        <td>{request.hospital_name || '-'}</td>
                        <td><span className={`badge ${request.urgency === 'Critical' ? 'bg-danger' : request.urgency === 'High' ? 'bg-warning' : 'bg-secondary'}`}>{request.urgency || '-'}</span></td>
                        <td>{request.reason || '-'}</td>
                        <td><span className={`badge bg-${
                          request.status === 'Approved' ? 'success' : 
                          request.status === 'Pending' ? 'warning' : request.status === 'Rejected' ? 'danger' : 'secondary'
                        }`}>{request.status}</span></td>
                        <td>{request.approved_date ? new Date(request.approved_date).toLocaleDateString() : '-'}</td>
                        <td>{request.fulfilled_date ? new Date(request.fulfilled_date).toLocaleDateString() : '-'}</td>
                        <td>{request.contact_number || '-'}</td>
                        <td>
                          <Button variant="outline-primary" size="sm" onClick={() => { setModalData(request); setShowModal(true); }}>View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )
            )}
          </Card.Body>
        </Card>
        {/* Modals */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalData && (
              <div>
                {modalData.donation_date ? (
                  <>
                    <p><strong>Date:</strong> {new Date(modalData.donation_date).toLocaleDateString()}</p>
                    <p><strong>Blood Group:</strong> {modalData.blood_group}</p>
                    <p><strong>Location:</strong> {modalData.location}</p>
                    <p><strong>Status:</strong> <span className={`badge bg-${modalData.status === 'Completed' ? 'success' : 'warning'}`}>{modalData.status}</span></p>
                  </>
                ) : (
                  <>
                    <p><strong>Date:</strong> {modalData.required_date ? new Date(modalData.required_date).toLocaleDateString() : '-'}</p>
                    <p><strong>Blood Group:</strong> {modalData.blood_group}</p>
                    <p><strong>Units:</strong> {modalData.units}</p>
                    <p><strong>Hospital:</strong> {modalData.hospital_name}</p>
                    <p><strong>Status:</strong> <span className={`badge bg-${
                      modalData.status === 'Approved' ? 'success' : 
                      modalData.status === 'Pending' ? 'warning' : 'danger'
                    }`}>{modalData.status}</span></p>
                  </>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showBringModal} onHide={() => setShowBringModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Bring Blood Request Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {bringModalData && (
              <div>
                <p><strong>Patient Name:</strong> {bringModalData.patientName}</p>
                <p><strong>Blood Type:</strong> {bringModalData.bloodType}</p>
                <p><strong>Units Needed:</strong> {bringModalData.unitsNeeded}</p>
                <p><strong>Urgency:</strong> {bringModalData.urgency}</p>
                <p><strong>Hospital:</strong> {bringModalData.hospital}</p>
                <p><strong>Request Date:</strong> {bringModalData.requestDate}</p>
                <p><strong>Contact Number:</strong> {bringModalData.contactNumber}</p>
                <p><strong>Reason:</strong> {bringModalData.reason}</p>
                <p><strong>Status:</strong> {bringModalData.status}</p>
                <p><strong>Approved Date:</strong> {bringModalData.approvedDate}</p>
                <p><strong>Fulfilled Date:</strong> {bringModalData.fulfilledDate}</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowBringModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default History;