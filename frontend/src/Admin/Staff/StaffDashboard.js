import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { Container, Card, Nav, Button, Modal } from 'react-bootstrap';
import DonorsManagement from './components/DonorsManagement';
import HospitalManagement from './components/HospitalManagement';
import BringBloodRequest from './components/BringBloodRequest';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
    // State for editing fulfilled and approved date
    const [editFulfilledDate, setEditFulfilledDate] = useState('');
    const [editApprovedDate, setEditApprovedDate] = useState('');
    // State for editing blood request status
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [editRequestMode, setEditRequestMode] = useState(false);
    const [deleteRequestMode, setDeleteRequestMode] = useState(false);
    const [editRequestStatus, setEditRequestStatus] = useState('');
    // Open modal for approve/reject
    const openRequestModal = (request) => {
        setSelectedRequest(request);
        setEditRequestMode(false);
        setShowRequestModal(true);
    };

    // Open modal for editing status only

    const handleEditRequest = (request) => {
        setSelectedRequest(request);
        setEditRequestStatus(request.status || 'Pending');
        setEditFulfilledDate(request.status === 'Fulfilled' ? (request.fulfilledDate || '') : '');
        setEditApprovedDate(request.status === 'Approved' ? (request.approvedDate || '') : '');
        setEditRequestMode(true);
        setDeleteRequestMode(false);
        setShowRequestModal(true);
    };

    const handleDeleteRequest = (request) => {
        setSelectedRequest(request);
        setEditRequestMode(false);
        setDeleteRequestMode(true);
        setShowRequestModal(true);
    };

    // When status changes, clear fulfilled/approved date if not Fulfilled/Approved
    useEffect(() => {
        if (editRequestMode) {
            if (editRequestStatus !== 'Fulfilled' && editFulfilledDate) {
                setEditFulfilledDate('');
            }
            if (editRequestStatus !== 'Approved' && editApprovedDate) {
                setEditApprovedDate('');
            }
        }
    }, [editRequestStatus, editRequestMode]);

    const fetchBloodRequests = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/blood_requests');
            const mapped = response.data.map(r => ({
                id: r.id,
                patientName: r.patientName || r.patient_name, // Use patientName from backend join, fallback to patient_name
                bloodType: r.bloodType || r.blood_group,
                unitsNeeded: r.units || r.quantity,
                urgency: r.urgency || '',
                hospital: r.hospital_name,
                requestDate: r.required_date || r.request_date,
                contactNumber: r.contactNumber || r.contact_number,
                status: r.status,
                reason: r.reason,
                approvedDate: r.approved_date,
                fulfilledDate: r.fulfilled_date
            }));
            setBloodRequests(mapped);
        } catch (err) {
            console.error('Error fetching blood requests:', err);
        }
    };

    const [bringBloodRequests, setBringBloodRequests] = useState([]);

    // Fetch bring blood requests from the new endpoint
    const fetchBringBloodRequests = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/bring_blood_requests');
            setBringBloodRequests(response.data);
        } catch (err) {
            console.error('Error fetching bring blood requests:', err);
        }
    };

    // Fetch on mount
    useEffect(() => {
        fetchBringBloodRequests();
    }, []);

    // Update bring blood requests after edit/delete
    const refreshBringBloodRequests = fetchBringBloodRequests;

    const handleSaveRequestEdit = async () => {
        // For bring blood requests modal
        if (selectedBringBloodRequest) {
            console.log('Saving bring blood request:', {
                status: editRequestStatus,
                fulfilledDate: editFulfilledDate,
                approvedDate: editApprovedDate
            });
            try {
                await axios.put(`http://localhost:5001/api/bring_blood_requests/${selectedBringBloodRequest.id}`,
                    {
                        status: editRequestStatus,
                        fulfilled_date: editFulfilledDate,
                        approved_date: editApprovedDate
                    }
                );
                await refreshBringBloodRequests();
            } catch (err) {
                console.error('Error updating bring blood request:', err);
            }
            setShowBringBloodModal(false);
            setEditBringBloodMode(false);
        }
        // For regular blood requests modal
        else if (selectedRequest) {
            console.log('Saving blood request:', {
                status: editRequestStatus,
                fulfilledDate: editFulfilledDate,
                approvedDate: editApprovedDate
            });
            try {
                await axios.put(`http://localhost:5001/api/blood_requests/${selectedRequest.id}`,
                    {
                        status: editRequestStatus,
                        fulfilledDate: editFulfilledDate,
                        approvedDate: editApprovedDate
                    }
                );
                await fetchBloodRequests();
            } catch (err) {
                console.error('Error updating blood request:', err);
            }
            setShowRequestModal(false);
            setEditRequestMode(false);
        }
    };

    const handleApproveRequest = async () => {
        if (selectedRequest) {
            try {
                await axios.put(`http://localhost:5001/api/blood_requests/${selectedRequest.id}`,
                    { status: 'Approved' }
                );
                await fetchBloodRequests();
            } catch (err) {
                console.error('Error approving blood request:', err);
            }
            setShowRequestModal(false);
        }
    };

    const handleRejectRequest = async () => {
        if (selectedRequest) {
            try {
                await axios.put(`http://localhost:5001/api/blood_requests/${selectedRequest.id}`,
                    { status: 'Rejected' }
                );
                await fetchBloodRequests();
            } catch (err) {
                console.error('Error rejecting blood request:', err);
            }
            setShowRequestModal(false);
        }
    };

    const closeRequestModal = () => {
        setShowRequestModal(false);
        setSelectedRequest(null);
        setEditRequestMode(false);
    };
    // State for editing/deleting donor fields
    const [editMode, setEditMode] = useState(false);
    const [deleteDonorMode, setDeleteDonorMode] = useState(false);
    const [editLastDonation, setEditLastDonation] = useState('');
    const [editTotalDonations, setEditTotalDonations] = useState('');

    // State for bring blood request delete mode
    const [deleteBringBloodMode, setDeleteBringBloodMode] = useState(false);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('hospital');
    const [staffProfile, setStaffProfile] = useState(null);
    // Donors data (fetched from backend)
    const [donors, setDonors] = useState([]);
    // Hospital blood modal state
    const [showBloodModal, setShowBloodModal] = useState(false);
    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const staffToken = localStorage.getItem('staffToken');
                const response = await axios.get('http://localhost:5001/api/donors', {
                    headers: { Authorization: `Bearer ${staffToken}` }
                });
                setDonors(response.data);
            } catch (err) {
                console.error('Error fetching donors:', err);
            }
        };
        fetchDonors();
    }, []);
    const [showDonorModal, setShowDonorModal] = useState(false);
    const [selectedDonor, setSelectedDonor] = useState(null);

    // Used for both approve/reject and edit actions
    const openDonorRequestModal = (donor) => {
        setSelectedDonor(donor);
        setEditMode(false);
        setDeleteDonorMode(false);
        setShowDonorModal(true);
    };

    const handleEdit = (donor) => {
        setSelectedDonor(donor);
        setEditLastDonation(donor.lastDonation || '');
        setEditTotalDonations(donor.totalDonations || '');
        setEditMode(true);
        setDeleteDonorMode(false);
        setShowDonorModal(true);
    };

    const handleDeleteDonor = (donor) => {
        setSelectedDonor(donor);
        setEditMode(false);
        setDeleteDonorMode(true);
        setShowDonorModal(true);
    };

    const handleConfirmDeleteDonor = async () => {
        if (selectedDonor) {
            try {
                const staffToken = localStorage.getItem('staffToken');
                await axios.delete(`http://localhost:5001/api/donors/${selectedDonor.id}`, {
                    headers: { Authorization: `Bearer ${staffToken}` }
                });
                setDonors(prev => prev.filter(d => d.id !== selectedDonor.id));
            } catch (err) {
                console.error('Error deleting donor:', err);
            }
            setShowDonorModal(false);
            setDeleteDonorMode(false);
        }
    };

    // Bring Blood Request edit/delete handlers
    const [selectedBringBloodRequest, setSelectedBringBloodRequest] = useState(null);
    const [editBringBloodMode, setEditBringBloodMode] = useState(false);
    const handleEditBringBlood = (request) => {
        setSelectedBringBloodRequest(request);
        setEditBringBloodMode(true);
        setDeleteBringBloodMode(false);
        setShowBringBloodModal(true);
    };
    const handleDeleteBringBlood = async (request) => {
        setSelectedBringBloodRequest(request);
        setEditBringBloodMode(false);
        setDeleteBringBloodMode(true);
        setShowBringBloodModal(true);
        try {
            await axios.delete(`http://localhost:5001/api/bring_blood_requests/${request.id}`);
            await refreshBringBloodRequests();
        } catch (err) {
            console.error('Error deleting bring blood request:', err);
        }
    };

    const handleConfirmDeleteBringBlood = async () => {
        if (selectedBringBloodRequest) {
            try {
                console.log('Deleting blood request with ID:', selectedBringBloodRequest.id);
                await axios.delete(`http://localhost:5001/api/blood_requests/${selectedBringBloodRequest.id}`);
                setBloodRequests(prev => prev.filter(r => r.id !== selectedBringBloodRequest.id));
            } catch (err) {
                console.error('Error deleting bring blood request:', err);
            }
            setShowBringBloodModal(false);
            setDeleteBringBloodMode(false);
        }
    };
    const [showBringBloodModal, setShowBringBloodModal] = useState(false);

    

    const handleSaveEdit = () => {
        if (selectedDonor) {
            setDonors(prev => prev.map(d =>
                d.id === selectedDonor.id
                    ? { ...d, lastDonation: editLastDonation, totalDonations: editTotalDonations }
                    : d
            ));
            setShowDonorModal(false);
            setEditMode(false);

        }
    };

    const closeDonorModal = () => {
        setShowDonorModal(false);
        setSelectedDonor(null);
    };

    const handleApprove = () => {
        if (selectedDonor) {
            setDonors(prev => prev.map(d => d.id === selectedDonor.id ? { ...d, requestStatus: 'Approved' } : d));
            closeDonorModal();
        }
    };

    const handleReject = () => {
        if (selectedDonor) {
            setDonors(prev => prev.map(d => d.id === selectedDonor.id ? { ...d, requestStatus: 'Rejected' } : d));
            closeDonorModal();
        }
    };


    // Blood requests data (fetched from backend)
    const [bloodRequests, setBloodRequests] = useState([]);
    useEffect(() => {
        const fetchBloodRequests = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/blood_requests');
                // Map backend fields to frontend fields if needed
                const mapped = response.data.map(r => ({
                    id: r.id,
                    patientName: r.patientName || r.patient_name, // Use patientName from backend join, fallback to patient_name
                    bloodType: r.bloodType || r.blood_group,
                    unitsNeeded: r.units || r.quantity,
                    urgency: r.urgency || '',
                    hospital: r.hospital_name,
                    requestDate: r.required_date || r.request_date,
                    contactNumber: r.contactNumber || r.contact_number,
                    status: r.status,
                    reason: r.reason,
                    approvedDate: r.approved_date,
                    fulfilledDate: r.fulfilled_date
                }));
                setBloodRequests(mapped);
            } catch (err) {
                console.error('Error fetching blood requests:', err);
            }
        };
        fetchBloodRequests();
    }, []);

    useEffect(() => {
        const staffToken = localStorage.getItem('staffToken');
        const userRole = localStorage.getItem('userRole');
        let profile = null;
        try {
            profile = JSON.parse(localStorage.getItem('staffProfile'));
        } catch (e) {
            profile = null;
        }
        // Check for valid token, correct role, and profile is a non-null object
        if (!staffToken || userRole !== 'staff' || !profile || typeof profile !== 'object') {
            navigate('/staff-auth');
        } else {
            setStaffProfile(profile);
        }
    }, [navigate]);

    // Hospital data with blood inventory (fetched from backend)
    const [hospitals, setHospitals] = useState([]);
    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/hospitals');
                // If bloodInventory is stored as JSON string, parse it
                const hospitalsWithInventory = response.data.map(h => ({
                    ...h,
                    bloodInventory: h.bloodInventory ? (typeof h.bloodInventory === 'string' ? JSON.parse(h.bloodInventory) : h.bloodInventory) : {}
                }));
                setHospitals(hospitalsWithInventory);
            } catch (err) {
                console.error('Error fetching hospitals:', err);
            }
        };
        fetchHospitals();
    }, []);

    const handleSaveBloodInventory = async (hospitalId, newInventory) => {
        try {
            // Update blood_stock table via new endpoint
            await axios.post('http://localhost:5001/api/blood_stock/update_inventory', {
                hospital_id: hospitalId,
                inventory: newInventory
            });
            // Optionally, also update the hospital's bloodInventory field for legacy UI
            const hospital = hospitals.find(h => h.id === hospitalId);
            await axios.put(`http://localhost:5001/api/hospitals/${hospitalId}`, {
                ...hospital,
                bloodInventory: JSON.stringify(newInventory)
            });
            // Refresh hospitals
            const response = await axios.get('http://localhost:5001/api/hospitals');
            const hospitalsWithInventory = response.data.map(h => ({
                ...h,
                bloodInventory: h.bloodInventory ? (typeof h.bloodInventory === 'string' ? JSON.parse(h.bloodInventory) : h.bloodInventory) : {}
            }));
            setHospitals(hospitalsWithInventory);
        } catch (err) {
            console.error('Error updating blood inventory:', err);
        }
    };

    const handleLogout = async () => {
        // Get staffProfile from localStorage or state
        let profile = staffProfile;
        if (!profile) {
            try {
                profile = JSON.parse(localStorage.getItem('staffProfile'));
            } catch (e) {
                profile = null;
            }
        }
        if (profile && profile.id) {
            try {
                await axios.post('http://localhost:5001/api/staff/logout', { staffId: profile.id });
            } catch (err) {
                // Optionally log error, but continue logout
                console.error('Error updating staff status on logout:', err);
            }
        }
        localStorage.removeItem('staffToken');
        localStorage.removeItem('staffProfile');
        localStorage.removeItem('userRole'); // Clear role on logout
        window.location.replace('/'); // Force full reload to home page
    };

    return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingTop: '2rem' }}>
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-5" style={{ position: 'relative' }}>
                {!(showDonorModal || showBringBloodModal || showRequestModal || showBloodModal) && (
                    <Button 
                        variant="outline-danger" 
                        className="ms-auto" 
                        style={{ position: 'absolute', top: '-24px', right: 0, zIndex: 2000 }} 
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                )}
                <div className="text-center w-100">
                    <h1 className="display-4 fw-bold text-danger mb-3">🩸 Staff</h1>
                    <p className="lead text-muted">Staff management system for hospital and user operations</p>
                    {staffProfile && (
                        <div className="mt-3">
                            <span className="badge bg-danger me-2 fs-6">👤 {staffProfile.name}</span>
                            <span className="badge bg-danger me-2 fs-6">🏥 {staffProfile.hospital}</span>
                            <span className="badge bg-danger fs-6">{staffProfile.role}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="sticky-nav" style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', boxShadow: 'none', borderBottom: 'none', padding: '0.5rem 0' }}>
                <Nav 
                    variant="pills" 
                    activeKey={activeTab} 
                    onSelect={setActiveTab} 
                    className="mb-4"
                >
                <Nav.Item>
                    <Nav.Link eventKey="hospital" className={`custom-nav-link fw-bold rounded${activeTab === 'hospital' ? ' bg-red-deep active' : ' bg-transparent text-dark'}`}>
                        🏥 Hospital Management
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="donors" className={`custom-nav-link fw-bold rounded${activeTab === 'donors' ? ' bg-red-deep active' : ' bg-transparent text-dark'}`}>
                        🩸 Donors Management
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="bringblood" className={`custom-nav-link fw-bold rounded${activeTab === 'bringblood' ? ' bg-red-deep active' : ' bg-transparent text-dark'}`}>
                        🚚 Bring Blood Requests
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="requests" className={`custom-nav-link fw-bold rounded${activeTab === 'requests' ? ' bg-red-deep active' : ' bg-transparent text-dark'}`}>
                        📋 Blood Requests
                    </Nav.Link>
                </Nav.Item>
                </Nav>
            </div>
            {/* Hospital Management Tab */}
            {activeTab === 'hospital' && (
                <HospitalManagement 
                    hospitals={hospitals} 
                    onSaveBloodInventory={handleSaveBloodInventory}
                    showBloodModal={showBloodModal}
                    setShowBloodModal={setShowBloodModal}
                />
            )}
            {/* Donors Management Tab */}

            {activeTab === 'donors' && (
                <DonorsManagement 
                    donors={donors} 
                    onApproveReject={openDonorRequestModal}
                    onEdit={handleEdit}
                    onDelete={handleDeleteDonor}
                />
            )}
            {/* ...existing code... */}

            {/* Bring Blood Requests Tab */}
            {activeTab === 'bringblood' && (
                <BringBloodRequest 
                    requests={bringBloodRequests} 
                    onEdit={handleEditBringBlood}
                    onDelete={handleDeleteBringBlood}
                    onConfirmDelete={handleConfirmDeleteBringBlood}
                    showModal={showBringBloodModal}
                    selectedRequest={selectedBringBloodRequest}
                    editMode={editBringBloodMode}
                    deleteMode={deleteBringBloodMode}
                    editRequestStatus={editRequestStatus}
                    editApprovedDate={editApprovedDate}
                    editFulfilledDate={editFulfilledDate}
                    setEditRequestStatus={setEditRequestStatus}
                    setEditApprovedDate={setEditApprovedDate}
                    setEditFulfilledDate={setEditFulfilledDate}
                    closeModal={() => setShowBringBloodModal(false)}
                    handleSave={handleSaveRequestEdit}
                />
            )}

            {/* Donor Details Modal */}
            <Modal show={showDonorModal} onHide={closeDonorModal} size="md">
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>👤 Donor Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedDonor && (
                        <div>
                            <p><strong>Name:</strong> {selectedDonor.name}</p>
                            <p><strong>Blood Type:</strong> {selectedDonor.bloodType}</p>
                            <p><strong>Total Donations:</strong> {selectedDonor.totalDonations}</p>
                            <p><strong>Last Donation:</strong> {selectedDonor.lastDonation}</p>
                            <p><strong>Address:</strong> {selectedDonor.address}</p>
                            <p><strong>Hospital:</strong> {selectedDonor.hospital}</p>
                            <p><strong>Status:</strong> {selectedDonor.status}</p>
                            <p><strong>Requested:</strong> {selectedDonor.requested ? 'Yes' : 'No'}</p>
                            <p><strong>Request Status:</strong> {selectedDonor.requestStatus}</p>
                            <p><strong>Email:</strong> {selectedDonor.email}</p>
                            <p><strong>Phone:</strong> {selectedDonor.phone}</p>
                            {editMode ? (
                                <>
                                    <div className="mb-2">
                                        <label><strong>Last Donation:</strong></label>
                                        <input type="date" className="form-control" value={editLastDonation} onChange={e => setEditLastDonation(e.target.value)} />
                                    </div>
                                    <div className="mb-2">
                                        <label><strong>Total Donations:</strong></label>
                                        <input type="number" className="form-control" value={editTotalDonations} onChange={e => setEditTotalDonations(e.target.value)} min="0" />
                                    </div>
                                    <div className="d-flex gap-2 mt-3">
                                        <Button variant="outline-success" onClick={handleApprove}>✅ Approve</Button>
                                        <Button variant="outline-danger" onClick={handleReject}>❌ Reject</Button>
                                    </div>
                                </>
                            ) : deleteDonorMode && (
                                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', width: '100%' }}>
                                    <Button variant="danger" size="lg" onClick={handleConfirmDeleteDonor}>🗑️ Delete</Button>
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {editMode ? (
                        <Button variant="outline-primary" onClick={handleSaveEdit}>💾 Save</Button>
                    ) : deleteDonorMode ? null : (
                        <>
                            <Button variant="outline-success" onClick={handleApprove}>✅ Approve</Button>
                            <Button variant="outline-danger" onClick={handleReject}>❌ Reject</Button>
                        </>
                    )}
                </Modal.Footer>
            </Modal>
            {/* Blood Requests Tab */}
            {activeTab === 'requests' && (
                <Card className="shadow">
                    <Card.Header className="bg-danger text-white">
                        <h4 className="mb-0">📋 Blood Requests Management</h4>
                    </Card.Header>
                    <Card.Body>
                        <div className="table-responsive">
                            <table className="table table-striped table-bordered table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>👤 Patient Name</th>
                                        <th>🩸 Blood Type</th>
                                        <th>📦 Units Needed</th>
                                        <th>⚡ Urgency</th>
                                        <th>🏥 Hospital</th>
                                        <th>📅 Request Date</th>
                                        <th>📞 Contact</th>
                                        <th>💼 Reason</th>
                                        <th>📊 Status</th>
                                        <th>📅 Approved Date</th>
                                        <th>📅 Fulfilled Date</th>
                                        <th>⚙️ Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bloodRequests.map(request => (
                                        <tr key={request.id}>
                                            <td><span className="badge bg-danger">{request.patientName}</span></td>
                                            <td><span className="badge bg-info">{request.bloodType}</span></td>
                                            <td><span className="badge bg-warning">{request.unitsNeeded} units</span></td>
                                            <td><span className={`badge ${request.urgency === 'Critical' ? 'bg-danger' : request.urgency === 'High' ? 'bg-warning' : 'bg-secondary'}`}>{request.urgency}</span></td>
                                            <td>{request.hospital}</td>
                                            <td>{request.requestDate ? new Date(request.requestDate).toISOString().slice(0, 10) : '-'}</td>
                                            <td>{request.contactNumber}</td>
                                            <td>{request.reason}</td>
                                            <td><span className={`badge ${request.status === 'Pending' ? 'bg-warning' : request.status === 'Approved' ? 'bg-info' : request.status === 'Rejected' ? 'bg-danger' : 'bg-success'}`}>{request.status}</span></td>
                                            <td>{request.approvedDate ? new Date(request.approvedDate).toISOString().slice(0, 10) : '-'}</td>
                                                                                        <td>{request.fulfilledDate
                                                                                              ? (request.fulfilledDate.split('T')[0] || new Date(request.fulfilledDate).toISOString().slice(0, 10))
                                                                                              : '-'}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    <Button variant="outline-warning" size="sm" style={{ minWidth: 70 }} onClick={() => handleEditRequest(request)}>
                                                        ✏️ Edit
                                                    </Button>
                                                    <Button variant="outline-danger" size="sm" style={{ minWidth: 70 }} onClick={() => handleDeleteRequest(request)}>
                                                        🗑️ Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card.Body>
                </Card>
            )}

            {/* Blood Request Modal */}
            <Modal show={showRequestModal} onHide={closeRequestModal} size="md">
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>📋 Blood Request Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRequest && (
                        <div>
                            <p><strong>Patient Name:</strong> {selectedRequest.patientName}</p>
                            <p><strong>Blood Type:</strong> {selectedRequest.bloodType}</p>
                            <p><strong>Units Needed:</strong> {selectedRequest.unitsNeeded}</p>
                            <p><strong>Urgency:</strong> {selectedRequest.urgency}</p>
                            <p><strong>Hospital:</strong> {selectedRequest.hospital}</p>
                            <p><strong>Request Date:</strong> {selectedRequest.requestDate}</p>
                            <p><strong>Contact Number:</strong> {selectedRequest.contactNumber}</p>
                            <p><strong>Reason:</strong> {selectedRequest.reason}</p>
                            {editRequestMode ? (
                                <>
                                    <div className="mb-2">
                                        <label><strong>Status:</strong></label>
                                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                            <Button variant={editRequestStatus === 'Pending' ? 'warning' : 'outline-warning'} size="sm" onClick={() => setEditRequestStatus('Pending')}>
                                                ⏳ Pending
                                            </Button>
                                            <Button variant={editRequestStatus === 'Approved' ? 'success' : 'outline-success'} size="sm" onClick={() => setEditRequestStatus('Approved')}>
                                                ✅ Approved
                                            </Button>
                                            <Button variant={editRequestStatus === 'Rejected' ? 'danger' : 'outline-danger'} size="sm" onClick={() => setEditRequestStatus('Rejected')}>
                                                ❌ Rejected
                                            </Button>
                                            <Button variant={editRequestStatus === 'Fulfilled' ? 'info' : 'outline-info'} size="sm" onClick={() => setEditRequestStatus('Fulfilled')}>
                                                📦 Fulfilled
                                            </Button>
                                        </div>
                                    </div>
                                    {editRequestStatus === 'Approved' && (
                                        <div className="mb-2">
                                            <label><strong>Approved Date:</strong></label>
                                            <input type="date" className="form-control" value={editApprovedDate} onChange={e => setEditApprovedDate(e.target.value)} required={editRequestStatus === 'Approved'} />
                                        </div>
                                    )}
                                    {editRequestStatus === 'Fulfilled' && (
                                        <div className="mb-2">
                                            <label><strong>Fulfilled Date:</strong></label>
                                            <input type="date" className="form-control" value={editFulfilledDate} onChange={e => setEditFulfilledDate(e.target.value)} required={editRequestStatus === 'Fulfilled'} />
                                        </div>
                                    )}
                                </>
                            ) : deleteRequestMode ? (
                                <div className="text-center">
                                    <Button variant="danger" size="lg" onClick={async () => {
                                        if (selectedRequest) {
                                            try {
                                                await axios.delete(`http://localhost:5001/api/blood_requests/${selectedRequest.id}`);
                                                await fetchBloodRequests();
                                            } catch (err) {
                                                console.error('Error deleting blood request:', err);
                                            }
                                            setShowRequestModal(false);
                                            setDeleteRequestMode(false);
                                        }
                                    }}>🗑️ Delete</Button>
                                </div>
                            ) : (
                                <p><strong>Status:</strong> {selectedRequest.status}</p>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {editRequestMode ? (
                        <Button variant="outline-primary" onClick={handleSaveRequestEdit}>💾 Save</Button>
                    ) : deleteRequestMode ? null : (
                        <>
                            <Button variant="outline-success" onClick={handleApproveRequest}>✅ Approve</Button>
                            <Button variant="outline-danger" onClick={handleRejectRequest}>❌ Reject</Button>
                        </>
                    )}
                </Modal.Footer>
            </Modal>
        </Container>
    </div>
    )
}
export default StaffDashboard;
