'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';

export default function VendorCreate() {

    const [formData, setFormData] = useState({
        'VenderName': '',
        'GSTNo': '',
        'Mobile': '',
        'WhatsApp': '',
        'Email': '',
        'Address': '',
        'Area': '',
        'City': '',
        'State': '',
        'PinCode': '',
        'BranchID': '',
        'Mobile2': '',
        'Mobile3': '',
        'VenderType': '',
        'BenificiaryName': '',
        'BankName': '',
        'BranchName': '',
        'AccountNo': '',
        'IFSCCode': ''
    });

    const [cities, setCities] = useState([]);
    const [states, setStates] = useState([]);
    const [areas, setAreas] = useState([]);
    const [cityID, setCityID] = useState('');
    const [areaID, setAreaID] = useState('');
    const [stateID, setStateID] = useState('');
    const [errors, setErrors] = useState({});
    const [successMsg, setSuccessMsg] = useState('');
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

        if (formData.GSTNo.length != 0 && !/^[0-9A-Z]{0,15}$/.test(formData.GSTNo)) {
            setErrorMsg({ GSTNo: ['GST number must be a maximum of 15 characters.'] });
            setSuccessMsg('');
            return;
        }

        if (!/^\d{10}$/.test(formData.Mobile)) {
            setErrors({ Mobile: ['Phone Number must be exactly 10 digits.'] });
            setSuccessMsg('');
            return;
        }

        if (formData.WhatsApp.length != 0 && !/^\d{10}$/.test(formData.WhatsApp)) {
            setErrors({ WhatsApp: ['WhatsApp Number must be exactly 10 digits.'] });
            setSuccessMsg('');
            return;
        }

        if (formData.Mobile2.length != 0 && !/^\d{10}$/.test(formData.Mobile2)) {
            setErrors({ Mobile2: ['Phone Number must be exactly 10 digits.'] });
            setSuccessMsg('');
            return;
        }

        if (formData.Mobile3.length != 0 && !/^\d{10}$/.test(formData.Mobile3)) {
            setErrors({ Mobile3: ['Phone Number must be exactly 10 digits.'] });
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

        if (formData.PinCode.length != 0 && !/^\d{6}$/.test(formData.PinCode)) {
            setErrors({ PinCode: ['Pincode must be exactly 6 digits.'] });
            setSuccessMsg('');
            return;
        }

        try {
            await api.post(
                'vendor-store',
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

            setSuccessMsg('Vendor created successfully! 🎉');
            setFormData({
                'VenderName': '',
                'GSTNo': '',
                'Mobile': '',
                'WhatsApp': '',
                'Email': '',
                'Address': '',
                'Area': '',
                'City': '',
                'State': '',
                'PinCode': '',
                'BranchID': '',
                'Mobile2': '',
                'Mobile3': '',
                'VenderType': '',
                'BenificiaryName': '',
                'BankName': '',
                'BranchName': '',
                'AccountNo': '',
                'IFSCCode': ''
            });
            setErrors({});
            setSuccessMsg('Vendor Created Successfully 🎉');
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                console.error('Registration error:', err);
            }
        } finally{
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ marginTop: '50px' }}>
            <h2 className="text-center mb-4">Create Vendor</h2>

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
                            <div className='h4 text-center text-primary'>Vendor Form</div>
                        </div>
                        <div className="mb-3">
                            <label className='form-label fw-bold'>Vendor Name <span className='text-danger'>*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name="VenderName"
                                value={formData.VenderName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className='form-label fw-bold'>GST Number</label>
                                <input
                                    className={`form-control ${errors.GSTNo ? 'is-invalid' : ''}`}
                                    type="text"
                                    name="GSTNo"
                                    value={formData.GSTNo}
                                    onChange={(e) => {
                                        const input = e.target.value.toUpperCase();
                                        if (/^[0-9A-Z]{0,15}$/.test(input)) {
                                            setFormData({ ...formData, GSTNo: input });
                                        }
                                    }}
                                    placeholder='Enter GST Number'
                                />
                                {errors.GSTNo && <div className="invalid-feedback">{errors.GSTNo[0]}</div>}
                            </div>
                            <div className="mb-3 col-md-6">
                                <label className='form-label fw-bold'>Vendor Type <span className='text-danger'>*</span></label>
                                <select
                                    className="form-select"
                                    name="VenderType"
                                    value={formData.VenderType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Vendor Type</option>
                                    <option value="CashRetail">Cash Retail</option>
                                    <option value="CreditPurchase">Credit Purchase</option>
                                </select>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className='form-label fw-bold'>Email <span className='text-danger'>*</span></label>
                            <input
                                type="email"
                                className="form-control"
                                name="Email"
                                value={formData.Email}
                                onChange={handleChange}
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
                            <div className="mb-3 col-md-6">
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
                                {errors.WhatsApp && <div className="invalid-feedback">{errors.WhatsApp[0]}</div>}
                            </div>
                        </div>
                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label fw-bold">Mobile 2</label>
                                <input
                                    type="tel"
                                    className={`form-control ${errors.Mobile2 ? 'is-invalid' : ''}`}
                                    name="Mobile2"
                                    value={formData.Mobile2}
                                    onChange={(e) => {
                                        const input = e.target.value;
                                        if (/^\d{0,10}$/.test(input)) {
                                            setFormData({ ...formData, Mobile2: input });
                                        }
                                    }}
                                    placeholder="Enter mobile number"
                                />
                                {errors.Mobile2 && <div className="invalid-feedback">{errors.Mobile2[0]}</div>}
                            </div>
                            <div className="mb-3 col-md-6">
                                <label className="form-label fw-bold">Mobile 3</label>
                                <input
                                    type="tel"
                                    className={`form-control ${errors.Mobile3 ? 'is-invalid' : ''}`}
                                    name="Mobile3"
                                    value={formData.Mobile3}
                                    onChange={(e) => {
                                        const input = e.target.value;
                                        if (/^\d{0,10}$/.test(input)) {
                                            setFormData({ ...formData, Mobile3: input });
                                        }
                                    }}
                                    placeholder="Enter mobile number"
                                />
                                {errors.Mobile3 && <div className="invalid-feedback">{errors.Mobile3[0]}</div>}
                            </div>
                        </div>
                        <div className='mb-3'>
                            <label className='form-label fw-bold'>Address <span className='text-danger'>*</span></label>
                            <textarea className="form-control" name="Address" value={formData.Address} onChange={handleChange} required placeholder='Vendor Shop Address'></textarea>
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
                                <datalist id="area-options">
                                    {areas.map(area => (
                                        <option key={area.AreaID} value={area.AreaName} />
                                    ))}
                                </datalist>
                                {errors.areaID && <div className="invalid-feedback">{errors.areaID[0]}</div>}
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
                                <datalist id="city-options">
                                    {cities.map(city => (
                                        <option key={city.CityID} value={city.CityName} />
                                    ))}
                                </datalist>
                                {errors.cityID && <div className="invalid-feedback">{errors.cityID[0]}</div>}
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
                                <datalist id="state-options">
                                    {states.map(state => (
                                        <option key={state.StateID} value={state.StateName} />
                                    ))}
                                </datalist>
                                {errors.stateID && <div className="invalid-feedback">{errors.stateID[0]}</div>}
                            </div>
                            <div className="mb-3 col-md-6">
                                <label className='form-label fw-bold'>Pincode <span className='text-danger'>*</span></label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.PinCode ? 'is-invalid' : ''}`}
                                    name="PinCode"
                                    value={formData.PinCode}
                                    onChange={(e) => {
                                        const input = e.target.value;
                                        if (/^\d{0,6}$/.test(input)) {
                                            setFormData({ ...formData, PinCode: input });
                                        }
                                    }}
                                    placeholder="Enter pincode"
                                    required
                                />
                                {errors.PinCode && <div className="invalid-feedback">{errors.PinCode[0]}</div>}
                            </div>
                        </div>
                        <hr style={{ height: '.1rem', backgroundColor: '#00008B' }} />
                        <div className="mb-3">
                            <div className='h4 text-center text-primary'>Bank Details</div>
                        </div>
                        <div className="mb-3">
                            <label className='form-label fw-bold'>Benificiary Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="BenificiaryName"
                                value={formData.BenificiaryName}
                                onChange={handleChange}
                                placeholder="Enter benificiary name"
                            />
                        </div>
                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className='form-label fw-bold'>Bank Name</label>
                                <input
                                    type="text"
                                    className='form-control'
                                    name='BankName'
                                    value={formData.BankName}
                                    onChange={handleChange}
                                    placeholder="Select a bank"
                                />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label className='form-label fw-bold'>Branch Name</label>
                                <input
                                    type="text"
                                    className='form-control'
                                    name='BranchName'
                                    value={formData.BranchName}
                                    onChange={handleChange}
                                    placeholder="Select a branch"
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className='form-label fw-bold'>Account Number</label>
                                <input
                                    type="text"
                                    className='form-control'
                                    name='AccountNo'
                                    value={formData.AccountNo}
                                    onChange={(e) => {
                                        const input = e.target.value;
                                        if (/^\d{0,18}$/.test(input)) {
                                            setFormData({ ...formData, AccountNo: input });
                                        }
                                    }}
                                    placeholder="Enter account number"
                                />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label className='form-label fw-bold'>IFSC Code</label>
                                <input
                                    type="text"
                                    className='form-control'
                                    name='IFSCCode'
                                    value={formData.IFSCCode}
                                    onChange={(e) => {
                                        const input = e.target.value.toUpperCase();
                                        if (/^[A-Z]{0,4}$/.test(input) || /^[A-Z]{4}0?[A-Z0-9]{0,6}$/.test(input)) {
                                            setFormData({ ...formData, IFSCCode: input });
                                        }
                                    }}
                                    placeholder="Enter IFSC code"
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
                            {loading ? ' Creating...' : 'Create Vendor'}
                        </button>
                    </form>
                </div>
            </div >
        </div >
    );
}
