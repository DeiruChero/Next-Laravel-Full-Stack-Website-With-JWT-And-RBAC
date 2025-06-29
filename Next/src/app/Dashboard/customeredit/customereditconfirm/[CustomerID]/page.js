'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function CustomerUpdate({ params }) {
    const CustomerID = params.CustomerID;
    const router = useRouter();

    const [formData, setFormData] = useState({
        CustomerName: '',
        Email: '',
        Mobile: '',
        WhatsApp: '',
        Address: '',
        Area: '',
        City: '',
        State: '',
        PinCode: '',
        Country: 'India',
        IsUnderDistributor: false,
    });

    const [cities, setCities] = useState([]);
    const [states, setStates] = useState([]);
    const [areas, setAreas] = useState([]);
    const [cityID, setCityID] = useState('');
    const [areaID, setAreaID] = useState('');
    const [stateID, setStateID] = useState('');
    const [errors, setErrors] = useState({});
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!CustomerID) return;

        const fetchCustomer = async () => {
            try {
                const res = await api.get(`customer-show/${CustomerID}`);
                const customer = res.data;

                setFormData({
                    CustomerName: customer.CustomerName || '',
                    Email: customer.Email || '',
                    Mobile: customer.Mobile || '',
                    WhatsApp: customer.WhatsApp || '',
                    Address: customer.Address || '',
                    Area: customer.Area || '',
                    City: customer.City || '',
                    State: customer.State || '',
                    PinCode: customer.PinCode || '',
                    Country: customer.Country || 'India',
                    IsUnderDistributor: customer.IsUnderDistributor || false,
                });
                setLoading(false);
            } catch (err) {
                setErrors("Failed to load customer data.");
                console.error(err);
                setLoading(false);
            }
        };

        fetchCustomer();
    }, [CustomerID]);

    useEffect(() => {
        api.get("area-data").then((res) => setAreas(res.data.data)).catch((err) => console.error(err));
        api.get("state-data").then((res) => setStates(res.data.data)).catch((err) => console.error(err));
        api.get("/city-data").then((res) => setCities(res.data.data)).catch((err) => console.error(err));
    }, []);

    const handleCancel = () => router.push('/Dashboard/customeredit');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCityBlur = () => {
        const match = cities.find(city => city.CityName.trim().toLowerCase() === formData.City.trim().toLowerCase());
        setCityID(match?.CityID || '');
    };

    const handleStateBlur = () => {
        const match = states.find(state => state.StateName.trim().toLowerCase() === formData.State.trim().toLowerCase());
        setStateID(match?.StateID || '');
    };

    const handleAreaBlur = () => {
        const match = areas.find(area => area.AreaName.trim().toLowerCase() === formData.Area.trim().toLowerCase());
        setAreaID(match?.AreaID || '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSuccessMsg('');

        if (!/^\d{10}$/.test(formData.Mobile)) {
            setErrors({ Mobile: ['Mobile number must be exactly 10 digits.'] });
            return;
        }

        if (!/^\d{10}$/.test(formData.WhatsApp)) {
            setErrors({ WhatsApp: ['WhatsApp number must be exactly 10 digits.'] });
            return;
        }

        if (!/^\d{6}$/.test(formData.PinCode)) {
            setErrors({ PinCode: ['Pincode must be exactly 6 digits.'] });
            return;
        }

        if (!areaID) {
            setErrors({ areaID: ['Please select a valid area from the list.'] });
            return;
        }

        if (!cityID) {
            setErrors({ cityID: ['Please select a valid city from the list.'] });
            return;
        }

        if (!stateID) {
            setErrors({ stateID: ['Please select a valid state from the list.'] });
            return;
        }

        try {
            await api.put(
                `customer-update/${CustomerID}`,
                { ...formData },
                {
                    headers: { Accept: 'application/json' },
                    withCredentials: true,
                }
            );

            setSuccessMsg('Customer Updated Successfully 🎉');
            router.push('/Dashboard/customeredit');
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                console.error('Update error:', err);
            }
        } finally {
            setLoading(false);
        }
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
            <h2 className="text-center mb-4 text-warning">Edit Customer</h2>

            {typeof errors === 'string' && <div className="alert alert-danger">{errors}</div>}
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
                            <label className="form-label fw-bold">Customer Name <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" name="CustomerName" value={formData.CustomerName} onChange={handleChange} required />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Address *</label>
                            <textarea className="form-control" name="Address" value={formData.Address} onChange={handleChange} required />
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Mobile *</label>
                                <input type="tel" className={`form-control ${errors.Mobile ? 'is-invalid' : ''}`} name="Mobile" value={formData.Mobile}
                                    onChange={(e) => {
                                        const input = e.target.value;
                                        if (/^\d{0,10}$/.test(input)) {
                                            setFormData({ ...formData, Mobile: input });
                                        }
                                    }}
                                    required />
                                {errors.Mobile && <div className="invalid-feedback">{errors.Mobile[0]}</div>}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">WhatsApp *</label>
                                <input type="tel" className={`form-control ${errors.WhatsApp ? 'is-invalid' : ''}`} name="WhatsApp" value={formData.WhatsApp}
                                    onChange={(e) => {
                                        const input = e.target.value;
                                        if (/^\d{0,10}$/.test(input)) {
                                            setFormData({ ...formData, WhatsApp: input });
                                        }
                                    }}
                                    required />
                                {errors.WhatsApp && <div className="invalid-feedback">{errors.WhatsApp[0]}</div>}
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label fw-bold">Email *</label>
                                <input type="email" className="form-control" name="Email" value={formData.Email} onChange={handleChange} required />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label fw-bold">Area *</label>
                                <input type="text" className={`form-control ${errors.areaID ? 'is-invalid' : ''}`} list="area-options" name="Area" value={formData.Area}
                                    onChange={handleChange} onBlur={handleAreaBlur} required />
                                <datalist id="area-options">
                                    {areas.map(area => (
                                        <option key={area.AreaID} value={area.AreaName} />
                                    ))}
                                </datalist>
                                {errors.areaID && <div className="invalid-feedback">{errors.areaID[0]}</div>}
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label fw-bold">City *</label>
                                <input type="text" className={`form-control ${errors.cityID ? 'is-invalid' : ''}`} list="city-options" name="City" value={formData.City}
                                    onChange={handleChange} onBlur={handleCityBlur} required />
                                <datalist id="city-options">
                                    {cities.map(city => (
                                        <option key={city.CityID} value={city.CityName} />
                                    ))}
                                </datalist>
                                {errors.cityID && <div className="invalid-feedback">{errors.cityID[0]}</div>}
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label fw-bold">State *</label>
                                <input type="text" className={`form-control ${errors.stateID ? 'is-invalid' : ''}`} list="state-options" name="State" value={formData.State}
                                    onChange={handleChange} onBlur={handleStateBlur} required />
                                <datalist id="state-options">
                                    {states.map(state => (
                                        <option key={state.StateID} value={state.StateName} />
                                    ))}
                                </datalist>
                                {errors.stateID && <div className="invalid-feedback">{errors.stateID[0]}</div>}
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label fw-bold">Country *</label>
                                <input type="text" className="form-control" name="Country" value={formData.Country} disabled />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label fw-bold">Pincode *</label>
                                <input type="text" className={`form-control ${errors.PinCode ? 'is-invalid' : ''}`} name="PinCode" value={formData.PinCode}
                                    onChange={(e) => {
                                        const input = e.target.value;
                                        if (/^\d{0,6}$/.test(input)) {
                                            setFormData({ ...formData, PinCode: input });
                                        }
                                    }}
                                    required />
                                {errors.PinCode && <div className="invalid-feedback">{errors.PinCode[0]}</div>}
                            </div>
                        </div>

                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="isUnderDistributor"
                                name="IsUnderDistributor"
                                checked={formData.IsUnderDistributor}
                                onChange={(e) => setFormData({ ...formData, IsUnderDistributor: e.target.checked })}
                            />
                            <label className="form-check-label fw-bold" htmlFor="isUnderDistributor">
                                Is the customer under a distributor?
                            </label>
                        </div>

                        <button type="submit" className="btn btn-success w-100 mb-3" disabled={loading}>
                            {loading && (
                                <span
                                    className="spinner-border spinner-border-sm text-light"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                            )}
                            {loading ? ' Updating...' : 'Update Customer'}
                        </button>
                        <button type="button" className="btn btn-secondary w-100" onClick={handleCancel}>
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
