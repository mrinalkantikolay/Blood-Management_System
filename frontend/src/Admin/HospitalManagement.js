import React from 'react';
import { Card, Button, Table, Modal, Form, Alert } from 'react-bootstrap';

const HospitalManagement = ({
  hospitalList,
  showHospitalModal,
  setShowHospitalModal,
  modalMode,
  setModalMode,
  selectedItem,
  setSelectedItem,
  hospitalForm,
  setHospitalForm,
  handleHospitalSubmit,
  alert,
  setAlert,
  activeTab,
  setActiveTab,
  showDeleteModal,
  setShowDeleteModal,
  confirmDelete,
  handleEdit,
  handleDelete,
  handleAdd,
  handleCoordinateChange
}) => (
  <Card className="shadow">
    <Card.Header className="bg-danger text-white">
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">🏥 Hospital Management</h4>
        <Button variant="light" onClick={handleAdd}>
          ➕ Add Hospital
        </Button>
      </div>
    </Card.Header>
    <Card.Body>
      {hospitalList.length === 0 ? (
        <div className="text-center py-5">
          <h5 className="text-muted">No hospitals found</h5>
          <p className="text-muted">Click "Add Hospital" to get started</p>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>🏥 Name</th>
              <th>📍 Address</th>
              <th>📞 Phone</th>
              <th>🗺️ Pincode</th>
              <th>⚙️ Actions</th>
            </tr>
          </thead>
          <tbody>
            {hospitalList.map((hospital, index) => (
              <tr key={hospital.id || index}>
                <td>{hospital.name}</td>
                <td>{hospital.address}</td>
                <td>{hospital.phone || 'Not provided'}</td>
                <td>{hospital.pincode || 'N/A'}</td>
                <td>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleEdit(hospital)}
                    className="me-2"
                  >
                    ✏️ Edit
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    onClick={() => handleDelete(hospital.id)}
                  >
                    🗑️ Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card.Body>
    {/* Hospital Modal */}
    <Modal show={showHospitalModal} onHide={() => setShowHospitalModal(false)}>
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>{modalMode === 'add' ? '➕ Add Hospital' : '✏️ Edit Hospital'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleHospitalSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" value={hospitalForm.name} onChange={e => setHospitalForm({ ...hospitalForm, name: e.target.value })} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" value={hospitalForm.address} onChange={e => setHospitalForm({ ...hospitalForm, address: e.target.value })} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="text" value={hospitalForm.phone} onChange={e => setHospitalForm({ ...hospitalForm, phone: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Pincode</Form.Label>
            <Form.Control type="text" value={hospitalForm.pincode} onChange={e => setHospitalForm({ ...hospitalForm, pincode: e.target.value })} />
            <Form.Text className="text-muted">
              Pincode is filled automatically after you enter both latitude and longitude.
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Latitude</Form.Label>
            <Form.Control type="text" value={hospitalForm.latitude} onChange={e => handleCoordinateChange('latitude', e.target.value)} />
            <Form.Text className="text-muted">
              Enter the latitude coordinate (e.g., 22.5726 for Kolkata).
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Longitude</Form.Label>
            <Form.Control type="text" value={hospitalForm.longitude} onChange={e => handleCoordinateChange('longitude', e.target.value)} />
            <Form.Text className="text-muted">
              Enter the longitude coordinate (e.g., 88.3639 for Kolkata).
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowHospitalModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" type="submit">
            {modalMode === 'add' ? '➕ Add Hospital' : '✏️ Update Hospital'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
    {/* Delete Confirmation Modal */}
    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>⚠️ Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-center fs-5">
          Are you sure you want to delete this hospital?
        </p>
        <p className="text-center text-muted">
          This action cannot be undone.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={confirmDelete}>
          🗑️ Delete
        </Button>
      </Modal.Footer>
    </Modal>
  </Card>
);

export default HospitalManagement;
