import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';


const BringBloodRequest = ({
  requests,
  onEdit,
  onDelete,
  onConfirmDelete,
  showModal,
  selectedRequest,
  editMode,
  deleteMode,
  editRequestStatus,
  editApprovedDate,
  editFulfilledDate,
  setEditRequestStatus,
  setEditApprovedDate,
  setEditFulfilledDate,
  closeModal,
  handleSave
}) => {

  return (
    <Card className="shadow">
      <Card.Header className="bg-danger text-white">
        <h4 className="mb-0">🚚 Bring Blood Requests Management</h4>
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
                <th>Hospital</th>
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
              {requests && requests.length > 0 ? (
                requests.map(request => (
                  <tr key={request.id}>
                    <td><span className="badge bg-danger">{request.patientName}</span></td>
                    <td><span className="badge bg-info">{request.bloodType}</span></td>
                    <td><span className="badge bg-warning">{request.unitsNeeded} units</span></td>
                    <td><span className={`badge ${request.urgency === 'Critical' ? 'bg-danger' : request.urgency === 'High' ? 'bg-warning' : 'bg-secondary'}`}>{request.urgency}</span></td>
                    <td>{request.hospital}</td>
                    <td>{request.requestDate ? request.requestDate.split('T')[0] : (request.requestDateTime ? request.requestDateTime.split('T')[0] : '-')}</td>
                    <td>{request.contactNumber}</td>
                    <td>{request.reason}</td>
                    <td><span className={`badge ${request.status === 'Pending' ? 'bg-warning' : request.status === 'Approved' ? 'bg-info' : request.status === 'Rejected' ? 'bg-danger' : 'bg-success'}`}>{request.status}</span></td>
                    <td>{request.approvedDate ? request.approvedDate.split('T')[0] : '-'}</td>
                    <td>{request.fulfilledDate
                      ? (request.fulfilledDate.split('T')[0] || new Date(request.fulfilledDate).toISOString().slice(0, 10))
                      : '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Button variant="outline-warning" size="sm" style={{ minWidth: 70 }} onClick={() => onEdit && onEdit(request)}>
                          ✏️ Edit
                        </Button>
                        <Button variant="outline-danger" size="sm" style={{ minWidth: 70 }} onClick={() => onDelete && onDelete(request)}>
                          🗑️ Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="text-center">No bring blood requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card.Body>

      {/* Modal for editing bring blood request */}
      <Modal show={showModal} onHide={closeModal} size="md">
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>🚚 Bring Blood Request Details</Modal.Title>
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
              {editMode ? (
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
              ) : deleteMode ? (
                <div className="text-center">
                  <Button variant="danger" size="lg" onClick={() => onConfirmDelete && onConfirmDelete(selectedRequest)}>🗑️ Delete</Button>
                </div>
              ) : (
                <p><strong>Status:</strong> {selectedRequest.status}</p>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {editMode ? (
            <Button variant="outline-primary" onClick={handleSave}>💾 Save</Button>
          ) : null}
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default BringBloodRequest;
