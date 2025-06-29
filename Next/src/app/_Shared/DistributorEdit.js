'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function DistributorEdit({ params }) {
  const UserID = params.UserID;
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [adhaarNumber, setAdhaarNumber] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [areas, setAreas] = useState([]);
  const [roleId, setRoleId] = useState('');
  const [myLoading, setMyLoading] = useState(false);
  const [areaID, setAreaID] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!UserID) return;

    const fetchUser = async () => {
      try {
        const res = await api.get(`user-info/${UserID}`);
        const user = res.data;

        setDisplayName(user.DisplayName);
        setPanNumber(user.PanNo);
        setAdhaarNumber(user.AdharNo);
        setMobile(user.Mobile);
        setEmail(user.Email);
        setAddress(user.Address);
        setArea(user.Area);
        setCity(user.City);
        setState(user.State);
        setPincode(user.PinCode);
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
    if(!areaID){
      setError('Please select a valid area from the list.');
      setMyLoading(false);
      return;
    }
    try {
      await api.put(`update-distributor/${UserID}`, {
        Area: area,
        PinCode: pincode,
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
      <h2 className="text-center mb-4 text-warning">Edit Distributor</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
        <div className="mb-3">
          <label className="form-label fw-bold">Distributor Name</label>
          <input className="form-control" value={displayName} disabled />
        </div>
        <div className="row">
            <div className="mb-3 col-md-6">
                <label className='form-label fw-bold'>PAN Number</label>
                <input className='form-control' value={panNumber} disabled></input>
            </div>
            <div className="mb-3 col-md-6">
                <label className='form-label fw-bold'>Adhaar Number</label>
                <input className='form-control' value={adhaarNumber} disabled></input>
            </div>
        </div>

        <div className="row">
          <div className="mb-3 col-md-6">
            <label className="form-label fw-bold">Mobile</label>
            <input className="form-control" value={mobile} disabled />
          </div>
          <div className="mb-3 col-md-6">
            <label className="form-label fw-bold">Email</label>
            <input className="form-control" value={email} disabled />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Address</label>
          <textarea className="form-control" value={address} disabled />
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

          <div className="mb-3 col-md-6">
            <label className="form-label fw-bold">City</label>
            <input className="form-control" value={city} disabled />
          </div>
        </div>

        <div className="row">
          <div className="mb-3 col-md-6">
            <label className="form-label fw-bold">State</label>
            <input className="form-control" value={state} disabled />
          </div>
          <div className="mb-3 col-md-6">
            <label className="form-label fw-bold">Pincode</label>
            <input className="form-control" value={pincode} disabled />
          </div>
        </div>

        <button type="submit" className="btn btn-success w-100 mb-3" disabled={myLoading}>
          {myLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Updating...
            </>
          ) : 'Update Distributor'}
        </button>

        <button type="button" className="btn btn-secondary w-100" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}
