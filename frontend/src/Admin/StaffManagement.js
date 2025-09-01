import React from 'react';
import { Card, Button, Table, Modal, Form, Alert } from 'react-bootstrap';
import { TelephoneFill, CircleFill } from 'react-bootstrap-icons';

const StaffManagement = ({
  staffList,
  showStaffModal,
  setShowStaffModal,
  modalMode,
  setModalMode,
  selectedItem,
  setSelectedItem,
  staffForm,
  setStaffForm,
  handleStaffSubmit,
  alert,
  setAlert,
  activeTab,
  setActiveTab,
  showDeleteModal,
  setShowDeleteModal,
  confirmDelete,
  handleEdit,
  handleDelete,
  handleAdd
}) => (
  <Card className="shadow">
    <Card.Header className="bg-danger text-white">
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">👥 Staff Management</h4>
        <Button variant="light" onClick={handleAdd}>
          ➕ Add Staff
        </Button>
      </div>
    </Card.Header>
    <Card.Body>
      {staffList.length === 0 ? (
        <div className="text-center py-5">
          <h5 className="text-muted">No staff members found</h5>
          <p className="text-muted">Click "Invite New Staff" to get started</p>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>👤 Name</th>
              <th>📧 Email</th>
              <th><TelephoneFill className="me-1" />Phone</th>
              <th><CircleFill className="me-1" />Status</th>
              <th>⚙️ Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff, index) => (
              <tr key={staff.id || index}>
                <td>{staff.firstName} {staff.lastName}</td>
                <td>{staff.email}</td>
                <td>{staff.phone || 'Not provided'}</td>
                <td>
                  {staff.isActive ? (
                    <span><CircleFill style={{marginRight: 6, color: '#198754'}}/>Active</span>
                  ) : (
                    <span><CircleFill style={{marginRight: 6, color: '#dc3545'}}/>Not Active</span>
                  )}
                </td>
                <td>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleEdit(staff)}
                    className="me-2"
                  >
                    ✏️ Edit
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    onClick={() => handleDelete(staff.id)}
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
    {/* Staff Modal */}
    <Modal show={showStaffModal} onHide={() => setShowStaffModal(false)}>
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>{modalMode === 'add' ? '➕ Add Staff' : '✏️ Edit Staff'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleStaffSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" value={staffForm.firstName} onChange={e => setStaffForm({ ...staffForm, firstName: e.target.value })} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" value={staffForm.lastName} onChange={e => setStaffForm({ ...staffForm, lastName: e.target.value })} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={staffForm.email} onChange={e => setStaffForm({ ...staffForm, email: e.target.value })} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="text" value={staffForm.phone} onChange={e => setStaffForm({ ...staffForm, phone: e.target.value })} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStaffModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" type="submit">
            {modalMode === 'add' ? '➕ Add Staff' : '✏️ Update Staff'}
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
          Are you sure you want to delete this staff member?
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

export default StaffManagement;
