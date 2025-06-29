'use client';

import { useState, useEffect } from 'react';
import api from "@/lib/axios";
import { useCart } from '../_context/CartContext';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Modal from 'react-bootstrap/Modal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { useLocation } from '../_context/LocationContext';
import LocationSelect from '../_comp/LocationSelect';

export default function Header() {
  const [isHovered, setIsHovered] = useState(false);
  const [issHovered, setIssHovered] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [user, setUser] = useState(null);

  const { getTotalItems, getTotalPrice } = useCart();
  const { location, setLocation } = useLocation();
  const router = useRouter();

  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);

  const handleLocationClick = () => setShowLocationModal(true);
  const handleLocationModalClose = () => setShowLocationModal(false);

  const onLocationChange = (newLocation) => {
    setLocation(newLocation);
    localStorage.setItem('selectedLocation', JSON.stringify(newLocation));
    setShowLocationModal(false);
  };

  // ✅ Load user from localStorage
  const loadUserFromStorage = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error('Failed to parse user');
    }
  };

  useEffect(() => {
    loadUserFromStorage(); // Load once initially

    // ✅ Watch localStorage every second (for same-tab update)
    const interval = setInterval(() => {
      loadUserFromStorage();
    }, 1000);

    // ✅ Listen to localStorage change (for multi-tab sync)
    const handleStorageChange = (e) => {
      if (e.key === 'user') loadUserFromStorage();
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Restore location
  useEffect(() => {
    const stored = localStorage.getItem('selectedLocation');
    if (!user && !location.branchId && stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.branchId) {
          setLocation(parsed);
        }
      } catch (e) {
        console.warn('Invalid stored location');
      }
    }
  }, [user, location.branchId]);

  useEffect(() => {
    const alreadyOpened = sessionStorage.getItem('locationModalShown');
    if (!user && !location.branchId && !alreadyOpened) {
      setShowLocationModal(true);
      sessionStorage.setItem('locationModalShown', 'true');
    }
  }, [user, location.branchId]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.post('/logout');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('selectedLocation');
          setUser(null);
          setLocation({ city: '', area: '', branchId: null });

          Swal.fire('Logged out!', 'You have been successfully logged out.', 'success')
            .then(() => {
              setShowLocationModal(true);
              router.push('/loginpage');
            });
        } catch (error) {
          console.error('Logout error:', error);
          Swal.fire('Oops!', 'Something went wrong while logging out.', 'error');
        }
      }
    });
  };

  return (
    <>
      <Navbar expand="lg" className="bg-success mb-2 position-fixed top-0 start-0 end-0 z-3">
        <Container fluid>
          <div
            className="bg-body-tertiary shadow rounded p-2 d-inline-block"
            style={{ transition: 'transform 0.3s', transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img src="/gharayalogo.png" alt="Logo" className="img-fluid" style={{ maxHeight: '2.1rem' }} />
          </div>

          {/* 👤 User or 📍 Location */}
          <div className="text-center font-monospace text-white">
            {user ? (
              <div>
                <i className="bi bi-person-check fs-6"></i>
                <div className="small">
                  <strong>{user.DisplayName}</strong>
                </div>
              </div>
            ) : (
              <div onClick={handleLocationClick} style={{ cursor: 'pointer' }}>
                <i className="bi bi-geo-alt fs-6"></i>
                <div className="small">
                  <strong>{location.city || "Select Location"}</strong>
                </div>
              </div>
            )}
          </div>


          {/* Menu Drawer */}
          <Navbar.Offcanvas id="offcanvasNavbar" placement="end" show={showOffcanvas} onHide={handleClose}>
            <Offcanvas.Header closeButton className="bg-success gap-1" />
            <Offcanvas.Body className="bg-success">
              <Nav className="justify-content-end flex-grow-1 pe-3 gap-3">
                <Link href="/" className="text-white fs-5 text-decoration-none font-monospace mt-1" onClick={handleClose}>Shop</Link>
                <Link href="/website/about" className="text-white fs-5 text-decoration-none font-monospace mt-1" onClick={handleClose}>About</Link>
                <Link href="/website/contact" className="text-white fs-5 text-decoration-none font-monospace mt-1" onClick={handleClose}>Contact</Link>

                {!user ? (
                  <Link href="/loginpage" className="text-white fs-5 text-decoration-none font-monospace mt-1" onClick={handleClose}>Login</Link>
                ) : (
                  <>
                    <Link href="/website/myaccount" className="text-white fs-5 text-decoration-none font-monospace mt-1" onClick={handleClose}>MyAccount</Link>
                    <span className="text-white fs-5 text-decoration-none font-monospace mt-1" onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</span>
                  </>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
          <Link href="/website/cart" className="text-decoration-none text-dark">
            <div
              className="d-none d-md-flex align-items-center bg-info text-white rounded gap-2 p-1"
              style={{ transition: 'transform 0.3s', transform: issHovered ? 'scale(1.1)' : 'scale(1)' }}
              onMouseEnter={() => setIssHovered(true)}
              onMouseLeave={() => setIssHovered(false)}
            >
              <i className="bi bi-cart fs-5" />
              <div className="d-flex flex-column">
                <span className="font-monospace">{getTotalItems()} items</span>
                <span className="font-monospace">₹{getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </Link>
          <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={handleShow} />
        </Container>
      </Navbar>

      {/* Location Modal */}
      <Modal show={showLocationModal} onHide={handleLocationModalClose} backdrop="static" keyboard={false}>
        <Modal.Body>
          <LocationSelect onLocationSelect={onLocationChange} />
        </Modal.Body>
      </Modal>
    </>
  );
}
