'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function LoginWithOtp() {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;

    // Allow only digits
    if (/^\d*$/.test(value)) {
      setMobile(value);
      // Validate only when user enters something
      if (value.length > 0 && value.length !== 10) {
        setError('Mobile number must be exactly 10 digits.');
      } else {
        setError('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mobile.length !== 10) {
      setError('Mobile number must be exactly 10 digits.');
      return;
    }
    // Proceed with OTP logic here
    alert(`Sending OTP to ${mobile}`);
  };

  return (
    <main style={{ overflowX: 'hidden' }}>
      <div className="row gap-2 pt-4 mt-5">
        <div className="container my-4">
          <div className="card shadow-sm mx-auto p-4" style={{ maxWidth: '400px', borderRadius: '0.5rem' }}>
            <div className="mb-3 text-center">
              <h4 style={{ fontFamily: 'Candara' }}><b>Login with OTP</b></h4>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Enter Your Mobile"
                  name="mobile"
                  maxLength={10}
                  value={mobile}
                  onChange={handleChange}
                />
                {error && <div className="text-danger mt-1">{error}</div>}
              </div>

              <div className="mb-3">
                <button type="submit" className="btn btn-primary w-100 mt-1">
                  Get OTP
                </button>
              </div>
            </form>

            <div className="text-center small">
              Don’t have an account?{' '}
              <Link href="/registration" className="text-primary text-decoration-underline">Register</Link>
            </div>
            <div className="text-center small mt-2">
              By continuing, you agree to{' '}
              <Link href="/privacypolicy" className="text-primary text-decoration-underline">Gharaya's Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="col">
        <div className="d-flex align-items-center justify-content-center flex-wrap gap-3">
          <Link href="/otp" className="text-decoration-none">
            <button type="button" className="btn btn-outline-success">Login with OTP</button>
          </Link>
          <Link href="/loginpage" className="text-decoration-none">
            <button type="button" className="btn btn-outline-success">Login with password</button>
          </Link>
        </div>
      </div>
    </main>
  );
}
