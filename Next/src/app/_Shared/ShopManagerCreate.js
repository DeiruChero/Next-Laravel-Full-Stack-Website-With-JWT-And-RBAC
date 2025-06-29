'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';

export default function ShopManagerCreate() {

    const [formData, setFormData] = useState({
        DisplayName: '',
        Email: '',
        Mobile: '',
        WhatsApp: '',
        password_confirmation: '',
        Password: '',
        RoleID: '',
        Address: '',
        Area: '',
        City: '',
        State: '',
        PinCode: '',
        Picture: null,
    });

    const [roles, setRoles] = useState([]);
    const [cities, setCities] = useState([]);
    const [states, setStates] = useState([]);
    const [areas, setAreas] = useState([]);
    const [cityID, setCityID] = useState('');
    const [areaID, setAreaID] = useState('');
    const [stateID, setStateID] = useState('');
    const [rules, setRules] = useState([]);
    const [selectedRules, setSelectedRules] = useState([]);
    const [errors, setErrors] = useState({});
    const [successMsg, setSuccessMsg] = useState('');
    const [loadingRules, setLoadingRules] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get("roles-data")
            .then((res) => {
                setRoles(res.data.data);
            })
            .catch((err) => console.error("Failed to fetch roles:", err));
    }, []);

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
        if (formData.RoleID) {
            fetchRules();
        } else {
            setRules([]);
            setSelectedRules([]);
        }
    }, [formData.RoleID]);

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

    const fetchRules = async () => {
        setLoadingRules(true);
        try {
            const response = await api.get('rules-data');
            setRules(response.data.data);
            setSelectedRules([]);
        } catch (err) {
            console.error("Failed to fetch rules:", err);
        } finally {
            setLoadingRules(false);
        }
    };

    useEffect(() => {
        const fetchRoleRulesAndAllRules = async () => {
            if (!formData.RoleID) {
                setRules([]);
                setSelectedRules([]);
                return;
            }

            setLoadingRules(true);
            try {
                const roleResponse = await api.get(`roles-show/${formData.RoleID}`);
                const roleData = roleResponse.data;
                setSelectedRules(roleData.rules || []);

                const rulesResponse = await api.get('rules-data');
                setRules(rulesResponse.data.data);
            } catch (err) {
                console.error("Failed to fetch role rules or all rules:", err);
                setRules([]);
                setSelectedRules([]);
            } finally {
                setLoadingRules(false);
            }
        };

        fetchRoleRulesAndAllRules();
    }, [formData.RoleID]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'user_picture') {
            setFormData((prev) => ({
                ...prev,
                [name]: files[0] || null,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleRuleCheckboxChange = (ruleId) => {
        setSelectedRules((prevSelected) => {
            if (prevSelected.includes(ruleId)) {
                return prevSelected.filter((id) => id !== ruleId);
            } else {
                return [...prevSelected, ruleId];
            }
        });
    };

    const handleCityBlur = () => {
        const match = cities.find(
            city => city.CityName.trim().toLowerCase() === formData.cityName.trim().toLowerCase()
        );
        setCityID(match?.CityID || '');
    };

    const handleStateBlur = () => {
        const match = states.find(
            state => state.StateName.trim().toLowerCase() === formData.stateName.trim().toLowerCase()
        );
        setStateID(match?.StateID || '');
    }

    const handleAreaBlur = () => {
        const match = areas.find(
            area => area.AreaName.trim().toLowerCase() === formData.areaName.trim().toLowerCase()
        );
        setAreaID(match?.AreaID || '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSuccessMsg('');

        if (!/^\d{10}$/.test(formData.Mobile)) {
            setErrors('Phone Number must be exactly 10 digits.');
            setSuccessMsg('');
            return;
        }

        if (formData.WhatsApp.length != 0 && !/^\d{10}$/.test(formData.WhatsApp)) {
            setErrors('Whatsapp Number must be exactly 10 digits.');
            setSuccessMsg('');
            return;
        }

        if (!/^\d{6}$/.test(formData.PinCode)) {
            setErrors('Pincode must be exactly 6 digits.');
            setSuccessMsg('');
            return;
        }

        if (formData.Password.length < 6) {
            setErrors('Password must be at least 6 characters long.');
            setSuccessMsg('');
            return;
        }

        if (formData.Password !== formData.password_confirmation) {
            setErrors('Password and Confirm Password must be same.');
            setSuccessMsg('');
            return;
        }

        try {
            await api.post(
                'create-shop-manager',
                {
                    ...formData,
                    rules: selectedRules,
                },
                {
                    headers: {
                        Accept: 'application/json',
                    },
                    withCredentials: true,
                }
            );

            setSuccessMsg('Shop Manager created successfully! 🎉');
            setFormData({
                DisplayName: '',
                Email: '',
                Mobile: '',
                password_confirmation: '',
                WhatsApp: '',
                Password: '',
                RoleID: '',
                Address: '',
                Area: '',
                City: '',
                State: '',
                PinCode: '',
                Picture: null,
            });
            setSelectedRules([]);
            setRules([]);
            setErrors({});
            setSuccessMsg('Shop Manager Created Successfully 🎉');
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
            <h2 className="text-center mb-4 text-primary">Create Shop Manager</h2>

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
                            <label className="form-label fw-bold">Role <span className='text-danger'>*</span></label>
                            <select
                                className={`form-select ${errors.RoleID ? 'is-invalid' : ''}`}
                                name="RoleID"
                                value={formData.RoleID}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Select User Type --</option>
                                {roles.map((role) => (
                                    <option key={role.RoleID} value={role.RoleID}>
                                        {role.RoleName}
                                    </option>
                                ))}
                            </select>
                            {errors.RoleID && <div className="invalid-feedback">{errors.RoleID[0]}</div>}
                        </div>

                        {formData.RoleID && (
                            <div className="col-md-12 mb-3">
                                <label className="form-label fw-bold mb-2" style={{ fontSize: '1.1rem' }}>
                                    Assigned Rules
                                </label>
                                {loadingRules ? (
                                    <p>Loading rules...</p>
                                ) : (
                                    <div
                                        className="border rounded p-3"
                                        style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: '#f9f9f9' }}
                                    >
                                        {rules.map((rule) => (
                                            <div
                                                className="form-check mb-2"
                                                key={rule.RulesID}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`rule-${rule.RulesID}`}
                                                    value={rule.RulesID}
                                                    checked={selectedRules.includes(rule.RulesID)}
                                                    onChange={() => handleRuleCheckboxChange(rule.RulesID)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor={`rule-${rule.RulesID}`}
                                                    style={{ userSelect: 'none', cursor: 'pointer' }}
                                                >
                                                    {rule.RulesName}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="form-label fw-bold">Shop Manager's Name <span className='text-danger'>*</span></label>
                            <input
                                type="text"
                                className={`form-control ${errors.DisplayName ? 'is-invalid' : ''}`}
                                name="DisplayName"
                                value={formData.DisplayName}
                                onChange={handleChange}
                                placeholder="Enter Shop Manager's Name"
                                required
                            />
                            {errors.DisplayName && <div className="invalid-feedback">{errors.DisplayName[0]}</div>}
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
                                <label className='form-label fw-bold'>WhatsApp</label>
                                <input
                                    type="tel"
                                    className={`form-control ${errors.WhatsApp ? 'is-invalid' : ''}`}
                                    name="WhatsApp"
                                    value={formData.WhatsApp}
                                    onChange={(e) => {
                                        const input = e.target.value;
                                        if (/^\d{0,10}$/.test(input)) {
                                            setFormData({ ...formData, WhatsApp: input });
                                        }
                                    }}
                                    placeholder="Enter WhatsApp number"
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label fw-bold">Email <span className='text-danger'>*</span></label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.Email ? 'is-invalid' : ''}`}
                                    name="Email"
                                    value={formData.Email}
                                    onChange={handleChange}
                                    placeholder="Enter email"
                                    required
                                />
                                {errors.Email && <div className="invalid-feedback">{errors.Email[0]}</div>}
                            </div>
                            <div className="mb-3 col-md-6">
                                <label className='form-label fw-bold'>Country</label>
                                <input type="text" value={'India'} disabled className="form-control" />
                            </div>
                        </div>

                        <div className='mb-3'>
                            <label className='form-label fw-bold'>Address <span className='text-danger'>*</span></label>
                            <textarea className="form-control" name="Address" value={formData.Address} onChange={handleChange} required placeholder='Enter Shop Address'></textarea>
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
                                    className="form-control"
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

                        <div className="mb-3">
                            <label className="form-label fw-bold">Shop Manager's Picture</label>
                            <input
                                type="file"
                                className={`form-control ${errors.Picture ? 'is-invalid' : ''}`}
                                name="Picture"
                                onChange={handleChange}
                                accept="image/*"
                            />
                            {errors.Picture && (
                                <div className="invalid-feedback">{errors.Picture[0]}</div>
                            )}
                        </div>

                        <button type="submit" className="btn btn-success w-100" disabled={loading}>
                            {loading && (
                                <span
                                    className="spinner-border spinner-border-sm text-light"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                            )}
                            {loading ? ' Creating...' : 'Create Shop Manager'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
