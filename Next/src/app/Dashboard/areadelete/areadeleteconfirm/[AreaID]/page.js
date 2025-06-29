'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function AreaDelete({ params }) {
  const AreaID = params.AreaID;
  const router = useRouter();

  const [area, setArea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!AreaID) return;

    const fetchArea = async () => {
      try {
        const res = await api.get(`/area-show/${AreaID}`);
        setArea(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load area data.');
        console.error(err);
        setLoading(false);
      }
    };

    fetchArea();
  }, [AreaID]);

  const handleDelete = async () => {
    try {
      await api.delete(`/area-delete/${AreaID}`);
      router.push('/Dashboard/areadelete');
    } catch (err) {
      setError('Failed to delete this area.');
      console.error(err.response?.data || err.message);
    }
  };

  const handleCancel = () => {
    router.push('/Dashboard/areadelete');
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

  if (!area) {
    return (
      <div className="text-center mt-5">
        <div className='alert alert-danger'>Area details not found!</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-danger">Delete this Area</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="shadow p-4 rounded bg-white">

        <div className="mb-3">
          <label className="form-label fw-bold">Area Name</label>
          <input type="text" className="form-control" value={area.AreaName || ''} disabled />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">City Name</label>
          <input type="text" className="form-control" value={area.city.CityName || ''} disabled />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Pincode</label>
          <input type="text" className="form-control" value={area.PinCode || ''} disabled />
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
