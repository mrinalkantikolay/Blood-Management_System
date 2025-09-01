import React, { useState, useEffect } from 'react';
import { Container, Button, Alert, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import StaffManagement from './StaffManagement';
import HospitalManagement from './HospitalManagement';
import axios from 'axios';

const AdminDashboard = () => {
    const navigate = useNavigate();
    // State management
    const [activeTab, setActiveTab] = useState('staff');
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [showHospitalModal, setShowHospitalModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [staffList, setStaffList] = useState([]);
    const [hospitalList, setHospitalList] = useState([]);
    const [modalMode, setModalMode] = useState('add');
    const [selectedItem, setSelectedItem] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [staffForm, setStaffForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });
    const [hospitalForm, setHospitalForm] = useState({ name: '', address: '', latitude: '', longitude: '', pincode: '', phone: '' });

    useEffect(() => {
        if (activeTab === 'staff') {
            fetchStaff();
        } else {
            fetchHospitals();
        }
    }, [activeTab]);

    const fetchStaff = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/staff');
            setStaffList(response.data);
        } catch (error) {
            setAlert({ show: true, message: 'Failed to fetch staff data', type: 'danger' });
        }
    };
    const fetchHospitals = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/hospitals');
            // Map location to address for each hospital (ensure always present)
            const hospitals = response.data.map(hospital => ({
                ...hospital,
                address: hospital.location || hospital.address || ''
            }));
            setHospitalList(hospitals);
        } catch (error) {
            setAlert({ show: true, message: 'Failed to fetch hospital data', type: 'danger' });
        }
    };
    const handleStaffSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalMode === 'add') {
                await axios.post('http://localhost:5001/api/staff', staffForm);
                setAlert({ show: true, message: 'Staff invitation created successfully! They will receive an email to complete registration.', type: 'success' });
            } else {
                await axios.put(`http://localhost:5001/api/staff/${selectedItem.id}`, staffForm);
                setAlert({ show: true, message: 'Staff updated successfully!', type: 'success' });
            }
            setShowStaffModal(false);
            fetchStaff();
            setStaffForm({ firstName: '', lastName: '', email: '', phone: '' });
        } catch (error) {
            setAlert({ show: true, message: error.response?.data?.message || 'Failed to save staff', type: 'danger' });
        }
    };
    const handleCoordinateChange = async (field, value) => {
        setHospitalForm(prev => ({ ...prev, [field]: value, pincode: '' }));
        const lat = field === 'latitude' ? value : hospitalForm.latitude;
        const lng = field === 'longitude' ? value : hospitalForm.longitude;
        if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
            try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
                if (response.data && response.data.address) {
                    const pincode = response.data.address.postcode || '';
                    setHospitalForm(prev => ({ ...prev, pincode }));
                }
            } catch (error) {}
        }
    };
    const handleHospitalSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalMode === 'add') {
                await axios.post('http://localhost:5001/api/hospitals', hospitalForm);
                setAlert({ show: true, message: 'Hospital created successfully!', type: 'success' });
            } else {
                await axios.put(`http://localhost:5001/api/hospitals/${selectedItem.id}`, hospitalForm);
                setAlert({ show: true, message: 'Hospital updated successfully!', type: 'success' });
            }
            setShowHospitalModal(false);
            fetchHospitals();
            setHospitalForm({ name: '', address: '', latitude: '', longitude: '', pincode: '', phone: '' });
        } catch (error) {
            setAlert({ show: true, message: 'Failed to save hospital', type: 'danger' });
        }
    };
    const handleEdit = (item) => {
        setSelectedItem(item);
        setModalMode('edit');
        if (activeTab === 'staff') {
            setStaffForm({ firstName: item.firstName || '', lastName: item.lastName || '', email: item.email || '', phone: item.phone || '' });
            setShowStaffModal(true);
        } else {
            setHospitalForm({ name: item.name || '', address: item.address || '', latitude: item.latitude || '', longitude: item.longitude || '', pincode: item.pincode || '', phone: item.phone || '' });
            setShowHospitalModal(true);
        }
    };
    const handleDelete = (id) => {
        setSelectedItem({ id });
        setShowDeleteModal(true);
    };
    const confirmDelete = async () => {
        try {
            const endpoint = activeTab === 'staff' ? 'staff' : 'hospitals';
            await axios.delete(`http://localhost:5001/api/${endpoint}/${selectedItem.id}`);
            setAlert({ show: true, message: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} deleted successfully!`, type: 'success' });
            setShowDeleteModal(false);
            if (activeTab === 'staff') {
                fetchStaff();
            } else {
                fetchHospitals();
            }
        } catch (error) {
            setAlert({ show: true, message: `Failed to delete ${activeTab}`, type: 'danger' });
        }
    };
    const handleAdd = () => {
        setModalMode('add');
        setSelectedItem(null);
        if (activeTab === 'staff') {
            setStaffForm({ firstName: '', lastName: '', email: '', phone: '' });
            setShowStaffModal(true);
        } else {
            setHospitalForm({ name: '', address: '', latitude: '', longitude: '', pincode: '', phone: '' });
            setShowHospitalModal(true);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userToken');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('userRole');
        window.location.replace('/');
    };

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingTop: '2rem' }}>
            <Container>
                    <div className="d-flex justify-content-between align-items-center mb-5" style={{ position: 'relative' }}>
                        {!(showStaffModal || showHospitalModal || showDeleteModal) && (
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
                            <h1 className="display-4 fw-bold text-danger mb-3">🩸 Admin</h1>
                        </div>
                    </div>
                {alert.show && (
                    <Alert variant={alert.type} dismissible onClose={() => setAlert({ ...alert, show: false })} className="mb-4">{alert.message}</Alert>
                )}
                <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
                    <Nav.Item>
                        <Nav.Link eventKey="staff">
                            <Button variant="danger" className="border-0 bg-transparent text-dark fw-bold">👥 Staff Management</Button>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="hospitals">
                            <Button variant="danger" className="border-0 bg-transparent text-dark fw-bold">🏥 Hospital Management</Button>
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                {activeTab === 'staff' ? (
                    <StaffManagement
                        staffList={staffList}
                        showStaffModal={showStaffModal}
                        setShowStaffModal={setShowStaffModal}
                        modalMode={modalMode}
                        setModalMode={setModalMode}
                        selectedItem={selectedItem}
                        setSelectedItem={setSelectedItem}
                        staffForm={staffForm}
                        setStaffForm={setStaffForm}
                        handleStaffSubmit={handleStaffSubmit}
                        alert={alert}
                        setAlert={setAlert}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        showDeleteModal={showDeleteModal}
                        setShowDeleteModal={setShowDeleteModal}
                        confirmDelete={confirmDelete}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        handleAdd={handleAdd}
                    />
                ) : (
                    <HospitalManagement
                        hospitalList={hospitalList}
                        showHospitalModal={showHospitalModal}
                        setShowHospitalModal={setShowHospitalModal}
                        modalMode={modalMode}
                        setModalMode={setModalMode}
                        selectedItem={selectedItem}
                        setSelectedItem={setSelectedItem}
                        hospitalForm={hospitalForm}
                        setHospitalForm={setHospitalForm}
                        handleHospitalSubmit={handleHospitalSubmit}
                        alert={alert}
                        setAlert={setAlert}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        showDeleteModal={showDeleteModal}
                        setShowDeleteModal={setShowDeleteModal}
                        confirmDelete={confirmDelete}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        handleAdd={handleAdd}
                        handleCoordinateChange={handleCoordinateChange}
                    />
                )}
            </Container>
        </div>
    );
}

export default AdminDashboard;
