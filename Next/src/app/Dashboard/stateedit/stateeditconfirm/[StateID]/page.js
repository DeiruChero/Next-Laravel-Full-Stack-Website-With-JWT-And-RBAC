'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function StateEdit({ params }) {
    const [stateName, setStateName] = useState('');
    const [stateType, setStateType] = useState('');
    const [loading, setLoading] = useState(false);

    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const router = useRouter();
    const { StateID } = params;

    useEffect(() => {
        if (!StateID) return;

        const fetchState = async () => {
            try {
                const res = await api.get(`/state-show/${StateID}`);
                const state = res.data;

                setStateName(state.StateName || '');
                setStateType(state.StateType || '');
            } catch (error) {
                console.error('Error fetching state data:', error);
                setErrorMsg('Failed to load state data.');
            }
        };

        fetchState();
    }, [StateID]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!stateName.trim()) {
            setErrorMsg('State Name is required.');
            setSuccessMsg('');
            return;
        }

        try {
            await api.put(`/state-update/${StateID}`, {
                StateName: stateName,
                StateType: stateType
            });

            setSuccessMsg('State updated successfully! 🎉');
            setErrorMsg('');
            setTimeout(() => router.push('/Dashboard/stateedit'), 1500);
        } catch (error) {
            console.error('Error updating state:', error);
            setErrorMsg('Failed to update state. Please try again.');
            setSuccessMsg('');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/Dashboard/stateedit');
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Edit State</h2>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label className="form-label">
                            State Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={stateName}
                            onChange={(e) => setStateName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3 col-md-6">
                        <label className="form-label">
                            State Type <span className="text-danger">*</span>
                        </label>
                        <select
                            className="form-control"
                            value={stateType}
                            onChange={(e) => setStateType(e.target.value)}
                            required
                        >
                            <option value="">Select State Type</option>
                            <option value="U">Union Territory</option>
                            <option value="S">State</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="btn btn-warning w-100 mb-4" disabled={loading}>
                    {loading && (
                        <span
                            className="spinner-border spinner-border-sm text-light"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    )}
                    {loading ? ' Updating...' : 'Update State'}
                </button>
                <button type="button" className="btn btn-secondary w-100" onClick={handleCancel}>
                    Cancel
                </button>
            </form>
        </div>
    );
}
