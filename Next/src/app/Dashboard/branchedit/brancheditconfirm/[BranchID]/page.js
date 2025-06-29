'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function BranchEdit({ params }) {
    const BranchID = params.BranchID;
    const [branchName, setBranchName] = useState('');
    const [cityName, setCityName] = useState('');
    const [cityID, setCityID] = useState('');
    const [stateName, setStateName] = useState('');
    const [stateID, setStateID] = useState('');
    const [cities, setCities] = useState([]);
    const [states, setStates] = useState([]);
    const [shortName, setShortName] = useState('');
    const [address, setAddress] = useState('');
    const [countryID, setCountryID] = useState('');
    const [countryName, setCountryName] = useState('India');
    const [pincode, setPincode] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [email, setEmail] = useState('');
    const [gstNo, setGstNo] = useState('');
    const [branchImage, setBranchImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (!BranchID) return;
        const fetchBranch = async () => {
            try {
                const res = await api.get(`branch-show/${BranchID}`);
                const branch = res.data.branch[0];

                setCityName(branch.city.CityName || '');
                setStateName(branch.State || '');
                setShortName(branch.ShortName || '');
                setAddress(branch.Address || '');
                setPincode(branch.PinCode || '');
                setContactPerson(branch.ContactPerson || '');
                setMobileNo(branch.Mobile || '');
                setEmail(branch.Email || '');
                setGstNo(branch.GSTNo || '');
                setBranchImage(branch.Picture || 'null');
                setLoading(false);
            } catch (err) {
                setError('Failed to load branch data.');
                console.error(err);
                setLoading(false);
            }
        };
        fetchBranch();
    }, [BranchID]);

    useEffect(() => {
        const fetchCitiesAndStates = async () => {
            try {
                const [citiesRes, statesRes] = await Promise.all([
                    api.get('/city-data'),
                    api.get('/state-data')
                ]);
                setCities(citiesRes.data.data);
                setStates(statesRes.data.data);
            } catch (error) {
                console.error('Error fetching cities/states:', error);
            }
        };

        fetchCitiesAndStates();
    }, []);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const res = await api.get('/country-data');
                setCountries(res.data.data);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };
        fetchCountries();
    }, []);

    const handleCityBlur = () => {
        const match = cities.find(
            city => city.CityName.trim().toLowerCase() === cityName.trim().toLowerCase()
        );
        setCityID(match?.CityID || '');
    };

    const handleStateBlur = () => {
        const match = states.find(
            state => state.StateName.trim().toLowerCase() === stateName.trim().toLowerCase()
        );
        setStateID(match?.StateID || '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        if (!cityID) {
            setErrorMsg('Please select a valid city from the list.');
            setSuccessMsg('');
            return;
        }

        if (!stateID) {
            setErrorMsg('Please select a valid state from the list.');
            setSuccessMsg('');
            return;
        }

        if (!/^\d{6}$/.test(pincode)) {
            setErrorMsg('Pincode must be exactly 6 digits.');
            setSuccessMsg('');
            return;
        }

        if (!/^\d{10}$/.test(mobileNo)) {
            setErrorMsg('Mobile number must be exactly 10 digits.');
            setSuccessMsg('');
            return;
        }

        if (!/^[0-9A-Z]{0,15}$/.test(gstNo)) {
            setErrorMsg('GST number must be a maximum of 15 characters.');
            setSuccessMsg('');
            return;
        }

        try {
            await api.put(`branch-update/${BranchID}`, {
                BranchID: BranchID,
                BranchName: `${cityName}${cityName && stateName ? '-' : ''}${stateName}`,
                ShortName: shortName,
                Address: address,
                City: cityName,
                CityID: cityID,
                State: stateName,
                Country: countryName,
                PinCode: pincode,
                ContactPerson: contactPerson,
                Mobile: mobileNo,
                Email: email,
                Picture: branchImage,
                GSTNo: gstNo
            });

            setSuccessMsg('Branch updated successfully! 🎉');
            setErrorMsg('');
            setBranchName('');
            setCityName('');
            setCityID('');
            setStateName('');
            setStateID('');
            setShortName('');
            setAddress('');
            setCountryID('');
            setCountryName('');
            setPincode('');
            setContactPerson('');
            setMobileNo('');
            setEmail('');
            setGstNo('');
            setBranchImage(null);
            router.push('/Dashboard/branchedit');
        } catch (error) {
            console.error('Error updating branch:', error);
            setErrorMsg('Failed to update branch. Please try again.');
            setSuccessMsg('');
        } finally {
            setLoading(false);
        }
    };

    function handleCancel() {
        router.push('/Dashboard/branchedit');
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Edit Branch</h2>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                <div className="row">
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
                            {cities.map(city => (
                                <option key={city.CityID} value={city.CityName} />
                            ))}
                        </datalist>
                    </div>

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
                </div>

                <div className='row'>
                    <div className="mb-3 col-md-6">
                        <label className="form-label">
                            Branch Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={`${cityName}${cityName && stateName ? '-' : ''}${stateName}`}
                            disabled
                        />
                    </div>
                    <div className="mb-3 col-md-6">
                        <label className='form-label'>Branch Code<span className='text-danger'> *</span></label>
                        <input type="text" className="form-control" value={shortName} onChange={(e) => setShortName(e.target.value)} required placeholder='Enter Branch Code' />
                    </div>
                </div>
                <div className="mb-3">
                    <label className='form-label'>Branch Address<span className='text-danger'> *</span></label>
                    <textarea className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder='Branch Address'></textarea>
                </div>
                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label className="form-label">
                            Country Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={countryName}
                            onChange={(e) => setCountryName(e.target.value)}
                            disabled
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
                </div>
                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label className='form-label'>Contact Person <span className='text-danger'>*</span></label>
                        <input type="text" className='form-control' value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} required placeholder='Enter Person Name' />
                    </div>
                    <div className="mb-3 col-md-6">
                        <label className='form-label'>Mobile No. <span className='text-danger'>*</span></label>
                        <input type="text" className='form-control' value={mobileNo} onChange={(e) => {
                            const input = e.target.value;
                            if (/^\d{0,10}$/.test(input)) {
                                setMobileNo(input);
                            }
                        }} required placeholder='Enter 10 Digit Mobile No.' />
                    </div>
                </div>
                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label className='form-label'>Email <span className='text-danger'>*</span></label>
                        <input type="email" className='form-control' value={email} onChange={(e) => setEmail(e.target.value)} required placeholder='Enter Email' />
                    </div>
                    <div className="mb-3 col-md-6">
                        <label className='form-label'>GST No. <span className='text-danger'>*</span></label>
                        <input type="text" className='form-control' value={gstNo} onChange={(e) => {
                            const input = e.target.value.toUpperCase();
                            const gstReg = /^[0-9A-Z]{0,15}$/;

                            if (gstReg.test(input)) {
                                setGstNo(input);
                            }
                        }} required placeholder='Enter GST No' />
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Branch Picture</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setBranchImage(e.target.files[0])}
                    />
                </div>
                <button type="submit" className="btn btn-warning w-100 mb-4" disabled={loading}>
                    {loading && (
                        <span
                            className="spinner-border spinner-border-sm text-light"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    )}
                    {loading ? ' Updating...' : 'Update Branch'}
                </button>
                <button type='button' className='btn btn-secondary w-100' onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    );
}
