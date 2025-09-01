import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Container } from 'react-bootstrap';
import UserMainPage from './user/usermainpage';
import UserAuth from './user/UserAuth';
import WelcomePage from './components/WelcomePage';
import DonateBlood from './user/DonateBlood';
import RequestBlood from './user/RequestBlood';
import History from './user/History';
import AdminLogin from './Admin/AdminLogin';
import AdminDashboard from './Admin/AdminDashboard';
import StaffAuth from './Admin/Staff/StaffAuth';
import StaffDashboard from './Admin/Staff/StaffDashboard';
import About from './components/utility/About';
import Contact from './components/utility/Contact';
import FAQ from './components/utility/FAQ';
import HowItWorks from './components/utility/HowItWorks';
import NearbyHospital from './user/NearbyHospital';
import DonateNearbyHospital from './user/DonateNearbyHospital';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!(localStorage.getItem('token') || localStorage.getItem('userToken')));
  const [userRole, setUserRole] = React.useState(localStorage.getItem('userRole'));

  React.useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('userToken');
      setIsAuthenticated(!!token);
      setUserRole(localStorage.getItem('userRole'));
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Message component for restricted access
  const RestrictedMessage = () => (
    <Container className="mt-5 text-center">
      <div className="alert alert-warning">
        <h4>Access Restricted</h4>
        <p>At first log out your section and Please create a user profile and log in as a user to access this page.</p>
      </div>
    </Container>
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userToken');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole(null);
    window.location.replace('/'); // Force full reload to sync state
  };

  return (
    <Router>
      <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#fafafa' }}>
        <nav className="navbar navbar-expand-lg navbar-dark px-3" style={{backgroundColor: '#d32f2f'}}>
          <Container>
            <Link className="navbar-brand fw-bold" to="/">Blood System</Link>
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown" 
              aria-expanded="false" 
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
              <ul className="navbar-nav ms-auto align-items-center">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/admin">Admin</a>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/staff-dashboard">Staff</Link>
                </li>
                {isAuthenticated ? (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/donate-blood">Donate Blood</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/request-blood">Request Blood</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/usermainpage">Blood Services</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/history">History</Link>
                    </li>
                    <li className="nav-item">
                      <button 
                        className="nav-link btn btn-link" 
                        onClick={handleLogout}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '8px 16px',
                          cursor: 'pointer'
                        }}
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="nav-item">
                    <Link className="nav-link" to="/user">User</Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link className="nav-link" to="/about">About</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contact">Contact</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/faq">FAQ</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/how-it-works">How It Works</Link>
                </li>
              </ul>
            </div>
          </Container>
        </nav>
                <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={
              localStorage.getItem('userRole') === 'admin' ? <AdminDashboard /> :
              localStorage.getItem('userRole') === 'staff' ? <RestrictedMessage /> :
              <AdminLogin />
            } />
            <Route path="/admin-dashboard" element={
              localStorage.getItem('userRole') === 'admin' ? <AdminDashboard /> :
              localStorage.getItem('userRole') === 'staff' ? <RestrictedMessage /> :
              <AdminLogin />
            } />
            <Route path="/staff-login" element={<StaffAuth />} />
            <Route path="/staff" element={<StaffAuth />} />
            <Route path="/staff-auth" element={<StaffAuth />} />
            <Route path="/staff-dashboard" element={
              localStorage.getItem('userRole') === 'staff' ? <StaffDashboard /> :
              localStorage.getItem('userRole') === 'admin' ? <RestrictedMessage /> :
              <StaffAuth />
            } />
            <Route path="/user" element={localStorage.getItem('userRole') === 'admin' || localStorage.getItem('userRole') === 'staff' ? <RestrictedMessage /> : <UserAuth setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/usermainpage" element={localStorage.getItem('userRole') === 'admin' || localStorage.getItem('userRole') === 'staff' ? <RestrictedMessage /> : <UserMainPage />} />
            <Route path="/donate-blood" element={localStorage.getItem('userRole') === 'admin' || localStorage.getItem('userRole') === 'staff' ? <RestrictedMessage /> : <DonateBlood />} />
            <Route path="/request-blood" element={localStorage.getItem('userRole') === 'admin' || localStorage.getItem('userRole') === 'staff' ? <RestrictedMessage /> : <RequestBlood />} />
            <Route path="/history" element={localStorage.getItem('userRole') === 'admin' || localStorage.getItem('userRole') === 'staff' ? <RestrictedMessage /> : <History />} />
            <Route path="/user/history" element={localStorage.getItem('userRole') === 'admin' || localStorage.getItem('userRole') === 'staff' ? <RestrictedMessage /> : <History />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/user/nearbyhospital" element={localStorage.getItem('userRole') === 'admin' || localStorage.getItem('userRole') === 'staff' ? <RestrictedMessage /> : <NearbyHospital />} />
            <Route path="/user/donate-nearbyhospital" element={localStorage.getItem('userRole') === 'admin' || localStorage.getItem('userRole') === 'staff' ? <RestrictedMessage /> : <DonateNearbyHospital />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
