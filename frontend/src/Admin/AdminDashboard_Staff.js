import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';

const AdminDashboard = () => {
    console.log('✅ AdminDashboard v4.0 - Staff Management System');
    const [activeTab, setActiveTab] = useState('staff');
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [showHospitalModal, setShowHospitalModal] = useState(false);
    const [staffData, setStaffData] = useState([]);
    const [hospitalData, setHospitalData] = useState([]);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [selectedItem, setSelectedItem] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    // Form states
    const [staffForm, setStaffForm] = useState({ 
        firstName: '', 
        lastName: '', 
        email: ''
    });
    const [hospitalForm, setHospitalForm] = useState({
        name: '',
        address: '',
        phone: '',
        pincode: '',
        latitude: '',
        longitude: ''
    });

    // Load data on component mount
    useEffect(() => {
        loadStaffData();
        loadHospitalData();
    }, []);

    const loadStaffData = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/staff');
            setStaffData(response.data);
        } catch (error) {
            console.error('Error loading staff:', error);
            showAlert('❌ Failed to load staff from database', 'danger');
            setStaffData([]);
        }
    };

    const loadHospitalData = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/hospitals');
            const hospitals = response.data.map(hospital => ({
                ...hospital,
                address: hospital.location,
                pincode: hospital.pincode || ''
            }));
            setHospitalData(hospitals);
        } catch (error) {
            console.error('Error loading hospitals:', error);
            showAlert('❌ Failed to load hospitals from database', 'danger');
            setHospitalData([]);
        }
    };

    const showAlert = (message, type) => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
    };

    const handleStaffSubmit = async (e) => {
        e.preventDefault();
        if (modalMode === 'add') {
            try {
                const response = await axios.post('http://localhost:5001/api/staff', {
                    first_name: staffForm.firstName,
                    last_name: staffForm.lastName,
                    email: staffForm.email
                });
                
                showAlert(`✅ Staff invitation created for ${staffForm.email} successfully!`, 'success');
                loadStaffData();
            } catch (error) {
                console.error('Error creating staff:', error);
                showAlert('❌ Failed to create staff invitation', 'danger');
            }
        } else {
            try {
                await axios.put(`http://localhost:5001/api/staff/${selectedItem.id}`, {
                    first_name: staffForm.firstName,
                    last_name: staffForm.lastName,
                    email: staffForm.email
                });
                
                showAlert('✅ Staff member updated successfully!', 'success');
                loadStaffData();
            } catch (error) {
                console.error('Error updating staff:', error);
                showAlert('❌ Failed to update staff member', 'danger');
            }
        }
        setShowStaffModal(false);
        setStaffForm({ firstName: '', lastName: '', email: '' });
    };

    const openModal = (type, mode, item = null) => {
        setModalMode(mode);
        setSelectedItem(item);
        
        if (type === 'staff') {
            if (mode === 'edit' && item) {
                setStaffForm({
                    firstName: item.first_name || '',
                    lastName: item.last_name || '',
                    email: item.email || ''
                });
            } else {
                setStaffForm({ firstName: '', lastName: '', email: '' });
            }
            setShowStaffModal(true);
        } else {
            // Hospital modal logic (existing code)
            setShowHospitalModal(true);
        }
    };

    const handleDelete = async (type, id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                if (type === 'staff') {
                    await axios.delete(`http://localhost:5001/api/staff/${id}`);
                    showAlert('✅ Staff member deleted successfully!', 'success');
                    loadStaffData();
                } else {
                    await axios.delete(`http://localhost:5001/api/hospitals/${id}`);
                    showAlert('✅ Hospital deleted successfully!', 'success');
                    loadHospitalData();
                }
            } catch (error) {
                console.error(`Error deleting ${type}:`, error);
                showAlert(`❌ Failed to delete ${type}`, 'danger');
            }
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <Container fluid className="py-4">
                {/* Alert */}
                {alert.show && (
                    <Row className="mb-3">
                        <Col>
                            <Alert variant={alert.type}>
                                {alert.message}
                            </Alert>
                        </Col>
                    </Row>
                )}

                {/* Header */}
                <Row className="mb-4">
                    <Col>
                        <h2 className="text-primary">🏥 Blood Donation Admin Dashboard</h2>
                    </Col>
                </Row>

                {/* Tab Navigation */}
                <Row className="mb-4">
                    <Col>
                        <div className="d-flex gap-2">
                            <Button
                                variant={activeTab === 'staff' ? 'primary' : 'outline-primary'}
                                onClick={() => setActiveTab('staff')}
                            >
                                👥 Staff Management
                            </Button>
                            <Button
                                variant={activeTab === 'hospitals' ? 'primary' : 'outline-primary'}
                                onClick={() => setActiveTab('hospitals')}
                            >
                                🏥 Hospital Management
                            </Button>
                        </div>
                    </Col>
                </Row>

                {/* Staff Management Tab */}
                {activeTab === 'staff' && (
                    <Row>
                        <Col>
                            <Card>
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">Staff Members</h5>
                                    <Button 
                                        variant="success" 
                                        onClick={() => openModal('staff', 'add')}
                                    >
                                        ➕ Create Staff Invitation
                                    </Button>
                                </Card.Header>
                                <Card.Body>
                                    <Table responsive striped hover>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Registration Status</th>
                                                <th>Created Date</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {staffData.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="text-center text-muted">
                                                        No staff members found. Create your first staff invitation!
                                                    </td>
                                                </tr>
                                            ) : (
                                                staffData.map(staff => (
                                                    <tr key={staff.id}>
                                                        <td>
                                                            {staff.first_name && staff.last_name ? (
                                                                `${staff.first_name} ${staff.last_name}`
                                                            ) : (
                                                                <span className="text-muted fst-italic">
                                                                    Name will be set during registration
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td>{staff.email}</td>
                                                        <td>
                                                            {staff.phone ? (
                                                                <span className="text-success">{staff.phone}</span>
                                                            ) : (
                                                                <span className="text-muted fst-italic">Not provided yet</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <Badge bg={staff.username && staff.password ? 'success' : 'warning'}>
                                                                {staff.username && staff.password ? '✅ Registered' : '⏳ Pending Registration'}
                                                            </Badge>
                                                        </td>
                                                        <td>{new Date(staff.created_at).toLocaleDateString()}</td>
                                                        <td>
                                                            <Button
                                                                variant="outline-primary"
                                                                size="sm"
                                                                className="me-2"
                                                                onClick={() => openModal('staff', 'edit', staff)}
                                                            >
                                                                ✏️
                                                            </Button>
                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                                onClick={() => handleDelete('staff', staff.id)}
                                                            >
                                                                🗑️
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* Hospital Management Tab - Simplified for now */}
                {activeTab === 'hospitals' && (
                    <Row>
                        <Col>
                            <Card>
                                <Card.Header>
                                    <h5 className="mb-0">Hospital Management</h5>
                                </Card.Header>
                                <Card.Body>
                                    {hospitalData.length === 0 ? (
                                        <div className="text-center py-5">
                                            <h5 className="text-muted">No hospitals found</h5>
                                            <p className="text-muted">Contact admin to add hospitals.</p>
                                        </div>
                                    ) : (
                                        <Table striped bordered hover responsive>
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Address</th>
                                                    <th>Phone</th>
                                                    <th>Pincode</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {hospitalData.map((hospital, idx) => (
                                                    <tr key={hospital.id || idx}>
                                                        <td>{hospital.name}</td>
                                                        <td>{hospital.address}</td>
                                                        <td>{hospital.phone || 'Not provided'}</td>
                                                        <td>{hospital.pincode || 'N/A'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* Staff Modal */}
                <Modal show={showStaffModal} onHide={() => setShowStaffModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {modalMode === 'add' ? 'Create Staff Invitation' : 'Edit Staff Member'}
                        </Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleStaffSubmit}>
                        <Modal.Body>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>First Name *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={staffForm.firstName}
                                            onChange={(e) => setStaffForm({...staffForm, firstName: e.target.value})}
                                            required
                                            placeholder="Enter first name"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Last Name *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={staffForm.lastName}
                                            onChange={(e) => setStaffForm({...staffForm, lastName: e.target.value})}
                                            required
                                            placeholder="Enter last name"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email Address *</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={staffForm.email}
                                            onChange={(e) => setStaffForm({...staffForm, email: e.target.value})}
                                            required
                                            placeholder="Email for staff invitation"
                                        />
                                        <Form.Text className="text-muted">
                                            Staff will use this email to complete their registration and login.
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                            {modalMode === 'add' && (
                                <Alert variant="info">
                                    <strong>📧 Invitation Process:</strong><br/>
                                    • Basic staff record will be created with name and email<br/>
                                    • Staff can register using this email in the Staff Portal<br/>
                                    • They will complete their profile with phone and password during registration
                                </Alert>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowStaffModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                {modalMode === 'add' ? '✅ Create Staff Invitation' : '✏️ Update Staff'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Container>
        </div>
    );
};

export default AdminDashboard;
