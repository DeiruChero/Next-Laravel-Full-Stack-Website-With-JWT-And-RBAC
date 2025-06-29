'use client';

import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useCart } from '../_context/CartContext';
import Cart from './Cart'; // Your full cart list component

export default function MobileCartToggle() {
  const [show, setShow] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { getTotalItems } = useCart();

  // Only render the toggle once hydrated
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if (!isClient) return null;

  return (
    <>
      {/* Mobile-only cart button */}
      <Button
        variant="primary"
        className="d-lg-none position-fixed bottom-0 end-0 m-3 shadow-lg"
        onClick={handleShow}
        aria-label="Open cart"
        style={{ borderRadius: '50%', width: '3.5rem', height: '3.5rem' }}
      >
        <i className="bi bi-cart3 fs-4"></i>
        {getTotalItems() > 0 && (
          <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
            {getTotalItems()}
          </Badge>
        )}
      </Button>

      {/* Offcanvas for mobile */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        responsive="lg"
        placement="end"
        className="w-85"
      >
        <Offcanvas.Header closeButton className="bg-success text-white">
          <Offcanvas.Title className="w-100 text-center">
            🛒 My Cart
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <Cart />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
