//App.js
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/navbar';
import HomePage from './components/home_page';
import Weather from './components/Weather';
import TaskList from './components/TaskList';
import ImageUpload from './components/ImageUpload';
import Register from './components/Register';
import Login from './components/Login';
import CropForm from './components/CropForm';
import CropFeature from './components/CropFeature';
import VendorDashboard from './components/VendorDashboard';
import VendorList from './components/VendorList';
import SellCropForm from './components/SellCropForm';
import VendorProfileForm from './components/VendorProfileForm';
import Footer from './components/Footer';
import axios from 'axios';


function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [overdueCount, setOverdueCount] = useState(0);
  const [hasVendorProfile, setHasVendorProfile] = useState(null); // NEW

  useEffect(() => {
    const token = sessionStorage.getItem('access');
    const storedRole = sessionStorage.getItem('role');
    setIsAuthenticated(!!token);
    setRole(storedRole);
    
    // Fetch vendor profile status if vendor
    if (token && storedRole === 'vendor') {
      axios.get('http://localhost:8000/check-vendor-profile/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setHasVendorProfile(res.data.has_profile))
      .catch(() => setHasVendorProfile(false));
    } else {
      setHasVendorProfile(false);
    }

    setLoading(false);
  }, []);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  const hideNavbarRoutes = ['/login', '/register'];
  const shouldShowNavbar = isAuthenticated && !hideNavbarRoutes.includes(location.pathname);

  if (loading || (role === 'vendor' && hasVendorProfile === null)) return null;

  return (
    <>
      {shouldShowNavbar && role === 'farmer' && (
        <Navbar
          onLogout={() => {
            sessionStorage.removeItem('access');
            sessionStorage.removeItem('role');
            setIsAuthenticated(false);
            setRole(null);
          }}
          overdueCount={overdueCount}
        />
      )}
      <Routes>
        <Route path="/login" element={
          <Login onLogin={() => {
            setIsAuthenticated(true);
            const role = sessionStorage.getItem('role');
            setRole(role);

            if (role === 'vendor') {
              axios.get('http://localhost:8000/check-vendor-profile/', {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` },
              }).then((res) => setHasVendorProfile(res.data.has_profile));
            }
          }} />
        } />

        <Route path="/register" element={<Register />} />

        {role === 'vendor' && (
          <>
            <Route path="/vendor-profile" element={<PrivateRoute element={<VendorProfileForm />} />} />
            <Route path="/vendor-dashboard" element={<PrivateRoute element={<VendorDashboard />} />} />
          </>
        )}

        {role === 'farmer' && (
          <>
            <Route path="/home" element={<PrivateRoute element={<HomePage />} />} />
            <Route path="/weather" element={<PrivateRoute element={<Weather />} />} />
            <Route path="/tasklist" element={<PrivateRoute element={<TaskList onOverdueCountChange={setOverdueCount} />} />} />
            <Route path="/predict" element={<PrivateRoute element={<ImageUpload />} />} />
            <Route path="/recommend-crop" element={<PrivateRoute element={<CropForm />} />} />
            <Route path="/crop-feature" element={<PrivateRoute element={<CropFeature />} />} />
            <Route path="/vendors" element={<PrivateRoute element={<VendorList />} />} />
            <Route path="/sell-crop/:vendorId" element={<PrivateRoute element={<SellCropForm />} />} />
          </>
        )}

        <Route
          path="/"
          element={
            isAuthenticated ? (
              role === 'vendor' ? (
                hasVendorProfile ? (
                  <Navigate to="/vendor-dashboard" />
                ) : (
                  <Navigate to="/vendor-profile" />
                )
              ) : (
                <Navigate to="/home" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
      {shouldShowNavbar && role === 'farmer' && (
        <Footer
          onLogout={() => {
            sessionStorage.removeItem('access');
            sessionStorage.removeItem('role');
            setIsAuthenticated(false);
            setRole(null);
          }}
        />
      )}
    </>
  );
}

export default AppWrapper;
