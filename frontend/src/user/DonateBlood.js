import React, { useState } from 'react';
import { Container, Form, Card, ListGroup, Spinner } from 'react-bootstrap';
import { Calendar2Check, GeoAlt, Hospital } from 'react-bootstrap-icons';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSource } from '../store';
import './DonateBlood.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const DonateBlood = () => {
  const [formData, setFormData] = useState({ location: '', pincode: '' });
  const [coordinates, setCoordinates] = useState([22.5726, 88.3639]); // Default to Kolkata
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLocationChange = async () => {

    // Combine location and pincode for better geocoding
    let value = formData.location;
    if (formData.pincode && formData.pincode.trim().length === 6) {
      value = `${value}, ${formData.pincode.trim()}`;
    }

    if (!formData.location) {
      alert('Please enter a location');
      setShowResults(false);
      return;
    }

    let triedGeolocation = false;

    const geocodeAndSearch = async (searchValue) => {
      setIsLoading(true);
      // Use OpenStreetMap's Nominatim geocoding service to convert location to coordinates
      const geocodingResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchValue)}`);
      const geocodingResult = await geocodingResponse.json();

      if (!geocodingResult || geocodingResult.length === 0) {
        return null;
      }
      return geocodingResult[0];
    };

    try {
      let geoResult = await geocodeAndSearch(value);
      if (!geoResult) {
        // Prompt for geolocation if not found
        if (!triedGeolocation && window.confirm('Location not found. Would you like to use your current location instead?')) {
          triedGeolocation = true;
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
              const { latitude, longitude } = position.coords;
              setCoordinates([latitude, longitude]);
              setMapKey(prev => prev + 1);
              // Reverse geocode to get address
              const reverseRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
              const reverseData = await reverseRes.json();
              const address = reverseData.display_name || `${latitude},${longitude}`;
              setFormData(prev => ({ ...prev, location: address }));
              // Now search hospitals with these coordinates
          const response = await fetch(`http://localhost:5001/api/hospitals/nearby?latitude=${latitude}&longitude=${longitude}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                }
              });
              if (!response.ok) {
                alert('Failed to fetch hospitals for your location.');
                setShowResults(false);
                setIsLoading(false);
                return;
              }
              const hospitals = await response.json();
              const transformedHospitals = hospitals.map(hospital => ({
                id: hospital.id,
                name: hospital.name,
                coordinates: [hospital.latitude, hospital.longitude],
                address: hospital.location,
                phone: hospital.phone || 'Phone not available',
                availableBloodGroups: hospital.available_blood_groups ? 
                  hospital.available_blood_groups.split(',') : 
                  ['Blood stock information not available'],
                distance: hospital.distance_km ? 
                  `${parseFloat(hospital.distance_km).toFixed(1)} km` : 
                  'Distance not available'
              }));
              setNearbyHospitals(transformedHospitals);
              setShowResults(true);
              navigate('/user/donate-nearbyhospital');
              setIsLoading(false);
            }, (geoError) => {
              alert('Could not get your location. Please check your browser settings.');
              setIsLoading(false);
            });
            return;
          } else {
            alert('Geolocation is not supported by your browser.');
            setIsLoading(false);
            return;
          }
        } else {
          alert('Location not found. Please check your spelling or try a different place.');
          setShowResults(false);
          setIsLoading(false);
          return;
        }
      }

      const { lat, lon } = geoResult;
      setCoordinates([parseFloat(lat), parseFloat(lon)]);
      setMapKey(prev => prev + 1);

      // Fetch nearby hospitals from your backend API
  const response = await fetch(`http://localhost:5001/api/hospitals/nearby?latitude=${lat}&longitude=${lon}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch hospitals');
  }

  const hospitals = await response.json();
  // Transform the data to match the component's structure
  const transformedHospitals = hospitals.map(hospital => ({
    id: hospital.id,
    name: hospital.name,
    coordinates: [hospital.latitude, hospital.longitude],
    address: hospital.location,
    phone: hospital.phone || 'Phone not available',
    availableBloodGroups: hospital.available_blood_groups ? 
      hospital.available_blood_groups.split(',') : 
      ['Blood stock information not available'],
    distance: hospital.distance_km ? 
      `${parseFloat(hospital.distance_km).toFixed(1)} km` : 
      'Distance not available'
  }));

  setNearbyHospitals(transformedHospitals);
  setShowResults(true);
  // Always set Redux source to true before navigating
  dispatch(setSource(true));
  setTimeout(() => {
    navigate('/user/donate-nearbyhospital');
  }, 0);
    } catch (error) {
      // Only show a generic error if not a location-not-found case
      if (!String(error).includes('Location not found')) {
        console.error('Error:', error);
        alert('Error fetching nearby hospitals. Please try again.');
      }
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <Container>
        <Card className="shadow-sm border-0 rounded-3" style={{ maxWidth: showResults ? '1200px' : '600px', margin: '0 auto' }}>
          <Card.Body className="p-4">
            <div className="text-center mb-4">
              <Calendar2Check className="text-danger mb-2" size={40} />
              <h2 className="mb-1" style={{ color: '#d32f2f' }}>Donate Blood</h2>
              <p className="text-muted">Enter your location to find hospitals within 30km</p>
            </div>

            <Form className={showResults ? 'mb-4' : ''}>
              <Form.Group className="mb-4">
                <Form.Label><GeoAlt className="me-2" />Your Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter a location (e.g., Salt Lake City, Kolkata)"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  disabled={isLoading}
                  className="mb-3"
                />
                <Form.Text className="text-muted d-block mb-3">
                  Enter a location name to search for nearby hospitals
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label><GeoAlt className="me-2" />Pincode (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your pincode (e.g., 700064, 560001)"
                  value={formData.pincode || ''}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  disabled={isLoading}
                  className="mb-3"
                  maxLength="6"
                  pattern="[0-9]{6}"
                />
                <Form.Text className="text-muted d-block mb-3">
                  Optional: Enter a 6-digit pincode for more precise results
                </Form.Text>
              </Form.Group>
              <div className="d-grid">
                <button
                  type="button"
                  className="btn btn-danger w-100 rounded-pill py-2"
                  onClick={handleLocationChange}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Searching...
                    </>
                  ) : (
                    'Find Nearby Hospitals'
                  )}
                </button>
              </div>
            </Form>

            {showResults && coordinates && (
              <div>
                <h3 className="mb-3">
                  <Hospital className="me-2" />
                  Nearby Hospitals
                </h3>
                <div className="row">
                  <div className="col-md-5">
                    <ListGroup className="mb-3">
                      {nearbyHospitals.map(hospital => (
                        <ListGroup.Item key={hospital.id} className="border-0 shadow-sm mb-2">
                          <h5>{hospital.name}</h5>
                          <p className="mb-1 text-muted small">
                            <GeoAlt className="me-1" />
                            {hospital.address}
                          </p>
                          <p className="mb-1 small">
                            📞 {hospital.phone}
                          </p>
                          <p className="mb-1 small text-success">
                            Available Blood Groups: {hospital.availableBloodGroups.join(', ')}
                          </p>
                          <p className="mb-0 small text-info">
                            Distance: {hospital.distance}
                          </p>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                  <div className="col-md-7">
                    <div style={{ height: '400px', borderRadius: '10px', overflow: 'hidden' }}>
                      <MapContainer
                        key={mapKey}
                        center={coordinates}
                        zoom={12}
                        style={{ height: '100%', width: '100%' }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {/* User's location */}
                        <Marker position={coordinates}>
                          <Popup>Your Location</Popup>
                        </Marker>
                        {/* 30km radius circle */}
                        <Circle
                          center={coordinates}
                          radius={30000}
                          pathOptions={{ color: '#d32f2f', fillColor: '#d32f2f', fillOpacity: 0.1 }}
                        />
                        {/* Hospital markers */}
                        {nearbyHospitals.map(hospital => (
                          <Marker
                            key={hospital.id}
                            position={hospital.coordinates}
                          >
                            <Popup>
                              <strong>{hospital.name}</strong><br />
                              {hospital.address}
                            </Popup>
                          </Marker>
                        ))}
                      </MapContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default DonateBlood;
