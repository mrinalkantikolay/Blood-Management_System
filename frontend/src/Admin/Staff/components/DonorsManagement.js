
import React from 'react';
import { Button, Card } from 'react-bootstrap';

const DonorsManagement = ({ donors, onApproveReject, onEdit, onDelete }) => (
	<Card className="shadow">
		<Card.Header className="bg-danger text-white">
			<h2 className="mb-0">🧑‍🦰 Donors Management</h2>
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
						{donors && donors.map(donor => (
							<tr key={donor.id}>
								<td><span className="badge bg-danger">{donor.name}</span></td>
								<td>{donor.email || 'N/A'}</td>
								<td>{donor.contact || donor.phone || 'N/A'}</td>
								<td><span className="badge bg-info">{donor.blood_group || donor.bloodType || donor.bloodGroup || 'N/A'}</span></td>
								<td>{donor.lastDonation ? donor.lastDonation.slice(0, 10) : ''}</td>
								<td><span className="badge bg-success">{donor.totalDonations}</span></td>
								<td>{donor.address}</td>
								<td>{donor.hospital || '-'}</td>
								<td><span className={`badge ${donor.status === 'Eligible' ? 'bg-success' : 'bg-warning'}`}>{donor.status}</span></td>
								<td><span className={`badge ${donor.requested ? 'bg-info' : 'bg-secondary'}`}>{donor.requested ? 'Yes' : 'No'}</span></td>
								<td><span className={`badge ${donor.requestStatus === 'Pending' ? 'bg-warning' : donor.requestStatus === 'Approved' ? 'bg-success' : donor.requestStatus === 'Rejected' ? 'bg-danger' : 'bg-secondary'}`}>{donor.requestStatus || '-'}</span></td>
								<td>
																		<div style={{ display: 'flex', gap: '6px' }}>
																			<Button variant="outline-warning" size="sm" style={{ minWidth: 70 }} onClick={() => onEdit && onEdit(donor)}>
																				✏️ Edit
																			</Button>
																			<Button variant="outline-danger" size="sm" style={{ minWidth: 70 }} onClick={() => onDelete && onDelete(donor)}>
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
);

export default DonorsManagement;
