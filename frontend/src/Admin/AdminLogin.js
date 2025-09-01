import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Connect to backend admin login endpoint
      console.log('Sending login request...');
  const response = await fetch('http://localhost:5001/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });
      console.log('Received response:', response);
      const data = await response.json();
      console.log('Parsed response JSON:', data);
      if (response.ok && data.token) {
        localStorage.setItem('adminToken', data.token);
        console.log('Login successful, token saved.');
        localStorage.setItem('userRole', 'admin');
        window.location.href = '/admin-dashboard';
      } else {
        setError(data.error || 'Invalid admin credentials');
        console.log('Login failed:', data.error);
      }
    } catch (err) {
      console.log('Error during login:', err);
      setError('Login failed. Please try again.');
      console.error('Admin login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="text-danger fw-bold">🔐 Admin Login</h2>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter admin username"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      required
                    />
                    <InputGroup.Text style={{ background: 'none', borderLeft: 0, cursor: 'pointer' }} onClick={() => setShowPassword((v) => !v)} tabIndex={-1}>
                      {showPassword ? <EyeSlashFill /> : <EyeFill />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>

                <Button
                  type="submit"
                  variant="danger"
                  size="lg"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? '🔄 Logging in...' : '🚀 Login'}
                </Button>
              </Form>

              {/* Demo credentials removed since backend is now connected */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLogin;
