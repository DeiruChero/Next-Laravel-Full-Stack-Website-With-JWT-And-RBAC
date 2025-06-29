'use client';
import React, { useRef, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import api from "@/lib/axios";
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '@/app/_context/AuthContext';

export default function LoginWithOtp() {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [otpAttempts, setOtpAttempts] = useState(0);
    const [resendCount, setResendCount] = useState(0);
    const [locked, setLocked] = useState(false);
    const [resendLocked, setResendLocked] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);  // 🕒 For 1 min timer
    const inputRefs = useRef([]);
    const router = useRouter();
    const { setUser } = useAuth();

    useEffect(() => {
        let timer;
        if (resendTimer > 0) {
            timer = setTimeout(() => {
                setResendTimer(resendTimer - 1);
            }, 1000);
        } else if (resendLocked && resendCount < 3) {
            setResendLocked(false);
        }
        return () => clearTimeout(timer);
    }, [resendTimer, resendLocked, resendCount]);

    const sendOTP = async () => {
        if (resendLocked) {
            toast.warn("⏳ Please wait before requesting another OTP.");
            return;
        }

        if (!phone || phone.length !== 10) {
            toast.error("Please enter a valid 10-digit phone number.");
            return;
        }

        try {
            setLoading(true);
            const res = await api.post("/sendloginotp", { mobile: phone });

            if (res.data?.status === 'success') {
                setIsOtpSent(true);
                toast.success("✅ OTP sent successfully!");

                const nextResendCount = resendCount + 1;
                setResendCount(nextResendCount);

                if (nextResendCount >= 3) {
                    setResendLocked(true);
                    toast.error("Resend OTP limit reached. Please try again after some time.");
                } else {
                    setResendLocked(true);
                    setResendTimer(60); // Start 60s timer
                }
            } else {
                toast.error(res.data?.message || "❌ Failed to send OTP.");
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "❌ Error sending OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e, index) => {
        const { value } = e.target;
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        const pastedData = e.clipboardData.getData('Text').trim();
        if (!/^\d{6}$/.test(pastedData)) return;

        const digits = pastedData.split('');
        setOtp(digits);
        digits.forEach((digit, i) => {
            if (inputRefs.current[i]) {
                inputRefs.current[i].value = digit;
            }
        });
        inputRefs.current[5]?.focus();
        handleSubmit(digits.join(''));
    };

    const handleSubmit = async (otpValue) => {
        if (locked) {
            toast.error("Too many wrong attempts! Please try again after some time.");
            return;
        }

        try {
            const res = await api.post("/loginwithotp", {
                mobile: phone,
                otpcode: otpValue,
            });

            if (res.data?.status === "success") {
                localStorage.setItem("token", res.data?.access_token);
                localStorage.setItem("user", JSON.stringify(res.data?.user));
                setUser(res.data?.user);
                toast.success("✅ Login successfully");
                router.push(res.data.redirect_url || "/");
            } else {
                const nextOtpAttempts = otpAttempts + 1;
                setOtpAttempts(nextOtpAttempts);

                if (nextOtpAttempts >= 3) {
                    setLocked(true);
                    toast.error("❌ Too many wrong attempts! Login disabled for now.");
                } else {
                    toast.error(res.data?.message || "❌ OTP verification failed.");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "❌ Error verifying OTP.");
        }
    };

    return (
        <div className="container-fluid col-12 col-md-6" style={{ paddingTop: "6rem" }}>
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

            {!isOtpSent ? (
                <>
                    <h3 className="text-center">Login with OTP</h3>
                    <div className="mb-3 card p-3 shadow-sm">
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <input
                            type="text"
                            id="phone"
                            className="form-control"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter 10 digit mobile number"
                            maxLength="10"
                        />
                        <button
                            type="button"
                            className="btn btn-success mt-2"
                            onClick={sendOTP}
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="card shadow-sm mx-auto pt-1" style={{ maxWidth: '21rem', borderRadius: '2rem 0.2rem' }}>
                        <div className="col-12 mb-3 text-center">
                            <h1 className="text-dark" style={{ fontFamily: 'candara' }}>OTP Verification</h1>
                            <hr />
                            <h6 className="text-muted">Please Enter OTP</h6>
                        </div>

                        <div className="row m-2 justify-content-center" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <div className="col-2" key={index}>
                                    <input
                                        type="text"
                                        maxLength="1"
                                        className="form-control text-center fs-4"
                                        style={{
                                            width: '2.5rem',
                                            height: '2.5rem',
                                            borderRadius: '0.5rem',
                                        }}
                                        value={digit}
                                        onChange={(e) => handleChange(e, index)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Backspace') {
                                                e.preventDefault();
                                                const newOtp = [...otp];
                                                newOtp[index] = '';
                                                setOtp(newOtp);
                                                if (index > 0) {
                                                    inputRefs.current[index - 1]?.focus();
                                                }
                                            }
                                        }}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        disabled={locked}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="col-12 mb-3 d-flex justify-content-center">
                            <Button
                                style={{ width: '10rem', height: '3rem', borderRadius: '0.5rem' }}
                                variant="outline-success"
                                onClick={sendOTP}
                                disabled={loading || resendLocked}
                            >
                                {resendLocked
                                    ? `Resend in ${resendTimer}s`
                                    : (loading ? "Sending..." : "Resend OTP")}
                            </Button>
                        </div>

                        <div className="col-12 mb-3 d-flex justify-content-center">
                            <Button
                                style={{ width: '10rem', height: '3rem', borderRadius: '0.5rem' }}
                                variant="outline-secondary"
                                onClick={() => handleSubmit(otp.join(''))}
                                disabled={locked}
                            >
                                Submit & Login
                            </Button>
                        </div>

                        {locked && (
                            <div className="col-12 mb-2 text-center text-danger">
                                <small>Login disabled. Please try again later.</small>
                            </div>
                        )}

                        <div className="col-12 mb-2 d-flex justify-content-center">
                            <Link href="/loginpage">
                                <h6 className="text-muted text-center">Login With Password!</h6>
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
