'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function VendorDelete({ params }) {
  const VenderID = params.VenderID;
  const router = useRouter();

  const [vendorName, setVendorName] = useState('');
  const [vendorType, setVendorType] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!VenderID) return;

    const fetchVendor = async () => {
      try {
        const res = await api.get(`vendor-show/${VenderID}`);
        const vendor = res.data;

        setVendorName(vendor.VenderName || '');
        setVendorType(vendor.VenderType || '');
        setMobile(vendor.Mobile || '');
        setEmail(vendor.Email || '');
        setArea(vendor.Area || '');
        setCity(vendor.City || '');
        setState(vendor.State || '');
        setPincode(vendor.PinCode || '');
        setLoading(false);
      } catch (err) {
        setError('Failed to load vendor data.');
        console.error(err);
        setLoading(false);
      }
    };

    fetchVendor();
  }, [VenderID]);

  const handleDelete = async () => {
    try {
      await api.delete(`vendor-delete/${VenderID}`);
      router.push('/Dashboard/vendordelete');
    } catch (err) {
      setError('Failed to delete vendor.');
      console.error(err.response?.data || err.message);
    }
  };

  const handleCancel = () => {
    router.push('/Dashboard/vendordelete');
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-danger">Delete Vendor</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="shadow p-4 rounded bg-white">
        <p>Are you sure you want to delete the following vendor?</p>

        <div className="mb-3">
          <label className="form-label fw-bold">Vendor Name</label>
          <input type="text" className="form-control" value={vendorName} disabled />
        </div>
        <div className="row">
            <div className="mb-3 col-md-6">
                <label className='form-label fw-bold'>Vendor Type</label>
                <input type='text' className='form-control' value={vendorType} disabled />
            </div>
            <div className="mb-3 col-md-6">
                <label className='form-label fw-bold'>Mobile No.</label>
                <input type='text' className='form-control' value={mobile} disabled />
            </div>
        </div>
        <div className="mb-3">
            <label className='form-label fw-bold'>Email</label>
            <input type='text' className='form-control' value={email} disabled />
        </div>
        <div className="row">
            <div className="mb-3 col-md-6">
                <label className='form-label fw-bold'>Area</label>
                <input type='text' className='form-control' value={area} disabled />
            </div>
            <div className="mb-3 col-md-6">
                <label className='form-label fw-bold'>City</label>
                <input type='text' className='form-control' value={city} disabled />
            </div>
        </div>
        <div className="row">
            <div className="mb-3 col-md-6">
                <label className='form-label fw-bold'>State</label>
                <input type='text' className='form-control' value={state} disabled />
            </div>
            <div className="mb-3 col-md-6">
                <label className='form-label fw-bold'>Pincode</label>
                <input type='text' className='form-control' value={pincode} disabled />
            </div>
        </div>

        <button onClick={handleDelete} className="btn btn-danger w-100 mb-3">
          Confirm Delete
        </button>
        <button onClick={handleCancel} className="btn btn-secondary w-100">
          Cancel
        </button>
      </div>
    </div>
  );
}
