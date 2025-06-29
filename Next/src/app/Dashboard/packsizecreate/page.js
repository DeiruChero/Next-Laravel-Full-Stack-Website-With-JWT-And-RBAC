'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function PackSizeCreate() {
    const [packSizeName, setPackSizeName] = useState('');
    const [facter, setFacter] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!packSizeName.trim() || !facter.trim()) {
            setErrorMsg('All fields are required.');
            setSuccessMsg('');
            return;
        }

        try {
            await api.post('packsize-store', {
                PackSizeName: packSizeName,
                Facter: parseFloat(facter),
            });

            setSuccessMsg('Pack Size created successfully! 🎉');
            setErrorMsg('');
            setPackSizeName('');
            setFacter('');
        } catch (error) {
            console.error('Error creating pack size:', error);
            setErrorMsg('Failed to create pack size. Please try again.');
            setSuccessMsg('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Create New Pack Size</h2>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                <div className="mb-3">
                    <label className="form-label">
                        Pack Size Name <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={packSizeName}
                        onChange={(e) => setPackSizeName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        Facter <span className="text-danger">*</span>
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={facter}
                        onChange={(e) => setFacter(e.target.value)}
                        required
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
                    {loading ? ' Creating...' : 'Create Pack Size'}
                </button>
            </form>
        </div>
    );
}
