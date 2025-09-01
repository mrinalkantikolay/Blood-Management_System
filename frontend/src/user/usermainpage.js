import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { Droplet, Calendar2Check, ClockHistory } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import './usermainpage.css';

const UserMainPage = () => {
  const navigate = useNavigate();
  const [recentDonations, setRecentDonations] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [recentError, setRecentError] = useState(null);

  // Removed useEffect for fetching recent activity

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#fafafa',
      paddingTop: '2rem'
    }}>
      {/* Logout button directly below navbar */}
      <div className="d-flex justify-content-end" style={{padding: '16px 32px 0 32px'}}>
        <Button 
          variant="outline-danger" 
          onClick={handleLogout}
          className="rounded-pill px-4"
        >
          Logout
        </Button>
      </div>
      {/* Welcome section higher up */}
      <div className="w-100 d-flex flex-column align-items-center" style={{marginTop: 12, marginBottom: 24}}>
        <img 
          src="https://cdn.vectorstock.com/i/500p/91/76/desi-indian-lady-namaste-traditional-colorful-vector-44199176.jpg" 
          alt="Namaste Indian Lady" 
          style={{width: 64, height: 64, objectFit: 'contain', marginBottom: 4, borderRadius: '50%', background: 'none'}} 
        />
        <h2 className="fw-bold mb-0 text-center" style={{ color: '#d32f2f' }}>Welcome to Blood Management System</h2>
      </div>
      <Container className="py-4">
        <Row className="g-4">
          <Col md={6} lg={4}>
            <Card className="h-100 shadow-sm border-0 hover-card">
              <Card.Body className="d-flex flex-column">
                <div className="text-center mb-3">
                  <Droplet className="text-danger" size={40} />
                </div>
                <Card.Title className="text-center mb-3">Donate Blood</Card.Title>
                <Card.Text className="text-muted">
                  Register as a blood donor and help save lives. Find nearby hospitals and schedule your donation.
                </Card.Text>
                <Button 
                  variant="danger" 
                  className="mt-auto w-100 rounded-pill"
                  onClick={() => navigate('/donate-blood')}
                >
                  Donate Blood
                </Button>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={4}>
            <Card className="h-100 shadow-sm border-0 hover-card">
              <Card.Body className="d-flex flex-column">
                <div className="text-center mb-3">
                  <Calendar2Check className="text-danger" size={40} />
                </div>
                <Card.Title className="text-center mb-3">Request Blood</Card.Title>
                <Card.Text className="text-muted">
                  Need blood? Submit a request and we'll help you find matching donors in your area.
                </Card.Text>
                <Button 
                  variant="danger" 
                  className="mt-auto w-100 rounded-pill"
                  onClick={() => navigate('/request-blood')}
                >
                  Request Blood
                </Button>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={4}>
            <Card className="h-100 shadow-sm border-0 hover-card">
              <Card.Body className="d-flex flex-column">
                <div className="text-center mb-3">
                  <ClockHistory className="text-danger" size={40} />
                </div>
                <Card.Title className="text-center mb-3">View History</Card.Title>
                <Card.Text className="text-muted">
                  Track your donation history and blood requests. View status updates and manage your profile.
                </Card.Text>
                <Button 
                  variant="danger" 
                  className="mt-auto w-100 rounded-pill"
                  onClick={() => navigate('/user/history')}
                >
                  View History
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

  {/* Recent History Section removed as per user request */}
    </div>
  );
};

export default UserMainPage;
