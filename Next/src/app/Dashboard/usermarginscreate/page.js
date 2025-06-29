'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function UserMarginsCreate() {
    const [userType, setUserType] = useState('');
    const [marginPercentage, setMarginPercentage] = useState('');
    const [transportationCharges, setTransportationCharges] = useState('');
    const [labourCharges, setLabourCharges] = useState('');
    const [barcodeCharges, setBarcodeCharges] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('margin-store', {
                UserType: userType,
                MarginPercentage: marginPercentage,
                TransportationCharges: transportationCharges,
                LabourCharges: labourCharges,
                BarcodeCharges: barcodeCharges,
            });

            setErrorMsg('');
            setUserType('');
            setMarginPercentage('');
            setTransportationCharges('');
            setLabourCharges('');
            setBarcodeCharges('');
            setSuccessMsg('User Type Margin created successfully! 🎉');
        } catch (error) {
            console.error('Error creating margin:', error);
            setErrorMsg('Failed to create margin. Please try again.');
            setSuccessMsg('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Create New User Type Margin</h2>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                <div className="row">
                    <div className="mb-3 col-md-8">
                        <label className="form-label fw-bold">
                            User Type <span className="text-danger">*</span>
                        </label>
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
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading && (
                        <span
                            className="spinner-border spinner-border-sm text-light"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    )}
                    {loading ? ' Creating...' : 'Create Margin'}
                </button>
            </form>
        </div>
    );
}
