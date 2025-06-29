'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';

export default function QuickCommerceCreate() {

    const [formData, setFormData] = useState({
        DisplayName: '',
        ProductPrice: '',
        ProductCode: '',
        PlatformGSTNo: '',
        ProductName: '',
        Email: '',
        Mobile: '',
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
    const [activeForm, setActiveForm] = useState(null);
    const [loading, setLoading] = useState(false);

    const [cp1Data, setCp1Data] = useState({
        CPName1: '',
        CPEmail1: '',
        CPMobile1: '',
        CPWhatsApp1: '',
    });
    const [cp2Data, setCp2Data] = useState({
        CPName2: '',
        CPEmail2: '',
        CPMobile2: '',
        CPWhatsApp2: '',
    });

    const handleCp1Change = (e) => {
        const { name, value } = e.target;
        setCp1Data((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleCp2Change = (e) => {
        const { name, value } = e.target;
        setCp2Data((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

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
            setErrors({ Mobile: ['Phone Number must be exactly 10 digits.'] });
            setSuccessMsg('');
            return;
        }

        if (formData.PlatformGSTNo.length != 0 && !/^[0-9A-Z]{0,15}$/.test(formData.PlatformGSTNo)) {
            setErrorMsg({ PlatformGSTNo: ['GST number must be a maximum of 15 characters.'] });
            setSuccessMsg('');
            return;
        }

        if (!areaID) {
            setErrors({ areaID: ['Please select a valid area from the list.'] });
            setSuccessMsg('');
            return;
        }

        if (!stateID) {
            setErrors({ stateID: ['Please select a valid state from the list.'] });
            setSuccessMsg('');
            return;
        }

        if (!cityID) {
            setErrors({ cityID: ['Please select a valid city from the list.'] });
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

        if (!/^\d{0,10}$/.test(cp1Data.CPMobile1)) {
            setErrors({ CPMobile1: ['Phone Number must be exactly 10 digits.'] });
            setSuccessMsg('');
            return;
        }

        if (!/^\d{0,10}$/.test(cp2Data.CPMobile2)) {
            setErrors({ CPMobile2: ['Phone Number must be exactly 10 digits.'] });
            setSuccessMsg('');
            return;
        }

        if (cp1Data.CPWhatsApp1.length != 0 && !/^\d{10}$/.test(cp1Data.CPWhatsApp1)) {
            setErrors({ 'CPWhatsApp1': ['Whatsapp Number must be exactly 10 digits.'] });
            setSuccessMsg('');
            return;
        }

        if (cp2Data.CPWhatsApp2.length != 0 && !/^\d{10}$/.test(cp2Data.CPWhatsApp2)) {
            setErrors({ 'CPWhatsApp2': ['Whatsapp Number must be exactly 10 digits.'] });
            setSuccessMsg('');
            return;
        }

        const payload = new FormData();
        for (const key in formData) {
            if (formData[key] !== undefined && formData[key] !== null) {
                payload.append(key, formData[key]);
            }
        }
        payload.append('ContactPersonName1', cp1Data.CPName1);
        payload.append('CPMobile1', cp1Data.CPMobile1);
        payload.append('CPWhatsApp1', cp1Data.CPWhatsApp1);
        payload.append('CPEmail1', cp1Data.CPEmail1);

        payload.append('ContactPersonName2', cp2Data.CPName2);
        payload.append('CPMobile2', cp2Data.CPMobile2);
        payload.append('CPWhatsApp2', cp2Data.CPWhatsApp2);
        payload.append('CPEmail2', cp2Data.CPEmail2);

        try {
            await api.post(
                'create-qc', payload,
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

            setFormData({
                DisplayName: '',
                Email: '',
                Mobile: '',
                ProductName: '',
                password_confirmation: '',
                Password: '',
                RoleID: '',
                Address: '',
                GSTNo: '',
                PlatformGSTNo: '',
                ProductPrice: '',
                ProductCode: '',
                Area: '',
                City: '',
                State: '',
                PinCode: '',
                Picture: null,
            });
            setCp1Data({
                CPName1: '',
                CPMobile1: '',
                CPWhatsApp1: '',
                CPEmail1: '',
            })
            setCp2Data({
                CPName2: '',
                CPMobile2: '',
                CPWhatsApp2: '',
                CPEmail2: '',
            })
            setSelectedRules([]);
            setRules([]);
            setErrors({});
            setSuccessMsg('Platform Created Successfully 🎉');
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
            <h2 className="text-center mb-4 text-primary">Create Quick Commerce</h2>

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
                            <label className="form-label fw-bold">Platform Name <span className='text-danger'>*</span></label>
                            <input
                                type="text"
                                className={`form-control ${errors.DisplayName ? 'is-invalid' : ''}`}
                                name="DisplayName"
                                value={formData.DisplayName}
                                onChange={handleChange}
                                placeholder="Enter Platform Name"
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
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className='form-label fw-bold'>GST Number</label>
                                <input
                                    className={`form-control ${errors.PlatformGSTNo ? 'is-invalid' : ''}`}
                                    type="text"
                                    name="PlatformGSTNo"
                                    value={formData.PlatformGSTNo}
                                    onChange={(e) => {
                                        const input = e.target.value.toUpperCase();
                                        if (/^[0-9A-Z]{0,15}$/.test(input)) {
                                            setFormData({ ...formData, PlatformGSTNo: input });
                                        }
                                    }}
                                    placeholder='Enter GST Number'
                                />
                                {errors.PlatformGSTNo && <div className="invalid-feedback">{errors.PlatformGSTNo[0]}</div>}
                            </div>
                            <div className="mb-3 col-md-6">
                                <label className='form-label fw-bold'>Product Name From <span className='text-danger'>*</span></label>
                                <select
                                    className="form-select"
                                    name="ProductName"
                                    value={formData.ProductName}
                                    required
                                    onChange={(e) => setFormData({ ...formData, ProductName: e.target.value })}
                                >
                                    <option value="">-- Select Product Name --</option>
                                    <option value="NameSwiggy">Product Name Swiggy</option>
                                    <option value="NameBlinkit">Product Name Blinkit</option>
                                    <option value="NameRelience">Product Name Relience</option>
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className='form-label fw-bold'>Item Code From <span className='text-danger'>*</span></label>
                                <select
                                    className="form-select"
                                    name="ProductCode"
                                    value={formData.ProductCode}
                                    required
                                    onChange={(e) => setFormData({ ...formData, ProductCode: e.target.value })}
                                >
                                    <option value="">-- Select Item Code --</option>
                                    <option value="ItemCodeSwiggy">Item Code Swiggy</option>
                                    <option value="ItemCodeBlinkit">Item Code Blinkit</option>
                                    <option value="ItemCodeRelience">Item Code Relience</option>
                                </select>
                                {errors.ProductCode && <div className="invalid-feedback">{errors.ProductCode[0]}</div>}
                            </div>
                            <div className="mb-3 col-md-6">
                                <label className='form-label fw-bold'>Product Price From <span className='text-danger'>*</span></label>
                                <select
                                    className="form-select"
                                    name="ProductPrice"
                                    value={formData.ProductPrice}
                                    required
                                    onChange={(e) => setFormData({ ...formData, ProductPrice: e.target.value })}
                                >
                                    <option value="">-- Select Product Price --</option>
                                    <option value="ItemCodeSwiggy">Swiggy Price</option>
                                    <option value="ItemCodeBlinkit">Blinkit Price</option>
                                    <option value="ItemCodeRelience">Relience Price</option>
                                </select>
                                {errors.ProductPrice && <div className="invalid-feedback">{errors.ProductPrice[0]}</div>}
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
                                    className={`form-control ${errors.areaID ? 'is-invalid' : ''}`}
                                    list="area-options"
                                    name="Area"
                                    value={formData.Area}
                                    onChange={handleChange}
                                    onBlur={handleAreaBlur}
                                    placeholder="Select an Area"
                                    required
                                />
                                {errors.areaID && <div className="invalid-feedback">{errors.areaID[0]}</div>}
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
                                    className={`form-control ${errors.cityID ? 'is-invalid' : ''}`}
                                    list="city-options"
                                    name="City"
                                    value={formData.City}
                                    onChange={handleChange}
                                    onBlur={handleCityBlur}
                                    placeholder="Select a city"
                                    required
                                />
                                {errors.cityID && <div className="invalid-feedback">{errors.cityID[0]}</div>}
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
                                    className={`form-control ${errors.stateID ? 'is-invalid' : ''}`}
                                    list="state-options"
                                    name="State"
                                    value={formData.State}
                                    onChange={handleChange}
                                    onBlur={handleStateBlur}
                                    placeholder="Select a state"
                                    required
                                />
                                {errors.stateID && <div className="invalid-feedback">{errors.stateID[0]}</div>}
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
                                    type="tel"
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

                        <div className="mb-3">
                            <label className="form-label fw-bold">User Picture</label>
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

                        <div className="card p-3 mb-3">
                            <div className='mb-3'>
                                <div className="mb-3 d-flex gap-2">
                                    <button className="btn btn-success" type='button' onClick={() => setActiveForm('cp1')}>
                                        Contact Person 1
                                    </button>
                                    <button className="btn btn-primary" type='button' onClick={() => setActiveForm('cp2')}>
                                        Contact Person 2
                                    </button>
                                </div>
                                {activeForm === 'cp1' && (
                                    <div className="container">
                                        <div className="mb-3">
                                            <label className='form-label fw-bold text-success'>CP Name 1 <span className='text-danger'>*</span></label>
                                            <input
                                                className='form-control'
                                                type="text"
                                                name="CPName1"
                                                value={cp1Data.CPName1}
                                                placeholder='Enter CP Name 1'
                                                onChange={handleCp1Change}
                                                required
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <label className='form-label fw-bold text-success'>CP Mobile 1 <span className='text-danger'>*</span></label>
                                                <input
                                                    className={`form-control ${errors.CPMobile1 ? 'is-invalid' : ''}`}
                                                    type="tel"
                                                    name="CPMobile1"
                                                    value={cp1Data.CPMobile1}
                                                    placeholder='Enter CP Mobile 1'
                                                    onChange={(e) => {
                                                        const input = e.target.value;
                                                        if (/^\d{0,10}$/.test(input)) {
                                                            setCp1Data({ ...cp1Data, CPMobile1: input });
                                                        }
                                                    }}
                                                    required
                                                />
                                                {errors.CPMobile1 && <div className="invalid-feedback">{errors.CPMobile1[0]}</div>}
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label className='form-label fw-bold text-success'>CP WhatsApp 1</label>
                                                <input
                                                    className={`form-control ${errors.CPWhatsApp1 ? 'is-invalid' : ''}`}
                                                    type="tel"
                                                    name="CPWhatsApp1"
                                                    value={cp1Data.CPWhatsApp1}
                                                    placeholder='Enter CP WhatsApp 1'
                                                    onChange={(e) => {
                                                        const input = e.target.value;
                                                        if (/^\d{0,10}$/.test(input)) {
                                                            setCp1Data({ ...cp1Data, CPWhatsApp1: input });
                                                        }
                                                    }}
                                                />
                                                {errors.CPWhatsApp1 && <div className="invalid-feedback">{errors.CPWhatsApp1[0]}</div>}
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className='form-label fw-bold text-success'>CP Email 1 <span className='text-danger'>*</span></label>
                                            <input
                                                className='form-control'
                                                type="email"
                                                name="CPEmail1"
                                                value={cp1Data.CPEmail1}
                                                placeholder='Enter CP Email 1'
                                                onChange={handleCp1Change}
                                                required
                                            />
                                        </div>
                                    </div>
                                )}
                                {activeForm === 'cp2' && (
                                    <div className="container">
                                        <div className="mb-3">
                                            <label className='form-label fw-bold text-primary'>CP Name 2</label>
                                            <input
                                                className='form-control'
                                                type="text"
                                                name="CPName2"
                                                value={cp2Data.CPName2}
                                                placeholder='Enter CP Name 2'
                                                onChange={handleCp2Change}
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <label className='form-label fw-bold text-primary'>CP Mobile 2</label>
                                                <input
                                                    className={`form-control ${errors.CPMobile2 ? 'is-invalid' : ''}`}
                                                    type="text"
                                                    name="CPMobile2"
                                                    value={cp2Data.CPMobile2}
                                                    placeholder='Enter CP Mobile 2'
                                                    onChange={(e) => {
                                                        const input = e.target.value;
                                                        if (/^\d{0,10}$/.test(input)) {
                                                            setCp2Data({ ...cp2Data, CPMobile2: input });
                                                        }
                                                    }}
                                                />
                                                {errors.CPMobile2 && <div className="invalid-feedback">{errors.CPMobile2[0]}</div>}
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label className='form-label fw-bold text-primary'>CP WhatsApp 2</label>
                                                <input
                                                    className={`form-control ${errors.CPWhatsApp2 ? 'is-invalid' : ''}`}
                                                    type="tel"
                                                    name="CPWhatsApp2"
                                                    value={cp2Data.CPWhatsApp2}
                                                    placeholder='Enter CP WhatsApp 2'
                                                    onChange={(e) => {
                                                        const input = e.target.value;
                                                        if (/^\d{0,10}$/.test(input)) {
                                                            setCp2Data({ ...cp2Data, CPWhatsApp2: input });
                                                        }
                                                    }}
                                                />
                                                {errors.CPWhatsApp2 && <div className="invalid-feedback">{errors.CPWhatsApp2[0]}</div>}
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className='form-label fw-bold text-primary'>CP Email 2</label>
                                            <input
                                                className='form-control'
                                                type="email"
                                                name="CPEmail2"
                                                value={cp2Data.CPEmail2}
                                                placeholder='Enter CP Email 2'
                                                onChange={handleCp2Change}
                                            />
                                        </div>
                                    </div>
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
                            {loading ? ' Creating...' : 'Create Quick Commerce'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
