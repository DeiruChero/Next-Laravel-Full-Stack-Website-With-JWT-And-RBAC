'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';

export default function DeliveryBoyCreate() {

    const [formData, setFormData] = useState({
        DeliveryBoyName: '',
        Email: '',
        Mobile: '',
        password_confirmation: '',
        Password: '',
        Gender: '',
        DateofBirth: '',
        DateJoined: '',
        Salary: '',
        Address: '',
        Area: '',
        City: '',
        State: '',
        PinCode: '',
    });

    const [cities, setCities] = useState([]);
    const [states, setStates] = useState([]);
    const [areas, setAreas] = useState([]);
    const [cityID, setCityID] = useState('');
    const [areaID, setAreaID] = useState('');
    const [stateID, setStateID] = useState('');
    const [errors, setErrors] = useState({});
    const [successMsg, setSuccessMsg] = useState('');
    const [loadingRules, setLoadingRules] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get("area-data")
            .then((res) => {
                setAreas(res.data.data);
            })
            .catch((err) => console.error("Failed to fetch areas:", err));
    }, [])

    useEffect(() => {
        api.get("state-data")
            .then((res) => {
                setStates(res.data.data);
            })
            .catch((err) => console.error("Failed to fetch states:", err));
    }, [])

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCityBlur = () => {
        const match = cities.find(
            city => city.CityName.trim().toLowerCase() === formData.City.trim().toLowerCase()
        );
        setCityID(match?.CityID || '');
    };

    const handleStateBlur = () => {
        const match = states.find(
            state => state.StateName.trim().toLowerCase() === formData.State.trim().toLowerCase()
        );
        setStateID(match?.StateID || '');
    }

    const handleAreaBlur = () => {
        const match = areas.find(
            area => area.AreaName.trim().toLowerCase() === formData.Area.trim().toLowerCase()
        );
        setAreaID(match?.AreaID || '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSuccessMsg('');

        if (!/^\d{10}$/.test(formData.Mobile)) {
            setErrors({ Mobile: ['Mobile number must be exactly 10 digits.'] });
            setSuccessMsg('');
            return;
        }

        if (!/^\d{6}$/.test(formData.PinCode)) {
            setErrors({ PinCode: ['Pincode must be exactly 6 digits.'] });
            setSuccessMsg('');
            return;
        }

        if (formData.Password.length < 6) {
            setErrors({ Password: ['Password must be at least 6 characters long.'] });
            setSuccessMsg('');
            return;
        }

        if (formData.Password !== formData.password_confirmation) {
            setErrors({ Password: ['Password and Confirm Password must be same.'] }, { password_confirmation: ['Password and Confirm Password must be same.'] });
            setSuccessMsg('');
            return;
        }

        if (!areaID) {
            setErrors({ areaID: ['Please select a valid area from the list.'] });
            setSuccessMsg('');
            return;
        }

        if (!cityID) {
            setErrors({ cityID: ['Please select a valid city from the list.'] });
            setSuccessMsg('');
            return;
        }

        if (!stateID) {
            setErrors({ stateID: ['Please select a valid state from the list.'] });
            setSuccessMsg('');
            return;
        }

        try {
            await api.post(
                'deliveryboy-store',
                {
                    ...formData,
                },
                {
                    headers: {
                        Accept: 'application/json',
                    },
                    withCredentials: true,
                }
            );

            setSuccessMsg('Delivery Boy created successfully! 🎉');
            setFormData({
                DeliveryBoyName: '',
                Email: '',
                Mobile: '',
                password_confirmation: '',
                Password: '',
                Gender: '',
                DateofBirth: '',
                DateJoined: '',
                Salary: '',
                Address: '',
                Area: '',
                City: '',
                State: '',
                PinCode: '',
            });
            setErrors({});
            setSuccessMsg('Delivery Boy Created Successfully 🎉');
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                console.error('Registration error:', err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ marginTop: '50px' }}>
            <h2 className="text-center mb-4 text-primary">Create Delivery Boy</h2>

            {typeof errors === 'string' && (
                <div className="alert alert-danger">{errors}</div>
            )}

            {typeof errors === 'object' && Object.keys(errors).length > 0 && (
                <div className="alert alert-danger">
                    <ul className="mb-0">
                        {Object.entries(errors).map(([field, msgs], index) => (
                            <li key={index}>{Array.isArray(msgs) ? msgs[0] : msgs}</li>
                        ))}
                    </ul>
                </div>
            )}
            {successMsg && <div className="alert alert-success">{successMsg}</div>}

            <div className="card shadow-lg bg-light">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Delivery Boy Name <span className='text-danger'>*</span></label>
                            <input
                                type="text"
                                className='form-control'
                                name="DeliveryBoyName"
                                value={formData.DeliveryBoyName}
                                onChange={handleChange}
                                placeholder="Enter Delivery Boy Name"
                                required
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Mobile <span className='text-danger'>*</span></label>
                                <input
                                    type="tel"
                                    className={`form-control ${errors.Mobile ? 'is-invalid' : ''}`}
                                    name="Mobile"
                                    value={formData.Mobile}
                                    required
                                    onChange={(e) => {
                                        const input = e.target.value;
                                        if (/^\d{0,10}$/.test(input)) {
                                            setFormData({ ...formData, Mobile: input });
                                        }
                                    }}
                                    placeholder="Enter mobile number"
                                />
                                {errors.Mobile && <div className="invalid-feedback">{errors.Mobile[0]}</div>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className='form-label fw-bold'>Gender <span className='text-danger'>*</span></label>
                                <select className="form-select" name="Gender" value={formData.Gender} onChange={handleChange} required>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label fw-bold">Email <span className='text-danger'>*</span></label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="Email"
                                    value={formData.Email}
                                    onChange={handleChange}
                                    placeholder="Enter email"
                                    required
                                />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label className='form-label fw-bold'>Salary <span className='text-danger'>*</span></label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="Salary"
                                    value={formData.Salary}
                                    onChange={handleChange}
                                    placeholder="Enter salary"
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label fw-bold">Date of Birth <span className='text-danger'>*</span></label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="DateofBirth"
                                    value={formData.DateofBirth}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label fw-bold">Date Joined <span className='text-danger'>*</span></label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="DateJoined"
                                    value={formData.DateJoined}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className='mb-3'>
                            <label className='form-label fw-bold'>Address <span className='text-danger'>*</span></label>
                            <textarea className="form-control" name="Address" value={formData.Address} onChange={handleChange} required placeholder='Branch Address'></textarea>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label fw-bold">
                                    Area Name <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    list="area-options"
                                    name="Area"
                                    value={formData.Area}
                                    onChange={handleChange}
                                    onBlur={handleAreaBlur}
                                    placeholder="Select an Area"
                                    required
                                />
                                <datalist id="area-options">
                                    {areas.map(area => (
                                        <option key={area.AreaID} value={area.AreaName} />
                                    ))}
                                </datalist>
                            </div>
                            <div className="mb-3 col-md-6">
                                <label className="form-label fw-bold">
                                    City Name <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    list="city-options"
                                    name="City"
                                    value={formData.City}
                                    onChange={handleChange}
                                    onBlur={handleCityBlur}
                                    placeholder="Select a city"
                                    required
                                />
                                <datalist id="city-options">
                                    {cities.map(city => (
                                        <option key={city.CityID} value={city.CityName} />
                                    ))}
                                </datalist>
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label fw-bold">
                                    State Name <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    list="state-options"
                                    name="State"
                                    value={formData.State}
                                    onChange={handleChange}
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
                            <div className="mb-3 col-md-6">
                                <label className="form-label fw-bold">
                                    Pincode <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.PinCode ? 'is-invalid' : ''}`}
                                    name="PinCode"
                                    value={formData.PinCode}
                                    placeholder="Enter 6-digit pincode"
                                    onChange={(e) => {
                                        const input = e.target.value;
                                        if (/^\d{0,6}$/.test(input)) {
                                            setFormData({ ...formData, PinCode: input });
                                        }
                                    }}
                                    required
                                />
                                {errors.PinCode && <div className="invalid-feedback">{errors.PinCode[0]}</div>}
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Password <span className='text-danger'>*</span></label>
                                <input
                                    type="password"
                                    className={`form-control ${errors.Password ? 'is-invalid' : ''}`}
                                    name="Password"
                                    value={formData.Password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                    required
                                />
                                {errors.Password && <div className="invalid-feedback">{errors.Password[0]}</div>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Confirm Password <span className='text-danger'>*</span></label>
                                <input
                                    type="password"
                                    className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    placeholder="Confirm password"
                                    required
                                />
                                {errors.password_confirmation && (
                                    <div className="invalid-feedback">{errors.password_confirmation[0]}</div>
                                )}
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
                            {loading ? ' Creating...' : 'Create Delivery Boy'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
