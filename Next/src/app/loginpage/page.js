'use client';

import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/_context/AuthContext';
// import Form from 'react-bootstrap/Form';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const isEmail = emailRegex.test(username);
    const isPhone = phoneRegex.test(username);

    if (!isEmail && !isPhone) {
      setError('Username must be a valid email or a 10-digit phone number.');
      setLoading(false);
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/loginwithpass', {
        username,
        password,
      });

      const user = res.data.user;

      // ✅ Save user and token
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      // ✅ Redirect
      const redirectUrl = res.data.redirect_url || '/';
      router.push(redirectUrl);

    } catch (err) {
      const message = err?.response?.data?.message || 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ overflowX: 'hidden' }}>
      <div className="row gap-2 mt-5" style={{ paddingTop: '2rem' }}>
        <div
          className="card mx-auto mt-3 p-4 shadow-sm"
          style={{ maxWidth: '350px', borderRadius: '0.5rem' }}
        >
          <div className="mb-3 text-center">
            <h3 style={{ fontFamily: 'Candara' }}>
              <strong>Login</strong>
            </h3>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="emailphone" className="form-label">
                Mobile / Email
              </label>
              <input
                type="text"
                className="form-control"
                id="emailphone"
                placeholder="Enter Your Mobile / Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <p className="text-center mb-0" style={{ fontSize: '0.9rem' }}>
              By continuing, you agree to{' '}
              <Link href="/website/privacypolicy" className="text-decoration-none text-primary">
                Gharaya's Privacy Policy
              </Link>
            </p><br />

            <div className="d-grid mb-3">
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Logging in...
                  </>
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          </form>

          <div className="d-flex justify-content-between mb-3">
            <Link href="/loginwithotp" className="text-decoration-none text-primary">
              Forgot Password?
            </Link>
            <Link href="/loginwithotp" className="text-decoration-none text-primary">
              Login with OTP
            </Link>
          </div>

          <p className="text-center mb-1" style={{ fontSize: '0.9rem' }}>
            Don’t have an account?{' '}
            <Link href="/website/registration" className="text-decoration-none text-primary">
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
