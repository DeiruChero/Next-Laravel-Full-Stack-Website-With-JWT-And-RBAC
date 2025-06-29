'use client';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function ChangePassword() {
  const router = useRouter();
  const [mobile] = useState(''); // Hardcoded or passed as prop
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/sendchangepassotp');
      if (res.status === 200) {
        toast.success(`✅ OTP sent successfully `);
        setOtpSent(true);
        setResendTimer(30); // 30 sec cooldown
      } else {
        toast.error('❌ Failed to send OTP. Please try again.');
      }
    } catch (err) {
      console.error(err);
      toast.error('❌ Error sending OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.length !== 6) {
      toast.error('❌ Enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/verifychangepassotp', { mobile, otpcode: otp });
      if (res.data?.status === 'success') {
        toast.success('✅ OTP verified!');
        setOtpVerified(true);
      } else {
        toast.error(res.data.message || '❌ OTP verification failed.');
      }
    } catch (err) {
      console.error(err);
      toast.error('❌ Error verifying OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('❌ Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('❌ Passwords do not match.');
      return;
    }

    try {
      const res = await api.post('/changecustomerpassword', { password });
      if (res.data?.status === 'success') {
        toast.success('✅ Password changed successfully!');
        // ✅ Reset all states
        setPassword('');
        setConfirmPassword('');
        setOtp('');
        setOtpSent(false);
        setOtpVerified(false);
        setResendTimer(0);

        // ✅ Redirect after short delay to show toast
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        toast.error(res.data.message || '❌ Failed to change password.');
      }
    } catch (err) {
      console.error(err);
      toast.error('❌ Error changing password.');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '6rem' }}>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <div className="card col-md-8 col-lg-4 mx-auto p-4 shadow rounded">
        <h3 className="text-center mb-4">Change Password</h3>

        {!otpSent && (
          <button className="btn btn-success fs-6 w-100" onClick={handleSendOtp}>
            Send otp to your registered mobile no.
          </button>
        )}

        {otpSent && !otpVerified && (
          <div>
            <form onSubmit={handleVerifyOtp}>
              <input
                type="text"
                maxLength="6"
                className="form-control mb-2"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-success w-100 mb-2"
                disabled={otp.length !== 6 || loading}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
            <button
              className="btn btn-link p-0"
              onClick={handleSendOtp}
              disabled={resendTimer > 0}
            >
              {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
            </button>
          </div>
        )}

        {otpVerified && (
          <form onSubmit={handleChangePassword}>
            <input
              type="password"
              className="form-control mb-2"
              placeholder="New Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              className="form-control mb-2"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary w-100">
              Change Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
