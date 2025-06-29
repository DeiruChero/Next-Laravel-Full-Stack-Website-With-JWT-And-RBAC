'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function InstitutionEdit({ params }) {
    const UserID = params.UserID;
    const router = useRouter();

    const [displayName, setDisplayName] = useState('');
    const [gstNo, setGstNo] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');
    const [email, setEmail] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [ownerMobile, setOwnerMobile] = useState('');
    const [address, setAddress] = useState('');
    const [area, setArea] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [cpName1, setCpName1] = useState('');
    const [cpMobile1, setCpMobile1] = useState('');
    const [cpEmail1, setCpEmail1] = useState('');
    const [cpWhatsApp1, setCpWhatsApp1] = useState('');
    const [cpName2, setCpName2] = useState('');
    const [cpMobile2, setCpMobile2] = useState('');
    const [cpEmail2, setCpEmail2] = useState('');
    const [cpWhatsApp2, setCpWhatsApp2] = useState('');
    const [areas, setAreas] = useState([]);
    const [roleId, setRoleId] = useState('');
    const [myLoading, setMyLoading] = useState(false);
    const [areaID, setAreaID] = useState('');
    const [activeForm, setActiveForm] = useState(null);
    const [billingPercentage, setBillingPercentage] = useState('');
    const [employeeID, setEmployeeID] = useState('');
    const [paymentMode, setPaymentMode] = useState('');
    const [priceType, setPriceType] = useState('');
    const [employeeName, setEmployeeName] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!UserID) return;

        const fetchUser = async () => {
            try {
                const res = await api.get(`user-info/${UserID}`);
                const user = res.data;

                setDisplayName(user.DisplayName);
                setGstNo(user.GSTNo);
                setDeliveryTime(user.DeliveryTime);
                setEmail(user.InstitutionEmail);
                setOwnerName(user.OwnerName);
                setOwnerMobile(user.OwnerMobile);
                setAddress(user.Address);
                setArea(user.Area);
                setCity(user.City);
                setState(user.State);
                setPincode(user.PinCode);
                setCpName1(user.ContactPersonName1);
                setCpMobile1(user.CPMobile1);
                setCpEmail1(user.CPEmail1);
                setCpWhatsApp1(user.CPWhatsApp1);
                setCpName2(user.ContactPersonName2);
                setCpMobile2(user.CPMobile2);
                setCpEmail2(user.CPEmail2);
                setCpWhatsApp2(user.CPWhatsApp2);
                setEmployeeID(user.EmployeeID);
                setBillingPercentage(user.BillingPercent);
                setPaymentMode(user.PaymentMode);
                setPriceType(user.PriceType);
                setRoleId(user.RoleID);
                setLoading(false);
            } catch (err) {
                setError('Failed to load user data.');
                console.error(err);
                setLoading(false);
            }
        };

        fetchUser();
    }, [UserID]);

    useEffect(() => {
        api.get(`/employee-show/${employeeID}`)
        .then((res) => setEmployeeName(res.data.EmployeeName))
        .catch((err) => console.error("Failed to fetch employee name:", err));
    }, [employeeID]);

    useEffect(() => {
        api.get("area-data")
            .then((res) => setAreas(res.data.data))
            .catch((err) => console.error("Failed to fetch areas:", err));
    }, []);

    const handleAreaBlur = () => {
        const selectedArea = areas.find(a => a.AreaName === area);
        if (selectedArea) {
            setAreaID(selectedArea.AreaID);
            setPincode(selectedArea.PinCode);
        } else {
            setAreaID('');
            setPincode('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMyLoading(true);
        setError(null);
        if (gstNo.length != 0 && !/^[0-9A-Z]{0,15}$/.test(gstNo)) {
            setError({ PlatformGSTNo: ['GST number must be a maximum of 15 characters.'] });
            setSuccessMsg('');
            return;
        }
        if (!areaID) {
            setError('Please select a valid area from the list.');
            setMyLoading(false);
            return;
        }
        if (!/^\d{0,10}$/.test(cpMobile1)) {
            setError({ CPMobile1: ['Phone Number must be exactly 10 digits.'] });
            setSuccessMsg('');
            return;
        }
        if (!/^\d{0,10}$/.test(cpMobile2)) {
            setError({ CPMobile2: ['Phone Number must be exactly 10 digits.'] });
            setSuccessMsg('');
            return;
        }
        try {
            await api.put(`update-insti/${UserID}`, {
                Area: area,
                PinCode: pincode,
                ContactPersonName1: cpName1,
                CPMobile1: cpMobile1,
                ContactPersonName2: cpName2,
                CPMobile2: cpMobile2,
                CPEmail1: cpEmail1,
                CPWhatsApp1: cpWhatsApp1,
                CPEmail2: cpEmail2,
                CPWhatsApp2: cpWhatsApp2,
                RoleID: roleId
            }, {
                headers: { Accept: 'application/json' },
                withCredentials: true,
            });
            router.push('/Dashboard/useredit');
        } catch (err) {
            setError('Failed to update user.');
            console.error(err.response?.data || err.message);
        } finally {
            setMyLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/Dashboard/useredit');
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
            <h2 className="text-center mb-4 text-warning">Edit Institution</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
                <div className="mb-3">
                    <label className="form-label fw-bold">Institution Name</label>
                    <input className="form-control" value={displayName} disabled />
                </div>
                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label className='form-label fw-bold'>GST Number</label>
                        <input className='form-control' value={gstNo} disabled></input>
                    </div>
                    <div className="mb-3 col-md-6">
                        <label className='form-label fw-bold'>Delivery Time</label>
                        <input className='form-control' value={deliveryTime} disabled></input>
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label fw-bold">Address</label>
                    <textarea className="form-control" value={address} disabled />
                </div>

                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label className="form-label fw-bold">Institution Email</label>
                        <input className="form-control" value={email} disabled />
                    </div>
                    <div className="mb-3 col-md-6">
                        <label className="form-label fw-bold">Owner Name</label>
                        <input className="form-control" value={ownerName} disabled />
                    </div>
                </div>
                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label className="form-label fw-bold">Owner Mobile</label>
                        <input className="form-control" value={ownerMobile} disabled />
                    </div>
                    <div className="mb-3 col-md-6">
                        <label className="form-label fw-bold">
                            Area Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            list="area-options"
                            name="Area"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
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
                </div>

                <div className="row">
                    <div className="mb-3 col-md-4">
                        <label className="form-label fw-bold">City</label>
                        <input className="form-control" value={city} disabled />
                    </div>

                    <div className="mb-3 col-md-4">
                        <label className="form-label fw-bold">State</label>
                        <input className="form-control" value={state} disabled />
                    </div>
                    <div className="mb-3 col-md-4">
                        <label className="form-label fw-bold">Pincode</label>
                        <input className="form-control" value={pincode} disabled />
                    </div>
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
                                        value={cpName1}
                                        placeholder='Enter CP Name 1'
                                        onChange={(e) => setCpName1(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="row">
                                    <div className="mb-3 col-md-6">
                                        <label className='form-label fw-bold text-success'>CP Mobile 1 <span className='text-danger'>*</span></label>
                                        <input
                                            className='form-control'
                                            type="tel"
                                            value={cpMobile1}
                                            placeholder='Enter CP Mobile 1'
                                            onChange={(e) => {
                                                const input = e.target.value;
                                                if (/^\d{0,10}$/.test(input)) {
                                                    setCpMobile1(input);
                                                }
                                            }}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3 col-md-6">
                                        <label className='form-label fw-bold text-success'>CP WhatsApp 1</label>
                                        <input
                                            className='form-control'
                                            type="tel"
                                            value={cpWhatsApp1}
                                            placeholder='Enter CP WhatsApp 1'
                                            onChange={(e) => {
                                                const input = e.target.value;
                                                if (/^\d{0,10}$/.test(input)) {
                                                    setCpWhatsApp1(input);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className='form-label fw-bold text-success'>CP Email 1 <span className='text-danger'>*</span></label>
                                    <input
                                        className='form-control'
                                        type="email"
                                        value={cpEmail1}
                                        placeholder='Enter CP Email 1'
                                        onChange={(e) => setCpEmail1(e.target.value)}
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
                                        value={cpName2}
                                        placeholder='Enter CP Name 2'
                                        onChange={(e) => setCpName2(e.target.value)}
                                    />
                                </div>
                                <div className="row">
                                    <div className="mb-3 col-md-6">
                                        <label className='form-label fw-bold text-primary'>CP Mobile 2</label>
                                        <input
                                            className='form-control'
                                            type="text"
                                            value={cpMobile2}
                                            placeholder='Enter CP Mobile 2'
                                            onChange={(e) => {
                                                const input = e.target.value;
                                                if (/^\d{0,10}$/.test(input)) {
                                                    setCpMobile2(input);
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="mb-3 col-md-6">
                                        <label className='form-label fw-bold text-primary'>CP WhatsApp 2</label>
                                        <input
                                            className='form-control'
                                            type="tel"
                                            value={cpWhatsApp2}
                                            placeholder='Enter CP WhatsApp 2'
                                            onChange={(e) => {
                                                const input = e.target.value;
                                                if (/^\d{0,10}$/.test(input)) {
                                                    setCpWhatsApp2(input);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className='form-label fw-bold text-primary'>CP Email 2</label>
                                    <input
                                        className='form-control'
                                        type="email"
                                        value={cpEmail2}
                                        placeholder='Enter CP Email 2'
                                        onChange={(e) => setCpEmail2(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label className='form-label fw-bold'>Billing Percentage</label>
                        <input className='form-control' value={billingPercentage} disabled></input>
                    </div>
                    <div className="mb-3 col-md-6">
                        <label className='form-label fw-bold'>Relationship Manager</label>
                        <input className='form-control' value={employeeName} disabled></input>
                    </div>
                </div>
                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label className='form-label fw-bold'>Payment Mode</label>
                        <input className='form-control' value={paymentMode === 'COD' ? 'Cash on Delivery' : 'Online'} disabled></input>
                    </div>
                    <div className="mb-3 col-md-6">
                        <label className='form-label fw-bold'>Price Type</label>
                        <input className='form-control' value={priceType === 'NewInstitution' ? 'New Institution' : priceType} disabled></input>
                    </div>
                </div>

                <button type="submit" className="btn btn-success w-100 mb-3" disabled={myLoading}>
                    {myLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Updating...
                        </>
                    ) : 'Update Institution'}
                </button>

                <button type="button" className="btn btn-secondary w-100" onClick={handleCancel}>
                    Cancel
                </button>
            </form>
        </div>
    );
}
