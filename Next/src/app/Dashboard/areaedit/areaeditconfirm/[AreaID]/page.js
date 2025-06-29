'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';

export default function AreaEdit({ params }) {
    const [areaName, setAreaName] = useState('');
    const [cityName, setCityName] = useState('');
    const [cityID, setCityID] = useState('');
    const [pincode, setPincode] = useState('');
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);

    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const router = useRouter();
    const searchParams = useSearchParams();
    const AreaID = params.AreaID;

    // Fetch cities first
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await api.get('/city-data');
                setCities(res.data.data);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };
        fetchCities();
    }, []);

    useEffect(() => {
        if (!AreaID) return;

        const fetchArea = async () => {
            try {
                const res = await api.get(`/area-show/${AreaID}`);
                const area = res.data;

                setAreaName(area.AreaName || '');
                setCityID(area.CityID || '');
                setPincode(area.PinCode || '');
                setCityName(area.city?.CityName || '');
            } catch (error) {
                console.error('Error fetching area data:', error);
                setErrorMsg('Failed to load area data.');
            }
        };

        fetchArea();
    }, [AreaID]);

    const handleCityBlur = () => {
        const matchedCity = cities.find(
            (city) => city.CityName.trim().toLowerCase() === cityName.trim().toLowerCase()
        );
        setCityID(matchedCity ? matchedCity.CityID : '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!areaName.trim()) {
            setErrorMsg('Area Name is required.');
            setSuccessMsg('');
            return;
        }

        if (!/^\d{6}$/.test(pincode)) {
            setErrorMsg('Pincode must be exactly 6 digits.');
            setSuccessMsg('');
            return;
        }

        if (!cityID) {
            setErrorMsg('Please select a valid city from the list.');
            setSuccessMsg('');
            return;
        }

        try {
            await api.put(`area-update/${AreaID}`, {
                AreaName: areaName,
                CityID: cityID,
                Pincode: pincode,
            });

            setSuccessMsg('Area updated successfully! 🎉');
            setErrorMsg('');
            setTimeout(() => router.push('/Dashboard/areaedit'), 1500);
        } catch (error) {
            console.error('Error updating area:', error);
            setErrorMsg('Failed to update area. Please try again.');
            setSuccessMsg('');
        } finally {
            setLoading(false);
        }
    };

    function handleCancel() {
        router.push('/Dashboard/areaedit');
    }
    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Edit Area</h2>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label className="form-label">
                            Area Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={areaName}
                            onChange={(e) => setAreaName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3 col-md-6">
                        <label className="form-label">
                            Pincode <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={pincode}
                            placeholder="Enter 6-digit pincode"
                            onChange={(e) => {
                                const input = e.target.value;
                                if (/^\d{0,6}$/.test(input)) {
                                    setPincode(input);
                                }
                            }}
                            required
                        />
                    </div>

                    <div className="mb-3 col-md-6">
                        <label className="form-label">
                            City Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            list="city-options"
                            value={cityName}
                            onChange={(e) => setCityName(e.target.value)}
                            onBlur={handleCityBlur}
                            placeholder="Select a city"
                            required
                        />
                        <datalist id="city-options">
                            {cities.map((city) => (
                                <option key={city.CityID} value={city.CityName} />
                            ))}
                        </datalist>
                    </div>

                    <div className="mb-3 col-md-6">
                        <label className="form-label">Selected City</label>
                        <input type="text" className="form-control" value={cityName} disabled />
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
                    {loading ? ' Updating...' : 'Update Area'}
                </button>
                <button className='btn btn-secondary w-100' type='button' onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    );
}
