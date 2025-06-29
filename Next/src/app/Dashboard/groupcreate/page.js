'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function GroupCreate() {
    const [groupName, setGroupName] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!groupName.trim()) {
            setErrorMsg('Group Name is required.');
            setSuccessMsg('');
            return;
        }

        try {
            await api.post('group-store', {
                GroupName: groupName,
            });

            setSuccessMsg('Product Group created successfully! 🎉');
            setErrorMsg('');
            setGroupName('');
        } catch (error) {
            console.error('Error creating product group:', error);
            setErrorMsg('Failed to create product group. Please try again.');
            setSuccessMsg('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Create Product Group</h2>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                <div className="mb-3">
                    <label className="form-label">
                        Group Name <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
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
                    {loading ? ' Creating...' : 'Create Product Group'}
                </button>
            </form>
        </div>
    );
}
