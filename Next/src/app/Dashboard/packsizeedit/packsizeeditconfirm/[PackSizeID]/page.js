'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function PackSizeEdit({ params }) {
    const router = useRouter();
    const packSizeID = params.PackSizeID;

    const [packSizeName, setPackSizeName] = useState('');
    const [facter, setFacter] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!packSizeID) return;

        const fetchPackSize = async () => {
            try {
                const res = await api.get(`packsize-show/${packSizeID}`);
                const data = res.data;

                setPackSizeName(data.PackSizeName || '');
                setFacter(data.Facter || '');
                setLoading(false);
            } catch (err) {
                setError('Failed to load pack size data.');
                console.error(err);
                setLoading(false);
            }
        };

        fetchPackSize();
    }, [packSizeID]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`packsize-update/${packSizeID}`, {
                PackSizeName: packSizeName,
                Facter: facter,
            });
            router.push('/Dashboard/packsizeedit');
        } catch (err) {
            setError('Failed to update pack size.');
            console.error(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/Dashboard/packsizeedit');
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
            <h2 className="text-center mb-4 text-primary">Edit Pack Size</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light border">
                <div className="mb-3">
                    <label className="form-label fw-semibold">Pack Size Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={packSizeName}
                        onChange={(e) => setPackSizeName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="form-label fw-semibold">Facter</label>
                    <input
                        type="number"
                        className="form-control"
                        value={facter}
                        onChange={(e) => setFacter(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-success w-100 mb-2" disabled={loading}>
                    {loading && (
                        <span
                            className="spinner-border spinner-border-sm text-light"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    )}
                    {loading ? ' Updating...' : 'Update Pack Size'}
                </button>
                <button type="button" className="btn btn-secondary w-100" onClick={handleCancel}>
                    Cancel
                </button>
            </form>
        </div>
    );
}
