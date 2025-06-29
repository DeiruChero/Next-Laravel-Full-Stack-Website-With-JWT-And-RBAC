'use client';

import { useState } from 'react';
import api from '@/lib/axios';

export default function DesignationCreate() {
    const [designationName, setDesignationName] = useState('');
    const [remark, setRemark] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!designationName.trim()) {
            setErrorMsg('Designation Name is required.');
            setSuccessMsg('');
            return;
        }

        try {
            await api.post('designation-store', {
                DesignationName: designationName,
                Remark: remark,
            });

            setSuccessMsg('Designation created successfully! 🎉');
            setErrorMsg('');
            setDesignationName('');
            setRemark('');
        } catch (error) {
            console.error('Error creating designation:', error);
            setErrorMsg('Failed to create designation. Please try again.');
            setSuccessMsg('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Create New Designation</h2>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                <div className="mb-3">
                    <label className="form-label">
                        Designation Name <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={designationName}
                        onChange={(e) => setDesignationName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        Remark
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading && (
                        <span
                            className="spinner-border spinner-border-sm text-light"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    )}
                    {loading ? ' Creating...' : 'Create Designation'}
                </button>
            </form>
        </div>
    );
}
