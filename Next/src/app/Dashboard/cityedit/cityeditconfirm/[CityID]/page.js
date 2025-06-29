'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function CityEdit({ params }) {
    const [cityName, setCityName] = useState('');
    const [stateName, setStateName] = useState('');
    const [stateID, setStateID] = useState('');
    const [states, setStates] = useState([]);
    const [loading, setLoading] = useState(false);

    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const router = useRouter();
    const CityID = params.CityID;

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

    useEffect(() => {
        if (!CityID) return;

        const fetchCity = async () => {
            try {
                const res = await api.get(`/city-show/${CityID}`);
                const city = res.data;

                setCityName(city.CityName || '');
                setStateID(city.StateID || '');
                setStateName(city.state?.StateName || '');
            } catch (error) {
                console.error('Error fetching city data:', error);
                setErrorMsg('Failed to load city data.');
            }
        };

        fetchCity();
    }, [CityID]);

    const handleStateBlur = () => {
        const matchedState = states.find(
            (state) => state.StateName.trim().toLowerCase() === stateName.trim().toLowerCase()
        );
        setStateID(matchedState ? matchedState.StateID : '');
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
            await api.put(`/city-update/${CityID}`, {
                CityName: cityName,
                StateID: stateID,
            });

            setSuccessMsg('City updated successfully! 🎉');
            setErrorMsg('');
            setTimeout(() => router.push('/Dashboard/cityedit'), 1500);
        } catch (error) {
            console.error('Error updating city:', error);
            setErrorMsg('Failed to update city. Please try again.');
            setSuccessMsg('');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/Dashboard/cityedit');
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Edit City</h2>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
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
                            {states.map((state) => (
                                <option key={state.StateID} value={state.StateName} />
                            ))}
                        </datalist>
                    </div>

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

                <button type="submit" className="btn btn-primary w-100 mb-4" disabled={loading}>
                    {loading && (
                        <span
                            className="spinner-border spinner-border-sm text-light"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    )}
                    {loading ? ' Updating...' : 'Update City'}
                </button>
                <button type="button" className="btn btn-secondary w-100" onClick={handleCancel}>
                    Cancel
                </button>
            </form>
        </div>
    );
}
