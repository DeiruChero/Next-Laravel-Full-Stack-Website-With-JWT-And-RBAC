'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function UserMarginsDelete({ params }) {
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

        const fetchUserMargin = async () => {
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
                setError('Failed to load user margin data.');
                console.error(err);
                setLoading(false);
            }
        };

        fetchUserMargin();
    }, [UserTypeMarginPercentageID]);

    const handleDelete = async () => {
        try {
            await api.delete(`margin-delete/${UserTypeMarginPercentageID}`);
            router.push('/Dashboard/usermarginsdelete');
        } catch (err) {
            setError('Failed to delete user margin.');
            console.error(err.response?.data || err.message);
        }
    };

    const handleCancel = () => {
        router.push('/Dashboard/usermarginsdelete');
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4 text-danger">Delete User Margin</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="shadow p-4 rounded bg-white">
                <p>Are you sure you want to delete the following <span className='text-danger'>user margin</span>?</p>

                <div className="row">
                    <div className="mb-3 col-md-8">
                        <label className="form-label fw-bold">User Type</label>
                        <input type="text" className="form-control" value={userType} disabled />
                    </div>
                    <div className="mb-3 col-md-4">
                        <label className="form-label fw-bold">Margin Percentage</label>
                        <input type="text" className="form-control" value={marginPercentage} disabled />
                    </div>
                </div>
                <div className="row">
                    <div className="mb-3 col-md-4">
                        <label className="form-label fw-bold">Transportation Charges</label>
                        <input type="text" className="form-control" value={transportationCharges} disabled />
                    </div>
                    <div className="mb-3 col-md-4">
                        <label className="form-label fw-bold">Labour Charges</label>
                        <input type="text" className="form-control" value={labourCharges} disabled />
                    </div>
                    <div className="mb-3 col-md-4">
                        <label className="form-label fw-bold">Barcode Charges</label>
                        <input type="text" className="form-control" value={barcodeCharges} disabled />
                    </div>
                </div>

                <button onClick={handleDelete} className="btn btn-danger w-100 mb-3">
                    Confirm Delete
                </button>
                <button onClick={handleCancel} className="btn btn-secondary w-100">
                    Cancel
                </button>
            </div>
        </div>
    );
}
