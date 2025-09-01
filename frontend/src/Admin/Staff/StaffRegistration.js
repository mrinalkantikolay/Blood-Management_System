import React, { useState, useEffect } from 'react';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const StaffRegistration = ({ onRegistrationComplete }) => {
  const [email, setEmail] = useState('');
  const [invitation, setInvitation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    emergencyContact: '',
    bloodType: '',
    password: '',
    confirmPassword: ''
  });
  const [step, setStep] = useState(1); // 1: Email verification, 2: Complete registration
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const checkInvitation = () => {
    const invitations = JSON.parse(localStorage.getItem('staffInvitations') || '[]');
    const foundInvitation = invitations.find(inv => inv.email.toLowerCase() === email.toLowerCase());
    
    if (foundInvitation) {
      setInvitation(foundInvitation);
      setStep(2);
      setError('');
    } else {
      setError('No invitation found for this email address. Please contact admin.');
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    checkInvitation();
  };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    if (!formData.name || !formData.phone || !formData.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Simulate registration process
    setTimeout(() => {
      // Create staff profile
      const staffProfile = {
        email: email,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        bloodType: formData.bloodType,
        role: invitation.role,
        hospital: invitation.hospital,
        registrationDate: new Date().toISOString(),
        status: 'active'
      };

      // Store in localStorage (in real app, this would be API call)
      localStorage.setItem('staffProfile', JSON.stringify(staffProfile));
      localStorage.setItem('staffToken', 'staff-jwt-token');

      // Remove the invitation as it's now used
      const invitations = JSON.parse(localStorage.getItem('staffInvitations') || '[]');
      const updatedInvitations = invitations.filter(inv => inv.email !== email);
      localStorage.setItem('staffInvitations', JSON.stringify(updatedInvitations));

      setLoading(false);
      onRegistrationComplete && onRegistrationComplete(staffProfile);
    }, 2000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="text-danger fw-bold">
                  {step === 1 ? '📧 Staff Registration' : '👤 Complete Your Profile'}
                </h2>
                <p className="text-muted">
                  {step === 1 
                    ? 'Enter your email to verify invitation'
                    : 'Complete your registration to access staff dashboard'
                  }
                </p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              {step === 1 ? (
                // Email Verification Step
                <Form onSubmit={handleEmailSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address *</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your invited email address"
                      required
                    />
                    <Form.Text className="text-muted">
                      Use the email address admin provided for your invitation
                    </Form.Text>
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="danger"
                    size="lg"
                    className="w-100"
                  >
                    🔍 Verify Invitation
                  </Button>
                </Form>
              ) : (
                // Registration Form Step
                <>
                  <Alert variant="success" className="mb-4">
                    <strong>✅ Invitation Verified!</strong><br/>
                    <strong>Role:</strong> {invitation.role}<br/>
                    <strong>Hospital:</strong> {invitation.hospital}
                  </Alert>

                  <Form onSubmit={handleRegistrationSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Full Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number *</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter your address"
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Emergency Contact</Form.Label>
                          <Form.Control
                            type="text"
                            name="emergencyContact"
                            value={formData.emergencyContact}
                            onChange={handleChange}
                            placeholder="Emergency contact number"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Blood Type</Form.Label>
                          <Form.Select
                            name="bloodType"
                            value={formData.bloodType}
                            onChange={handleChange}
                          >
                            <option value="">Select Blood Type</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Password *</Form.Label>
                          <div className="d-flex align-items-center">
                            <Form.Control
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="Create password (min 6 chars)"
                              required
                            />
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="ms-2"
                              tabIndex={-1}
                              onClick={() => setShowPassword((v) => !v)}
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                              {showPassword ? <EyeSlashFill /> : <EyeFill />}
                            </Button>
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Confirm Password *</Form.Label>
                          <div className="d-flex align-items-center">
                            <Form.Control
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              placeholder="Confirm your password"
                              required
                            />
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="ms-2"
                              tabIndex={-1}
                              onClick={() => setShowConfirmPassword((v) => !v)}
                              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                            >
                              {showConfirmPassword ? <EyeSlashFill /> : <EyeFill />}
                            </Button>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="d-flex gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setStep(1)}
                      >
                        ← Back
                      </Button>
                      <Button
                        type="submit"
                        variant="danger"
                        className="flex-grow-1"
                        disabled={loading}
                      >
                        {loading ? '🔄 Registering...' : '✅ Complete Registration'}
                      </Button>
                    </div>
                  </Form>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StaffRegistration;
