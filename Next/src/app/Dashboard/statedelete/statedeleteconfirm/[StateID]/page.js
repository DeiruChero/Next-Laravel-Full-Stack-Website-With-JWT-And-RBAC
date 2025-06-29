'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function StateDelete({ params }) {
    const [stateName, setStateName] = useState('');
    const [stateType, setStateType] = useState('');
    const [countryName, setCountryName] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter();
    const StateID = params.StateID;

    useEffect(() => {
        if (!StateID) return;

        const fetchState = async () => {
            try {
                const res = await api.get(`/state-show/${StateID}`);
                const state = res.data;

                setStateName(state.StateName || '');
                setStateType(state.StateType || '');
                setCountryName(state.country?.CountryName || '');
            } catch (error) {
                console.error('Error fetching state data:', error);
                setErrorMsg('Failed to load state data.');
            }
        };

        fetchState();
    }, [StateID]);

    const handleDelete = async () => {
        try {
            await api.delete(`/state-delete/${StateID}`);
            setSuccessMsg('State deleted successfully! 🎉');
            setErrorMsg('');
            setTimeout(() => router.push('/Dashboard/statedelete'), 1500);
        } catch (error) {
            console.error('Error deleting state:', error);
            setErrorMsg('Failed to delete state. Please try again.');
            setSuccessMsg('');
        }
    };

    const handleCancel = () => {
        router.push('/Dashboard/statedelete');
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4 text-danger">Delete State</h2>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <div className="shadow p-4 rounded bg-light">
                <div className="row">
                    <div className="mb-3 col-md-4">
                        <label className='form-label fw-bold'>State Name</label>
                        <input type='text' className='form-control' value={stateName} disabled/>
                    </div>
                    <div className="mb-3 col-md-4">
                        <label className='form-label fw-bold'>State Type</label>
                        <input type='text' className='form-control' value={stateType=='S'? 'State' : 'Union Territory'} disabled/>
                    </div>
                    <div className="mb-3 col-md-4">
                        <label className='form-label fw-bold'>Country Name</label>
                        <input type='text' className='form-control' value={countryName} disabled/>
                    </div>
                </div>

                <button className="btn btn-danger w-100 mb-3" onClick={handleDelete}>
                    Delete State
                </button>
                <button className="btn btn-secondary w-100" onClick={handleCancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
}
