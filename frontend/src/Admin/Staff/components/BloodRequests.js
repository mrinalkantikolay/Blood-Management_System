
import React from 'react';

const BloodRequests = ({ bloodRequests }) => (
  <div>
    <h2>🩸 Blood Requests</h2>
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Requester 🧑‍🦰</th>
          <th>Blood Group 🩸</th>
          <th>Reason 🤔</th>
          <th>Approve ✅</th>
          <th>Reject ❌</th>
        </tr>
      </thead>
      <tbody>
        {bloodRequests.map(request => (
          <tr key={request.id}>
            <td>{request.requester}</td>
            <td>{request.bloodGroup}</td>
            <td>{request.reason}</td>
            <td>
              <button className="btn btn-success" disabled>Approve</button>
            </td>
            <td>
              <button className="btn btn-danger" disabled>Reject</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default BloodRequests;


