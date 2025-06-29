'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material';
import Head from 'next/head';
import { useLocation } from '@/app/_context/LocationContext';
import { useAuth } from '@/app/_context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RegisterPage() {
  const { location } = useLocation();
  const { setUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtherFields, setShowOtherFields] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [branchName, setBranchName] = useState('');
  const [areaName, setAreaName] = useState('');
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    branchid: '',
    areaid: '',
    referralcode: '',
  });

  useEffect(() => {
    const storedLocation = JSON.parse(localStorage.getItem('selectedLocation')) || {};
    setBranchName(storedLocation.branchName || location?.branchName || '');
    setAreaName(storedLocation.area || '');
    setForm((prev) => ({
      ...prev,
      branchid: storedLocation.branchId?.toString() || location?.branchId?.toString() || '',
      areaid: storedLocation.areaId?.toString() || location?.areaId?.toString() || '',
    }));
  }, [location]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'mobile' || name === 'referralcode') && !/^\d{0,10}$/.test(value)) return;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateBasic = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!/^\d{10}$/.test(form.mobile)) newErrors.mobile = 'Enter a valid 10-digit mobile number';
    if (!form.branchid) newErrors.branchid = 'Branch ID missing';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    if (!validateBasic()) return;
    setLoading(true);
    try {
      const res = await api.post('/sendregisterotp', { mobile: form.mobile });
      if (res.data?.status === 'success') {
        toast.success('OTP sent!');
        setOtpSent(true);
        setResendTimer(10);
      } else {
        toast.error(res.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error(err);
      toast.error('User already exists with the given mobile number.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast.error('Enter OTP');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/verifyregisterotp', {
        mobile: form.mobile,
        otpcode: otp,
      });
      if (res.data?.status === 'success') {
        toast.success('OTP verified!');
        setShowOtherFields(true);
      } else {
        toast.error(res.data.message || 'OTP verification failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailCheck = async () => {
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      toast.error('Enter a valid email');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/verifyregistrationemail', { email: form.email });
      if (res.data?.status === 'success') {
        toast.success('✅ Email is available');
        setEmailValid(true);
      } else {
        toast.error(res.data.message || '❌ Email already exists');
        setEmailValid(false);
      }
    } catch (err) {
      console.error(err);
      toast.error('❌ Error checking email');
      setEmailValid(false);
    } finally {
      setEmailChecked(true);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Enter valid email';
    }
    if (!form.password || form.password.length < 6) {
      newErrors.password = 'Min 6 characters';
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (form.referralcode && !/^\d{10}$/.test(form.referralcode)) {
      newErrors.referralcode = 'Referral must be 10-digit mobile';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await api.post('/register', {
        fname: form.firstName,
        lname: form.lastName,
        mobile: form.mobile,
        email: form.email,
        password: form.password,
        branchid: form.branchid,
        areaid: form.areaid,
        referralcode: form.referralcode,
      });

      if (res.data.result === 'Y' || res.data.status === 'success') {
        toast.success('Registration successful! Logging you in...');
        localStorage.setItem('token', res.data.access_token);
        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
          setUser(res.data.user);
        }
        setTimeout(() => {
          window.location.href = res.data.redirect_url || '/';
        }, 1500);
      } else {
        toast.error(res.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
      <Head><title>Register | DesiMati</title></Head>

      <Box sx={{ pt: 11 }}>
        <Grid container justifyContent="center" sx={{ minHeight: '100vh', backgroundColor: '#f4f7f8', px: 2 }}>
          <Grid item xs={12} sm={10} md={7} lg={4}>
            <Paper elevation={5} sx={{ borderRadius: 4, p: 4 }}>
              <Typography variant="h4" gutterBottom align="center" sx={{ fontFamily: 'Candara' }}>
                Create Your Account
              </Typography>
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Branch" value={branchName} InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="First Name" name="firstName" value={form.firstName} onChange={handleChange}
                      error={Boolean(errors.firstName)} helperText={errors.firstName} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Last Name" name="lastName" value={form.lastName} onChange={handleChange}
                      error={Boolean(errors.lastName)} helperText={errors.lastName} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Mobile Number" name="mobile" value={form.mobile} onChange={handleChange}
                      error={Boolean(errors.mobile)} helperText={errors.mobile} />
                  </Grid>

                  {!otpSent && (
                    <Grid item xs={12}>
                      <Button fullWidth variant="contained" color="success" onClick={handleSendOtp} disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
                      </Button>
                    </Grid>
                  )}

                  {otpSent && !showOtherFields && (
                    <>
                      <Grid item xs={12}>
                        <TextField fullWidth label="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                      </Grid>
                      <Grid item xs={12}>
                        <Button fullWidth variant="contained" color="success" onClick={handleVerifyOtp} disabled={loading}>
                          {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        <Button fullWidth variant="outlined" color="primary" onClick={handleSendOtp}
                          disabled={resendTimer > 0 || loading}>
                          {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                        </Button>
                      </Grid>
                    </>
                  )}

                  {showOtherFields && (
                    <>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          onBlur={handleEmailCheck}
                          error={Boolean(errors.email) || (emailChecked && !emailValid)}
                          helperText={
                            errors.email ||
                            (emailChecked && !emailValid ? 'Email already exists' : '')
                          }
                        />
                      </Grid>
                      {emailValid && (
                        <>
                          <Grid item xs={12}>
                            <TextField fullWidth label="Password" type="password" name="password" value={form.password}
                              onChange={handleChange} error={Boolean(errors.password)} helperText={errors.password} />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField fullWidth label="Confirm Password" type="password" name="confirmPassword"
                              value={form.confirmPassword} onChange={handleChange} error={Boolean(errors.confirmPassword)}
                              helperText={errors.confirmPassword} />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField fullWidth label="Referral Code (10-digit mobile)" name="referralcode"
                              value={form.referralcode} onChange={handleChange} error={Boolean(errors.referralcode)}
                              helperText={errors.referralcode} />
                          </Grid>
                          <Grid item xs={12}>
                            <Button type="submit" fullWidth variant="contained" color="success" disabled={loading}>
                              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                            </Button>
                          </Grid>
                        </>
                      )}
                    </>
                  )}
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
