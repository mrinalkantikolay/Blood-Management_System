import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Nav, InputGroup } from 'react-bootstrap';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StaffAuth = () => {
  // Auto-redirect if already logged in as staff
  React.useEffect(() => {
    const token = localStorage.getItem('staffToken');
    if (token && token.length > 20) { // crude check for real JWT
      window.location.href = '/staff-dashboard';
    }
  }, []);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('email-lookup');
  const [emailLookupData, setEmailLookupData] = useState({ email: '' });
  const [staffInfo, setStaffInfo] = useState(null);
  const [registrationData, setRegistrationData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Email lookup to check if staff is authorized
  const handleEmailLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
  const response = await axios.post('http://localhost:5001/api/staff/check-email', {
        email: emailLookupData.email
      });
      setStaffInfo(response.data);
      setSuccess(response.data.message);
      // If the backend returns found and no username/password, go to register
      if (response.data && (!response.data.username && !response.data.password)) {
        setActiveTab('register');
      } else {
        // If username/password exist, go to login
        setActiveTab('login');
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Email not found. Please contact admin to get authorized.');
      } else if (err.response?.status === 409) {
        // Do not show any error, just switch to login tab
        setError('');
        setActiveTab('login');
      } else {
        setError('Failed to verify email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Staff registration after email verification
  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (registrationData.password !== registrationData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
  const response = await axios.post('http://localhost:5001/api/staff/self-register', {
        email: staffInfo.email,
        username: registrationData.username,
        password: registrationData.password,
        phone: registrationData.phone
      });

      setSuccess('Registration successful! You can now login.');
      setActiveTab('login');
      // Clear registration form
      setRegistrationData({
        username: '',
        password: '',
        confirmPassword: '',
        phone: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo Staff login (bypasses backend)
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (loginData.username && loginData.password) {
  const response = await fetch('http://localhost:5001/api/staff/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: loginData.username,
            password: loginData.password
          })
        });
        const data = await response.json();
        if (response.ok && data.token) {
          localStorage.setItem('staffToken', data.token);
          localStorage.setItem('userRole', 'staff');
          // Force-set a minimal staff profile for dashboard redirect logic
          const staffProfile = {
            username: loginData.username,
            name: loginData.username,
            hospital: 'hospital',
            role: 'Staff Member'
          };
          localStorage.setItem('staffProfile', JSON.stringify(staffProfile));
          // Debug: log all values before redirect
          console.log('After login, localStorage:', {
            staffToken: localStorage.getItem('staffToken'),
            userRole: localStorage.getItem('userRole'),
            staffProfile: localStorage.getItem('staffProfile')
          });
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => {
            window.location.href = '/staff-dashboard';
          }, 500);
        } else {
          setError(data.error || 'Login failed');
        }
      } else {
        setError('Please enter username and password');
      }
    } catch (err) {
      setError('Login error');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmailLookupData({ email: e.target.value });
  };

  const handleRegistrationChange = (e) => {
    setRegistrationData({
      ...registrationData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container className="py-5">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="display-4 text-danger">
          🩸 Staff
        </h1>
      </div>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Header className="bg-danger text-white">
              <Nav variant="tabs" activeKey={activeTab} className="border-0">
                <Nav.Item>
                  <Nav.Link 
                    eventKey="email-lookup" 
                    onClick={() => setActiveTab('email-lookup')}
                    disabled={activeTab === 'register' && staffInfo}
                    className={activeTab === 'email-lookup' ? 'bg-white text-danger fw-bold' : 'text-white'}
                    style={{ border: 'none' }}
                  >
                    📧 Email Verification
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    eventKey="register" 
                    onClick={() => setActiveTab('register')}
                    disabled={!staffInfo}
                    className={activeTab === 'register' ? 'bg-white text-danger fw-bold' : 'text-white'}
                    style={{ border: 'none' }}
                  >
                    📝 Complete Registration
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    eventKey="login" 
                    onClick={() => setActiveTab('login')}
                    className={activeTab === 'login' ? 'bg-white text-danger fw-bold' : 'text-white'}
                    style={{ border: 'none' }}
                  >
                    🔐 Staff Login
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>

            <Card.Body>
              {/* Alert Messages */}
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              {/* Email Lookup Tab */}
              {activeTab === 'email-lookup' && (
                <div>
                  <h5 className="mb-3 text-danger">🔍 Verify Your Email</h5>
                  <p className="text-muted mb-4">
                    Enter your email address to register or login as staff. If your email is authorized, you can complete registration or proceed to login.
                  </p>
                  <Form onSubmit={handleEmailLookup}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">📧 Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        value={emailLookupData.email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email address"
                        required
                        className="border-2"
                      />
                    </Form.Group>
                    <Button 
                      variant="danger" 
                      type="submit" 
                      disabled={loading}
                      className="w-100"
                    >
                      {loading ? 'Checking...' : '🔍 Check Email'}
                    </Button>
                  </Form>
                </div>
              )}

              {/* Registration Tab */}
              {activeTab === 'register' && staffInfo && (
                <div>
                  <h5 className="mb-3 text-danger">👋 Welcome {staffInfo.first_name} {staffInfo.last_name}!</h5>
                  <p className="text-muted mb-4">
                    Complete your registration to access the staff portal.
                  </p>
                  <Form onSubmit={handleRegistration}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">👤 First Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={staffInfo.first_name}
                            disabled
                            className="bg-light border-2"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">👤 Last Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={staffInfo.last_name}
                            disabled
                            className="bg-light border-2"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">📧 Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        value={staffInfo.email}
                        disabled
                        className="bg-light border-2"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">🔑 Username *</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={registrationData.username}
                        onChange={handleRegistrationChange}
                        placeholder="Choose a username"
                        required
                        className="border-2"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">📞 Phone Number *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={registrationData.phone}
                        onChange={handleRegistrationChange}
                        placeholder="Enter your phone number"
                        required
                        className="border-2"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">🔒 Password *</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showRegPassword ? "text" : "password"}
                          name="password"
                          value={registrationData.password}
                          onChange={handleRegistrationChange}
                          placeholder="Create a password"
                          required
                          className="border-2"
                        />
                        <InputGroup.Text style={{ cursor: 'pointer', background: 'transparent' }} onClick={() => setShowRegPassword((v) => !v)} aria-label={showRegPassword ? 'Hide password' : 'Show password'}>
                          {showRegPassword ? <EyeSlashFill /> : <EyeFill />}
                        </InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">🔒 Confirm Password *</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showRegConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={registrationData.confirmPassword}
                          onChange={handleRegistrationChange}
                          placeholder="Confirm your password"
                          required
                          className="border-2"
                        />
                        <InputGroup.Text style={{ cursor: 'pointer', background: 'transparent' }} onClick={() => setShowRegConfirmPassword((v) => !v)} aria-label={showRegConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}>
                          {showRegConfirmPassword ? <EyeSlashFill /> : <EyeFill />}
                        </InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                    <Button 
                      variant="danger" 
                      type="submit" 
                      disabled={loading}
                      className="w-100"
                    >
                      {loading ? 'Registering...' : '📋 Complete Registration'}
                    </Button>
                  </Form>
                </div>
              )}

              {/* Login Tab */}
              {activeTab === 'login' && (
                <div>
                  <h5 className="mb-3 text-danger">🔐 Staff Login</h5>
                  {/* Demo Mode alert removed */}
                  <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">🔑 Username or Email</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={loginData.username}
                        onChange={handleLoginChange}
                        placeholder="Enter your username"
                        required
                        className="border-2"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">🔒 Password</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showLoginPassword ? "text" : "password"}
                          name="password"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          placeholder="Enter your password"
                          required
                          className="border-2"
                        />
                        <InputGroup.Text style={{ cursor: 'pointer', background: 'transparent' }} onClick={() => setShowLoginPassword((v) => !v)} aria-label={showLoginPassword ? 'Hide password' : 'Show password'}>
                          {showLoginPassword ? <EyeSlashFill /> : <EyeFill />}
                        </InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                    <Button 
                      variant="danger" 
                      type="submit" 
                      disabled={loading}
                      className="w-100"
                    >
                                      {loading ? 'Logging in...' : '🔑 Login'}
                    </Button>
                  </Form>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StaffAuth;
