'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export default function CityCreate() {
    const [cityName, setCityName] = useState('');
    const [stateName, setStateName] = useState('');
    const [stateID, setStateID] = useState('');
    const [states, setStates] = useState([]);
    const [loading, setLoading] = useState(false);

    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const res = await api.get('/state-data');
                setStates(res.data.data);
            } catch (error) {
                console.error('Error fetching states:', error);
            }
        };

        fetchStates();
    }, []);

    const handleStateBlur = () => {
        const match = states.find(
            state => state.StateName.trim().toLowerCase() === stateName.trim().toLowerCase()
        );
        setStateID(match?.StateID || '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!cityName.trim()) {
            setErrorMsg('City Name is required.');
            setSuccessMsg('');
            return;
        }

        if (!stateID) {
            setErrorMsg('Please select a valid state from the list.');
            setSuccessMsg('');
            return;
        }

        try {
            await api.post('/city-store', {
                CityName: cityName,
                StateID: stateID,
            });

            setSuccessMsg('City created successfully! 🎉');
            setErrorMsg('');
            setCityName('');
            setStateName('');
            setStateID('');
        } catch (error) {
            console.error('Error creating city:', error);
            setErrorMsg('Failed to create city. Please try again.');
            setSuccessMsg('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Create New City</h2>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                {/* City Name Field */}
                <div className="mb-3">
                    <label className="form-label">
                        City Name <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                        required
                    />
                </div>

                {/* State Name Input with Datalist */}
                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label className="form-label">
                            State Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            list="state-options"
                            value={stateName}
                            onChange={(e) => setStateName(e.target.value)}
                            onBlur={handleStateBlur}
                            placeholder="Select a state"
                            required
                        />
                        <datalist id="state-options">
                            {states.map(state => (
                                <option key={state.StateID} value={state.StateName} />
                            ))}
                        </datalist>
                    </div>

                    {/* Selected State (Display only) */}
                    <div className="mb-3 col-md-6">
                        <label className="form-label">Selected State</label>
                        <input
                            type="text"
                            className="form-control"
                            value={stateName}
                            disabled
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-success w-100" disabled={loading}>
                    {loading && (
                        <span
                            className="spinner-border spinner-border-sm text-light"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    )}
                    {loading ? ' Creating...' : 'Create City'}
                </button>
            </form>
        </div>
    );
}
