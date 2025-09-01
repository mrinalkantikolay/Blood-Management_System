import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
    <Spinner animation="border" variant="danger" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);

export default LoadingSpinner;
