import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';

function calculateTotalUnits(bloodInventory) {
	return Object.values(bloodInventory).reduce((total, units) => total + (parseInt(units) || 0), 0);
}

function getUnitsBadgeColor(totalUnits) {
	if (totalUnits > 40) return 'success';
	if (totalUnits > 20) return 'warning';
	return 'danger';
}


const HospitalManagement = ({ hospitals, onSaveBloodInventory, showBloodModal, setShowBloodModal }) => {
	const [selectedHospital, setSelectedHospital] = useState(null);
	const [bloodInventory, setBloodInventory] = useState({});

	const openBloodModal = (hospital) => {
		setSelectedHospital(hospital);
		setBloodInventory(hospital.bloodInventory || {});
		setShowBloodModal(true);
	};

	const closeBloodModal = () => {
		setShowBloodModal(false);
		setSelectedHospital(null);
		setBloodInventory({});
	};

	const updateBloodInventory = (bloodType, units) => {
		setBloodInventory(prev => ({ ...prev, [bloodType]: units }));
	};

	const removeBloodType = (bloodType) => {
		setBloodInventory(prev => {
			const updated = { ...prev };
			delete updated[bloodType];
			return updated;
		});
	};

	const saveBloodInventory = () => {
		if (selectedHospital && onSaveBloodInventory) {
			onSaveBloodInventory(selectedHospital.id, bloodInventory);
		}
		closeBloodModal();
	};

	return (
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
								<th>☎️ Phone</th>
								<th>📮 Pincode</th>
								<th>🩸 Total Units</th>
								<th>Blood Types</th>
								<th>Edit Blood</th>
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
			</Card.Body>
		</Card>
	);
};

export default HospitalManagement;
