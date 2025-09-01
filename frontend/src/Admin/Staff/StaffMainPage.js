import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Badge, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const StaffMainPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('hospital');
    const [staffProfile, setStaffProfile] = useState(null);
    const [showBloodModal, setShowBloodModal] = useState(false);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [bloodInventory, setBloodInventory] = useState({});
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    // Check authentication
    useEffect(() => {
        const staffToken = localStorage.getItem('staffToken');
        const userRole = localStorage.getItem('userRole');
        const profile = JSON.parse(localStorage.getItem('staffProfile') || 'null');
        
        if (!staffToken || userRole !== 'staff' || !profile) {
            navigate('/staff-auth');
        } else {
            setStaffProfile(profile);
        }
    }, [navigate]);

    // Hospital data with blood inventory
    const [hospitals, setHospitals] = useState([
        { 
            id: 1, 
            name: 'City General Hospital', 
            address: 'Downtown District', 
            phone: '+91-11-2345-6789', 
            pincode: '110001',
            bloodInventory: { 'A+': 25, 'B+': 30, 'O+': 45, 'AB+': 12 }
        },
        { 
            id: 2, 
            name: 'Metro Medical Center', 
            address: 'Central Area', 
            phone: '+91-11-2876-5432', 
            pincode: '110005',
            bloodInventory: { 'A+': 20, 'O+': 35, 'B-': 15, 'O-': 19 }
        },
        { 
            id: 3, 
            name: 'Regional Health Clinic', 
            address: 'North Zone', 
            phone: '+91-11-2456-7890', 
            pincode: '110009',
            bloodInventory: { 'B+': 12, 'AB+': 8, 'A-': 12 }
        },
        { 
            id: 4, 
            name: 'Emergency Care Hospital', 
            address: 'South District', 
            phone: '+91-11-2654-3210', 
            pincode: '110012',
            bloodInventory: { 'A+': 40, 'B+': 35, 'O+': 50, 'AB+': 20, 'A-': 25, 'B-': 30, 'O-': 35, 'AB-': 21 }
        },
        { 
            id: 5, 
            name: 'Community Health Center', 
            address: 'East Area', 
            phone: '+91-11-2789-4561', 
            pincode: '110015',
            bloodInventory: { 'O+': 30, 'O-': 18, 'A+': 19 }
        }
    ]);

    // Donors data
    const [donors, setDonors] = useState([
        { 
            id: 1, 
            name: 'John Doe', 
            email: 'john.doe@email.com', 
            phone: '+91-98765-43210', 
            bloodType: 'A+', 
            lastDonation: '2024-01-15',
            totalDonations: 8,
            status: 'Eligible',
            address: 'Downtown Area'
        },
        { 
            id: 2, 
            name: 'Jane Smith', 
            email: 'jane.smith@email.com', 
            phone: '+91-98765-43211', 
            bloodType: 'B+', 
            lastDonation: '2024-02-20',
            totalDonations: 12,
            status: 'Eligible',
            address: 'Central District'
        },
        { 
            id: 3, 
            name: 'Mike Johnson', 
            email: 'mike.j@email.com', 
            phone: '+91-98765-43212', 
            bloodType: 'O+', 
            lastDonation: '2024-03-01',
            totalDonations: 5,
            status: 'Pending',
            address: 'North Zone'
        },
        { 
            id: 4, 
            name: 'Sarah Wilson', 
            email: 'sarah.w@email.com', 
            phone: '+91-98765-43213', 
            bloodType: 'AB+', 
            lastDonation: '2024-01-30',
            totalDonations: 15,
            status: 'Eligible',
            address: 'South Area'
        },
        { 
            id: 5, 
            name: 'David Brown', 
            email: 'david.b@email.com', 
            phone: '+91-98765-43214', 
            bloodType: 'A-', 
            lastDonation: '2024-02-10',
            totalDonations: 6,
            status: 'Eligible',
            address: 'East District'
        }
    ]);

    // Blood requests data
    const [bloodRequests, setBloodRequests] = useState([
        {
            id: 1,
            patientName: 'Robert Kumar',
            bloodType: 'O+',
            unitsNeeded: 3,
            urgency: 'Critical',
            hospital: 'City General Hospital',
            requestDate: '2024-03-05',
            contactNumber: '+91-98765-12345',
            status: 'Pending',
            reason: 'Surgery'
        },
        {
            id: 2,
            patientName: 'Maria Garcia',
            bloodType: 'A+',
            unitsNeeded: 2,
            urgency: 'High',
            hospital: 'Metro Medical Center',
            requestDate: '2024-03-04',
            contactNumber: '+91-98765-12346',
            status: 'Approved',
            reason: 'Accident'
        },
        {
            id: 3,
            patientName: 'Ahmed Ali',
            bloodType: 'B-',
            unitsNeeded: 1,
            urgency: 'Medium',
            hospital: 'Regional Health Clinic',
            requestDate: '2024-03-03',
            contactNumber: '+91-98765-12347',
            status: 'Fulfilled',
            reason: 'Treatment'
        },
        {
            id: 4,
            patientName: 'Lisa Chen',
            bloodType: 'AB-',
            unitsNeeded: 4,
            urgency: 'Critical',
            hospital: 'Emergency Care Hospital',
            requestDate: '2024-03-05',
            contactNumber: '+91-98765-12348',
            status: 'Pending',
            reason: 'Emergency Surgery'
        },
        {
            id: 5,
            patientName: 'Tom Wilson',
            bloodType: 'O-',
            unitsNeeded: 2,
            urgency: 'High',
            hospital: 'Community Health Center',
            requestDate: '2024-03-02',
            contactNumber: '+91-98765-12349',
            status: 'Approved',
            reason: 'Chemotherapy'
        }
    ]);

    // Helper functions
    const calculateTotalUnits = (bloodInventory) => {
        return Object.values(bloodInventory).reduce((total, units) => total + units, 0);
    };

    const getUnitsBadgeColor = (total) => {
        if (total > 150) return 'success';
        if (total > 75) return 'warning';
        return 'danger';
    };

    const showAlert = (message, type) => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
    };

    const openBloodModal = (hospital) => {
        setSelectedHospital(hospital);
        setBloodInventory({ ...hospital.bloodInventory });
        setShowBloodModal(true);
    };

    const closeBloodModal = () => {
        setShowBloodModal(false);
        setSelectedHospital(null);
        setBloodInventory({});
    };

    const updateBloodInventory = (bloodType, units) => {
        setBloodInventory(prev => ({
            ...prev,
            [bloodType]: parseInt(units) || 0
        }));
    };

    const removeBloodType = (bloodType) => {
        setBloodInventory(prev => {
            const newInventory = { ...prev };
            delete newInventory[bloodType];
            return newInventory;
        });
    };

    const saveBloodInventory = () => {
        setHospitals(prev => prev.map(hospital => 
            hospital.id === selectedHospital.id 
                ? { ...hospital, bloodInventory: { ...bloodInventory } }
                : hospital
        ));
        showAlert(`Blood inventory updated for ${selectedHospital.name}`, 'success');
        closeBloodModal();
    };

    const handleLogout = () => {
        localStorage.removeItem('staffToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('staffProfile');
        navigate('/staff-auth');
    };

    const goToBloodDashboard = () => {
        navigate('/staff-dashboard');
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem' }}>
            <Container>
                {/* Header */}
                <div className="text-center mb-4">
                    <h1 className="display-4 text-danger">🩸 Staff Portal</h1>
                    <p className="lead text-muted">Staff management system for hospital and user operations</p>
                    {staffProfile && (
                        <div className="mt-3">
                            <span className="badge bg-danger me-2 fs-6">👤 {staffProfile.name}</span>
                            <span className="badge bg-danger me-2 fs-6">🏥 {staffProfile.hospital}</span>
                            <span className="badge bg-danger fs-6">{staffProfile.role}</span>
                        </div>
                    )}
                </div>

                {/* Logout Button */}
                <Button 
                    variant="outline-danger" 
                    onClick={handleLogout} 
                    className="position-fixed" 
                    style={{top: '1rem', right: '1rem', zIndex: 1000}}
                >
                    🚪 Logout
                </Button>

                {/* Blood Dashboard Button */}
                <div className="text-center mb-4">
                    <Button 
                        variant="danger" 
                        size="lg"
                        onClick={goToBloodDashboard}
                        className="me-3"
                    >
                        🩸 Blood Management Dashboard
                    </Button>
                </div>

                {/* Navigation Tabs */}
                <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
                    <Nav.Item>
                        <Nav.Link eventKey="hospital">
                            <Button variant="danger" className="border-0 bg-transparent text-dark fw-bold">
                                🏥 Hospital Management
                            </Button>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="donors">
                            <Button variant="danger" className="border-0 bg-transparent text-dark fw-bold">
                                🩸 Donors Management
                            </Button>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="requests">
                            <Button variant="danger" className="border-0 bg-transparent text-dark fw-bold">
                                📋 Blood Requests
                            </Button>
                        </Nav.Link>
                    </Nav.Item>
                </Nav>

                {/* Hospital Management Tab */}
                {activeTab === 'hospital' && (
                    <Card className="shadow">
                        <Card.Header className="bg-danger text-white">
                            <h4 className="mb-0">🏥 Hospital Management</h4>
                        </Card.Header>
                        <Card.Body>
                            <div className="table-responsive">
                                <table className="table table-striped table-bordered table-hover">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>🏥 Name</th>
                                            <th>📍 Address</th>
                                            <th>📞 Phone</th>
                                            <th>📮 Pincode</th>
                                            <th>🩸 Blood Units</th>
                                            <th>🅰️ Blood Types</th>
                                            <th>⚙️ Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hospitals.map(hospital => {
                                            const totalUnits = calculateTotalUnits(hospital.bloodInventory);
                                            return (
                                                <tr key={hospital.id}>
                                                    <td><span className="badge bg-danger">{hospital.name}</span></td>
                                                    <td>{hospital.address}</td>
                                                    <td>{hospital.phone}</td>
                                                    <td>{hospital.pincode}</td>
                                                    <td><span className={`badge bg-${getUnitsBadgeColor(totalUnits)}`}>{totalUnits} units</span></td>
                                                    <td>{Object.keys(hospital.bloodInventory).map(bloodType => (<span key={bloodType} className="badge bg-danger me-1">{bloodType}</span>))}</td>
                                                    <td><Button variant="outline-warning" size="sm" onClick={() => openBloodModal(hospital)}>✏️ Edit Blood</Button></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                )}

                {/* Donors Management Tab */}
                {activeTab === 'donors' && (
                    <Card className="shadow">
                        <Card.Header className="bg-danger text-white">
                            <h4 className="mb-0">🩸 Donors Management</h4>
                        </Card.Header>
                        <Card.Body>
                            <div className="table-responsive">
                                <table className="table table-striped table-bordered table-hover">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>👤 Name</th>
                                            <th>📧 Email</th>
                                            <th>📞 Phone</th>
                                            <th>🩸 Blood Type</th>
                                            <th>📅 Last Donation</th>
                                            <th>🔢 Total Donations</th>
                                            <th>📍 Address</th>
                                            <th>🏥 Hospital</th>
                                            <th>📊 Status</th>
                                            <th>📝 Requested</th>
                                            <th>⏳ Request Status</th>
                                            <th>⚙️ Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {donors.map(donor => (
                                            <tr key={donor.id}>
                                                <td><span className="badge bg-danger">{donor.name}</span></td>
                                                <td>{donor.email}</td>
                                                <td>{donor.phone}</td>
                                                <td><span className="badge bg-info">{donor.bloodType}</span></td>
                                                <td>{donor.lastDonation}</td>
                                                <td><span className="badge bg-success">{donor.totalDonations}</span></td>
                                                <td>{donor.address}</td>
                                                <td>{donor.hospital || '-'}</td>
                                                <td><span className={`badge ${donor.status === 'Eligible' ? 'bg-success' : 'bg-warning'}`}>{donor.status}</span></td>
                                                <td><span className={`badge ${donor.requested ? 'bg-info' : 'bg-secondary'}`}>{donor.requested ? 'Yes' : 'No'}</span></td>
                                                <td><span className={`badge ${donor.requestStatus === 'Pending' ? 'bg-warning' : donor.requestStatus === 'Approved' ? 'bg-success' : donor.requestStatus === 'Rejected' ? 'bg-danger' : 'bg-secondary'}`}>{donor.requestStatus || '-'}</span></td>
                                                <td>
                                                    {donor.requested && donor.requestStatus === 'Pending' && (
                                                        <Button variant="outline-success" size="sm" onClick={() => openDonorRequestModal(donor)}>✅ Approve/Reject</Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                )}

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
                                                <td>{request.requestDate}</td>
                                                <td>{request.contactNumber}</td>
                                                <td>{request.reason}</td>
                                                <td><span className={`badge ${request.status === 'Pending' ? 'bg-warning' : request.status === 'Approved' ? 'bg-info' : 'bg-success'}`}>{request.status}</span></td>
                                                <td>
                                                    <Button variant="outline-warning" size="sm" onClick={() => showAlert(`Editing request for ${request.patientName}`, 'warning')}>✏️ Edit</Button>
                                                    <Button variant="outline-success" size="sm" onClick={() => showAlert(`Approved blood request for ${request.patientName}`, 'success')} disabled={request.status === 'Fulfilled'}>✅ Approve</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                )}

                {/* Alert */}
                {alert.show && (
                    <Alert 
                        variant={alert.type} 
                        onClose={() => setAlert({ show: false, message: '', type: '' })} 
                        dismissible
                        className="mt-3"
                    >
                        {alert.message}
                    </Alert>
                )}

                {/* Blood Inventory Modal */}
                <Modal show={showBloodModal} onHide={closeBloodModal} size="lg">
                    <Modal.Header closeButton className="bg-danger text-white">
                        <Modal.Title>
                            🩸 Edit Blood Inventory - {selectedHospital?.name}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mb-3">
                            <h6>Current Blood Inventory:</h6>
                            <div className="row">
                                {Object.entries(bloodInventory).map(([bloodType, units]) => (
                                    <div key={bloodType} className="col-md-6 mb-2">
                                        <div className="input-group">
                                            <span className="input-group-text bg-danger text-white">{bloodType}</span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={units}
                                                onChange={(e) => updateBloodInventory(bloodType, e.target.value)}
                                                min="0"
                                            />
                                            <button
                                                className="btn btn-outline-danger"
                                                type="button"
                                                onClick={() => removeBloodType(bloodType)}
                                            >
                                                ❌
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="mb-3">
                            <h6>Add New Blood Type:</h6>
                            <div className="row">
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bloodType => (
                                    !bloodInventory.hasOwnProperty(bloodType) && (
                                        <div key={bloodType} className="col-md-3 mb-2">
                                            <button
                                                className="btn btn-outline-danger w-100"
                                                onClick={() => updateBloodInventory(bloodType, 0)}
                                            >
                                                + {bloodType}
                                            </button>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>

                        <div className="alert alert-info">
                            <strong>Total Units: {Object.values(bloodInventory).reduce((total, units) => total + (parseInt(units) || 0), 0)}</strong>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={saveBloodInventory}>
                            💾 Save Changes
                        </Button>
                        <Button variant="secondary" onClick={closeBloodModal}>
                            ❌ Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
};

export default StaffMainPage;
