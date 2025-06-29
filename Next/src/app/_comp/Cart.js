'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '../_context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Cart() {
  const { getCartItems, updateCartItem, getTotalPrice } = useCart();
  const cartItems = getCartItems();
  const router = useRouter();
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserRole(parsed.role || '');
      } catch {
        console.error('Invalid user data in localStorage');
      }
    }
  }, []);

  const delivery_fee = 0;
  const tax_fee = 0;

  const changeQuantity = (productID, delta) => {
    const item = cartItems.find(i => i.ProductID === productID);
    const newQty = Math.max(0, (item?.quantity || 0) + delta);
    updateCartItem(item, newQty);
  };


  if (cartItems.length === 0) {
    return (
      <div className="text-center my-5">      
        <h2 className="pt-5" style={{ marginTop: '10rem' }}><i className="bi bi-cart-x-fill"></i>
        <br/>
         Your cart is empty</h2>

        <Link href="/">
          <p className="btn btn-outline-primary mt-3">Add Products</p>
        </Link>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const grandTotal = subtotal + delivery_fee + tax_fee;

  const handleCheckout = () => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/website/checkout');
    } else {
      alert('Please login to proceed to checkout.');
      router.push('/loginpage');
    }
  };

  const subtotal = getTotalPrice();
  const grandTotal = subtotal + delivery_fee + tax_fee;

  if (cartItems.length === 0) {
    return (
      <div className="text-center my-5">
        <h2 className="pt-4">Your cart is empty</h2>
        <Link href="/">
          <p className="btn btn-outline-primary mt-3">Add Products</p>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fs-4 mb-4 mt-5">Cart: <span className="text-muted">{cartItems.length} items</span></h2>
      <div className="row">
        <div className="col-md-8">
          {cartItems.map(item => (
            <div key={item.ProductID} className="d-flex border rounded-3 p-3 mb-3 align-items-center shadow-sm bg-light">
              <img
                src={item.Picture}
                alt={item.ProductName}
                className="rounded me-3"
                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
              />
              <div className="flex-grow-1">
                <h6 className="mb-1 fw-bold">{item.ProductName}</h6>
                <div className="text-success mb-2">₹{parseFloat(item.Price).toFixed(2)} / unit</div>
                <div className="input-group input-group-md w-auto">
                  {userRole === 'Hotel' || userRole === 'Institution' ? (
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*\.?\d*$/.test(val)) {
                          updateCartItem(item, parseFloat(val) || 0);
                        }
                      }}
                      className="form-control text-center"
                      style={{ width: '4rem' }}
                    />
                  ) : (
                    <>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => changeQuantity(item.ProductID, -1)}
                      >−</button>
                      <span className="input-group-text bg-white">{item.quantity}</span>
                      <button
                        className="btn btn-outline-success"
                        onClick={() => changeQuantity(item.ProductID, 1)}
                      >+</button>
                    </>
                  )}
                </div>
              </div>
              <div className="text-end">
                <div className="fw-bold">₹{(item.quantity * parseFloat(item.Price)).toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm rounded-3">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Order summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span>₹{delivery_fee.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Tax</span>
                <span>₹{tax_fee.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between border-top pt-2 fw-bold">
                <span>Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
              <button className="btn btn-success w-100 mt-4" onClick={handleCheckout}>
                Proceed to checkout <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
