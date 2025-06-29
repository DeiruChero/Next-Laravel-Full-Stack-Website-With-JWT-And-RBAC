'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function UserMarginsEdit({ params }) {
    const UserTypeMarginPercentageID = params.UserTypeMarginPercentageID;
    const router = useRouter();

    const [userType, setUserType] = useState('');
    const [marginPercentage, setMarginPercentage] = useState('');
    const [transportationCharges, setTransportationCharges] = useState('');
    const [labourCharges, setLabourCharges] = useState('');
    const [barcodeCharges, setBarcodeCharges] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!UserTypeMarginPercentageID) return;

        const fetchUserMargins = async () => {
            try {
                const res = await api.get(`margin-show/${UserTypeMarginPercentageID}`);
                const margin = res.data;

                setUserType(margin.UserType);
                setMarginPercentage(margin.MarginPercentage);
                setTransportationCharges(margin.TransportationCharges);
                setLabourCharges(margin.LabourCharges);
                setBarcodeCharges(margin.BarcodeCharges);
                setLoading(false);
            } catch (err) {
                setError('Failed to load the margin data.');
                console.error(err);
                setLoading(false);
            }
        };

        fetchUserMargins();
    }, [UserTypeMarginPercentageID]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`margin-update/${UserTypeMarginPercentageID}`, {
                UserType: userType,
                MarginPercentage: marginPercentage,
                TransportationCharges: transportationCharges,
                LabourCharges: labourCharges,
                BarcodeCharges: barcodeCharges
            });
            router.push('/Dashboard/usermarginsedit');
        } catch (err) {
            setError('Failed to update user margin.');
            console.error(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/Dashboard/usermarginsedit');
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Edit User Margin</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
                <div className="row">
                    <div className="mb-3 col-md-8">
                        <label className="form-label fw-bold">User Type <span className='text-danger'>*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3 col-md-4">
                        <label className="form-label fw-bold">
                            Margin (%) <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={marginPercentage}
                            onChange={(e) => {
                                const input = e.target.value;
                                if (input >= 0 && input <= 100) {
                                    setMarginPercentage(input);
                                }
                            }}
                            required
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="mb-3 col-md-4">
                        <label className="form-label fw-bold">
                            Transportation Charges (₹) <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={transportationCharges}
                            onChange={(e) => {
                                const input = e.target.value;
                                if (input >= 0) {
                                    setTransportationCharges(input);
                                }
                            }}
                            required
                        />
                    </div>

                    <div className="mb-3 col-md-4">
                        <label className="form-label fw-bold">
                            Labour Charges (₹) <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={labourCharges}
                            onChange={(e) => {
                                const input = e.target.value;
                                if (input >= 0) {
                                    setLabourCharges(input);
                                }
                            }}
                            required
                        />
                    </div>

                    <div className="mb-3 col-md-4">
                        <label className="form-label fw-bold">
                            Barcode Charges (₹) <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={barcodeCharges}
                            onChange={(e) => {
                                const input = e.target.value;
                                if (input >= 0) {
                                    setBarcodeCharges(input);
                                }
                            }}
                            required
                        />
                    </div>
                </div>
                <button type="submit" className="btn btn-success w-100 mb-3" disabled={loading}>
                    {loading && (
                        <span
                            className="spinner-border spinner-border-sm text-light"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    )}
                    {loading ? ' Updating...' : 'Update Margin'}
                </button>
                <button type="button" className="btn btn-secondary w-100" onClick={handleCancel}>
                    Cancel
                </button>
            </form>
        </div>
    );
}
