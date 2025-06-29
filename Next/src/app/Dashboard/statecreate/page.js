'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export default function StateCreate() {
    const [stateName, setStateName] = useState('');
    const [stateType, setStateType] = useState('');

    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!stateName.trim()) {
            setErrorMsg('State Name is required.');
            setSuccessMsg('');
            return;
        }

        try {
            await api.post('/state-store', {
                StateName: stateName,
                StateType: stateType
            });

            setSuccessMsg('State created successfully! 🎉');
            setErrorMsg('');
            setStateName('');
            setStateType('');
        } catch (error) {
            console.error('Error creating state:', error);
            setErrorMsg('Failed to create state. Please try again.');
            setSuccessMsg('');
        } finally{
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Create New State</h2>

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
                        <label className='form-label'>State Type<span className='text-danger'> *</span></label>
                        <select className='form-control' required value={stateType} onChange={(e) => setStateType(e.target.value)}>
                            <option value="">Select State Type</option>
                            <option value="U">Union Territory</option>
                            <option value="S">State</option>
                        </select>
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
                    {loading ? ' Creating...' : 'Create State'}
                </button>
            </form>
        </div>
    );
}
