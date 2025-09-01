
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Nav, InputGroup } from "react-bootstrap";
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
import './UserAuth.css';

const UserAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({
    firstName: '', lastName: '', email: '', username: '', password: '', confirmPassword: ''
  });

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      #user-auth-card {
        width: 380px;
        max-width: 90vw;
      }
      @media (min-width: 768px) {
        #user-auth-card {
          width: 600px;
          max-width: 98vw;
        }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: '#fafafa' }}>
      <Card id="user-auth-card" className="shadow-lg border-0 rounded-3">
        <Card.Body className="p-4">
          <h2 className="text-center mb-4" style={{ color: '#d32f2f' }}>
            {isLogin ? 'Welcome Back' : 'Join Us Today'}
          </h2>
          <Nav variant="tabs" defaultActiveKey="login" className="mb-4 justify-content-center">
            <Nav.Item>
              <Nav.Link 
                eventKey="login" 
                active={isLogin} 
                onClick={() => setIsLogin(true)}
                style={{ color: isLogin ? '#d32f2f' : '#6c757d' }}
              >
                Login
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="signup" 
                active={!isLogin} 
                onClick={() => setIsLogin(false)}
                style={{ color: !isLogin ? '#d32f2f' : '#6c757d' }}
              >
                Sign Up
              </Nav.Link>
            </Nav.Item>
          </Nav>
          {isLogin ? (
            <>
              <h4 className="mb-3 text-center">User Login</h4>
              <Form
                onSubmit={async e => {
                  e.preventDefault();
                  try {
                    const response = await fetch("http://localhost:5001/api/users/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                          username: loginData.username,
                        password: loginData.password
                      })
                    });
                    if (response.ok) {
                      const data = await response.json();
                      localStorage.setItem('token', data.token);
                      // Trigger a storage event for App.js to detect
                      window.dispatchEvent(new Event('storage'));
                      navigate("/usermainpage");
                    } else {
                      alert("Login failed. Please check your credentials.");
                    }
                  } catch (err) {
                    alert("Network error. Please try again.");
                  }
                }}
              >
                <Form.Group className="mb-3" controlId="loginEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      value={loginData.username}
                      onChange={e => setLoginData({ ...loginData, username: e.target.value })}
                      required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="loginPassword">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={loginData.password}
                      onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                    <InputGroup.Text style={{ background: 'none', borderLeft: 0, cursor: 'pointer' }} onClick={() => setShowPassword((v) => !v)} tabIndex={-1}>
                      {showPassword ? <EyeSlashFill /> : <EyeFill />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                <Button 
                  variant="danger" 
                  type="submit" 
                  className="w-100 rounded-pill py-2 mt-4"
                  style={{ backgroundColor: '#d32f2f', borderColor: '#d32f2f' }}
                >
                  Login
                </Button>
              </Form>
            </>
          ) : (
            <>
              <h4 className="mb-4 text-center" style={{ color: '#d32f2f' }}>Create Your Account</h4>
              <Form
                onSubmit={async e => {
                  e.preventDefault();
                  setSignupError("");
                  if (signupData.password !== signupData.confirmPassword) {
                    setSignupError("Passwords do not match");
                    return;
                  }
                  try {
                    const response = await fetch("http://localhost:5001/api/users/signup", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        firstName: signupData.firstName,
                        lastName: signupData.lastName,
                        email: signupData.email,
                        username: signupData.username,
                        password: signupData.password
                      })
                    });
                    if (response.status === 201) {
                      setSignupSuccess(true);
                      setTimeout(() => {
                        setIsLogin(true);
                        setSignupSuccess(false);
                      }, 2000);
                    } else {
                      const data = await response.json();
                      setSignupError(data.error || data.message || "Signup failed");
                    }
                  } catch (err) {
                    setSignupError("Network error. Please try again.");
                  }
                }}
              >
                <Form.Group className="mb-3" controlId="signupFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your first name"
                    value={signupData.firstName}
                    onChange={e => setSignupData({ ...signupData, firstName: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="signupLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your last name"
                    value={signupData.lastName}
                    onChange={e => setSignupData({ ...signupData, lastName: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="signupEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={signupData.email}
                    onChange={e => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="signupUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Choose a username"
                    value={signupData.username}
                    onChange={e => setSignupData({ ...signupData, username: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="signupPassword">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showSignupPassword ? "text" : "password"}
                      placeholder="Password"
                      value={signupData.password}
                      onChange={e => setSignupData({ ...signupData, password: e.target.value })}
                      required
                    />
                    <InputGroup.Text style={{ background: 'none', borderLeft: 0, cursor: 'pointer' }} onClick={() => setShowSignupPassword((v) => !v)} tabIndex={-1}>
                      {showSignupPassword ? <EyeSlashFill /> : <EyeFill />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3" controlId="signupConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={signupData.confirmPassword}
                      onChange={e => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      required
                    />
                    <InputGroup.Text style={{ background: 'none', borderLeft: 0, cursor: 'pointer' }} onClick={() => setShowConfirmPassword((v) => !v)} tabIndex={-1}>
                      {showConfirmPassword ? <EyeSlashFill /> : <EyeFill />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                <Button variant="danger" type="submit" className="w-100">
                  Sign Up
                </Button>
                {signupSuccess && (
                  <div style={{ color: '#0a2a66', fontWeight: 600, marginTop: 16, textAlign: 'center' }}>
                    Signup successful! Please log in.
                  </div>
                )}
                {signupError && (
                  <div style={{ color: '#b00020', fontWeight: 600, marginTop: 16, textAlign: 'center' }}>
                    {signupError}
                  </div>
                )}
              </Form>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserAuth;
